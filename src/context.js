'use strict';

class ContextStackItem {

    constructor(state, data) {
        this.state = state;
        this.data = data;
    }

}

module.exports = class Context {

    constructor(state) {
        const newItem = new ContextStackItem(state, {});
        this.stack = [newItem];
        newItem.state.enter(this);
        newItem.state.resume(this);
    }

    get data() {
        if (!this.stack.length) {
            return {};
        }

        return this.stack[this.stack.length - 1].data;
    }

    isInState(state) {
        if (!this.stack.length) {
            return false;
        }

        return this.stack[this.stack.length - 1].state === state;
    }

    transition(state, data) {
        const currentItem = this.stack[this.stack.length - 1];
        currentItem.state.pause(this);
        currentItem.state.exit(this);

        const newItem = new ContextStackItem(state, data || {});
        this.stack[this.stack.length - 1] = newItem;

        newItem.state.enter(this);
        newItem.state.resume(this);
    }

    interrupt(state, data) {
        const currentItem = this.stack[this.stack.length - 1];
        currentItem.state.pause(this);

        const newItem = new ContextStackItem(state, data || {});
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

    update(updateParameters) {
        const currentItem = this.stack[this.stack.length - 1];
        currentItem.state.update(this, updateParameters);
    }

    reset(state, data = {}) {
        while (this.stack.length) {
            this.pop();
        }

        const newItem = new ContextStackItem(state, data);
        this.stack = [newItem];
        newItem.state.enter(this);
        newItem.state.resume(this);
    }

};
