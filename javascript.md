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
  }
}

console.log(test.func()) // 42
console.log(test.arrow()) // 53
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
  
  static info = 'This is a static field'
  
  static foo() {
    return this.info + ' about Rectangle class'
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
  
  info() {
    return `Full info:
    ${this._title} [${this._name}]:
    	w=${this.width}, h=${this.height}, area=${this.area}`
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

#### `.prototype`

```javascript
// ...
```

#### `.constructor`

```javascript
// ...
```

### `bind`, `apply`, `call`

```javascript
const maxBound = Math.max.bind(null, 1, 2, 3, 4, 5)
console.log(maxBound()) // 5

const maxApplied = Math.max.apply(null, [1, 2, 3, 4, 5])
console.log(maxApplied) // 5

const max = Math.max.call(null, 1, 2, 3, 4, 5)
console.log(max) // 5
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
