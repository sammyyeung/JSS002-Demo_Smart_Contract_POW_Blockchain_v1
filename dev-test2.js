const Bc = require("./blockchain");
const { sortChars, hash } = require("./util");
const { MAX_HASH, MAX_HASH_VAL } = require("./config");
const Block = require("./blockchain/block");

// const bc = new Bc();

// let chainData = JSON.stringify(bc);
// console.log(chainData);

// console.log(sortChars(chainData));

// const h = hash(chainData);
// console.log(h);

// console.log(MAX_HASH);
// console.log(MAX_HASH_VAL);

// const lastBlock = {
//   blockHdrs: {
//     difficulty: 1,
//   },
// };
// const target = Block.calTargetHash({ lastBlock });
// console.log(target);

// const block = Block.mineBlock({
//   lastBlock: Block.genesis(),
//   benef: "foo",
// });
// console.log(block);

let bc = new Bc();
// for (let i = 0; i < 1000; i++) {
//   const lastBlock = bc.chain[bc.chain.length - 1];
//   const block = Block.mineBlock({ lastBlock, benef: "beneficiary" });
//   bc.addBlock({ block });
//   console.log("block: ", block);
// }

const genesisBlock = Block.genesis();
const block = Block.mineBlock({
  lastBlock: genesisBlock,
  benef: "beneficiary",
});

// Block.validBlock({ lastBlock: null, block: genesisBlock })
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error.message));

// block.blockHdrs.parentHash = "foo";
// block.blockHdrs.blockNum = 2;
// block.blockHdrs.difficulty = 3;

// Block.validBlock({ lastBlock: genesisBlock, block })
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error.message));
