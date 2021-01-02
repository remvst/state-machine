'use strict';

import State  from './state';
import Context  from './context';

export default class StateMachine {

    state(stateId: string) {
        return new State(stateId);
    }

    context(initialState: State) {
        return new Context(initialState);
    }
}
