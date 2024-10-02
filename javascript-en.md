# JavaScript

## Error Handling

### `try..catch`

```javascript
try {
  // Code that might throw an error
} catch (err) {
  // Handle the error
  console.log(err.message)
}
```

### `try..catch..finally`

```javascript
try {
  // Code that might throw an error
} catch (err) {
  // Handle the error
} finally {
  // Cleanup code (always executed)
}

```

### Throwing Errors

```javascript
function divide(x, y) {
  if (y === 0) {
    throw new Error("Division by zero is not allowed.")
  }
  return x / y
}

try {
  const result = divide(10, 0)
} catch (error) {
  console.log(error.message) // "Division by zero is not allowed."
}
```

### Typed Errors

```javascript
try {
  if (Math.random() > 0.5) {
    throw new TypeError()
  } else {
    throw new Error()
  }
} catch (err) {
  if (err instanceof TypeError) {
    console.log("A TypeError occurred.");
  } else {
    console.log("An unknown error occurred.");
  }
}
```


### Custom Error Class

```javascript
class CustomError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name // CustomError
    // For example, remove call stack information:
    this.stack = undefined
  }
}
```

### Another Example

```javascript
class MyErrRoot extends Error {
  constructor(msg) {
    super(msg + '_PARENT')
    this.name = this.constructor.name
  }
}

class MyErr extends MyErrRoot {
  constructor(msg) {
    super()
    this.name = this.constructor.name
    this.message = msg + '_CHILD'
  }
}

throw new MyErrRoot('foo')
// Uncaught MyErrRoot: foo_PARENT
//     MyErrRoot debugger eval code:1
//     <anonymous> debugger eval code:1
// debugger eval code:1:7

throw new MyErr('foo')
// Uncaught MyErr: foo_CHILD
//     MyErrRoot debugger eval code:1
//     MyErr debugger eval code:1
//     <anonymous> debugger eval code:1
// debugger eval code:1:7
```

## Import/Export

### CommonJS

`"type": "commonjs"` in `package.json`. You also need to specify an extension for imports (`./my-module.js` instead of `./my-module`).

#### Exporting a module

```javascript
// export.js
const foo = 'Hello, world!'
module.exports = foo
```

#### Importing a module

```javascript
// import.js
const foo = require('./export.js')
console.log(foo) // Output: Hello, world!
```

### ES Modules (import/export)

`"type": "module"` in `package.json`

#### Exporting a module

```javascript
// export.js
export const foo = 'Hello, world!'
```

#### Importing a module

```javascript
// import.js
import { foo } from './export.js'
console.log(foo) // Output: Hello, world!
```

#### Default import/export

```javascript
// mathUtils.js
function add(x, y) {
  return x + y
}

export default add
```

```javascript
// main.js
import customAdd from './mathUtils.js'

const result = customAdd(7, 2)
console.log(result) // Output: 9

```

### Named imports/exports

#### Exporting multiple values

```javascript
// export.js
export const foo = 'Hello'
export const bar = 'world!'
```

#### Importing specific values

```javascript
// import.js
import { foo } from './export.js'
console.log(foo) // Output: Hello
```

#### Importing multiple values

```javascript
// import.js
import { foo, bar } from './export.js'
console.log(foo, bar) // Output: Hello world!
```

### Default exports

#### Exporting a default value

```javascript
// export.js
const foo = 'Hello, world!'
export default foo
```

#### Importing a default value

```javascript
// import.js
import foo from './export.js'
console.log(foo) // Output: Hello, world!
```

### Dynamic imports

#### Importing a module dynamically

```javascript
// import.js
import('./export.js')
  .then(module => {
    console.log(module.foo) // Output: Hello, world!
  })
```

### Aliases and `*` import

#### Importing all exports as a single object

```javascript
// import.js
import * as module from './export.js'
console.log(module.foo) // Output: Hello, world!
```

#### Aliases

```javascript
// export.js
export const foo = 'Hello, world!'

// import.js
import { foo as greeting } from './export.js'
console.log(greeting) // Output: Hello, world!
```

## Promises

### Creating Promises

```javascript
const promise = new Promise((resolve, reject) => {
  // Promise body
})
```

### Resolving a Promise

```javascript
resolve(value) // Resolves the promise with a value
```

### Rejecting a Promise

```javascript
reject(error) // Rejects the promise with an error
```

### Handling Promise Results

```javascript
promise
  .then((value) => {
    // Handle resolved value
  })
  .catch((error) => {
    // Handle rejected error
  })
```

### Chaining Promises

```javascript
promise
  .then((value) => {
    // Handle resolved value
    return transformedValue
  })
  .then((transformedValue) => {
    // Handle transformed value
  })
  .catch((error) => {
    // Handle rejected error
  })
```

### Handling Multiple Promises

```javascript
Promise.all([promise1, promise2, promise3])
  .then(([result1, result2, result3]) => {
    // Handle results of all promises
  })
  .catch((error) => {
    // Handle any error from any promise
  })
```

