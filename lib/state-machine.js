'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("./state");
const context_1 = require("./context");
class StateMachine {
    state(stateId) {
        return new state_1.default(stateId);
    }
    context(initialState) {
        return new context_1.default(initialState);
    }
}
exports.default = StateMachine;
