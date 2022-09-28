class TxQueue {
  constructor() {
    this.txMap = {};
  }

  add(tx) {
    this.txMap[tx.id] = tx;
  }

  getTxSeries() {
    return Object.values(this.txMap);
  }
  clearBlockTxs({ txSeries }) {
    for (let tx of txSeries) {
      delete this.txMap[tx.id];
    }
  }
}

module.exports = TxQueue;
