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

#### Animated example

![Event Loop Animated](./img/nodejs/event-loop-animated.gif)

### Event Loop

```
     ┌───────────────────────────┐
     │       initialization      │   Synchronous code, `require`, register callbacks
     └─────────────┬─────────────┘
     Microtasks: nextTick, Promises
┌─────────────────>│
│    ┏━━━━━━━━━━━━━┷━━━━━━━━━━━━━┓
│    ┃           timers          ┃   Executes setTimeout and setInterval callbacks
│    ┗━━━━━━━━━━━━━┯━━━━━━━━━━━━━┛
│    Microtasks: nextTick, Promises
│    ┌─────────────┴─────────────┐
│    │     pending callbacks     │   Executes system callbacks from previous I/O
│    └─────────────┬─────────────┘
│    Microtasks: nextTick, Promises
│    ┌─────────────┴─────────────┐
│    │       idle, prepare       │   Internal preparation steps
│    └─────────────┬─────────────┘
│    Microtasks: nextTick, Promises        ┌───────────────┐
│    ┏━━━━━━━━━━━━━┷━━━━━━━━━━━━━┓         │   incoming:   │
│    ┃           poll            ┃ <───────┤  connections, │   Main phase for I/O events
│    ┗━━━━━━━━━━━━━┯━━━━━━━━━━━━━┛         │   data, etc.  │
│    Microtasks: nextTick, Promises        └───────────────┘
│    ┏━━━━━━━━━━━━━┷━━━━━━━━━━━━━┓
│    ┃           check           ┃   Executes setImmediate callbacks
│    ┗━━━━━━━━━━━━━┯━━━━━━━━━━━━━┛
│    Microtasks: nextTick, Promises
│    ┏━━━━━━━━━━━━━┷━━━━━━━━━━━━━┓
│    ┃      close callbacks      ┃   Executes close event callbacks
│    ┗━━━━━━━━━━━━━┯━━━━━━━━━━━━━┛
│    Microtasks: nextTick, Promises
│    ┌─────────────┴─────────────┐
└─no─┤           exit?           │   Checks whether the program is finished
     └─────────────┬─────────────┘
                  yes
     ┌─────────────┴─────────────┐
     │           finish          │
     └───────────────────────────┘
```

- Heavy synchronous operations prevent the Event Loop from starting; it won't begin until the call stack is empty.
- Heavy asynchronous operations should be moved out of the main thread, for example, into worker threads, to avoid blocking the Event Loop.

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

// reactivates the timer if the event loop is still active at `check` phase
setImmediate(() => {
  anotherTimer.ref()
})
// 'Timeout is reached' after 3 sec.
```

### Event Loop examples

#### Simple example

```javascript
console.log(1) // synchronous

setTimeout(() => {
  console.log(2) // timer
}, 0)

process.nextTick(() => {
  console.log(3) // nextTick
})

Promise.resolve()
  .then(() => {
    console.log(4) // microtask - promise
  })
  .then(() => {
    console.log(5) // another microtask within the same promise
  })

setImmediate(() => {
  console.log(6) // immediate
})

console.log(7) // synchronous

// 1, 7, 3, 4, 5, 2, 6
```

#### Extended example

```javascript
console.log(1) // synchronous

setTimeout(() => {
  console.log(2) // synchronous inside the timer
  process.nextTick(() => {
    console.log(3) // nextTick inside the timer
  })

  new Promise(resolve => {
    console.log(4) // synchronous inside the promise
    resolve()
  })
    .then(() => {
      console.log(5) // then for the first promise
      return new Promise(resolve => {
        console.log(6) // synchronous inside the second promise
        resolve()
      })
    })
    .then(() => {
      console.log(7) // then for the second promise
    })
}, 0)

setImmediate(() => {
  console.log(8) // immediate
})

new Promise(resolve => {
  console.log(9) // synchronous inside the promise
  resolve()
})
  .then(() => {
    console.log(10) // first then for the promise
  })
  .then(() => {
    console.log(11) // second then for the promise
  })

// 1, 9, 10, 11, 2, 4, 3, 5, 6, 7, 8
```

### Call stack and Debug mode

```javascript
const foo = 1

function a() {
  function b() {
    function c() {
      console.log(foo)
    }
    c()
  }
  b()
}

a() // 1
```

![Call stack and Debug mode in VS Code](./img/nodejs/debug-mode-breakpoints.png)

### Performance

```javascript
const { performance, PerformanceObserver } = require('perf_hooks')

// // // performance basic usage
const start = performance.now()
// ... slow code ...
console.log(performance.now() - start)

// // // performance measurement with marks
performance.mark('start')
// ... slow code ...
performance.mark('end')
performance.measure('slow', 'start', 'end') // label, mark1, mark2
console.log(performance.getEntriesByName('slow'))

// // // performance measurement with observer for `measure` type
const measureObs = new PerformanceObserver((items, observer) => {
  console.log(items.getEntries()) // all entries
  console.log(items.getEntriesByName('slow')) // entries by name
  console.log(items.getEntriesByType('measure')) // entries by type
  observer.disconnect()
})
measureObs.observe({ entryTypes: ['measure'] }) // 'dns', 'function', 'gc', 'http', 'http2', 'mark', 'measure', 'net', 'node', 'resource'

