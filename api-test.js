const request = require("request");

const { OPCODE_MAP } = require("./interpreter");
const { STOP, ADD, PUSH, STORE, LOAD } = OPCODE_MAP;

const BASE_URL = "http://localhost:3000";

const postTx = ({ code, to, val, gasLimit }) => {
  return new Promise((resolve, reject) => {
    request(
      `${BASE_URL}/account/transact`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, to, val, gasLimit }),
      },
      (error, response, body) => {
        return resolve(JSON.parse(body));
      }
    );
  });
};

const getMine = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      request(`${BASE_URL}/blockchain/mine`, (error, response, body) => {
        return resolve(JSON.parse(body));
      });
    }, 1500);
  });
};

const getAcBal = ({ addr } = {}) => {
  return new Promise((resolve, reject) => {
    request(
      `${BASE_URL}/account/balance` + (addr ? `?addr=${addr}` : ""),
      (error, response, body) => {
        return resolve(JSON.parse(body));
      }
    );
  });
};

// postTx({ to: "foo-recipient", val: 20 })
//   .then((postTxRes) => {
//     console.log(postTxRes);
//   })
//   .catch((error) => console.log(error.message));

let toAcData;
let smartContractAcData;

postTx({})
  .then((postTxRes) => {
    console.log("postTxRes", postTxRes);
    toAcData = postTxRes.tx.data.acData;
    return getMine();
  })
  .then((getMineRes) => {
    console.log(getMineRes);
    return postTx({ to: toAcData.addr, val: 20 });
  })
  .then((postTxRes2) => {
    console.log("postTxRes2", postTxRes2);

    // const code = [PUSH, 4, PUSH, 5, ADD, STOP];
    const key = "foo";
    const val = "bar";
    const code = [PUSH, val, PUSH, key, STORE, PUSH, key, LOAD, STOP];

    return postTx({ code });
  })
  .then((postTxRes3) => {
    console.log("postTxRes3 (smart contract)", postTxRes3);
    smartContractAcData = postTxRes3.tx.data.acData;
    return getMine();
  })
  .then((getMineRes2) => {
    console.log("getMineRes2", getMineRes2);
    return postTx({ to: smartContractAcData.codeHash, val: 0, gasLimit: 100 });
  })
  .then((postTxRes4) => {
    console.log("postTxRes4 (to the smart constract)", postTxRes4);
    return getMine();
  })
  .then((getMineRes3) => {
    console.log("getMineRes3", getMineRes3);
    return getAcBal();
  })
  .then((getAcBalRes) => {
    console.log("getAcBalRes", getAcBalRes);

    return getAcBal({ addr: toAcData.addr });
  })
  .then((getAcBalRes2) => {
    console.log("getAcBalRes2", getAcBalRes2);
  })
  .catch((error) => console.log(error.message));
