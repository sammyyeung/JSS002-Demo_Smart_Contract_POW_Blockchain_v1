const PubNub = require("pubnub");
const uuid = require("uuid");
require("dotenv").config();

const Tx = require("../transaction");

const { CHANNELS_MAP } = require("../config");

const credentials = {
  publishKey: process.env.PUBNUB_PUBLISH,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE,
  secretKey: process.env.PUBNUB_SECRET,
  uuid: uuid.v1(), // new requirement from PubNub
};

class PubSub {
  constructor({ bc, txQueue }) {
    this.pubnub = new PubNub(credentials);
    this.bc = bc;
    this.txQueue = txQueue;
    this.subToChs();
    this.listen();
  }
  subToChs() {
    this.pubnub.subscribe({
      channels: Object.values(CHANNELS_MAP),
    });
  }
  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }
  listen() {
    this.pubnub.addListener({
      message: (msgObj) => {
        const { channel, message } = msgObj;
        const parsedMsg = JSON.parse(message);
        console.log("Message received. Channel:", channel);

        switch (channel) {
          case CHANNELS_MAP.BLOCK:
            console.log("block message", message);
            this.bc
              .addBlock({ block: parsedMsg, txQueue: this.txQueue })
              .then(() => console.log("New block accepted", parsedMsg))
              .catch((error) =>
                console.error("New block rejected:", error.message)
              );
            break;
          case CHANNELS_MAP.TX:
            console.log(`Received transaction: ${parsedMsg.id}`);
            this.txQueue.add(new Tx(parsedMsg));
            console.log(this.txQueue.getTxSeries());
            break;
          default:
            return;
        }
      },
    });
  }
  broadcastBlock(block) {
    this.publish({
      channel: CHANNELS_MAP.BLOCK,
      message: JSON.stringify(block),
    });
  }
  broadcastTx(tx) {
    this.publish({
      channel: CHANNELS_MAP.TX,
      message: JSON.stringify(tx),
    });
  }
}

module.exports = PubSub;
