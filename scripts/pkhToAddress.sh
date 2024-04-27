#!/bin/bash

# Define paths
EXECUTABLE="./bin/cardano-address-tools"
INPUT_CSV="./scripts/wallets.csv"
OUTPUT_CSV="./scripts/output_wallets.csv"

# Check if the executable exists
if [[ ! -f "$EXECUTABLE" ]]; then
    echo "Executable not found: $EXECUTABLE"
    exit 1
fi

# Create or clear the output file
echo "payment_key,stake_key,address" > "$OUTPUT_CSV"

# Read the CSV file, skipping the header
tail -n +2 "$INPUT_CSV" | while IFS=',' read -r payment_key stake_key
do
    # Check if stake key is present
    if [[ -z "$stake_key" ]]; then
        # Stake key is absent, pass only the payment key
        address=$("$EXECUTABLE" 0 "$payment_key")
    else
        # Stake key is present, pass both keys
        address=$("$EXECUTABLE" 0 "$payment_key" "$stake_key")
    fi

    # Check for empty addresses or errors
    if [[ -z "$address" ]]; then
        echo "Error generating address for $payment_key, $stake_key"
        address=""  # Set address to empty to indicate an error in the output
    fi

    # Write to the output CSV
    echo "$payment_key,$stake_key,$address" >> "$OUTPUT_CSV"
done

echo "Processing completed. Output saved to $OUTPUT_CSV"
