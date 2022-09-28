const Interp = require("./interpreter");
const { STOP, PUSH, ADD, SUB, MUL, DIV, LT, GT, EQ, AND, OR, JUMP, JUMPI } =
  Interp.OPCODE_MAP;

const interp = new Interp();

let code;

// ADD test
//  code = [PUSH, 2, PUSH, 3, ADD, STOP];
// console.log(new Interp().run(code));

// SUB test
//  code = [PUSH, 2, PUSH, 5, SUB, STOP];
// console.log(new Interp().run(code));

// MUL test
//  code = [PUSH, 2, PUSH, 4, MUL, STOP];
// console.log(new Interp().run(code));

// DIV test
//  code = [PUSH, 3, PUSH, 12, DIV, STOP];
// console.log(new Interp().run(code));

// LT test true
// code = [PUSH, 3, PUSH, 2, LT, STOP];
// console.log(new Interp().run(code));
// LT test false
// code = [PUSH, 2, PUSH, 3, LT, STOP];
// console.log(new Interp().run(code));

// GT test true
// code = [PUSH, 2, PUSH, 3, GT, STOP];
// console.log(new Interp().run(code));
// GT test false
// code = [PUSH, 3, PUSH, 2, GT, STOP];
// console.log(new Interp().run(code));

// EQ test true
// code = [PUSH, 2, PUSH, 2, EQ, STOP];
// console.log(new Interp().run(code));
// EQ test false
// code = [PUSH, 2, PUSH, 3, EQ, STOP];
// console.log(new Interp().run(code));

// AND test true
// code = [PUSH, 1, PUSH, 1, AND, STOP];
// console.log(new Interp().run(code));
// AND test false
// code = [PUSH, 0, PUSH, 1, AND, STOP];
// console.log(new Interp().run(code));

// OR test true
// code = [PUSH, 1, PUSH, 0, OR, STOP];
// console.log(new Interp().run(code));
// OR test false
// code = [PUSH, 0, PUSH, 0, OR, STOP];
// console.log(new Interp().run(code));

// JUMP test avoid infinite loop
// code = [PUSH, 6, JUMP, PUSH, 0, JUMP, PUSH, "jump successful", STOP];
// console.log(new Interp().run(code));

// JUMPI test
// code = [PUSH, 8, PUSH, 1, JUMPI, PUSH, 0, JUMP, PUSH, "jump successful", STOP];
// console.log(new Interp().run(code));

// JUMPI error test
// code = [PUSH, 99, JUMP, PUSH, 0, JUMP, PUSH, "jump successful", STOP];
// try {
//   new Interp().run(code);
// } catch (error) {
//   console.log("Invalid destination error", error.message);
// }

// PUSH error test
// code = [PUSH, 0, PUSH];
// try {
//   new Interp().run(code);
// } catch (error) {
//   console.log("Expected invalid PUSH error:", error.message);
// }

// EXEC_LIMIT test
// code = [PUSH, 6, PUSH, 0, JUMP, STOP];
// try {
//   new Interp().run(code);
// } catch (error) {
//   console.log("Expected invalid execution error:", error.message);
// }
