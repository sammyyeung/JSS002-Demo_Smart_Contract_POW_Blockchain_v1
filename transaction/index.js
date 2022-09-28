const uuid = require("uuid");

const Ac = require("../account");
const Interp = require("../interpreter");

const { TX_TYPE_MAP, MINING_REWARD } = require("../config");

class Tx {
  constructor({ id, from, to, val, data, sgn, gasLimit }) {
    this.id = id || uuid.v4();
    this.from = from || "-";
    this.to = to || "-";
    this.val = val || 0;
    this.data = data || "-";
    this.sgn = sgn || "-";
    this.gasLimit = gasLimit || 0;
  }

  static create({ ac, to, val, benef, gasLimit }) {
    if (benef) {
      return new this({
        to: benef,
        val: MINING_REWARD,
        gasLimit,
        data: { type: TX_TYPE_MAP.MINING_REWARD },
      });
    }

    if (to) {
      const txData = {
        id: uuid.v4(),
        from: ac.addr,
        to,
        val: val || 0,
        gasLimit: gasLimit || 0,
        data: { type: TX_TYPE_MAP.TRANSACT },
      };

      return new this({ ...txData, sgn: ac.sign(txData) });
    }

    return new this({
      data: { type: TX_TYPE_MAP.CREATE_AC, acData: ac.toJSON() },
    });
  }

  static validStdTx({ tx, state }) {
    return new Promise((resolve, reject) => {
      const { id, from, sgn, val, to, gasLimit } = tx;
      const txData = { ...tx };
      delete txData.sgn;
      if (!Ac.verifySgn({ pubKey: from, data: txData, sgn })) {
        return reject(new Error(`Transaction ${id} signature is invalid`));
      }

      const fromBal = state.getAc({ addr: tx.from }).bal;
      if (val + gasLimit > fromBal)
        return reject(
          new Error(
            `Transaction value and gas limit: ${val} excceds balance ${fromBal}`
          )
        );

      const toAc = state.getAc({ addr: to });
      if (!toAc)
        return reject(new Error(`The 'to' field: '${to}' does not exist`));

      if (toAc.codeHash) {
        const { gasUsed } = new Interp({
          storTrie: state.storTrieMap[toAc.codeHash],
        }).run(toAc.code);

        if (gasUsed > gasLimit)
          return reject(
            new Error(
              `Transaction needs more gas. Provided ${gasLimit}. Needs ${gasUsed}.`
            )
          );
      }

      return resolve();
    });
  }

  static validCreateAcTx({ tx }) {
    return new Promise((resolve, reject) => {
      const expectedAcDataFlds = Object.keys(new Ac().toJSON());
      const fields = Object.keys(tx.data.acData);
      if (fields.length !== expectedAcDataFlds.length) {
        return reject(
          new Error(
            `The transaction account data has an incorrect number of fields`
          )
        );
      }
      fields.forEach((field) => {
        if (!expectedAcDataFlds.includes(field)) {
          return reject(
            new Error(`The field: ${field}, is unexpected for account data`)
          );
        }
      });

      return resolve();
    });
  }

  static validMiningRewardTx({ tx }) {
    return new Promise((resolve, reject) => {
      const { val } = tx;

      if (val !== MINING_REWARD)
        return reject(
          new Error(
            `The provided mining reward value: ${val} does not equal ` +
              `the official value: ${MINING_REWARD}`
          )
        );

      return resolve();
    });
  }

  static validTxSeries({ txSeries, state }) {
    return new Promise(async (resolve, reject) => {
      for (let tx of txSeries) {
        try {
          switch (tx.data.type) {
            case TX_TYPE_MAP.CREATE_AC:
              await Tx.validCreateAcTx({ tx });
              break;
            case TX_TYPE_MAP.TRANSACT:
              await Tx.validStdTx({ state, tx });
              break;
            case TX_TYPE_MAP.MINING_REWARD:
              await Tx.validMiningRewardTx({ state, tx });
              break;
            default:
              break;
          }
        } catch (error) {
          return reject(error);
        }
      }
      return resolve();
    });
  }

  static runTx({ state, tx }) {
    switch (tx.data.type) {
      case TX_TYPE_MAP.TRANSACT:
        Tx.runStdTx({ state, tx });
        console.log(
          " -- Updated account data to reflect the standard transaction"
        );
        break;
      case TX_TYPE_MAP.CREATE_AC:
        Tx.runCreateAcTx({ state, tx });
        console.log(" -- Stored the account data");
        break;
      case TX_TYPE_MAP.MINING_REWARD:
        Tx.runMiningRewardTx({ state, tx });
        console.log(" -- Updated account data to reflect the mining reward");
        break;
      default:
        break;
    }
  }

  static runStdTx({ tx, state }) {
    const fromAc = state.getAc({ addr: tx.from });
    const toAc = state.getAc({ addr: tx.to });

    let gasUsed = 0;
    let result;

    if (toAc.codeHash) {
      const interp = new Interp({ storTrie: state.storTrieMap[toAc.codeHash] });
      ({ gasUsed, result } = interp.run(toAc.code));

      console.log(` -*- Smart contract execution: ${tx.id}. RESULT: ${result}`);
    }

    const { val, gasLimit } = tx;
    const refund = gasLimit - gasUsed;

    fromAc.bal -= val;
    fromAc.bal -= gasLimit;
    fromAc.bal += refund;
    toAc.bal += val;
    toAc.bal += gasUsed;

    state.putAc({ addr: tx.from, acData: fromAc });
    state.putAc({ addr: tx.to, acData: toAc });
  }

  static runCreateAcTx({ state, tx }) {
    const { acData } = tx.data;
    const { addr, codeHash } = acData;

    state.putAc({ addr: codeHash ? codeHash : addr, acData });
  }

  static runMiningRewardTx({ state, tx }) {
    const { to, val } = tx;
    const acData = state.getAc({ addr: to });
    acData.bal += val;
    state.putAc({ addr: to, acData });
  }
}

module.exports = Tx;