### Handling the First Resolved Promise

```javascript
Promise.race([promise1, promise2, promise3])
  .then((firstResult) => {
    // Handle result of the first resolved promise
  })
  .catch((error) => {
    // Handle any error from any promise
  })
```

### Async/Await Syntax

```javascript
async function asyncFunction() {
  try {
    const result = await promise
    // Handle resolved value
  } catch (error) {
    // Handle rejected error
  }
}
```

### Promises in Loops

```javascript
// without waiting
async function processArray(arr) {
  arr.forEach(async item => {
    await func(item)
  })
  console.log('Done!')
}
```

```javascript
// wait on each iteration
async function processArray(arr) {
  for (const item of arr) {
    await func(item)
  }
  console.log('Done!')
}
```

```javascript
// parallel
async function processArray(arr) {
  // pass our `func` as callback to get array of promises
  const promises = arr.map(func)
  await Promise.all(promises)
  console.log('Done!')
}
```

## `Set`

```javascript
const mySet = new Set()

mySet.add(1) // Set(1) { 1 }
mySet.add(5) // Set(2) { 1, 5 }
mySet.add(5) // Set(2) { 1, 5 }
mySet.add('some text') // Set(3) [ 1, 5, "some text" ]

const obj = { a: 1, b: 2 }
mySet.add(obj) // Set(4) [ 1, 5, "some text", {…} ]

// Important!
mySet.add({ a: 1, b: 2 }) // Set(5) [ 1, 5, "some text", {…}, {…} ]

mySet.has('some text') // true
mySet.size // 5
mySet.delete(obj) // true
mySet // Set(4) [ 1, 5, "some text", {…} ]
```

## `Map`

```javascript
const myMap = new Map()

myMap.set('a', 1)
myMap.set('b', 2)
myMap.set('c', 3)

console.log(myMap.get('a')) // 1

myMap.set('a', 97)
console.log(myMap.get('a')) // 97

console.log(myMap.size) // 3

myMap.delete('b')
console.log(myMap.size) // 2
```

## `Proxy`

### Objects

```javascript
const person = {
  name: 'Tom',
  age: 32,
  job: 'UX/UI Designer',
}

const op = new Proxy(person, {
  get(target, prop) {
    console.log(`Getting property "${prop}"...`)
    return target[prop]
  },
  
  set(target, prop, value) {
    if (prop in target) {
      target[prop] = value
    } else {
      throw new Error(`Unknown property "${prop}"...`)
    }
  },
  
  has(target, prop) {
    return ['name', 'age'].includes(prop)
  },
  
  deleteProperty(target, prop) {
    console.log(`Deleting property "${prop}"...`)
    delete target[prop]
    return true
  },
})

console.log(op) // Proxy { <target>: {…}, <handler>: {…} }
console.log(op.name) // Getting property "name"... Tom
console.log(op.job) // Getting property "job"... UX/UI Designer
console.log(op.age = 45) // 45
console.log('name' in op) // true
console.log('job' in op) // false
console.log(delete op.job) // Deleting property "job"... true

```

### Functions

```javascript
const log = text => `Log: ${text}`

const fp = new Proxy(log, {
  apply(target, thisArg, args) {
    console.log(`Calling "${target.name}"`)
    return target.apply(thisArg, args).toUpperCase()
  },
})

console.log(log('Test')) // Log: Test
console.log(fp('Test')) // Calling "log" LOG: TEST
```

### Classes

```javascript
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

const PersonProxy = new Proxy(Person, {
  construct(target, args) {
    console.log('Preson constructor called...')
    return new target(...args)
  },
  
  get(target, prop) {
    console.log('Getting property...')
  	return target[prop]
	},
})

const PersonProxyExtended = new Proxy(Person, {
  construct(target, args) {
    console.log('Preson constructor called...')
        
    return new Proxy(new target(...args), {
      get(t, prop) {
        console.log('Getting property...')
        return t[prop]
      }
    })
  },
})

const p1 = new PersonProxy('Alena', 30) // Preson constructor called...
console.log(p1) // Object { name: "Alena", age: 30 }
console.log(p1.age) // 30
console.log(PersonProxy.age) // Getting property... undefined

const p2 = new PersonProxyExtended('Tom', 25) // Preson constructor called...
console.log(p2.age) // Getting property... 25
console.log(p2) // Proxy { <target>: {…}, <handler>: {…} }
console.log(p2.__proto__.constructor.name) // Getting property... Person
```

## Closures

```javascript
function makeFunc() {
  const name = 'foo'
  function displayName() {
    console.log(name)
  }
  return displayName
}

const myFunc = makeFunc()
myFunc() // foo
```

```javascript
function makeCounter() {
  let count = 0

  return function() {
    return count++
  }
}

let counter = makeCounter()

console.log(counter()) // 0
console.log(counter()) // 1
console.log(counter()) // 2
```

