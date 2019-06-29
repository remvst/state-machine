'use strict';

const noop = function() {};

module.exports = class State {
    constructor(id) {
        this.id = id;

        this.onEnterCallback = noop;
        this.onResumeCallback = noop;
        this.onPauseCallback = noop;
        this.onExitCallback = noop;
        this.onUpdateCallback = noop;
    }

    enter(context) {
        this.onEnterCallback(context);
    }

    resume(context) {
        this.onResumeCallback(context);
    }

    update(context, updateParameters) {
        this.onUpdateCallback(context, updateParameters);
    }

    pause(context) {
        this.onPauseCallback(context);
    }

    exit(context) {
        this.onExitCallback(context);
    }

    onEnter(callback) {
        this.onEnterCallback = callback;
        return this;
    }

    onResume(callback) {
        this.onResumeCallback = callback;
        return this;
    }

    onPause(callback) {
        this.onPauseCallback = callback;
        return this;
    }

    onExit(callback) {
        this.onExitCallback = callback;
        return this;
    }

    onUpdate(callback) {
        this.onUpdateCallback = callback;
        return this;
    }
};
