const Trie = require("./trie");

class State {
  constructor() {
    this.trie = new Trie();
    this.storTrieMap = {};
  }

  putAc({ addr, acData }) {
    if (!this.storTrieMap[addr]) this.storTrieMap[addr] = new Trie();
    this.trie.put({
      key: addr,
      val: { ...acData, storRoot: this.storTrieMap[addr].rootHash },
    });
  }

  getAc({ addr }) {
    return this.trie.get({ key: addr });
  }

  getStateRoot() {
    return this.trie.rootHash;
  }
}

module.exports = State;
