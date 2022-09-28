const Ac = require("./account");
const Tx = require("./transaction");

const ac = new Ac();

// const data = { foo: "foo" };

// const sgn = ac.sign(data);

// console.log(sgn);

// console.log(Ac.verifySgn({ pubKey: ac.addr, data, sgn }));
// console.log(Ac.verifySgn({ pubKey: new Ac().addr, data, sgn }));

// console.log(Tx.create({ ac, to: "foo-recipient", val: 50 }));
// console.log(Tx.create({ ac }));

// const stdTx = Tx.create({ ac, to: "foo-recipient", val: 50 });
// // stdTx.to = "different-recipient";
// stdTx.to = "foo-recipient";
// Tx.validStdTx({ tx: stdTx })
//   .then(() => {
//     console.log("resolved");
//   })
//   .catch((error) => console.log(error.message));

// const createAcTx = Tx.create({ ac });
// const stdTx = Tx.create({ ac, to: "foo-recipient", val: 50 });
// console.log(stdTx);
// console.log(createAcTx);
// // createAcTx.data.acData.abc = new Ac().addr;
// Tx.validCreateAcTx({ tx: stdTx })
//   .then(() => console.log("resolved"))
//   .catch((error) => console.log(error.message));