```javascript
function foo(outerArg) {
  function inner(innerArg) {
    return outerArg + innerArg
  }
  return inner
}

const bar = foo(5)
 
console.log(
  bar(4)
) // 9

console.log(
  bar(3)
) // 8
```

```javascript
function sum(a) {
  return function(b) {
    return a + b
  }
}

console.log(
  sum(1)(2)
) // 3

console.log(
  sum(5)(-1)
) // 4
```

```javascript
const arr = [1, 2, 3, 4, 5, 6, 7]

function inBetween(a, b) {
  return function(item) {
    return item >= a && item <= b
  }
}

function inArray(arr) {
  return function(item) {
    return arr.includes(item)
  }
}

console.log(
  arr.filter(inBetween(3, 6))
) // Array(4) [ 3, 4, 5, 6 ]

console.log(
  arr.filter(inArray([1, 2, 10]))
) // Array [ 1, 2 ]
```

```javascript
const users = [
  { name: 'John', age: 25, surname: 'Johnson' },
  { name: 'Pete', age: 18, surname: 'Peterson' },
  { name: 'Ann', age: 23, surname: 'Hathaway' },
]

function byField(fieldName) {
  return function(a, b) {
    return a[fieldName] > b[fieldName] ? 1 : -1
  }
}

console.log(
  users.toSorted(byField('name'))
) // [ { name: "Ann", ... }, { name: "John", ... }, { name: "Pete", ... } ]

console.log(
  users.toSorted(byField('age'))
) // [ { age: 18, ... }, { age: 23, ... }, { age: 25, ... } ]
```

## Symbols

```javascript
const sym1 = Symbol()
const sym2 = Symbol('foo')
const sym3 = Symbol('foo')

Symbol('foo') === Symbol('foo') // false

// WRONG!
const sym = new Symbol() // TypeError

const sym = Symbol('foo')
typeof sym // "symbol"
const symObj = Object(sym)
typeof symObj // "object"

Symbol.keyFor(Symbol.for('tokenString')) === 'tokenString' // true
```

```javascript
const obj = {}

obj[Symbol('a')] = 'abc'
obj[Symbol.for('b')] = 'def'
obj['c'] = 'ghi'
obj.d = 'jkl'

for (const i in obj) {
  console.log(i)
}
// c d
```

```javascript
JSON.stringify({ [Symbol('foo')]: 'foo' })
// "{}"
```

## Generators

```javascript
// declaration
function* myFunc() { /* ... */ }
const myFunc = function* () { /* ... */ }
```

```javascript
// walk values in loop
function* myFunc() {
  yield 'a'
  yield 'b'
  yield 'c'
}

for (const item of myFunc()) {
  console.log(item) // a b c
}
```

```javascript
// work with generator instance
function* myFunc() {
  yield 1
  yield 2
  yield 3
}

const gen = myFunc() // Generator { }

console.log(gen.next().value) // 1
console.log(gen.next().value) // 2
console.log(gen.next().value) // 3
console.log(gen.next().value) // undefined
```

```javascript
// infinite generator
function* myFunc() {
  let index = 0
  while (true) yield index++
}

const gen = myFunc() // Generator { }

console.log(gen.next().value) // 0
console.log(gen.next().value) // 1
console.log(gen.next().value) // 2
// ...
```

```javascript
// WRONG!
function* myFunc() {
  let index = 0
  while (true) yield index++
}

console.log(myFunc().next().value) // 0
console.log(myFunc().next().value) // 0
console.log(myFunc().next().value) // 0
```

## Iterators

```javascript
const myIterable = {}
myIterable[Symbol.iterator] = function* () {
  yield 1
  yield 2
  yield 3
}
console.log([...myIterable]) // [ 1, 2, 3 ]
```

```javascript
class Foo {
  *[Symbol.iterator]() {
    yield 1
    yield 2
  }
}

const bar = {
  *[Symbol.iterator]() {
    yield 'a'
    yield 'b'
  },
}

console.log(...new Foo()) // 1, 2
console.log(...bar) // 'a', 'b'
```

```javascript
function* myIterable() {
  const values = [1, 2, 3, 4, 5]
  for (const value of values) {
    yield value
  }
}

for (const value of myIterable()) {
  console.log(value) // 1 2 3 4 5
}
```

## Functions

### Syntax

```javascript
function func1(a, b) {} // regular function
const func2 = function(a, b) {} // function expression
const func31 = (a, b) => { // arrow function
  return a + b
}
const func32 = (a, b) => a + b // same as { return a + b }
const func33 = (a, b) => ({ // return object
  a: 1,
  b: 2,
}) // return object
const func4 = new Function('a', 'b', 'return a + b') // function constructor
```

### Function as constructor

```javascript
function Foo {
  this.a = 1
  this.b = 2
}
// or `const Foo = function() {/* ... */}` (except arrow function syntax)

const foo = new Foo()
console.log(foo.a, foo.b) // 1 2
```

## OOP

### `this`

