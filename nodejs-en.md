# Node.js

## Intro

- Easy to swtich between frontend and backend
  - Developers who know JavaScript can easily work on both
- Common codebase for frontend and backend
- Variety of packages

## Installation

### `nvm`

> Node version manager.

- Conveniently install new Node.js versions
- Easily switch between installed versions
- Isolated enviroments for different versions

## Basics

### JavaScript runtimes

#### Browser vs Node.js

| Browser                            | Node.js                                  |
| ---------------------------------- | ---------------------------------------- |
| Frontend                           | Server-side                              |
| Browser API (`DOM`, `window`, ...) | Node API (`fs`, `http`, ...)             |
| JS version is not guaranteed       | JS version is defined by Node.js version |
| ES Modules                         | CommonJS, ES Modules                     |

Alternate server-side JavaScript runtimes:

- Deno
- Bun

### REPL

```bash
node
```

> Usecase: test regexps.

### Run JS files

```bash
node app.js
```

### Modules

Why modules?

- Reuse
- Compose
- Convenient collaboration
- Isolation
- Structure

#### Module types

- **IIFE (Immediately Invoked Function Expression)**: `;(function() {})()`
  - Browser
- **CommonJS**: `const foo = require('./foo.js')`
  - Browser (bundle)
  - Node.js
- **ES Modules**: `import { foo } from './foo.js'`
  - Browser
  - Node.js

#### CommonJS

```javascript
// foo.js
const a = 1
function b() {
  return 2
}
module.exports = { a, b }

// bar.js
const { a, b } = require('./foo.js')
console.log(a + b()) // 3
```

##### Default-like export

```javascript
// foo.js
function bar() {
  console.log('bar')
}
module.exports = bar

// baz.js
const qux = require('./foo.js')
qux() // 'bar'
```

##### Conditional import

```javascript
if (foo) {
  const { bar } = require('./baz.js')
  // ...
}
```

#### ES Modules

```javascript
// foo.js
export const a = 1
export function b() {
  return 2
}

// bar.js
import { a, b } from './foo.js'
console.log(a + b()) // 3
```

##### Variants of import

```javascript
// foo.js
export const a = 1
export function b() {}
export default class C {}

// bar.js
import { a, b } from './foo.js' // import `a` and `b`
import { a as first, b as second } from './foo.js' // import `a` and `b` as aliases
import * as foo from './foo.js' // import everything as `foo`
import Qux from './foo.js' // import default as `Qux`
// import { a, b as second }, * as foo, Qux from './foo.js' // can be combined in one line

a
b()
first
second()
foo.a
foo.b()
new Qux()
```

##### Async import

```javascript
;(async function () {
  const { a, b } = await import('./foo.js')
})()
```

Error handling is supported:

```javascript
;(async function () {
  try {
    const { a, b } = await import('./foo.js')
  } catch {
    console.error('Cannot load the module')
  }
})()
```

##### How to turn on ES Modules

Either:

- Use `.mjs` extension
- `"type": "module"` in `package.json`
- `--input-type=module` as a command-line argument of `node`

#### Import JSON files

CommonJS:

```javascript
const data = require('./data.json')
```

ES Modules:

```javascript
import data from './data.json' assert { type: 'json' } // sync
;(async () => {
  const data = await import('./data.json', { assert: { type: 'json' } }) // async
})()
```

#### CommonJS vs ES Modules

| CommonJS `require`          | ES Modules `import`          |
| --------------------------- | ---------------------------- |
| Available anywhere          | Only at the top              |
| Сan be used in conditions   | Сannot be used in conditions |
| Executes entire file        | Imports only what's needed   |
| No async (blocks execution) | Async load is supported      |

### Global and Modular variables

```javascript
// globals
global // root object
console
performance
setTimeout
setInterval
setImmediate
Event
EventTarget
Buffer
URL
URLSearchParams
TextEncoder
TextDecoder
MessageChannel
MessageEvent
MessagePort
// ...

// modulars
__dirname // absolute path to the directory of the current module file
__filename // absolute path to the current module file
exports
module
require()
```

### Events

| `EventEmitter`                                   | `EventTarget`                                       |
| ------------------------------------------------ | --------------------------------------------------- |
| From `events` module                             | From `globals`                                      |
| Multiple listeners for one event                 | Only one listener for one event                     |
| Compatible with browser `EventEmitter` API       | Partially compatible                                |
| Error handling on `error` event                  | No built-in error handling on `error` event         |
| Built-in events on adding and removing listeners | No built-in events on adding and removing listeners |

#### How it works

```javascript
const EventEmitter = require('events')
const emitter = new EventEmitter()

emitter.on('data', () => {})
emitter.on('data', handlerFoo)
emitter.on('data', handlerBar)

emitter.on('close', someHandler)
emitter.on('close', data => console.log(data))
emitter.on('close', foo)
```

| Event name | Order | Listener function           |
| ---------- | ----- | --------------------------- |
| `'data'`   | 1     | `() => {}`                  |
|            | 2     | `handlerFoo`                |
|            | 3     | `handlerBar`                |
| `'close'`  | 1     | `someHandler`               |
|            | 2     | `data => console.log(data)` |
|            | 3     | `foo`                       |

#### Examples

