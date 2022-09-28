const { EXEC_LIMIT } = require("../config");

class Interp {
  constructor({ storTrie } = {}) {
    this.state = {
      prgmCount: 0,
      stack: [],
      code: [],
      execCount: 0,
    };
    this.storTrie = storTrie;
  }

  run(code) {
    this.state.code = code;

    let gasUsed = 0;

    while (this.state.prgmCount < this.state.code.length) {
      this.state.execCount++;
      if (this.state.execCount > EXEC_LIMIT)
        throw new Error(
          `Check for an infinite loop. Execution limit of ${EXEC_LIMIT} exceeded.`
        );
      const opcode = this.state.code[this.state.prgmCount];

      gasUsed += OPCODE_GAS_MAP[opcode];

      let key, val;

      try {
        switch (opcode) {
          case STOP:
            throw new Error(EXEC_COMPL);

          case PUSH:
            if (this.state.prgmCount + 1 === this.state.code.length)
              throw new Error("The `PUSH` instruction cannot be last.");
            val = this.state.code[++this.state.prgmCount];
            this.state.stack.push(val);
            break;

          case ADD:
          case SUB:
          case MUL:
          case DIV:
          case LT:
          case GT:
          case EQ:
          case AND:
          case OR:
            const a = this.state.stack.pop();
            const b = this.state.stack.pop();
            let c;
            if (opcode === ADD) c = a + b;
            if (opcode === SUB) c = a - b;
            if (opcode === MUL) c = a * b;
            if (opcode === DIV) c = a / b;
            if (opcode === LT) c = a < b ? 1 : 0;
            if (opcode === GT) c = a > b ? 1 : 0;
            if (opcode === EQ) c = a === b ? 1 : 0;
            if (opcode === AND) c = a && b;
            if (opcode === OR) c = a || b;
            this.state.stack.push(c);
            break;

          case JUMP:
            this.jump();
            break;

          case JUMPI:
            const condition = this.state.stack.pop();
            if (condition) this.jump();
            break;

          case STORE:
            key = this.state.stack.pop();
            val = this.state.stack.pop();
            this.storTrie.put({ key, val });
            break;

          case LOAD:
            key = this.state.stack.pop();
            val = this.storTrie.get({ key });
            this.state.stack.push(val);
            break;

          default:
            break;
        }
      } catch (error) {
        if (error.message === EXEC_COMPL)
          return {
            result: this.state.stack[this.state.stack.length - 1],
            gasUsed,
          };
        throw error;
      }

      this.state.prgmCount++;
    }
  }

  jump() {
    const dest = this.state.stack.pop();
    if (dest < 0 || dest >= this.state.code.length)
      throw new Error(`Invalid destination: ${dest}`);
    this.state.prgmCount = dest - 1;
  }
}

const EXEC_COMPL = "Execution complete";

Interp.OPCODE_MAP = {
  STOP: "STOP",
  PUSH: "PUSH",
  ADD: "ADD",
  SUB: "SUB",
  MUL: "MUL",
  DIV: "DIV",
  LT: "LT",
  GT: "GT",
  EQ: "EQ",
  AND: "AND",
  OR: "OR",
  JUMP: "JUMP",
  JUMPI: "JUMPI",
  STORE: "STORE",
  LOAD: "LOAD",
};

Interp.OPCODE_GAS_MAP = {
  STOP: 0,
  PUSH: 0,
  ADD: 1,
  SUB: 1,
  MUL: 1,
  DIV: 1,
  LT: 1,
  GT: 1,
  EQ: 1,
  AND: 1,
  OR: 1,
  JUMP: 2,
  JUMPI: 2,
  STORE: 5,
  LOAD: 5,
};

const { OPCODE_GAS_MAP } = Interp;

const {
  STOP,
  PUSH,
  ADD,
  SUB,
  MUL,
  DIV,
  LT,
  GT,
  EQ,
  AND,
  OR,
  JUMP,
  JUMPI,
  STORE,
  LOAD,
} = Interp.OPCODE_MAP;

module.exports = Interp;