```javascript
this.prop = 53

const test = {
  prop: 42,
  // has its own `this` context
  func: function() {
    return this.prop
  },
  // doesn't have its own `this` context
  arrow: () => {
    return this.prop
  },
  // getter
  get someProp() {
    return this.prop
  },
  // setter
  set someProp(value) {
    this.prop = value
  }
}

console.log(test.func()) // 42
console.log(test.arrow()) // 53
```

```javascript
function agg() {
  console.log('Hello', this)
}

function hello1() {
  // passing `this` context of hello1() to agg()
  agg.call(this)
}

const hello2 = function() {
  // passing `this` context of hello2() to agg()
  agg.call(this)
}

const hello3 = () => {
  // passing `this` context of hello3() to agg(), but it has no effect due to arrow functions don't have their own this context, so `this` will be used from outer context
  agg.call(this)
}

const obj = {
  a: 1,
  b: 2,
  c: 3,
  f1: hello1,
  f2: hello2,
  f3: hello3,
}

obj.f1() // Hello > Object { a: 1, b: 2, c: 3, f1: hello1(), f2: hello2(), f3: hello3() }
obj.f2() // Hello > Object { a: 1, b: 2, c: 3, f1: hello1(), f2: hello2(), f3: hello3() }
obj.f3() // Hello > Window about:newtab
```

More extended example of using `this`:

```javascript
function agg() {
  console.log('Hello', this)
}

function hello1() {
  // passing `this` context of hello1() to agg()
  agg.call(this)
}

const hello2 = function() {
  // passing `this` context of hello2() to agg()
  agg.call(this)
}

const hello3 = () => {
  // passing `this` context of hello3() to agg(), but it has no effect due to arrow functions don't have their own this context, so `this` will be used from outer context
  agg.call(this)
}

const foo = {
  a: 'Something',
  b: 'Somewhere',
}

const bar = {
  a: 1,
  b: 2,
  c: 3,
  f1: hello1,
  f2: hello2,
  f3: hello3,
  f4: hello1.bind(this), // `this` refers to outer object due to simple objects don't heve their own `this` context
  f5: hello1.bind(foo),
  f6: hello2.bind(foo),
  f7: hello3.bind(foo),
  f8() {
    console.log(this) // has context of its object
  },
  f9: function() {
    console.log(this) // has context of its object
  },
  f10: () => {
    console.log(this) // has no own context due to this is arrow function
  }
}

agg()    // Hello > Window (or global object in Node.js)
hello1() // Hello > Window (or global object in Node.js)
hello2() // Hello > Window (or global object in Node.js)
hello3() // Hello > Window (or global object in Node.js)
bar.f1() // Hello > Object { a: 1, b: 2, c: 3, ... } (bar)
bar.f2() // Hello > Object { a: 1, b: 2, c: 3, ... } (bar)
bar.f3() // Hello > Window (or global object in Node.js)
bar.f4() // Hello > Window (or global object in Node.js)
bar.f5() // Hello > Object { a: "Something", ... } (foo)
bar.f6() // Hello > Object { a: "Something", ... } (foo)
bar.f7() // Hello > Window (or global object in Node.js)
bar.f8() // Hello > Object { a: 1, b: 2, c: 3, ... } (bar)
bar.f9() // Hello > Object { a: 1, b: 2, c: 3, ... } (bar)
bar.f10() // Hello > Window (or global object in Node.js)
```

```javascript
function Foo() {
	return this.a
}

function Bar() {
  this.a = 'a'
  return this.a  
}

function Baz() {
  return this.a
}

const Zab1 = function() {
  return this.a
}

const Zab2 = () => {
  return this.a
}

const Zab3 = () => {
  this.a = 1
  return this.a
}

class MySuperClass {
  a = 1
  
  f1() {
    return this.a
  }
  
  f2 = function() {
    return this.a
  }
    
  f3 = () => this.a
  
  f4 = Foo
  f5 = Bar
  f6 = Baz
  
  f7 = Zab1
  f8 = Zab2
  f9 = Zab3
}

const obj = new MySuperClass()

console.log(obj.f1()) // 1
console.log(obj.f2()) // 1
console.log(obj.f3()) // 1
console.log(obj.f4()) // 1
console.log(obj.f5()) // a
console.log(obj.f6()) // a
console.log(obj.f7()) // a
console.log(obj.f8()) // undefined
console.log(obj.f9()) // 1
console.log(obj.a) // a
```

### Classes

