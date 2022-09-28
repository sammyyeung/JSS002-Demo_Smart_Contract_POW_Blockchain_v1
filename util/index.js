const keccak256 = require("js-sha3").keccak256;
const EC = require("elliptic").ec;

const ec = new EC("secp256k1");

const sortChars = (data) => {
  return JSON.stringify(data).split("").sort().join("");
};

const hash = (data) => {
  const keccakHash = keccak256.create();
  keccakHash.update(sortChars(data));
  return keccakHash.hex();
};

module.exports = { sortChars, hash, ec };
