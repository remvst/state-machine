'use strict';

import StateMachine from '../src/state-machine';

describe('a state machine', () => {
    function mockState(
        stateMachine: StateMachine,
        label: string,
        eventList: string[]
    ) {
        return stateMachine.state(label)
            .onPause(() => eventList.push(label + '.onPause'))
            .onExit(() => eventList.push(label + '.onExit'))
            .onEnter(() => eventList.push(label + '.onEnter'))
            .onResume(() => eventList.push(label + '.onResume'))
            .onUpdate(() => eventList.push(label + '.onUpdate'));
    }

    it('can be instantiated', () => {
        expect(() => new StateMachine()).not.toThrow();
    });

    it('can be added states', () => {
        const sut = new StateMachine();

        const state1 = sut.state('state1');
        const state2 = sut.state('state2');

        expect(state1).toBeTruthy();
        expect(state2).toBeTruthy();
    });

    it('can update the current state', () => {
        const sut = new StateMachine();

        const events: string[] = [];

        const state1 = mockState(sut, 'state1', events);

        const context = sut.context(state1);
        expect(context.isInState(state1)).toBe(true);
        expect(Array.from(context.data.entries())).toEqual([]);

        context.update({'some': 'data'});

        expect(events).toEqual([
            'state1.onEnter',
            'state1.onResume',
            'state1.onUpdate'
        ]);
        expect(Array.from(context.data.entries())).toEqual([]);
    });

    it('can transition to a new state', () => {
        const sut = new StateMachine();

        const events: string[] = [];

        const state1 = mockState(sut, 'state1', events);
        const state2 = mockState(sut, 'state2', events);

        const context = sut.context(state1);
        expect(context.isInState(state1)).toBe(true);

        context.transition(state2);
        expect(context.isInState(state2)).toBe(true);

        expect(events).toEqual([
            'state1.onEnter',
            'state1.onResume',
            'state1.onPause',
            'state1.onExit',
            'state2.onEnter',
            'state2.onResume'
        ]);
        expect(Array.from(context.data.entries())).toEqual([]);
    });

    it('can transition to a new state with data', () => {
        const sut = new StateMachine();

        const events: string[] = [];

        const state1 = mockState(sut, 'state1', events);
        const state2 = mockState(sut, 'state2', events);

        const context = sut.context(state1);
        expect(context.isInState(state1)).toBe(true);

        context.transition(state2, new Map([['foo', 'bar']]));
        expect(context.isInState(state2)).toBe(true);

        expect(events).toEqual([
            'state1.onEnter',
            'state1.onResume',
            'state1.onPause',
            'state1.onExit',
            'state2.onEnter',
            'state2.onResume'
        ]);
        expect(context.data.get('foo')).toEqual('bar');
    });

    it('can start a new flow', () => {
        const sut = new StateMachine();

        const events: string[] = [];

        const state1 = mockState(sut, 'state1', events);
        const state2 = mockState(sut, 'state2', events);
        const state3 = mockState(sut, 'state3', events);

        const context = sut.context(state1);
        expect(context.isInState(state1)).toBe(true);

        context.interrupt(state2);
        expect(context.isInState(state2)).toBe(true);

        context.transition(state3);
        context.pop();

        expect(events).toEqual([
            'state1.onEnter',
            'state1.onResume',
            'state1.onPause',
            'state2.onEnter',
            'state2.onResume',
            'state2.onPause',
            'state2.onExit',
            'state3.onEnter',
            'state3.onResume',
            'state3.onPause',
            'state3.onExit',
            'state1.onResume'
        ]);
        expect(Array.from(context.data.entries())).toEqual([]);
    });

    it('can start a new flow with data', () => {
        const sut = new StateMachine();

        const events: string[] = [];

        const state1 = mockState(sut, 'state1', events);
        const state2 = mockState(sut, 'state2', events);
        const state3 = mockState(sut, 'state3', events);

        const context = sut.context(state1);
        expect(context.isInState(state1)).toBe(true);

        context.interrupt(state2, new Map([['foo', 'bar']]));
        expect(context.isInState(state2)).toBe(true);

        context.transition(state3, new Map([['baz', 'yolo']]));
        context.pop();

        expect(events).toEqual([
            'state1.onEnter',
            'state1.onResume',
            'state1.onPause',
            'state2.onEnter',
            'state2.onResume',
            'state2.onPause',
            'state2.onExit',
            'state3.onEnter',
            'state3.onResume',
            'state3.onPause',
            'state3.onExit',
            'state1.onResume'
        ]);
        expect(Array.from(context.data.entries())).toEqual([]);
    });

    it('can pop more than expected without exploding', () => {
        const sut = new StateMachine();

        const events: string[] = [];
        const state1 = mockState(sut, 'state1', events);

        const context = sut.context(state1);
        context.pop();

        expect(events).toEqual([
            'state1.onEnter',
            'state1.onResume',
            'state1.onPause',
            'state1.onExit'
        ]);

        expect(Array.from(context.data.entries())).toEqual([]);
        expect(context.isInState(state1)).toBe(false);
    });

    it('can be reset to a different state', () => {
        const sut = new StateMachine();

        const events: string[] = [];
        const state1 = mockState(sut, 'state1', events);
        const state2 = mockState(sut, 'state2', events);

        const context = sut.context(state1);
        context.reset(state2, new Map([['foo', 'bar']]));

        expect(events).toEqual([
            'state1.onEnter',
            'state1.onResume',
            'state1.onPause',
            'state1.onExit',
            'state2.onEnter',
            'state2.onResume'
        ]);

        expect(Array.from(context.data.entries())).toEqual([['foo', 'bar']]);
        expect(context.isInState(state1)).toBe(false);
        expect(context.isInState(state2)).toBe(true);
    });

    it('can be reset to a different state without any payload', () => {
        const sut = new StateMachine();

        const events: string[] = [];
        const state1 = mockState(sut, 'state1', events);
        const state2 = mockState(sut, 'state2', events);

        const context = sut.context(state1);
        context.reset(state2);

        expect(events).toEqual([
            'state1.onEnter',
            'state1.onResume',
            'state1.onPause',
            'state1.onExit',
            'state2.onEnter',
            'state2.onResume'
        ]);

        expect(Array.from(context.data.entries())).toEqual([]);
        expect(context.isInState(state1)).toBe(false);
        expect(context.isInState(state2)).toBe(true);
    });

    it('can keep adding callbacks to the same state', () => {
        const sut = new StateMachine();

        const events: string[] = [];
        const state = mockState(sut, 'state1', events);

        state.onEnter(() => events.push('onEnterBis'));
        state.onResume(() => events.push('onResumeBis'));
        state.onUpdate(() => events.push('onUpdateBis'));
        state.onPause(() => events.push('onPauseBis'));
        state.onExit(() => events.push('onExitBis'));

        const context = sut.context(state);

        events.splice(0, events.length);
        expect(events).toEqual([]);

        state.enter(context);
        state.resume(context);
        state.update(context);
        state.pause(context);
        state.exit(context);

        expect(events).toEqual([
            'state1.onEnter',
            'onEnterBis',
            'state1.onResume',
            'onResumeBis',
            'state1.onUpdate',
            'onUpdateBis',
            'state1.onPause',
            'onPauseBis',
            'state1.onExit',
            'onExitBis'
        ]);
    });
});