```javascript
class Shape {
  _name = null
  _title = null
  
  constructor(name, title = 'Shape') {
    this._name = name
    this._title = title
  }
}

class Rectangle extends Shape {
  width = null
  height = null
  modified = false

  // private field, only accessible within the class
  #privateField = 'Private field'
  
  static info = 'This is a static field'

  // private static field, only accessible within the class
  static #privateStatic = 'Private static field'
  
  static foo() {
    return `Static info:
      [Public static field]: ${this.info}
      [Public static method]: ${this.bar()}
      [Private static field]: ${this.#privateStatic}
      [Private static method]: ${this.#privateFoo()}`
  }

  static bar() {
    return 'Static method'
  }

  // private static method, only accessible within the class
  static #privateFoo() {
    return 'Private static method'
  }

  // block of static code
  static {
    let a = "That's a static field (changed in a static block)"
    this.info = a
  }
  
  constructor(width, height) {
    super('rectangle', 'Rectangle')
    
    this.width = width
    this.height = height
  }
  
  get area() {
    return this.width * this.height
  }
  
  get title() {
    return `Title: ${this._title}`
  }
  
  set title(value) {
    this._title = value
    this.modified = true
  }

  // private method, only accessible within the class
  #getSecret() {
    return 'Private method'
  }
  
  info() {
    return `Full info:
    ${this._title} [${this._name}]:
    	w=${this.width}, h=${this.height}, area=${this.area}
    Some secret info:
      -- ${this.#getSecret()} called --
      -- ${this.#privateField} called --`
  }
}

const rect = new Rectangle(3, 5)

console.log(rect._name) // rectangle
console.log(rect.area) // 15

rect.title = 'Square'

console.log(rect._name) // rectangle
console.log(rect.title) // Title: Square
console.log(rect.modified) // true

console.log(rect.info())
// Full info:
//    Square [rectangle]:
//    	w=3, h=5, area=15
//    Some secret info:
//      -- Private method called --
//      -- Private field called --

console.log(Rectangle.foo())
// Static info:
//   [Public static field]: That's a static field (changed in a static block)
//   [Public static method]: Static method
//   [Private static field]: Private static field
//   [Private static method]: Private static method
```

#### `prototype` vs `__proto__`

```javascript
class User {
  constructor(name, birthdate) {
    this.name = name
    this.birthdate = birthdate
  }

  getInfo() {
    return `User info:
      Name: ${this.name || '[We don\'t know yet]'}
      Birthdate: ${this.birthdate ?
        Intl.DateTimeFormat('ru-RU').format(this.birthdate) :
        '[We don\'t know yet]'}`
  }
}

const user = new User('Alex', new Date('1989-11-21'))

console.log(user.__proto__)
// Object { … }
//   constructor: class User { constructor(name, birthdate) }
//   getInfo: function getInfo()
//   <prototype>: Object { … }

console.log(user.__proto__.constructor)
// class User { constructor(name, birthdate) }
//   length: 2
//   name: "User"
//   prototype: Object { … }
//   <prototype>: function ()

console.log(User.prototype)
// Object { … }
//   constructor: class User { constructor(name, birthdate) }
//   getInfo: function getInfo()
//   <prototype>: Object { … }

console.log(user.__proto__ === User.prototype)
// true

console.log(user.__proto__.constructor === user.constructor)
// true

const user2 = new user.constructor('Max', null)
const user3 = new user.constructor('Alena', null)

console.log(user2)
// Object { name: "Max", birthdate: null }
//   birthdate: null
//   name: "Max"
//   <prototype>: Object { … }
//     constructor: class User { constructor(name, birthdate) }
//     getInfo: function getInfo()
//     <prototype>: Object { … }

console.log(user3)
// Object { name: "Alena", birthdate: null }
//   birthdate: null
//   name: "Alena"
//   <prototype>: Object { … }
//     constructor: class User { constructor(name, birthdate) }
//     getInfo: function getInfo()
//     <prototype>: Object { … }

console.log(user.constructor === user2.constructor)
// true

console.log(user2.constructor === user3.constructor)
// true

const user4 = Object.create(user) // set `user` as "parent" prototype for user4 object

console.log(user4.name) // Alex
console.log(user4.birthdate.toLocaleDateString()) // 21.11.1989
console.log(user4.hasOwnProperty('name')) // false
console.log(user4.hasOwnProperty('birthdate')) // false

user4.name = 'Rita'
user4.birthdate = new Date('1991-05-25')

console.log(user4.name) // Rita
console.log(user4.birthdate.toLocaleDateString()) // 25.05.1991
console.log(user4.hasOwnProperty('name')) // true
console.log(user4.hasOwnProperty('birthdate')) // true

console.log(user.hasOwnProperty('name')) // true
console.log(user.hasOwnProperty('birthdate')) // true
```

#### Inheritance

```javascript
class A {
  constructor() {
    this.prop = 1
  }
}

class B extends A {
  constructor() {
    super() // parent constructor, must be called in derived's class constrcuctor
    super.prop = 2 // same as `this.prop = 2`
  }
}

const foo = new A()
console.log(foo.prop) // 1

const bar = new B()
console.log(bar.prop) // 2
```

##### Old-style inheritance

```javascript
const Vehicle = function(wheels) {
  this.wheels = wheels
}

Vehicle.prototype.foo = function() {
  console.log('foo')
}

const Car = function(name, color) {
  Vehicle.call(this, 4) // 4 — wheels
  this.name = name
  this.color = color
}

Car.prototype = Object.create(Vehicle.prototype)

