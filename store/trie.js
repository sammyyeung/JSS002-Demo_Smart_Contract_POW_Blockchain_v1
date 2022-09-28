const _ = require("lodash");
const { hash } = require("../util");

class Node {
  constructor() {
    this.val = null;
    this.childMap = {};
  }
}

class Trie {
  constructor() {
    this.head = new Node();
    this.genRootHash();
  }

  genRootHash() {
    this.rootHash = hash(this.head);
  }

  get({ key }) {
    let node = this.head;
    for (let char of key) {
      if (!node.childMap[char]) return null;
      else node = node.childMap[char];
    }
    return _.cloneDeep(node.val);
  }

  put({ key, val }) {
    let node = this.head;
    for (let char of key) {
      if (!node.childMap[char]) node.childMap[char] = new Node();
      node = node.childMap[char];
    }
    node.val = val;
    this.genRootHash();
  }

  static buildTrie({ items }) {
    const trie = new this();
    for (let item of items.sort((a, b) => hash(a) > hash(b))) {
      trie.put({ key: hash(item), val: item });
    }
    return trie;
  }
}

module.exports = Trie;
