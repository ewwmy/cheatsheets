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

> Async (dynamic) imports can be declared anywhere in the code, unlike regular `import` statements, which must be placed only at the top of the source file.

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

> `fork` is used to create a child process in Node.js that runs a specified JavaScript file in a separate Node.js instance.

```javascript
// ./fork.js
process.on('message', msg => {
  if (msg === 'disconnect') {
    process.disconnect()
    return
  }
  console.log(`Fork process recieved: ${msg}`)
  process.send('pong')
})

// ./index.js
const { fork } = require('child_process')

const forkProcess = fork('./fork.js')

forkProcess.on('message', msg => {
  console.log(`Main process recieved: ${msg}`)
})

forkProcess.on('close', statusCode => {
  console.log(`Exited: ${statusCode}`)
})

forkProcess.send('ping')
forkProcess.send('disconnect')
```

### Worker Thread vs Fork

| Worker Thread                                      | Fork                                                              |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| Uses a thread within the same Node.js process      | Creates a new Node.js process                                     |
| Shares memory with the main thread                 | Isolates memory; uses IPC for communication with the main process |
| Lightweight and efficient for CPU-bound tasks      | Heavier and better suited for independent processes or tasks      |
| Can communicate directly with other Worker Threads | Forked processes cannot communicate directly with each other      |

- Worker Threads are ideal for parallelizing CPU-bound tasks without incurring the overhead of creating a new process. They exist within the same memory space as the main thread, which allows faster data exchange (no need for serialization or deserialization).
- Fork creates a completely separate process with its own memory space. This process communicates with the main process through Inter-Process Communication (IPC). Forked processes are useful for running fully isolated instances of Node.js, like independent servers or script runners.

> For frequent or large data transfers, use Worker Threads. IPC has limitations with very large data transfers (~200 MB) and may cause errors when exceeding buffer capacity. Additionally, creating threads is less resource-intensive than creating separate processes.

## V8

### Compilation stages

```
┌─────────────────┐      ┌─────────┐      ┌──────────────┐      ┌──────────────────┐
│   Source code   │─────>│   AST   │─────>│   Bytecode   │─────>│   Machine code   │
└─────────────────┘      └─────────┘      └──────────────┘      └──────────────────┘
```

#### AST