Car.prototype.info = function() {
  console.log(`
    [Car info]:
      Wheels: ${this.wheels}
      Name: ${this.name}
      Color: ${this.color}
  `)
}

const car = new Car('Tesla', 'White')
console.log(car.foo()) // foo
console.log(car.info())
// [Car info]:
//   Wheels: 4
//   Name: Tesla
//   Color: White
```

#### Static examples

```javascript
class MySuperClass {
  a = 1
  static a = 2
  
  b() {
    return this.a
  }
  
  static b() {
    return this.a
  }
}

const obj = new MySuperClass()

console.log(obj.a) // 1
console.log(MySuperClass.a) // 2

console.log(obj.b()) // 1
console.log(MySuperClass.b()) // 2
```

#### Link to class

```javascript
class MySuperClass {
  a = 1
  
  f = function() {
    return this.a
  }
}

const A = MySuperClass
const B = MySuperClass

console.log( new A().a ) // 1
console.log( new B().a ) // 1
console.log( new A().f() ) // 1
console.log( new B().f() ) // 1
```

### Constructors and Prototypes

```javascript
// constructor
function Person(name, age) {
  this.name = name
  this.age = age
}

const person1 = new Person('John', 25)
const person2 = new Person('Jane', 30)

// prototype
Person.prototype.greet = function() {
  console.log(`Hello, my name is ${this.name}`)
}

person1.greet() // Output: Hello, my name is John
person2.greet() // Output: Hello, my name is Jane

// inheritance
function Employee(name, age, position) {
  Person.call(this, name, age)
  this.position = position
}

Employee.prototype = Object.create(Person.prototype)
Employee.prototype.constructor = Employee

const employee = new Employee('Bob', 35, 'Manager')
employee.greet(); // Output: Hello, my name is Bob
console.log(employee.position) // Output: Manager
```

```javascript
class Foo {
  a = 1
}

function Bar(a, b) {
  this.a = a
  this.b = b
}

const foo = new Foo()
const bar = new Bar()

console.log(foo.prototype) // undefined
console.log(bar.prototype) // undefined

console.log(Foo.prototype) // Object { ... }
console.log(Foo.prototype.constructor) // class Foo {}
console.log(Foo.prototype.prototype) // undefined

console.log(Bar.prototype) // Object { ... }
console.log(Bar.prototype.constructor) // function Bar(a, b)
console.log(Bar.prototype.prototype) // undefined 

console.log(foo.constructor) // class Foo {}
console.log(foo.constructor.name) // 'Foo'
console.log(foo.constructor === Foo) // true
console.log(foo.constructor.prototype) // Object { ... }
console.log(foo.constructor.prototype === Foo.prototype) // true
console.log(foo.constructor.constructor === Foo.constructor) // true
console.log(foo.constructor.prototype.constructor) // class Foo {}
console.log(foo.constructor === foo.constructor.prototype.constructor) // true

console.log(bar.constructor) // function Bar(a, b)
console.log(bar.constructor.name) // 'Bar'
console.log(bar.constructor === Bar) // true
console.log(bar.constructor.prototype) // Object { ... }
console.log(bar.constructor.prototype === Bar.prototype) // true
console.log(bar.constructor.constructor === Bar.constructor) // true
console.log(bar.constructor.prototype.constructor) // function Bar(a, b)
console.log(bar.constructor === bar.constructor.prototype.constructor) // true

console.log(Foo.constructor) // function Function()
console.log(Foo.constructor.prototype) // function ()
console.log(Foo.constructor.prototype.constructor) // function Function()
console.log(Foo.constructor === Foo.constructor.prototype.constructor) // true

console.log(Bar.constructor) // function Function()
console.log(Bar.constructor.prototype) // function ()
console.log(Bar.constructor.prototype.constructor) // function Function()
console.log(Bar.constructor === Bar.constructor.prototype.constructor) // true
```

#### `.prototype`

```javascript
Object.prototype.sayHello = function() {
  console.log('Hi!')
}

// define object + different ways to define methods
const alex = {
  name: 'Alex',
  age: 35,
  greet1() {
    console.log(`Hello, ${this.name}!`)
  },
  greet2: function() {
    console.log(`Hello, ${this.name}!`)
  },
  greet3: () => {
    console.log(`Hello, ${this.name}!`) // !!!
  },
}

alex.greet1() // Hello, Alex!
alex.greet2() // Hello, Alex!
alex.greet3() // Hello, !
alex.sayHello() // Hi!


// identical way to define objects
const bob = new Object({
  name: 'Bob',
  age: 29,
  greet: function() {
    console.log(`Hello, ${this.name}!`)
  },
})

bob.greet() // Hello, Bob!
bob.sayHello() // Hi!

// use `alex` as prototype for `sveta`
const sveta = Object.create(alex)
console.log(sveta.name) // Alex
// `name` property has been read from the prototype of `sveta` (from `alex`)

sveta.name = 'Sveta'
console.log(sveta.name) // Sveta
// but:
console.log(sveta.__proto__.name) // Alex

