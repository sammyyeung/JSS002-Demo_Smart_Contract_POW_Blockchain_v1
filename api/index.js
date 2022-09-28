const express = require("express");
const request = require("request");
const Ac = require("../account");
const Bc = require("../blockchain");
const Block = require("../blockchain/block");
const PubSub = require("./pubsub");
const State = require("../store/state");
const Tx = require("../transaction");
const TxQueue = require("../transaction/tx-queue");

const app = express();

const state = new State();
const bc = new Bc({ state });
const txQueue = new TxQueue();
const pubsub = new PubSub({ bc, txQueue });
const ac = new Ac();
const tx = Tx.create({ ac });

setTimeout(() => {
  pubsub.broadcastTx(tx);
}, 500);

// console.log(txQueue.getTxSeries());
app.use(express.json());

app.get("/blockchain", (req, res, next) => {
  const { chain } = bc;
  res.json({ chain });
});

app.get("/blockchain/mine", (req, res, next) => {
  const lastBlock = bc.chain[bc.chain.length - 1];
  const block = Block.mineBlock({
    lastBlock,
    benef: ac.addr,
    txSeries: txQueue.getTxSeries(),
    stateRoot: state.getStateRoot(),
  });
  // block.blockHdrs.parentHash = "foo";
  bc.addBlock({ block, txQueue })
    .then(() => {
      pubsub.broadcastBlock(block);
      res.json({ block });
    })
    .catch(next);
});

app.post("/account/transact", (req, res, next) => {
  const { code, gasLimit, to, val } = req.body;
  const tx = Tx.create({ ac: !to ? new Ac({ code }) : ac, gasLimit, to, val });
  pubsub.broadcastTx(tx);
  res.json({ tx });
});

app.get("/account/balance", (req, res, next) => {
  const { addr } = req.query;
  const bal = Ac.calBal({ addr: addr || ac.addr, state });
  res.json({ bal });
});

app.use((err, req, res, next) => {
  console.log("Internal server error: ", err);
  res.status(500).json({ message: err.message });
});

const peer = process.argv.includes("--peer");

const PORT = peer ? Math.floor(2000 + Math.random() * 1000) : 3000;

if (peer) {
  request("http://localhost:3000/blockchain", (error, req, body) => {
    const { chain } = JSON.parse(body);
    // console.log("chain", chain);
    bc.replaceChain({ chain })
      .then(() => console.log("Synchronized blockchain with the root node"))
      .catch((error) =>
        console.error(`Sychronization error: ${error.message}`)
      );
  });
}
app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
