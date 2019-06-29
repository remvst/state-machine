# state-machine

## Usage

```js
const StateMachine = require('@remvst/state-machine');

const myStateMachine = new StateMachine();
const initialState = myStateMachine.state('initial');
const secondState = myStateMachine.state('second');

initialState
    .onEnter(context => console.log('entering the initial state'))
    .onExit(context => console.log('leaving the initial state'))
    .onUpdate(context => context.transition());

secondState
    .onEnter(context => console.log('entering the second state'));

const context = myStateMachine.context(initialState);
context.update({'update': 'parameters'});

// Output:
// entering the initial state
// leaving the initial state
// entering the second state
```
