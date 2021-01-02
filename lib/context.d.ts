import State from './state';
declare type StateData = Map<string, any>;
export declare class ContextStackItem {
    readonly state: State;
    readonly data: Map<string, any>;
    constructor(state: State, data: StateData);
}
export default class Context {
    private readonly stack;
    constructor(state: State);
    get data(): StateData;
    isInState(state: State): boolean;
    transition(state: State, data?: StateData): void;
    interrupt(state: State, data?: StateData): void;
    pop(): void;
    update(updateParameters: any): void;
    reset(state: State, data?: StateData): void;
}
export {};
