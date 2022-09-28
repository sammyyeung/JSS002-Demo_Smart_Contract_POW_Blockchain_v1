const Block = require("./block");

class Bc {
  constructor({ state }) {
    this.chain = [Block.genesis()];
    this.state = state;
  }

  addBlock({ block, txQueue }) {
    return new Promise((resolve, reject) => {
      Block.validBlock({
        lastBlock: this.chain[this.chain.length - 1],
        block,
        state: this.state,
      })
        .then(() => {
          this.chain.push(block);

          Block.runBlock({ block, state: this.state });

          txQueue.clearBlockTxs({ txSeries: block.txSeries });
          return resolve();
        })
        .catch(reject);
    });
  }

  replaceChain({ chain }) {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < chain.length; ++i) {
        const block = chain[i];
        const lastBlockIdx = i - 1;
        const lastBlock = lastBlockIdx >= 0 ? chain[i - 1] : null;

        try {
          await Block.validBlock({ lastBlock, block, state: this.state });
          Block.runBlock({ block, state: this.state });
        } catch (error) {
          return reject(error);
        }

        console.log(`*-- Validated block number: ${block.blockHdrs.blockNum}`);
      }
      this.chain = chain;
      return resolve();
    });
  }
}

module.exports = Bc;