sveta.sayHello() // Hi!
```

```javascript
const foo = {
  a: 1,
  b: 2,
  f() { return this.a + this.b + this.c },
}

console.log(foo.a, foo.b, foo.c) // 1 2 undefined
console.log(foo.f()) // NaN

const bar = Object.create(foo, { c: { value: 3 } })

console.log(bar.a, bar.b, bar.c) // 1 2 3
console.log(bar.f()) // 6

console.log(bar.__proto__ === foo) // true
```

Extending functionality of built-in classes:

```javascript
const arr = [1, 2, 3, 4, 5]

Array.prototype.multBy = function(n) {
  return this.map(item => item * n)
}

console.log(arr.multBy(5)) // Array(5) [ 5, 10, 15, 20, 25 ]
```

```javascript
// constructor function
function Foo(a, b) {
  this.a = a
  this.b = b
}

// extending prototype
Foo.prototype.f = function() {
  return this.a * this.b
}

// creating new object using constructor
const foo = new Foo(2, 3)
console.log(foo.f()) // 6
```

### `bind`, `apply`, `call`

Basic usage:

```javascript
const maxBound = Math.max.bind(null, 1, 2, 3, 4, 5)
console.log(maxBound()) // 5

const maxApplied = Math.max.apply(null, [1, 2, 3, 4, 5])
console.log(maxApplied) // 5

const max = Math.max.call(null, 1, 2, 3, 4, 5)
console.log(max) // 5
```

Example:

```javascript
const bob = {
  name: 'Bob',
  age: 25,
  info(position, salary) {
    console.group('User Info')
    console.log(`Username is ${this.name} and age is ${this.age}`)
    if (position) {
      console.log(`Position of ${this.name} is "${position}"`)
    }
    if (salary) {
      console.log(`Salary of ${this.name} is ${salary}`)
    }
    console.groupEnd()
  }
}

const lena = {
  name: 'Elena',
  age: 31,
}

bob.info()

// bind

// bind with arbitrary arguments
bob.info.bind(lena)('Frontend Developer', 2500)

// bind with predefined arguments
bob.info.bind(lena, 'Frontend Developer', 2500)()

// call (same as bind but call immediately)
bob.info.call(lena, 'Frontend Developer', 2500)

// apply (same as call but arguments should be passed as array)
bob.info.apply(lena, ['Frontend Developer', 2500])

```

Extended example:

```javascript
const bob = {
  name: 'Bob',
  age: 25,
  info(position, salary) {
    console.group('User Info')
    console.log(`Username is ${this.name} and age is ${this.age}`)
    if (position) {
      console.log(`Position of ${this.name} is "${position}"`)
    }
    if (salary) {
      console.log(`Salary of ${this.name} is ${salary}`)
    }
    console.groupEnd()
  }
}

const lena = {
  name: 'Elena',
  age: 31,
}

bob.info() // User Info < Username is Bob and age is 25 >

// bind

const info = bob.info.bind(lena)

info() // User Info < Username is Elena and age is 31 >
info('Frontend Developer') // User Info < Username is Elena and age is 31 | Position of Elena is "Frontend Developer" >
info('Frontend Developer', 2500) // User Info < Username is Elena and age is 31 | Position of Elena is "Frontend Developer" | Salary of Elena is 2500 >

bob.info.bind(lena)() // User Info < Username is Elena and age is 31 >
bob.info.bind(lena)('Frontend Developer') // User Info < Username is Elena and age is 31 | Position of Elena is "Frontend Developer" >
bob.info.bind(lena)('Frontend Developer', 2500) // User Info < Username is Elena and age is 31 | Position of Elena is "Frontend Developer" | Salary of Elena is 2500 >

bob.info.bind(lena)() // User Info < Username is Elena and age is 31 >
bob.info.bind(lena, 'Frontend Developer')() // User Info < Username is Elena and age is 31 | Position of Elena is "Frontend Developer" >
bob.info.bind(lena, 'Frontend Developer', 2500)() // User Info < Username is Elena and age is 31 | Position of Elena is "Frontend Developer" | Salary of Elena is 2500 >

const logInfo = bob.info.bind(lena, 'Frontend Developer', 2500)
logInfo() // User Info < Username is Elena and age is 31 | Position of Elena is "Frontend Developer" | Salary of Elena is 2500 >

// call (same as bind but call immediately)

bob.info.call(lena) // User Info < Username is Elena and age is 31 >
bob.info.call(lena, 'Frontend Developer') // User Info < Username is Elena and age is 31 | Position of Elena is "Frontend Developer" >
bob.info.call(lena, 'Frontend Developer', 2500) // User Info < Username is Elena and age is 31 | Position of Elena is "Frontend Developer" | Salary of Elena is 2500 >

// apply (same as call but arguments should be passed as array)

