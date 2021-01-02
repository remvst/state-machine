"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noop = function () { };
function append(initialAction, additionalAction) {
    return function () {
        initialAction(...arguments);
        additionalAction(...arguments);
    };
}
class State {
    constructor(id) {
        this.onEnterCallback = noop;
        this.onResumeCallback = noop;
        this.onPauseCallback = noop;
        this.onExitCallback = noop;
        this.onUpdateCallback = noop;
        this.id = id;
    }
    enter(context) {
        this.onEnterCallback(context);
    }
    resume(context) {
        this.onResumeCallback(context);
    }
    update(context, updateParameters = null) {
        this.onUpdateCallback(context, updateParameters);
    }
    pause(context) {
        this.onPauseCallback(context);
    }
    exit(context) {
        this.onExitCallback(context);
    }
    onEnter(callback) {
        this.onEnterCallback = append(this.onEnterCallback, callback);
        return this;
    }
    onResume(callback) {
        this.onResumeCallback = append(this.onResumeCallback, callback);
        return this;
    }
    onPause(callback) {
        this.onPauseCallback = append(this.onPauseCallback, callback);
        return this;
    }
    onExit(callback) {
        this.onExitCallback = append(this.onExitCallback, callback);
        return this;
    }
    onUpdate(callback) {
        this.onUpdateCallback = append(this.onUpdateCallback, callback);
        return this;
    }
}
exports.default = State;
;
