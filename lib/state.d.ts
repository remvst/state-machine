import Context from './context';
declare type ContextVoid = (context: Context) => void;
export default class State {
    readonly id: string;
    private onEnterCallback;
    private onResumeCallback;
    private onPauseCallback;
    private onExitCallback;
    private onUpdateCallback;
    constructor(id: string);
    enter(context: Context): void;
    resume(context: Context): void;
    update(context: Context, updateParameters?: any): void;
    pause(context: Context): void;
    exit(context: Context): void;
    onEnter(callback: ContextVoid): this;
    onResume(callback: ContextVoid): this;
    onPause(callback: ContextVoid): this;
    onExit(callback: ContextVoid): this;
    onUpdate(callback: ContextVoid): this;
}
export {};
