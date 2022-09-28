const { hash } = require("../util");
const Tx = require("../transaction");
const Trie = require("../store/trie");

const {
  GENESIS_DATA,
  HASH_LEN,
  MAX_HASH,
  MAX_HASH_VAL,
  MAX_NONCE,
  MINE_RATE,
} = require("../config");

class Block {
  constructor({ blockHdrs, txSeries }) {
    this.blockHdrs = blockHdrs;
    this.txSeries = txSeries;
  }

  static calTargetHash({ lastBlock }) {
    const target = (MAX_HASH_VAL / lastBlock.blockHdrs.difficulty).toString(16);
    if (target.length > HASH_LEN) return MAX_HASH;
    return target.padStart(64, "0");
  }

  static adjustDifficulty({ lastBlock, timestamp }) {
    let { difficulty } = lastBlock.blockHdrs;
    if (timestamp - lastBlock.blockHdrs.timestamp > MINE_RATE) {
      difficulty--;
      if (difficulty < 1) return 1;
    } else {
      difficulty++;
    }
    return difficulty;
  }

  static mineBlock({ lastBlock, benef, txSeries, stateRoot }) {
    const target = Block.calTargetHash({ lastBlock });
    const miningRewardTx = Tx.create({ benef });
    txSeries.push(miningRewardTx);
    const txTrie = Trie.buildTrie({ items: txSeries });
    let timestamp, truncatedHdrs, header, nonce, underTargetHash;

    do {
      timestamp = Date.now();
      truncatedHdrs = {
        parentHash: hash(lastBlock.blockHdrs),
        benef,
        blockNum: lastBlock.blockHdrs.blockNum + 1,
        difficulty: this.adjustDifficulty({ lastBlock, timestamp }),
        timestamp,
        txsRoot: txTrie.rootHash,
        stateRoot,
      };
      header = hash(truncatedHdrs);
      nonce = Math.floor(Math.random() * MAX_NONCE);
      underTargetHash = hash(header + nonce);
    } while (underTargetHash > target);

    return new this({
      blockHdrs: { ...truncatedHdrs, nonce },
      txSeries,
    });
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static validBlock({ lastBlock, block, state }) {
    return new Promise((resolve, reject) => {
      if (hash(block) === hash(Block.genesis()))
        return resolve("Genesis block validation successful");

      if (hash(lastBlock) === hash(block))
        return reject(new Error("Received duplicated block"));

      if (hash(lastBlock.blockHdrs) !== block.blockHdrs.parentHash)
        return reject(
          new Error(
            "The parent hash must be a hash of the last block's headers"
          )
        );

      if (block.blockHdrs.blockNum !== lastBlock.blockHdrs.blockNum + 1)
        return reject(new Error("The block must increment the number by 1"));

      if (
        Math.abs(block.blockHdrs.difficulty - lastBlock.blockHdrs.difficulty) >
        1
      )
        return reject(new Error("The difficulty must only adjust by 1"));

      const rebuiltTxsTrie = Trie.buildTrie({ items: block.txSeries });
      if (rebuiltTxsTrie.rootHash !== block.blockHdrs.txsRoot) {
        return reject(
          new Error(
            `The rebuilt transactions root does not match the block's ` +
              `transactions roots: ${block.blockHdrs.txsRoot}`
          )
        );
      }

      const target = Block.calTargetHash({ lastBlock });
      const { blockHdrs } = block;
      const { nonce } = blockHdrs;
      const truncatedHdrs = { ...blockHdrs };
      delete truncatedHdrs.nonce;
      const header = hash(truncatedHdrs);
      const underTargetHash = hash(header + nonce);

      if (underTargetHash > target)
        return new Error(
          "The block does not meet the proof of work requirement"
        );

      Tx.validTxSeries({ txSeries: block.txSeries, state })
        .then(resolve)
        .catch(reject);
    });
  }

  static runBlock({ block, state }) {
    for (let tx of block.txSeries) {
      Tx.runTx({ tx, state });
    }
  }
}

module.exports = Block;
