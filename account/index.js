const { ec, hash } = require("../util");

const { START_BAL } = require("../config");

class Ac {
  constructor({ code } = {}) {
    this.keyPair = ec.genKeyPair();
    this.addr = this.keyPair.getPublic().encode("hex");
    this.bal = START_BAL;
    this.code = code || [];
    this.genCodeHash();
  }

  genCodeHash() {
    this.codeHash = this.code.length > 0 ? hash(this.addr + this.code) : null;
  }

  sign(data) {
    return this.keyPair.sign(hash(data));
  }

  toJSON() {
    return {
      addr: this.addr,
      bal: this.bal,
      code: this.code,
      codeHash: this.codeHash,
    };
  }

  static verifySgn({ pubKey, data, sgn }) {
    const keyFromPub = ec.keyFromPublic(pubKey, "hex");
    return keyFromPub.verify(hash(data), sgn);
  }

  static calBal({ addr, state }) {
    return state.getAc({ addr }).bal;
  }
}

module.exports = Ac;
