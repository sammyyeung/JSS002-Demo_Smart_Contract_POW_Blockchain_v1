const EXEC_LIMIT = 10000;

const GENESIS_DATA = {
  blockHdrs: {
    parentHash: "--genesis-parent-hash--",
    benef: "--genesis-beneficiary--",
    blockNum: 0,
    difficulty: 1,
    timestamp: "--genesis-timestamp--",
    nonce: 0,
    txsRoot: "--genesis-transactions-root--",
    stateRoot: "--genesis-state-root--",
  },
  txSeries: [],
};

const HASH_LEN = 64;
const MAX_HASH = "f".repeat(HASH_LEN);
const MAX_HASH_VAL = parseInt(MAX_HASH, 16);
const MAX_NONCE = 2 ** 64;

const MS = 1;
const SEC = 1000 * MS;
const MINE_RATE = 13 * SEC;

const CHANNELS_MAP = {
  TEST: "TEST",
  BLOCK: "BLOCK",
  TX: "TRANSACTION",
};

const START_BAL = 1000;
const MINING_REWARD = 50;

const TX_TYPE_MAP = {
  CREATE_AC: "CREATE_AC",
  TRANSACT: "TRANSACT",
  MINING_REWARD: "MINING_REWARD",
};

module.exports = {
  EXEC_LIMIT,
  GENESIS_DATA,
  HASH_LEN,
  MAX_HASH,
  MAX_HASH_VAL,
  MAX_NONCE,
  MINE_RATE,
  CHANNELS_MAP,
  START_BAL,
  TX_TYPE_MAP,
  MINING_REWARD,
};
