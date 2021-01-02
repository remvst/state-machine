import State from './state';

type StateData = Map<string, any>;

export class ContextStackItem {

    readonly state: State;
    readonly data: Map<string, any>;

    constructor(state: State, data: StateData) {
        this.state = state;
        this.data = data;
    }
}

export default class Context {

    private readonly stack: ContextStackItem[];

    constructor(state: State) {
        const newItem = new ContextStackItem(state, new Map());
        this.stack = [newItem];
        newItem.state.enter(this);
        newItem.state.resume(this);
    }

    get data(): StateData {
        if (!this.stack.length) {
            return new Map();
        }

        return this.stack[this.stack.length - 1].data;
    }

    isInState(state: State) {
        if (!this.stack.length) {
            return false;
        }

        return this.stack[this.stack.length - 1].state === state;
    }

    transition(state: State, data: StateData = new Map()) {
        const currentItem = this.stack[this.stack.length - 1];
        currentItem.state.pause(this);
        currentItem.state.exit(this);

        const newItem = new ContextStackItem(state, data);
        this.stack[this.stack.length - 1] = newItem;

        newItem.state.enter(this);
        newItem.state.resume(this);
    }

    interrupt(state: State, data: StateData = new Map()) {
        const currentItem = this.stack[this.stack.length - 1];
        currentItem.state.pause(this);

        const newItem = new ContextStackItem(state, data);
        this.stack.push(newItem);

        newItem.state.enter(this);
        newItem.state.resume(this);
    }

    pop() {
        const currentItem = this.stack[this.stack.length - 1];
        currentItem.state.pause(this);
        currentItem.state.exit(this);
        this.stack.pop();

        if (this.stack.length > 0) {
            const newItem = this.stack[this.stack.length - 1];
            newItem.state.resume(this);
        }
    }

    update(updateParameters: any) {
        const currentItem = this.stack[this.stack.length - 1];
        currentItem.state.update(this, updateParameters);
    }

    reset(state: State, data: StateData = new Map()) {
        while (this.stack.length) {
            this.pop();
        }

        this.stack.splice(0, this.stack.length);

        const newItem = new ContextStackItem(state, data);
        this.stack.push(newItem);
        newItem.state.enter(this);
        newItem.state.resume(this);
    }
}
