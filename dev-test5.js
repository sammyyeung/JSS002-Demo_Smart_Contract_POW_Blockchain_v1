const Trie = require("./store/trie");
const State = require("./store/state");
const Ac = require("./account");
const Tx = require("./transaction");
const Block = require("./blockchain/block");
const TxQueue = require("./transaction/tx-queue");
const Bc = require("./blockchain");
const { hash } = require("./util");

// const trie = new Trie();
// trie.put({ key: "foo", val: "bar" });
// trie.put({ key: "food", val: "ramen" });
// console.log(JSON.stringify(trie));

const ac = new Ac();
const acData = ac.toJSON();

const toAc = new Ac();
const toAcData = toAc.toJSON();

const state = new State();
state.putAc({ addr: ac.addr, acData });
state.putAc({ addr: toAc.addr, acData: toAcData });

// test valid transaction
// const stdTx = Tx.create({ ac, to: toAc.addr, val: 50 });
// Tx.validStdTx({ tx: stdTx, state })
//   .then(() => console.log("Valid standard transaction"))
//   .catch((error) => console.log(error.message));

// test if the value exceeds the balance
// const stdTx = Tx.create({ ac, to: toAc.addr, val: 1020 });
// Tx.validStdTx({ tx: stdTx, state })
//   .then(() => console.log("Valid standard transaction"))
//   .catch((error) => console.log(error.message));

// test if `to` address does not exist
const stdTx = Tx.create({ ac, to: "foo-recipient", val: 50 });
Tx.validStdTx({ tx: stdTx, state })
  .then(() => console.log("Valid standard transaction"))
  .catch((error) => console.log(error.message));

// const bc = new Bc({ state });
// const txQueue = new TxQueue();
// const tx = Tx.create({ ac, to: toAc.addr, val: 50 });
// // const tx = Tx.create({ ac, to: "foo.recipient", val: 50 });
// // const tx = Tx.create({ ac, to: toAc.addr, val: 9000 });
// txQueue.add(tx);
// const lastBlock = Block.genesis();
// const block = Block.mineBlock({
//   lastBlock,
//   benef: ac.addr,
//   txSeries: txQueue.getTxSeries(),
//   stateRoot: state.getStateRoot(),
// });

// console.log(block);

// Block.validBlock({ lastBlock, block, state })
//   .then(() => console.log("Block validation successful"))
//   .catch((error) => console.log(error.message));

// bc.addBlock({ block, txQueue })
//   .then(() => console.log("Block added to the chain"))
//   .catch((error) => console.log(error));

// const item1 = { foo: "bar" };
// const item2 = { foo2: "foo2" };

// const trie = Trie.buildTrie({ items: [item1, item2] });
// console.log(trie.get({ key: hash(item1) }));
// console.log(trie.get({ key: hash(item2) }));

// block.txSeries = ["foo"];
// Block.validBlock({ lastBlock, block, state })
//   .then(() => console.log("Block valid"))
//   .catch((error) => console.log(error.message));

// const miningRewardTx = Tx.create({ benef: ac.addr });
// // console.log(miningRewardTx);
// miningRewardTx.val = 9001;
// Tx.validMiningRewardTx({ tx: miningRewardTx })
//   .then(() => console.log("Valid mining reward transaction"))
//   .catch((error) => console.log(error.message));