AST can be reviewed using the modern web service [AST explorer](https://astexplorer.net/).

##### Example

Source code:

```javascript
let items = ['one', 'two', 'three']

function printItems() {
  items.forEach((item, key) => console.log(`Item ${key}:` + item))
}
```

AST (simplified):

```
Program {
  body: [
    VariableDeclaration {
      declarations: [
        VariableDeclarator {
          id: Identifier {
            name: "items"
          }
          init: ArrayExpression {
            elements: [
              Literal {
                value: "one"
                raw: "'one'"
              }
              Literal {
                value: "two"
                raw: "'two'"
              }
              Literal {
                value: "three"
                raw: "'three'"
              }
            ]
          }
        }
      ]
      kind: "let"
    }
    FunctionDeclaration {
      id: Identifier {
        name: "printItems"
      }
      expression: false
      generator: false
      async: false
      params: []
      body: BlockStatement {
        body: [
          ExpressionStatement {
            ...
          }
        ]
      }
    }
  ]
  sourceType: "module"
}
```

#### Bytecode

```bash
node --print-bytecode ./app.js
```

```javascript
// ./app.js
const main = () => {
  const a = 3
  return a * 5
}
main()
```

```
...

[generated bytecode for function: main (0x3dd5bfc5b559 <SharedFunctionInfo main>)]
Bytecode length: 7
Parameter count 1
Register count 1
Frame size 8
Bytecode age: 0
   33 S> 0x3dd5bfc5c01e @    0 : 0d 03             LdaSmi [3]
         0x3dd5bfc5c020 @    2 : c4                Star0
   46 S> 0x3dd5bfc5c021 @    3 : 46 05 00          MulSmi [5], [0]
   49 S> 0x3dd5bfc5c024 @    6 : a9                Return
Constant pool (size = 0)
Handler Table (size = 0)
Source Position Table (size = 8)
0x3dd5bfc5c029 <ByteArray[8]>
```

### How V8 works

```
┌─────────────────┐      ┌────────────┐      ┌─────────┐
│   Source code   │─────>│   Parser   │─────>│   AST   │
└─────────────────┘      └────────────┘      └─────────┘
                                                  │
        ┌─────────────────────────────────────────┘
        V
┌──────────────┐
│   Ignition   │      ┌──────────────┐
│  interpreter │─────>│   Bytecode   │
└──────────────┘      └──────────────┘
                             │
                             └──────────────────┐
                                                V
┌──────────────┐                        ┌──────────────┐
│   TurboFan   │<╴╴╴╴╴optimization╶╶╶╶╶╶│   Sparkplug  │
│   compiler   │╴╴╴╴╴deoptimization╶╶╶╶>│   compiler   │
└──────────────┘                        └──────────────┘
       │                                        │
       V                                        V
┌──────────────┐                       ┌─────────────────┐
│  Optimized   │                       │  Non-optimized  │
│ machine code │╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴│  machine code   │
└──────────────┘                       └─────────────────┘
```

- **Parser**: Converts the source code into an Abstract Syntax Tree (**AST**).
- **Ignition Interpreter**: Converts the AST into **bytecode** for fast interpretation.
- **Sparkplug Compiler**: Compiles **bytecode** into **non-optimized machine code**, improving performance at the initial stages of execution.
- **Profiling**: During execution, V8 profiles the code while running it through **Ignition** or **Sparkplug**, identifying parts that could be optimized (referred to as **hot code**).
  - If profiling indicates that a part of the code can be optimized, **TurboFan** is triggered to compile that **hot code** into **optimized machine code**.
  - If **TurboFan**'s optimization assumptions fail during execution, control is returned to **Sparkplug** for re-compilation (referred to as **deoptimization**).

#### Optimization / Deoptimization

> **TurboFan** makes optimizations by creating **Hidden Classes** to make assumptions about data types.

How to make code optimization work:

- Maintain consistent data types when passing arguments into functions: `add(1); add(2);` ~~`add('3');`~~
- Maintain the order of properties in objects.
- TypeScript generates well-optimized JavaScript code.

### Memory

Node.js (via V8) manages memory automatically with a **Garbage Collector (GC)**, freeing unused memory to prevent leaks.

- **Reference Counting**: Tracks object references; doesn’t handle cyclic references well.
- **Mark-and-Sweep**: Pauses execution to scan objects; frees unmarked ones.
- **Tri-Color Marking**: Efficient, incremental algorithm; reduces pauses.

#### Memory Fragmentation

- **Stop-and-Copy**: Compacts memory by copying live objects to a new space; pauses execution.

#### Generational GC: Young and Old Spaces

- **Young Space**: Holds short-lived objects; managed with **Parallel Scavenger** GC:
  - **Nursery**: New objects go here.
  - **Intermediate**: Retains objects after initial GC.
- **Old Space**: Stores long-lived objects; uses **Mark-Sweep** and **Incremental Marking**.

#### Debugging GC

Show detailed GC logs:

```bash
node --expose-gc --trace_gc_verbose app.js
```

## `process`, `os`, `path`

### `process`

```javascript
process.argv // array of passed command-line arguments, including `node` and the executing filename
process.env // object with the environment variables
process.env.MY_VAR // access to the `MY_VAR` environment variable
```

Pass environment variables:

```bash
MY_VAR=something node app.js
```

Or set environment variables globally:

```bash
export MY_VAR=something
node app.js
```

`app.js`:

```javascript
console.log(process.env.MY_VAR) // 'something'
```

### `os`

```javascript
import { homedir } from 'node:os'
homedir() // absoulte path of the home directory
```

### `path`

```javascript
import {
  join,
  basename,
  dirname,
  extname,
  relative,
  isAbsolute,
  resolve,
  sep,
} from 'node:path'

join('/a/b', 'something.txt') // safely concatenate path parts together: '/a/b/something.txt'
join('/a/b//', '/something.txt') // safely concatenate path parts together: '/a/b/something.txt'
join('a/b', '../c/d') // safely concatenate path parts together: 'a/c/d'

basename('/a/b/c') // last element of the path: 'c'
basename('/a/b/file.smth.txt') // last element of the path: 'file.smth.txt'

dirname('/a/b/c') // part of the path without the last element: '/a/b'
dirname('/a/b/file.smth.txt') // part of the path without the last element: '/a/b'

extname('/a/b/c') // extension: ''
extname('/a/b/file.smth.txt') // extension: '.txt'

relative('/a/b', '/a/b/c/file.txt') // relative path between two passed: 'c/file.txt'
relative('/a/b/c', '/a/b/file.txt') // relative path between two passed: '../file.txt'

isAbsolute('/a/b') // check if the path is absolute: true
isAbsolute('a/b') // check if the path is absolute: false

// current dir: '/home/user/tests':
resolve('/a/b') // make absolute path: '/a/b'
resolve('a/b') // make absolute path: '/home/user/tests/a/b'
resolve('a/b/..') // make absolute path: '/home/user/tests/a'
resolve('../..') // make absolute path: '/home'

sep // path separator for the current OS: '/'
```

## Environment variables

> The examples below are valid for Linux.

```bash
# create a session-only variable
MY_VAR="session_value" # available only in this shell

# print the value of a variable
echo $MY_VAR

# export an already defined variable
export MY_VAR # makes an existing variable available to child processes

# export a new variable (to child processes)
export ANOTHER_VAR="exported_value" # available in this shell and all child processes

# unset a variable
unset MY_VAR # removes the variable

# pass variables to a command or script (it overrides variables for the command)
MY_VAR="some_value" ANOTHER_VAR="another_value" node ./app.js # only for this command

# persist a variable across sessions (add to ~/.bashrc or ~/.bash_profile)
echo 'export MY_VAR="persistent_value"' >> ~/.bashrc
source ~/.bashrc # apply changes to the current session
```

### `dotenv`

> `dotenv` automatically reads `.env` files, parses their content, and loads the variables into the `process.env` object in a Node.js application.

#### Security note

> Real `.env` files (not the example ones) must always be added to `.gitignore` to prevent sensitive data from leaking.

#### Installation

```bash
npm i dotenv
```

#### Usage

`.env`:

```
APP_NAME="my-awesome-app"
```

`.env.production`:

```
APP_NAME="my-awesome-app (production)"
```

`index.js`:

```javascript
import 'dotenv/config' // this automatically loads the `.env` file without additional configuration
console.log(process.env.APP_NAME) // my-awesome-app
```

`advanced.js`:

```javascript
import dotenv from 'dotenv'
dotenv.config({ path: './.env.production' })
console.log(process.env.APP_NAME) // my-awesome-app (production)
```

## `http`

### Create HTTP server

#### `server.mjs`

```javascript
import http from 'node:http'

const hostname = 'localhost'
const port = 8000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(
    JSON.stringify({
      data: 'Hello World!',
    })
  )
})

server.listen(port, hostname, () => {
  console.log(`Server is running on ${hostname}:${port}...`)
})
```

#### Run

```bash
node server.mjs &

# Server is running on localhost:8000...
```

#### Test

```bash
http get localhost:8000

# HTTP/1.1 200 OK
# Connection: keep-alive
# Content-Length: 23
# Content-Type: application/json
# Date: Fri, 03 Jan 2025 18:13:05 GMT
# Keep-Alive: timeout=5

# {
#     "data": "Hello World!"
# }
```

#### Stop

```bash
fg
^C
```

### Perform HTTP requests

#### `client.mjs`

```javascript
import * as http from 'node:http'

const hostname = 'localhost'
const port = 8000

// http.get(options[, callback])
// http.get(url[, options][, callback])
http.get(
  {
    hostname,
    port,
    path: '/',
  },
  res => {
    let rawData
    console.log(`HTTP/${res.httpVersion}`, res.statusCode, res.statusMessage)
    console.log(res.headers)
    res.on('data', chunk => {
      rawData += chunk
    })
    res.on('end', () => {
      console.log(rawData)
    })
  }
)
```

#### Run

```bash
node client.mjs
```

## Express

```javascript
import express from 'express'

const port = 3000
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
```

## Express Router and Middleware

### `index.js`

```javascript
import express from 'express'
import { userRouter } from './routes/user.js'

const port = 8000
const app = express()

// order of defining handlers (by calling `.get()`, `.post()`, etc.) is important

// use custom middleware
app.use((req, res, next) => {
  console.log('First root middleware')
  next()
})

// of course, handlers can be defined separately
const anotherMiddleware = (req, res, next) => {
  console.log('Second root middleware')
}

// use middleware from a predefined function
app.use(anotherMiddleware)

// use middleware on `/hello` url
app.use('/hello', (req, res, next) => {
  console.log('Hello middleware')
  next()
})

// `/hello` handler on GET request
app.get('/hello', (req, res) => {
  console.log('Hello!')
})

// use a router on the `/user` url
app.use('/user', userRouter)

// throw error in a handler
app.get('/error', (req, res) => {
  throw new Error('Something went wrong')
})

// error handler middleware; must be defined after all other handlers
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).send(err.message)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
```

### `routes/user.js`

```javascript
import express from 'express'

const userRouter = express.Router()

// use custom middleware only for the current router
userRouter.use((req, res, next) => {
  console.log('User middleware')
  next()
})

// `/user/login` handler on POST request
userRouter.post('/login', (req, res) => {
  res.send('Login')
})

// `/user/register` on POST request
userRouter.post('/register', (req, res) => {
  res.send('Register')
})

export { userRouter }
```

## Layered Architecture

```
                                        Application
              ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
              ┃           ┌─────────┐          ┌────────────────┐     ┌───┐ ┃
Request ──────╂──────────>│   DTO   ├─────────>│   Middleware   │     │   │ ┃
              ┃           └─────────┘          └────────────────┘     │   │ ┃
              ┃                                        ↓              │   │ ┃      Presentation Layer
              ┃     ┌────────────────────┐     ┌────────────────┐     │   │ ┃
Response <────╂─────┤ Exception Handler  │<────┤   Controller   │     │ L │ ┃
              ┃     └────────────────────┘     └────────────────┘     │ o │ ┃
              ┃                                        ↓↑             │ g │ ┃   -------------------------------------------
              ┃         ┌─────────────┐        ┌────────────────┐     │ g │ ┃
              ┃         │   Entity    │<──────>│    Service     │     │ e │ ┃      Business Logic Layer
              ┃         └─────────────┘        └────────────────┘     │ r │ ┃
              ┃                                        ↓↑             │   │ ┃   -------------------------------------------
              ┃         ┌─────────────┐        ┌────────────────┐     │   │ ┃
              ┃         │    Model    │<──────>│   Repository   │     │   │ ┃      Data Access Layer (Persistence Layer)
              ┃         └─────────────┘        └────────────────┘     └───┘ ┃
              ┗━━━━━━━━━━━━━━━↓↑━━━━━━━━━━━━━━━━━━━━━━━↓↑━━━━━━━━━━━━━━━━━━━┛   -------------------------------------------
              ┌-------------------------------------------------------------┐
              ╎                        D a t a b a s e                      ╎      Database Layer
              └-------------------------------------------------------------┘
```

Good for:

- small to medium API applications
- microservices.

Not suitable for:

- large monolithic API applications (Domain-Driven Design is usually a better choice in such cases).

## DIP, IoC, DI, IoC Container

### DIP (Dependency Inversion Principle)

The **Dependency Inversion Principle** is one of the **SOLID** principles. It states that high-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

### IoC (Inversion of Control)

**Inversion of Control** is a **principle** in software design where control of object creation and dependency management is transferred from the application code to a framework or container.

### DI (Dependency Injection)

**Dependency Injection** is a **design pattern** used to provide dependencies (e.g., services, objects) to a class rather than the class instantiating them directly.

#### Through a constructor

```typescript
class Logger {
  public info(...args: unknown[]): void {
    console.log(...args)
  }
}

class Application {
  public constructor(private logger: Logger) {}

  public something(): void {
    this.logger.info('something')
  }
}

const logger = new Logger()
const app = new Application(logger)
app.something()
```

#### Through a method

```typescript
class Logger {
  public info(...args: unknown[]): void {
    console.log(...args)
  }
}

class Application {
  public something(logger: Logger): void {
    logger.info('something')
  }
}

const logger = new Logger()
const app = new Application()
app.something(logger)
```

#### Improved DI by using interfaces

```typescript
interface ILogger {
  info(...args: unknown[]): void
}

class Logger implements ILogger {
  public info(...args: unknown[]): void {
    console.log(...args)
  }
}

class Application {
  public constructor(private logger: ILogger) {}

  public something(): void {
    this.logger.info('something')
  }
}

const logger = new Logger()
const app = new Application(logger)
app.something()
```

### Composition Root

**Composition Root** is a **design pattern** and a key concept in **Dependency Injection (DI)**. It is the central location in your application where all the components and their dependencies are assembled. This is where the dependency graph is constructed and all objects are configured and wired together before the application is run.

In simpler terms, the Composition Root is the place in your code where:

- you register and configure all the dependencies
- you assemble and wire together the components of your system
- it acts as the entry point for creating and initializing the application.

```typescript
const main = async () => {
  const logger = new Logger()
  const app = new Application(logger, new UserController(logger))
  await app.init()
}

main()
```

### IoC Container (Inversion of Control Container)

An **IoC Container** is a framework/tool that handles the lifecycle and dependency resolution of objects, often using configuration or annotations. It simplifies managing dependencies and promotes decoupling.

[InversifyJS](https://github.com/inversify/InversifyJS) is one of the popular implementations of an **IoC Container**.

#### InversifyJS Example

```typescript
import 'reflect-metadata'
import { Container, injectable, inject } from 'inversify'

interface IEngine {
  start(): void
}

interface ICar {
  drive(): void
}

interface ILogger {
  log(data: string): void
}

@injectable()
class Engine implements IEngine {
  constructor(@inject('logger') private logger: ILogger) {}

  start() {
    this.logger.log('[Engine] Started...')
  }
}

@injectable()
class Car implements ICar {
  constructor(
    @inject('engine') private engine: IEngine,
    @inject('logger') private logger: ILogger
  ) {}

  drive() {
    this.engine.start()
    this.logger.log('[Car] Driving...')
  }
}

@injectable()
class Logger implements ILogger {
  constructor() {
    this.log('[Logger] Initialized...')
  }

  log(data: string) {
    console.log(data)
  }
}

// create a container
const container = new Container()

// bind interfaces to their concrete implementations
container.bind<IEngine>('engine').to(Engine) // transient (default) scope
container.bind<ICar>('car').to(Car) // transient (default) scope
container.bind<ILogger>('logger').to(Logger).inSingletonScope() // singleton scope: ensures that only one instance of the dependency exists in the container

// resolve dependencies
const car = container.get<ICar>('car')
car.drive()
// [Logger] Initialized...
// [Engine] Started...
// [Car] Driving...

// demonstrate transient dependency
const anotherCar = container.get<ICar>('car')
console.log(car === anotherCar) // false

// demonstrate singleton dependency
const logger = container.get<ILogger>('logger')
const sameLogger = container.get<ILogger>('logger')
console.log(logger === sameLogger) // true
```

##### Explanation

1. **Interfaces (`IEngine` and `ICar`):**

- define a contract that classes are required to follow
- this allows implementations to be easily swapped without modifying the `Car` class itself.

2. **Container:**

- uses string identifiers (`'IEngine'`, `'ICar'`) to map interfaces to their implementations
  - this is especially useful when multiple implementations of the same interface are available.

3. **Dependency Injection:**

- the `Car` class does not care about which specific implementation of `IEngine` is provided — this decision is delegated to the container.

4. **Singleton Scope:**

- dependencies bound with `.inSingletonScope()` are instantiated only once, and the same instance is reused across all classes that inject it
- in this example, `Logger` is defined as a singleton; even though it is injected into both the `Engine` and `Car` classes, **only one instance** of `Logger` is created and shared
- this is evident from the `Logger` constructor logging `[Logger] Initialized...` **only once**, regardless of how many times it is injected or retrieved from the container.

##### Benefits

- **Flexibility**: Easily replace `Engine` with another implementation, such as `ElectricEngine`
- **Testability**: In tests, a mock object can be provided instead of the real `Engine`
- This is a more mature and universal approach that adheres to the SOLID principles.

#### InversifyJS Example with `ContainerModule`

```typescript
// create a module and bind interfaces to their concrete implementations there
const carModule = new ContainerModule(bind => {
  bind<IEngine>('engine').to(Engine)
  bind<ICar>('car').to(Car)
  bind<ILogger>('logger').to(Logger).inSingletonScope()
})

// create a container
const container = new Container()

// load the module into the container
container.load(carModule)

// resolve dependencies
const car = container.get<ICar>('car')
car.drive()
```

### Service Locator

The **Service Locator** pattern is a **design pattern** used to provide a centralized registry (or locator) that can be queried to retrieve services or dependencies. It is an alternative approach to Dependency Injection (DI), where instead of injecting dependencies into objects explicitly, the objects fetch their dependencies from the service locator at runtime.

### Code example

```typescript
// DIP (Dependency Inversion Principle):
// The high-level module (Application) depends on an abstraction (ILogger)
// rather than a concrete implementation (ConsoleLogger).
interface ILogger {
  log(message: string): void
}

// Concrete implementation of the ILogger abstraction.
// This is a low-level module.
class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(message)
  }
}

// DI (Dependency Injection):
// The dependency (ILogger) is injected through the constructor,
// instead of being created inside the class.
class Application {
  constructor(private logger: ILogger) {} // dependency is injected via the constructor
  run() {
    this.logger.log('Application is running...')
  }
}

// IoC (Inversion of Control):
// The control of object creation is transferred to external code.
// Here, the external code creates and provides the dependency.
const logger = new ConsoleLogger() // external code manages the creation of the dependency
const app = new Application(logger) // external code manages the injection of the dependency
app.run()
```

## Developer tools

### ESLint and Prettier

#### Installation

```bash
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier typescript
touch .prettierrc
touch eslint.config.js # `.eslintrc.js` or `.eslintrc` for old ESLint versions
mkdir -p .vscode
touch .vscode/settings.json
```

#### Prettier Config

```json
{
  "semi": false,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "endOfLine": "lf"
}
```

#### ESLint Config

```javascript
module.exports = [
  {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      tsconfigRootDir: __dirname,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    root: true,
    env: {
      node: true,
      jest: true,
    },
    ignorePatterns: ['eslint.config.js', '.eslintrc.js', '.eslintrc'],
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': [
        'error',
        {
          semi: false,
          tabWidth: 2,
          useTabs: false,
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 80,
          arrowParens: 'avoid',
          bracketSpacing: true,
          endOfLine: 'lf',
        },
      ],
    },
  },
]
```

##### Autoload `.prettierrc` settings

```javascript
const fs = require('fs')

function getPrettierConfig() {
  const configPath = `${__dirname}/.prettierrc`
  const fileContent = fs.readFileSync(configPath, 'utf8')
  return JSON.parse(fileContent)
}

const prettierConfig = getPrettierConfig()

module.exports = [
  {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      tsconfigRootDir: __dirname,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    root: true,
    env: {
      node: true,
      jest: true,
    },
    ignorePatterns: ['eslint.config.js', '.eslintrc.js', '.eslintrc'],
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': ['error', prettierConfig],
    },
  },
]
```

##### Default ESLint rules from NestJS setup

```javascript
{
  '@typescript-eslint/interface-name-prefix': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
},
```

#### VS Code Settings

##### Using Prettier VS Code plugin

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.requireConfig": true
}
```

##### Using ESLint VS Code plugin

```json
{
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

#### ESLint `package.json` scripts

##### General

```json
{
  "scripts": {
    "lint": "eslint \"./src/**\"",
    "lint:fix": "eslint \"./src/**\" --fix"
  }
}
```

##### NestJS default + Prettier

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  }
}
```

### `nodemon` and `ts-node`

- `nodemon` is a tool that automatically restarts the application when file changes are detected
- `ts-node` is an on-the-fly executor for TypeScript files without pre-building.

```bash
npm i -D nodemon ts-node
```

> `ts-node` respects `tsconfig.json`, so no additional config needed.

`nodemon.json`:

```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node ./src/main.ts"
}
```

Run:

```bash
nodemon
```

### Debug

#### Security note

Never run Node.js with `inspect` (debug) mode in production! Use debug mode only in development.

- **Performance**: Debug mode adds significant overhead.
- **Security**: Opens a debug port (e.g., `9229`) that can expose sensitive data.
- **Risk**: Debug tools may leak internal app state.

For production monitoring, use tools like **[PM2](https://pm2.keymetrics.io/)** or **[Clinic.js](https://clinicjs.org/)**.

If debug is essential in production, make sure you restrict access to the debug port with firewalls or IP whitelisting.

#### Debug in VS Code with `nodemon`

```bash
mkdir -p .vscode
touch .vscode/launch.json # profile configuration for debug in VS Code
```

##### `.vscode/launch.json`

Create a Debug profile for VS Code in `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug (nodemon)",
      "runtimeExecutable": "${workspaceFolder}/node_modules/nodemon/bin/nodemon.js",
      "restart": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

