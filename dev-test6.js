const Interp = require("./interpreter");
const Trie = require("./store/trie");

const { PUSH, STOP, STORE, LOAD } = Interp.OPCODE_MAP;

let code;

const interp = new Interp({ storTrie: new Trie() });
const key = "foo";
const val = "bar";
// code = [PUSH, val, PUSH, key, STORE, STOP];
// interp.run(code);
// console.log(interp.storTrie.get({ key: "foo" }));

code = [PUSH, val, PUSH, key, STORE, PUSH, key, LOAD, STOP];
const { result, gasUsed } = interp.run(code);
console.log("result:", result, "| gasUsed:", gasUsed);