// // // performance measurement with observer for `function` type
function slow() {
  // ... slow code ...
}
slow = performance.timerify(slow)

const funcObs = new PerformanceObserver((items, observer) => {
  console.log(items.getEntries()) // all entries
  observer.disconnect()
})
funcObs.observe({ entryTypes: ['function'] }) // types of entries that we observe

// // // high-resolution timing for a function
console.time('label')
// ... slow code ...
console.timeEnd('label')

// // // inspecting event loop lag
const start = Date.now()
setImmediate(() => {
  const lag = Date.now() - start
  console.log(`Event Loop Lag: ${lag}ms`)
})

// // // memory usage
console.log(process.memoryUsage()) // { rss, heapTotal, heapUsed, external, arrayBuffers }
```

## Multi-threading

### Worker threads

- Node.js is a single-threaded environment, but it can use **Worker Threads** for multithreading to offload heavy computations.
- `libuv` has a default thread pool of **`4` threads** to handle asynchronous I/O operations, but it can be expanded up to **`1024` threads** using the `UV_THREADPOOL_SIZE` environment variable.

> Not every asynchronous operation uses **Worker Threads**.

**Worker Threads:**

- All filesystem operations with `fs.*`
- `dns.lookup()`
- Pipes (in some cases)
- CPU-intensive calculations

**OS-level Async Calls:**

- TCP / UDP server and client
- `http` / `https` client
- `dns.resolve()`
- Pipes
- `child_process`

Demonstrates that OS-level async calls operate independently of `UV_THREADPOOL_SIZE`, thus, requests are processed almost in parallel:

```javascript
const https = require('https')

const start = performance.now()

// number of threads can be set with `UV_THREADPOOL_SIZE` environment variable
process.env.UV_THREADPOOL_SIZE = 4

// https uses OS-level async calls
for (let i = 0; i < 32; i++) {
  https.get('https://example.com', res => {
    res.on('data', () => {})
    res.on('end', () => {
      console.log(performance.now() - start) // ~ 1000 1001 1003 1007 1008 1010 1011 1015 ...
    })
  })
}
```

Highlights the effect of `UV_THREADPOOL_SIZE`, showing output in batches, because only four threads can run in parallel when `UV_THREADPOOL_SIZE=4`:

```javascript
const crypto = require('crypto')

const start = performance.now()

// number of threads can be set with `UV_THREADPOOL_SIZE` environment variable
process.env.UV_THREADPOOL_SIZE = 4

// crypto uses worker threads
for (let i = 0; i < 32; i++) {
  crypto.pbkdf2('test', 'salt', 100000, 64, 'sha512', (err, key) => {
    console.log(performance.now() - start) // ~ 60 61 63 63 (x4)   118 119 119 120 (x4) ...
  })
}
```

#### Usage of Worker Threads

```javascript
// ./workers/compute.js
const { parentPort, workerData } = require('worker_threads')

const compute = ({ items }) =>
  items.map(num => {
    for (let i = 0; i < 1e9; i++) Math.sqrt(i) // imitation of cpu-intensive calculation
    return num ** 2
  })

parentPort.postMessage(compute(workerData))

// ./index.js
const { Worker } = require('worker_threads')

const computeWrapper = items => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./workers/compute.js', {
      workerData: {
        items,
      },
    })

    worker.on('message', msg => resolve(msg))
    worker.on('error', err => reject(err))
    worker.on('exit', () => console.log('Finished'))
  })
}

const main = async () => {
  try {
    performance.mark('start')

    const result = await Promise.all([
      computeWrapper([57, 31, 85, 48, 63, 92, 74, 59, 21]),
      computeWrapper([33, 67, 29, 50, 88, 41, 93, 77, 25]),
      computeWrapper([96, 45, 20, 58, 34, 99, 74, 89, 22]),
      computeWrapper([49, 27, 38, 97, 91, 53, 85, 32, 61]),
    ])
    console.log(result)

    performance.mark('end')
    performance.measure('main', 'start', 'end')
    console.log(performance.getEntriesByName('main').pop())
  } catch (error) {
    console.error(`Error: ${error?.message}`)
  }
}

main()
```

> ❗ Make sure you don't create worker threads on each web server connection! Create limited set of worker threads for that purpose instead.

### `exec`

```javascript
const { exec } = require('child_process')

const childProcess = exec('ls', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err?.message}`)
  }
  console.log(`Stdout: ${stdout}`)
  console.log(`Stderr: ${stderr}`)
})

childProcess.on('exit', exitCode => {
  console.log(`Child process exited with code: ${exitCode}`)
})
```

### `spawn`

```javascript
const { spawn } = require('child_process')

const childProcess = spawn('ls')

childProcess.stdout.on('data', data => {
  console.log(`Stdout: ${data}`)
})

childProcess.stderr.on('data', data => {
  console.log(`Stderr: ${data}`)
})

childProcess.on('error', err => {
  console.error(`Error: ${err?.message}`)
})

childProcess.on('exit', exitCode => {
  console.log(`Child process exited with code: ${exitCode}`)
})
```

### `fork`

...