bob.info.apply(lena) // User Info < Username is Elena and age is 31 >
bob.info.apply(lena, ['Frontend Developer']) // User Info < Username is Elena and age is 31 | Position of Elena is "Frontend Developer" >
bob.info.apply(lena, ['Frontend Developer', 2500]) // User Info < Username is Elena and age is 31 | Position of Elena is "Frontend Developer" | Salary of Elena is 2500 >
```

```javascript
const a = 'abc'
const b = 'def'

this.a = 'ghi'
this.b = 'jkl'

const foo = {
  a: 'lmn',
  b: 'opq',
  f1(val) {
    return this.a + this.b + val
  },
  f2: function(val) {
    return this.a + this.b + val
  },
  f3: (val) => {
    return this.a + this.b + val
  }
}

const bar = {
  a: 'rst',
  b: 'uvw'
}

console.log(foo.f1(7)) // lmnopq7
console.log(foo.f2(7)) // lmnopq7
console.log(foo.f3(7)) // ghijkl7

console.log(foo.f1.call(foo, 7)) // lmnopq7
console.log(foo.f2.call(foo, 7)) // lmnopq7
console.log(foo.f3.call(foo, 7)) // ghijkl7

console.log(foo.f1.call(bar, 7)) // rstuvw7
console.log(foo.f2.call(bar, 7)) // rstuvw7
console.log(foo.f3.call(bar, 7)) // ghijkl7
```

#### `bind`

```javascript
Function.prototype.bind()
```

```javascript
bind(thisArg)
bind(thisArg, arg1)
bind(thisArg, arg1, arg2)
bind(thisArg, arg1, arg2, /* …, */ argN)
```

```javascript
const module = {
  x: 42,
  getX: function() {
    return this.x
  },
};

const unboundGetX = module.getX
 // The function gets invoked at the global scope
console.log(unboundGetX()) // undefined

const boundGetX = unboundGetX.bind(module)
console.log(boundGetX()) // 42
```

```javascript
const person = {
  name: 'John',
  greet: function() {
    console.log(`Hello, my name is ${this.name}`)
  }
}

const greet = person.greet.bind(person)
greet() // Output: Hello, my name is John
```

#### `apply`

```javascript
Function.prototype.apply()
```

```javascript
apply(thisArg)
apply(thisArg, argsArray)
```

```javascript
const numbers = [1, 2, 3, 4, 5]

const max = Math.max.apply(null, numbers)
console.log(max) // Output: 5
```

#### `call`

```javascript
Function.prototype.call()
```

```javascript
call(thisArg)
call(thisArg, arg1)
call(thisArg, arg1, /* …, */ argN)
```

```javascript
function Product(name, price) {
  this.name = name
  this.price = price
}

function Food(name, price) {
  Product.call(this, name, price)
  this.category = 'food'
}

console.log(new Food('cheese', 5).name) // cheese
```

```javascript
const person = {
  name: 'Jane',
  greet: function(city) {
    console.log(`Hello, my name is ${this.name} and I live in ${city}`)
  }
}

person.greet.call(person, 'New York')
// Output: Hello, my name is Jane and I live in New York
```

```javascript
function greet() {
  console.log(this.animal, "typically sleep between", this.sleepDuration);
}

const obj = {
  animal: "cats",
  sleepDuration: "12 and 16 hours",
};

greet.call(obj); // cats typically sleep between 12 and 16 hours
```

## Rest and Spread

### Arrays

#### Rest

```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5]
console.log(first) // Output: 1
console.log(second) // Output: 2
console.log(rest) // Output: [3, 4, 5]
```

#### Spread

```javascript
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]
const combined = [...arr1, ...arr2]
console.log(combined); // Output: [1, 2, 3, 4, 5, 6]
```

### Objects

#### Rest

```javascript
const { name, age, ...rest } = {
  name: 'John',
  age: 25,
  city: 'New York',
  country: 'USA'
}
console.log(name) // Output: John
console.log(age) // Output: 25
console.log(rest) // Output: { city: 'New York', country: 'USA' }
```

#### Spread

```javascript
const obj1 = {
  name: 'John',
  age: 25
}
const obj2 = {
  city: 'New York',
  country: 'USA'
}
const merged = { ...obj1, ...obj2 }
console.log(merged) // Output: { name: 'John', age: 25, city: 'New York', country: 'USA' }
```

#### Important

```javascript
const obj1 = { a: 1, b: 2 }
const obj2 = obj1
const obj3 = { ...obj1 }

console.log(obj1 === obj2) // true
console.log(obj1 === obj3) // false

obj1.c = 3

console.log(obj1) // Object { a: 1, b: 2, c: 3 }
console.log(obj2) // Object { a: 1, b: 2, c: 3 }
console.log(obj3) // Object { a: 1, b: 2 }
```

### Functions

#### Rest

```javascript
function sum(...theArgs) {
  let total = 0
  for (const arg of theArgs) {
    total += arg
  }
  return total
}

console.log(sum(1, 2, 3))
// Expected output: 6

console.log(sum(1, 2, 3, 4))
// Expected output: 10
```
