import State from './state';
import Context from './context';
export default class StateMachine {
    state(stateId: string): State;
    context(initialState: State): Context;
}
