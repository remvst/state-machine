'use strict';

const noop = function() {};

function append(initialAction, additionalAction) {
    return function() {
        initialAction.apply(this, arguments);
        additionalAction.apply(this, arguments);
    };
}

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
};
