import Context from './context';

const noop = function() {};

type AnyVoid = (..._: any[]) => void;
type AnyContextVoid = (context: Context, ..._: any[]) => void;
type ContextVoid = (context: Context) => void;

function append(initialAction: AnyVoid, additionalAction: AnyVoid) {
    return function() {
        initialAction(...arguments);
        additionalAction(...arguments);
    };
}

export default class State {

    readonly id: string;

    private onEnterCallback: (ContextVoid) = noop;
    private onResumeCallback: (ContextVoid) = noop;
    private onPauseCallback: (ContextVoid) = noop;
    private onExitCallback: (ContextVoid) = noop;
    private onUpdateCallback: AnyContextVoid = noop;

    constructor(id: string) {
        this.id = id;
    }

    enter(context: Context) {
        this.onEnterCallback(context);
    }

    resume(context: Context) {
        this.onResumeCallback(context);
    }

    update(context: Context, updateParameters: any = null) {
        this.onUpdateCallback(context, updateParameters);
    }

    pause(context: Context) {
        this.onPauseCallback(context);
    }

    exit(context: Context) {
        this.onExitCallback(context);
    }

    onEnter(callback: ContextVoid) {
        this.onEnterCallback = append(this.onEnterCallback, callback);
        return this;
    }

    onResume(callback: ContextVoid) {
        this.onResumeCallback = append(this.onResumeCallback, callback);
        return this;
    }

    onPause(callback: ContextVoid) {
        this.onPauseCallback = append(this.onPauseCallback, callback);
        return this;
    }

    onExit(callback: ContextVoid) {
        this.onExitCallback = append(this.onExitCallback, callback);
        return this;
    }

    onUpdate(callback: AnyContextVoid) {
        this.onUpdateCallback = append(this.onUpdateCallback, callback);
        return this;
    }
};
