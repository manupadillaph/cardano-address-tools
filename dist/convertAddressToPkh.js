"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ed25519KeyHashToAddress = exports.pubKeyHashToAddress = void 0;
const cardano_serialization_lib_nodejs_1 = __importDefault(require("@emurgo/cardano-serialization-lib-nodejs"));
function pubKeyHashToAddress(network, pkh, stakePkh) {
    // console.log('pubKeyHashToAddress - pkh: ' + pkh);
    const keyHash = cardano_serialization_lib_nodejs_1.default.Ed25519KeyHash.from_hex(pkh);
    let stekeKeyHash;
    if (stakePkh !== undefined && stakePkh !== '') {
        stekeKeyHash = cardano_serialization_lib_nodejs_1.default.Ed25519KeyHash.from_hex(stakePkh);
    }
    else {
        stekeKeyHash = undefined;
    }
    const bech32 = Ed25519KeyHashToAddress(network, keyHash, stekeKeyHash);
    return bech32;
}
exports.pubKeyHashToAddress = pubKeyHashToAddress;
function Ed25519KeyHashToAddress(network, keyHash, stakeKeyHash) {
    let address;
    if (stakeKeyHash !== undefined) {
        address = cardano_serialization_lib_nodejs_1.default.BaseAddress.new(network, cardano_serialization_lib_nodejs_1.default.StakeCredential.from_keyhash(keyHash), cardano_serialization_lib_nodejs_1.default.StakeCredential.from_keyhash(stakeKeyHash));
    }
    else {
        address = cardano_serialization_lib_nodejs_1.default.EnterpriseAddress.new(network, cardano_serialization_lib_nodejs_1.default.StakeCredential.from_keyhash(keyHash));
    }
    const bech32 = address.to_address().to_bech32(undefined);
    return bech32;
}
exports.Ed25519KeyHashToAddress = Ed25519KeyHashToAddress;
async function run() {
    const args = process.argv.slice(2); // Remove the first two elements
    const network = parseInt(args[0], 10);
    const pkh = args[1];
    const stakePkh = args[2]; // This could be undefined if not provided
    const address = pubKeyHashToAddress(network, pkh, stakePkh);
    // const address = pubKeyHashToAddress (0,'4a7f481cf94777e442f3c6d5be7206f11d6041302a9d9ebff9aded4f','b70c1852f881584693c30c29d5850b7d4b759620efeb1ffaa0e737b9')
    console.log(address);
}
run();
//# sourceMappingURL=convertAddressToPkh.js.map