- `"type": "node"` — use Node.js
- `"request": "launch"` — launch the debugger (also available `attach`)
- `"name": "Debug (nodemon)"` — profile name (to select in VS Code)
- `"runtimeExecutable": "..."` — what to execute to run the application
- `"restart": true` — restart the debugger if the application is restarted
- `"console": "integratedTerminal"` — use the built-in terminal in VS Code
- `"internalConsoleOptions": "neverOpen"` — no need to open the debug console automatically.

##### `tsconfig.json`

If you're using TypeScript, enable `sourceMap` option in `tsconfig.json` to bind code lines between the TypeScript source files and the built JavaScript files:

```json
{
  "compilerOptions": {
    "sourceMap": true /* Create source map files for emitted JavaScript files. */
  }
}
```

##### Start Debugging

1. Set breakpoints
2. Press `F5` (or use the section **Run and Debug** in VS Code, select a profile, e.g., **Debug (nodemon)**, and press **Start Debugging**).

Now you can:

- walk between breakpoints, enabling or disabling them
- use the debug console
- watch current variables
- check the call stack, and more.

#### Chrome DevTools for Node.js to detect memory leaks

> You can use any external debugger, e.g. **Chrome DevTools for Node.js**. It's especially useful for memory profiling.

To use **Chrome DevTools for Node.js**, open [Inspect](chrome://inspect/#devices) and press on **Open dedicated DevTools for Node**.

Run the application in debug mode with `nodemon` and `ts-node`:

```bash
nodemon -e ts,json --exec node --inspect=localhost:9222 -r ts-node/register src/main.ts
```

or add an npm-script to run it with `npm run start:debug`:

```json
{
  "scripts": {
    "start:debug": "nodemon -e ts,json --exec node --inspect=localhost:9222 -r ts-node/register src/main.ts"
  }
}
```

Structure of Chrome DevTools for Node.js:

- **Connection** — set up connections to the debugging applications
- **Console** — a standard console, where any output of the application appears and any JS-command can be run in the application context
- **Sources** — the source code can be viewed here (you need to enable `sourceMap` option in `tsconfig.json` to be able to view the source TypeScript files)
- **Performance** — record the application activity to analyze the timeline of functions and methods in the call stack
- **Memory** — watch how much memory each object uses, by making memory snapshots and comparing them (e.g., **Objects allocated between Snapshot N and Snapshot M**).

### Detect performance issues with **Clinic.js Doctor** and **Autocannon**

**Clinic.js Doctor** is an instrument to collect and show the performance information while the application is running:

- Detected potential problems (e.g., memory leaks or event loop issues)
  - Recommendations on how to solve them
- CPU Usage
- Memory Usage
- Event Loop Delay
- Active Handlers.

**Autocannon** is a tool to generate multiple HTTP requests to the application in order to provide sufficient load and collect the basic metrics.

Installation:

```bash
npm i -g clinic autocannon
```

> Add `.clinic` directory to the `.gitignore` to avoid saving the reports in Git.

Example:

```bash
clinic doctor --on-port 'autocannon -m POST localhost:3000/endpoint/to/check' -- node dist/main.js
```

## Validation with `class-validator` and `class-transformer`

- `class-validator` is a library for object validation in TypeScript; it helps to enforce rules and constraints on class properties (e.g., string length, integer range)
- `class-transformer` is used to transform plain objects (e.g., received from an API) into class instances (to use methods and properties defined in the class) and vice versa.

### Installation

```bash
npm i class-validator class-transformer
```

### Usage

`user.dto.ts`:

```typescript
import { IsString, IsInt, MinLength } from 'class-validator'

export class UserDto {
  @IsString()
  @MinLength(3)
  name: string

  @IsInt()
  age: number
}
```

`index.ts`:

```typescript
import 'reflect-metadata'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { UserDto } from './user.dto'

const plainObject = { name: 'Alex', age: 25 }

const user = plainToInstance(UserDto, plainObject)

validate(user).then(errors => {
  if (errors.length > 0) {
    console.log('Validation failed:', errors)
  } else {
    console.log('Validation succeeded')
  }
})
```

## Authentication and Authorization

> **Authentication** is the process of verifying the identity of a user, ensuring they are who they claim to be. It answers the question: "Who are you?" (e.g., via username and password, biometrics, or a token).

> **Authorization** is the process of granting or denying a user access to resources or actions based on their permissions or roles. It answers the question: "What can you do?" (e.g., access to certain APIs, files, or functionalities in the system).

### `bcrypt`

> `bcrypt` is a library used to hash passwords securely and compare them during authentication.

#### Installation

```bash
npm i bcrypt
```

#### Hashing and Verifying a Password

```javascript
import bcrypt from 'bcrypt'

// determines the complexity of the hash
const saltRounds = 10
const plainPassword = 'my-secure-password'

// hashing a password
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
console.log('Hashed Password:', hashedPassword) // Hashed Password: $2b$10$...

// password entered by the user
const enteredPassword = 'my-secure-password'
// password hash retrieved from the database
const savedHash = hashedPassword

// verifying a password
const isMatch = await bcrypt.compare(enteredPassword, savedHash)

if (isMatch) {
  console.log('OK: Password is correct')
} else {
  console.log('Error: Wrong password')
}
// OK: Password is correct
```

#### Notes

- `saltRounds`: higher values increase security but slow down hash generation
- store only the hashed password in your database, never the plain password
- use `async` methods (`hash` and `compare`) to prevent blocking the event loop.

### JWT

> JWT (JSON Web Token) is a compact, URL-safe token format used to securely transmit information between participants as a JSON object. It is stateless, meaning it eliminates the need for server-side session storage, and is typically used for authentication and authorization.

> JWT guarantees that the token data hasn't been altered during transmission, as long as the token's signature is valid.

#### Structure

```
header.payload.signature
```

##### Header

> Converted to `base64Url`.

Object structure:

- `alg` (algorithm): `HS256` `HS384` `HS512` `RS256` `RS384` `RS512` `ES256` `ES384` `ES512` `PS256` `PS384` `PS512`
- `typ` (token type): `JWT`.

Example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

##### Payload

> Converted to `base64Url`.

Object structure:

- Registered claims (optional):
  - `iss` (issuer)
  - `exp` (expiration time)
  - `sub` (subject)
  - `aud` (audience)
  - and [others](https://tools.ietf.org/html/rfc7519#section-4.1).
- Public claims (optional)
- Private claims (optional)
  - any custom data:
    - `id`: `123`
    - `role`: `"user"`
    - and more.

Example:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

> The data in `payload` is not encrypted, so you should never pass any sensitive or secret information here.

##### Verify Signature

> Generated using the algorithm specified in `header.alg` and converted to `base64Url`.

Example for `HS256`:

```javascript
base64UrlEncode(
  HMACSHA256(
    base64UrlEncode(header) + '.' + base64UrlEncode(payload),
    secretToBase64 ? base64UrlEncode(secret) : secret
  )
)
```

Example for `RS512`:

```javascript
base64UrlEncode(
  RSASHA512(
    base64UrlEncode(header) + '.' + base64UrlEncode(payload),
    publickey,
    privatekey
  )
)
```

#### How JWT Works

##### 1. User Authentication

When a user logs in successfully, the server generates and returns a JSON Web Token (JWT). This token acts as the user's credential.

##### 2. Token Usage

The client (e.g., browser) sends the JWT in the `Authorization` header of API requests using the `Bearer` scheme:

```
Authorization: Bearer <token>
```

##### 3. Server Validation

The server checks the JWT's validity (whether the `payload` data matches the data signed in the `signature`). If valid, the user is granted access to protected resources.

Additionally, server can check the `payload` data (e.g., `iat`, `exp`, `role`, etc.) to determine whether the sender is authorized to access the requested resource.

##### Stateless Mechanism

JWT eliminates the need for server-side session storage, as all required information is contained in the token itself.

##### CORS-Friendly

If the token is sent in the `Authorization` header, Cross-Origin Resource Sharing (CORS) won't be an issue as it doesn't use cookies.

##### Security Notes

- do not store sensitive data in JWT; they are visible to anyone
- avoid storing tokens in browser storage due to limited security
- keep tokens small; large tokens can exceed server header size limits.

#### Work with JWT in Node.js

##### Installation

```bash
npm i jsonwebtoken
```

Additionally, if TypeScript support is needed:

```bash
npm i -D @types/jsonwebtoken
```

##### Usage

```javascript
import jwt from 'jsonwebtoken'

// secret key to sign the token with the HS256 algorithm
const SECRET_KEY = 'your-very-secure-secret'

// function to create (sign) a token
export async function createToken(payload, expiresIn = '1h') {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      SECRET_KEY,
      { expiresIn, algorithm: 'HS256' }, // `algorithm` defaults to `'HS256'`; `iat` defaults to `Math.floor(Date.now() / 1000)`
      (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      }
    )
  })
}

// function to verify a token
export async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

// usage
async function main() {
  try {
    // create the token
    const payload = { userId: 123, username: 'exampleUser' }
    const token = await createToken(payload)
    console.log('Generated token:', token)

    // verify and decode the token
    const decodedPayload = await verifyToken(token)
    console.log('Decoded payload:', decodedPayload)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

main()
// Generated token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywidXNlcm5hbWUiOiJleGFtcGxlVXNlciIsImlhdCI6MTczNjU0NjcwMSwiZXhwIjoxNzM2NTUwMzAxfQ.rrfYbhr9o9l2-qVBH0WytUGIWPiMmTTPW4vemqnKfes
// Decoded payload: {
//   userId: 123,
//   username: 'exampleUser',
//   iat: 1736546701,
//   exp: 1736550301
// }
```

### Guards

> A guard is typically a middleware to validate user credentials, such as a JWT token. If the token is invalid or the user lacks proper permissions, the guard blocks further request processing and returns an error.

## Testing

### Testing Pyramid

```
      ------------------------------------------------------------
     ╱   E2E   ╲        API tests, the entire system
    --------------------------------------------------------------
   ╱ Integration ╲      Two or more components together
  ----------------------------------------------------------------
 ╱      Unit       ╲    Isolated functions, components, modules
------------------------------------------------------------------
```

Frontend libraries:

- **Cypress** (high-level E2E testing framework)
- **Protractor** (E2E testing library for Angular)
- **Puppeteer** (high-level API to control Chrome or Firefox over the DevTools Protocol or WebDriver BiDi).

Backend (Common) libraries:

- **Jest** (TypeScript-compatible JavaScript Testing Framework)
- **Mocha** (JavaScript test framework running on Node.js and in the browser)
- **Chai** (BDD / TDD assertion library for node and the browser).

### Unit Testing

#### Jest

##### Installation

```bash
npm i -D jest
```

Additionally, if TypeScript support is needed:

```bash
npm i -D @types/jest ts-jest
```

##### Configuration

`jest.config.ts`:

```typescript
import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
}

export default config
```

`package.json`:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Run:

```bash
npm run test
```

##### Usage

`user.service.spec.ts`:

```typescript
import 'reflect-metadata'
/* other imports */

// mocking service to be injected
const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
}

// mocking service to be injected
const UsersRepositoryMock: IUsersRepository = {
  find: jest.fn(),
  create: jest.fn(),
}

// mock data for tests
const MockDictionary = {
  user: {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'qwerty',
    wrongPassword: 'abc',
  },
  config: {
    salt: '10',
  },
}

// create IoC container as usual
const container = new Container()

// define dependencies
let configService: IConfigService
let usersRepository: IUsersRepository
let usersService: IUserService

// hook to run before all tests
beforeAll(() => {
  // bind the real service that we want to test (current service)
  container.bind<IUserService>(TYPES.UserService).to(UserService)

  // bind mocked service that the tested service depends on
  container
    .bind<IConfigService>(TYPES.ConfigService)
    .toConstantValue(ConfigServiceMock)

  // bind mocked service that the tested service depends on
  container
    .bind<IUsersRepository>(TYPES.UsersRepository)
    .toConstantValue(UsersRepositoryMock)

  // instantiate all needed dependencies from the container
  configService = container.get<IConfigService>(TYPES.ConfigService)
  usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository)
  usersService = container.get<IUserService>(TYPES.UserService)
})

// define a user model object outside the tests to be able to use it in other tests (avoid dependency between tests, but this can be useful in sequential testing)
let createdUser: UserModel | null

// test suite for `UserService`
describe('UserService', () => {
  // test case for the `createUser` method
  it('createUser — Creates a user with hashed password and returns it', async () => {
    // mock the value returned by `configService.get`
    configService.get = jest
      .fn()
      .mockReturnValueOnce(MockDictionary.config.salt)

    // mock the implementation of `usersRepository.create`
    usersRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        name: user.name,
        email: user.email,
        password: user.password,
        id: MockDictionary.user.id,
      })
    )

    // call the method to be tested
    createdUser = await usersService.createUser({
      email: MockDictionary.user.email,
      name: MockDictionary.user.name,
      password: MockDictionary.user.password,
    })

    // assert the returned user has the expected id
    expect(createdUser?.id).toEqual(MockDictionary.user.id)

    // assert the password is hashed (not equal to the original)
    expect(createdUser?.password).not.toEqual(MockDictionary.user.password)
  })

  // test case for the `validateUser` method with correct data
  it('validateUser — Correct password', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser)
    const res = await usersService.validateUser({
      email: MockDictionary.user.email,
      password: MockDictionary.user.password,
    })
    expect(res).toBeTruthy()
  })

  // test case for the `validateUser` method with wrong data
  it('validateUser — Wrong password', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser)
    const res = await usersService.validateUser({
      email: MockDictionary.user.email,
      password: MockDictionary.user.wrongPassword,
    })
    expect(res).toBeFalsy()
  })
})
```

### E2E Testing

> For E2E testing it's highly recommended to use different environment, e.g. creating different instance of the database.

#### Jest

##### Installation

> `supertest` is a library to perform HTTP requests using Express.

```bash
npm i -D jest supertest
```

Additionally, if TypeScript support is needed:

```bash
npm i -D @types/jest @types/supertest ts-jest
```

##### Configuration

```bash
mkdir -p ./tests
```

`jest.e2e.config.ts`:

```typescript
import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  rootDir: './tests',
  testRegex: '.e2e-spec.ts$',
}

export default config
```

`package.json`:

```json
{
  "scripts": {
    "test:e2e": "jest --config jest.e2e.config.ts"
  }
}
```

Run:

```bash
npm run test:e2e
```

##### Usage

`./tests/users.e2e-spec.ts`:

```typescript
import request from 'supertest'
/* other imports */

// mock data for tests
const MockDictionary = {
  existingUser: {
    email: 'test@example.com',
    password: 'qwerty',
    wrongPassword: 'abc',
  },
}

// declare an instance of the application class
let application: App

// run the application before all tests
beforeAll(async () => {
  application = await bootstrap()
  /* here we can connect to the test database and create all necessary test data */
})

// test suit for the users e2e
describe('Users E2E', () => {
  // test case for the `POST /users/register` method
  it('Registration — User already exists', async () => {
    const res = await request(application.app) // `application.app` is the instance of Express
      .post('/users/register')
      .send({
        email: MockDictionary.existingUser.email,
        password: MockDictionary.existingUser.password,
      })

    // assert the status code is `422`
    expect(res.statusCode).toBe(422)

    // assert the response body has the expected error message
    expect(res.body).toEqual({
      error: 'User already exists',
    })
  })

  it('Login — Correct data', async () => {
    const res = await request(application.app).post('/users/login').send({
      email: MockDictionary.existingUser.email,
      password: MockDictionary.existingUser.password,
    })
    expect(res.body.jwt).not.toBeUndefined()
  })

  it('Login — Wrong data', async () => {
    const res = await request(application.app).post('/users/login').send({
      email: MockDictionary.existingUser.email,
      password: MockDictionary.existingUser.wrongPassword,
    })
    expect(res.statusCode).toBe(401)
  })

  it('Info — JWT token is valid', async () => {
    const login = await request(application.app).post('/users/login').send({
      email: MockDictionary.existingUser.email,
      password: MockDictionary.existingUser.password,
    })
    const res = await request(application.app)
      .get('/users/info')
      .set('Authorization', `Bearer ${login.body.jwt}`)
    expect(res.body.email).toBe(MockDictionary.existingUser.email)
  })

  it('Info — JWT token is not valid', async () => {
    const res = await request(application.app)
      .get('/users/info')
      .set('Authorization', `Bearer 1`)
    expect(res.statusCode).toBe(401)
  })
})

// close the application after all tests
afterAll(async () => {
  /* here we can delete all the test data we created, disconnect from the database, and stop other services */
  await application.close() // gracefully stop the application to ensure all connections and handlers are closed, allowing the tests to finish properly
})
```

### Coverage

#### Jest

If you use a specific directory for tests via the `rootDir` option (e.g., for e2e tests), ensure this option is removed or set to the root of the source files to calculate coverage properly across all source files:

```typescript
const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testRegex: '.e2e-spec.ts$',
}
```

Alternatively, consider auto-collecting coverage data by using configuration options such as `collectCoverage` and `collectCoverageFrom`.

`package.json`:

```json
{
  "scripts": {
    "test:coverage": "jest --coverage",
    "test:e2e:coverage": "jest --config jest.e2e.config.ts --coverage"
  }
}
```

Run:

```bash
npm run test:coverage # for unit-tests
npm run test:e2e:coverage # for e2e-tests
```

or

```bash
jest --coverage # for unit-tests
jest --config jest.e2e.config.ts --coverage # for e2e-tests
```

## Essential NPM Packages

> Mostly for backend.

```bash
### Main
dotenv                    # a zero-dependency module that loads environment variables from a `.env` file into `process.env`
dotenv-expand             # extends `dotenv` so that it allows using variables as values in env files
cross-env                 # run scripts that set and use environment variables across platforms (`cross-env FIRST_ENV=one SECOND_ENV=two node ./my-program`)
config                    # organizes hierarchical configurations for your app deployments (json, env, etc.)
yargs                     # build interactive command line tools, by parsing arguments and generating an elegant user interface
inquirer                  # a collection of common interactive command line user interfaces (legacy, maintenance)
@inquirer/prompts         # a collection of common interactive command line user interfaces (new versions)
bcrypt                    # a library to help you hash passwords
bcryptjs                  # optimized bcrypt in JavaScript with zero dependencies; compatible to the C++ bcrypt binding on Node.js and also working in the browser
app-root-path             # helps you access your application's root path from anywhere in the application without resorting to relative paths like `require("../../path")`
inversify                 # a powerful and lightweight inversion of control container for JavaScript & Node.js apps powered by TypeScript
validator                 # a library of string validators and sanitizers
class-validator           # allows use of decorator and non-decorator based validation; internally uses validator.js to perform validation
class-transformer         # allows you to transform plain object to some instance of class and versa
date-fns                  # provides the most comprehensive, yet simple and consistent toolset for manipulating JavaScript dates in a browser & Node.js
fs-extra                  # adds file system methods that aren't included in the native `fs` module and adds promise support to the `fs` methods
body-parser               # Node.js body parsing middleware
jsonwebtoken              # a library to sign and validate a JWT
passport                  # `express`-compatible authentication middleware for Node.js; authenticates requests with the help of an extensible set of plugins known as strategies
passport-jwt              # a passport strategy for authenticating with a JWT
reflect-metadata          # allows adding metadata to JavaScript objects in TypeScript that is available at runtime
rxjs                      # reactive extensions library for JavaScript
sharp                     # a high speed module to convert images in common formats to smaller, web-friendly JPEG, PNG, WebP, GIF and AVIF images of varying dimensions
telegraf                  # modern Telegram Bot API framework for Node.js
xml2js                    # simple XML to JavaScript object converter; it supports bi-directional conversion; uses `sax-js` and `xmlbuilder-js`
supertest                 # a high-level abstraction for testing HTTP (e.g., E2E testing)
autocannon                # an HTTP/1.1 benchmarking tool written in node, greatly inspired by wrk and wrk2, with support for HTTP pipelining and HTTPS
clinic                    # an Open Source Node.js performance profiling suite originally developed by NearForm
nodemon                   # a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected
jest                      # a comprehensive JavaScript testing solution; works out of the box for most JavaScript projects
ts-jest                   # a Jest transformer with source map support that lets you use Jest to test projects written in TypeScript
ts-node                   # TypeScript execution and REPL for Node.js, with source map and native ESM support
nodemailer                # send emails from Node.js
tslog                     # powerful, fast and expressive logging for TypeScript and JavaScript

### Error monitoring
rollbar                   # proactively discover, predict, and resolve errors in real-time with Rollbar’s error monitoring platform
@sentry/node              # application monitoring software (official Sentry SDK for Node.js)
@sentry/browser           # application monitoring software (official Sentry SDK for Browsers)

### Special
@types/<package-name>     # TypeScript support for a library (if present)
@types/node               # contains type definitions for Node.js

### ESLint + Prettier
eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier
```
