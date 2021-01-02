"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextStackItem = void 0;
class ContextStackItem {
    constructor(state, data) {
        this.state = state;
        this.data = data;
    }
}
exports.ContextStackItem = ContextStackItem;
class Context {
    constructor(state) {
        const newItem = new ContextStackItem(state, new Map());
        this.stack = [newItem];
        newItem.state.enter(this);
        newItem.state.resume(this);
    }
    get data() {
        if (!this.stack.length) {
            return new Map();
        }
        return this.stack[this.stack.length - 1].data;
    }
    isInState(state) {
        if (!this.stack.length) {
            return false;
        }
        return this.stack[this.stack.length - 1].state === state;
    }
    transition(state, data = new Map()) {
        const currentItem = this.stack[this.stack.length - 1];
        currentItem.state.pause(this);
        currentItem.state.exit(this);
        const newItem = new ContextStackItem(state, data);
        this.stack[this.stack.length - 1] = newItem;
        newItem.state.enter(this);
        newItem.state.resume(this);
    }
    interrupt(state, data = new Map()) {
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
    update(updateParameters) {
        const currentItem = this.stack[this.stack.length - 1];
        currentItem.state.update(this, updateParameters);
    }
    reset(state, data = new Map()) {
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
exports.default = Context;
