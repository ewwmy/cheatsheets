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
    this.name = 'CustomError'
    // For example, remove call stack information:
    this.stack = undefined
  }
}
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
  const promises = array.map(func)
  await Promise.all(promises)
  console.log('Done!')
}
```

## Closures

...

## Symbols

...

## Iterators

...

## Generators

...

## OOP

...

### Classes

...

#### Static classes

...

### Interfaces

...

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

### `bind`, `apply`, `call`

#### `bind`

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
const numbers = [1, 2, 3, 4, 5]

const max = Math.max.apply(null, numbers)
console.log(max) // Output: 5
```

#### `call`

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
