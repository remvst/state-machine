'use strict';

const State = require('./state');
const Context = require('./context');

class StateMachine {

    state(stateId) {
        return new State(stateId);
    }

    context(initialState) {
        return new Context(initialState);
    }

}

module.exports = StateMachine;