```javascript
const EventEmitter = require('events')
const emitter = new EventEmitter()

const hello = () => console.log('Hello!')
const bye = () => console.log('Goodbye!')
const helloName = name => console.log(`Hello, ${name}!`)

// adding listeners
emitter.addListener('greet', hello)
emitter.on('greet', bye)
emitter.on('greetAlt', helloName)

// adding listeners in the beginning of the list
emitter.prependListener('greet', () => console.log('👋'))

// emitting events
emitter.emit('greet') // 👋 ⏎ Hello! ⏎ Goodbye!
emitter.emit('greetAlt', 'Alice') // Hello, Alice!

// removing listeners
emitter.removeListener('greet', hello)
emitter.off('greetAlt', helloName)

// emitting again
emitter.emit('greet') // 👋 ⏎ Goodbye!
emitter.emit('greetAlt', 'Alice') // _

// removing all listeners for an event
emitter.removeAllListeners('greet')

// removing all listeners
emitter.removeAllListeners()

// one-time listener
emitter.once('greetOnce', name => console.log(`Once: Hello, ${name}!`))
emitter.emit('greetOnce', 'Bob') // Once: Hello, Bob!
emitter.emit('greetOnce', 'Charlie') // _

// max listeners
emitter.setMaxListeners(5)
emitter.getMaxListeners() // Default is 10

// listeners count
emitter.listenerCount('greet')

// listeners array
emitter.listeners('greet')

// event names
emitter.eventNames()

// handling events on adding/removing listeners
emitter.on('newListener', (event, listener) =>
  console.log(`Added listener "${listener}" for "${event}" event`)
)
emitter.on('removeListener', (event, listener) =>
  console.log(`Listener "${listener}" removed from "${event}" event`)
)

// error handling
emitter.on('error', err => console.log(`Error: ${err.message}`))
emitter.emit('error', new Error('Something went wrong')) // Error: Something went wrong
```

## Advanced concepts

### Architecture of Node.js

![Event Loop](./img/nodejs/event-loop.png)

### Event Loop

```
     ┌───────────────────────────┐
     │       initialization      │   Synchronous code, `require`, register callbacks
     └─────────────┬─────────────┘
┌─────────────────>│
│    ┏━━━━━━━━━━━━━┷━━━━━━━━━━━━━┓
│    ┃           timers          ┃   Executes setTimeout and setInterval callbacks
│    ┗━━━━━━━━━━━━━┯━━━━━━━━━━━━━┛
│         Microtasks: nextTick, Promises
│    ┌─────────────┴─────────────┐
│    │     pending callbacks     │   Executes system callbacks from previous I/O
│    └─────────────┬─────────────┘
│         Microtasks: nextTick, Promises
│    ┌─────────────┴─────────────┐
│    │       idle, prepare       │   Internal preparation steps
│    └─────────────┬─────────────┘         ┌───────────────┐
│    ┏━━━━━━━━━━━━━┷━━━━━━━━━━━━━┓         │   incoming:   │
│    ┃           poll            ┃ <───────┤  connections, │   Main phase for I/O events
│    ┗━━━━━━━━━━━━━┯━━━━━━━━━━━━━┛         │   data, etc.  │
│         Microtasks: nextTick, Promises   └───────────────┘
│    ┏━━━━━━━━━━━━━┷━━━━━━━━━━━━━┓
│    ┃           check           ┃   Executes setImmediate callbacks
│    ┗━━━━━━━━━━━━━┯━━━━━━━━━━━━━┛
│         Microtasks: nextTick, Promises
│    ┏━━━━━━━━━━━━━┷━━━━━━━━━━━━━┓
│    ┃      close callbacks      ┃   Executes close event callbacks
│    ┗━━━━━━━━━━━━━┯━━━━━━━━━━━━━┛
│         Microtasks: nextTick, Promises
│    ┌─────────────┴─────────────┐
└─no─┤           exit?           │   Checks whether the program is finished
     └─────────────┬─────────────┘
                  yes
     ┌─────────────┴─────────────┐
     │           finish          │
     └───────────────────────────┘
```

> Heavy synchronous operations prevent the Event Loop from starting; it won't begin until the call stack is empty.
> Heavy asynchronous operations should be moved out of the main thread, for example, into worker threads, to avoid blocking the Event Loop.

### Timers

> Timers don't guarantee exact timing because of the Event Loop. The more the Event Loop is loaded, the greater the delay may be.

```javascript
// a callback
const greet = (name, emoji) => console.log(`Hello, ${name}! ${emoji}`)

// executes a callback once after a delay (ms)
setTimeout(() => console.log('Timeout'), 1000) // 'Timeout' after 1 sec.
setTimeout(greet, 5000, 'Alice', '👋') // 'Hello, Alice! 👋' after 5 sec.

// executes a callback once after a delay (ms) and saves the timer id into a variable
const timeout = setTimeout(() => console.log('Timeout'), 1000)
// cancels a timeout
clearTimeout(timeout)

// executes a callback repeatedly with a fixed delay (ms) and saves the timer id into a variable
const interval = setInterval(() => console.log('Interval'), 1000)
// cancels an interval
clearInterval(interval)

// executes a callback immediately after I/O events and saves the timer id into a variable
const immediate = setImmediate(() => console.log('Immediate'))
// cancels an immediate
clearImmediate(immediate)

// `ref` and `unref` usage
const anotherTimer = setTimeout(() => {
  console.log('Timeout is reached')
}, 3000)

// the timeout is unset
anotherTimer.unref()

// but at the `check` Event Loop stage we back the timer, so finally, it will be activated
setImmediate(() => {
  anotherTimer.ref()
})
// 'Timeout is reached' after 3 sec.
```
