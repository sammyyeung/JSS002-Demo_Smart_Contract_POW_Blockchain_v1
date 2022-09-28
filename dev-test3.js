const PubSub = require("./api/pubsub");
const { CHANNELS_MAP } = require("./config");

const pubsub = new PubSub();

setTimeout(() => {
  pubsub.publish({
    channel: CHANNELS_MAP.TEST,
    message: "foo",
  });
}, 3000);
