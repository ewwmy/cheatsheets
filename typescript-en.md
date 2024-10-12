# TypeScript

## Prepare

```bash
npm i -g typescript # install typescript globally
tsc --version # check version of the installed typescript
tsc --help # get help
```

## Initialize

```bash
tsc --init # initialize typescript project in the current directory (will create ./tsconfig.json)
```

## `tsconfig.json`

Default settings are:

```javascript
{
  "compilerOptions": {
    "target": "es2016", // compile typescript files to javascript es2016 syntax
    "module": "commonjs", // use commonjs modules for import/export
    "strict": true, // all strict type-checking settings are enabled (recommended)
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

```bash
tsc # compile typescript files of the project into javascript (as described in tsconfig.json)
tsc ./app.ts # compile ./app.ts into ./app.js (using default settings, ignoring tsconfig.json)
```

## Basics

### Type Inference (Выведение типов)

TypeScript can automatically infer the types of variables and return values based on the assigned values. Explicit type annotations are not always necessary.

```typescript
let x = 5; // TypeScript infers `x` as type `number`
```

### Type Annotations (Аннотации типов)

Explicitly define the types of variables, function parameters, and return values.

```typescript
let y: string = "Hello";
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

### Union Types (Объединение типов)

Combine multiple types, allowing a variable to hold values of different types.

```typescript
let id: string | number;
id = 123; // valid
id = "ABC"; // valid
```

### Type Narrowing (Сужение типов)

Narrow down the type of a variable within conditional blocks based on type checks.

```typescript
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // id is treated as string
  } else {
    console.log(id); // id is treated as number
  }
}
```

### Literal Types (Литеральные типы)

Restrict variables to a specific literal value or set of values.

```typescript
let direction: "left" | "right" | "up" | "down";
direction = "left"; // valid
```

### Type Aliases (Псевдонимы типов)

Create custom type names for more complex type combinations or reusability.

```typescript
type ID = string | number;
let userId: ID;
```

### Interfaces (Интерфейсы)

Define the structure of an object. Similar to types but primarily used for object shapes and are extendable.

```typescript
interface User {
  id: number;
  name: string;
}
let user: User = { id: 1, name: "Alice" };
```

### Intersection Types (Пересечение типов)

Combine multiple types into one, requiring all properties to be present.

```typescript
interface Employee {
  employeeId: number;
}
interface Person {
  name: string;
}
type EmployeePerson = Employee & Person;
let emp: EmployeePerson = { employeeId: 123, name: "Alice" };
```

### Type Guards (Защита типов)

Methods or constructs that allow TypeScript to infer a more specific type inside a conditional block (e.g., `typeof`, `instanceof`).

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

### Generics (Дженерики)

Create reusable components with type placeholders that can be specified when the function or class is used.

```typescript
function identity<T>(value: T): T {
  return value;
}
let num = identity<number>(5);
```

### Enums (Перечисления)

Define a set of named constants, either as numeric or string-based.

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right
}
let dir: Direction = Direction.Up;
```

### Type Assertion (Type Casting) (Утверждение типа)

Tell TypeScript to treat a value as a specific type.

```typescript
let someValue: unknown = "Hello";
let strLength: number = (someValue as string).length;
```

### Never Type (Тип Never)

Represents values that never occur, commonly used in functions that never return (e.g., infinite loops or throwing errors).

```typescript
function error(message: string): never {
  throw new Error(message);
}
```

### Optional Properties and Parameters (Опциональные свойства и параметры)

Use `?` to mark properties or parameters as optional.

```typescript
interface Person {
  name: string;
  age?: number;
}
function greet(name: string, age?: number) {
  console.log(`Hello, ${name}`);
}
```

### Readonly Properties (Только для чтения)

Properties that can be set once and are immutable afterward.

```typescript
interface User {
  readonly id: number;
  name: string;
}
let user: User = { id: 1, name: "Alice" };
// user.id = 2; // Error: Cannot assign to 'id' because it is a read-only property
```

## Types

> Don't use `any` type! If you use `any` type you don't need TypeScript.

Typescript | JavaScript
---|---
`number` | `number`
`string` | `string`
`boolean` | `boolean`
`object` | `object`
Array | Array
Tuple | Array
Enum | `function` \| `const` value

### Object types

```typescript
type User = {
  firstname: string
  age: number
}

const getAge = (user: User): number => {
    return user.age
}

const user = {
  firstname: 'Alex',
  surname: 'Surname',
  age: 33,
  skills: ['html', 'css'],
}

console.log(
  getAge(user)
) // 33
```

### Arrays

```typescript
const skills: string[] = ['html', 'css', 'javascript']
const ids: number[] = [1, 2, 3]

type User = {
  name: string
}

const user1: User = {
  name: 'Alex',
}

const user2: User = {
  name: 'Elena'
}

const users: User[] = [user1, user2]
```

### Tuples (Кортежи)

> Be sure you don't mess up `type[]` (which is `Array` of `type` elements) and `[type]` (which is `Array` of the only one element of `type`):

```typescript
type User = {
  name: string
}

type Users = User[] // array of objects of the `User` type
type OnlyUser = [User] // array of the only one object of the `User` type (even though you can add new elements by calling `push`, for example)
```

Tuple examples:

```typescript
type User = {
  name: string
}

type Tuple1 = [number]
type Tuple2 = [number, string]
type Tuple3 = [number, string, User]

const tuple1: Tuple1 = [1]
const tuple2: Tuple2 = [3, 'three']
const tuple3: Tuple3 = [35, 'user', { name: 'Alex' }]

// destructuring
const [id, role, user] = tuple3
console.log(id) // 35
console.log(role) // 'user'
console.log(user) // { name: 'Alex' }
```

Adding and accessing elements:

```typescript
type Tuple = [string]

const tuple: Tuple = ['one']

tuple[0] // ✅
tuple.push('something else') // ✅
tuple[1] // ❌
```

Unlimited tuples:

```typescript
type Tuple = [number, string, ...boolean[]]

const tuple: Tuple = [1, 'fixed', true, false, false]
const anotherTuple: Tuple = [2, 'fixed'] // ✅

// destructuring
const [id, itemStatus, flag1, ...otherFlags] = tuple

console.log(id) // 1
console.log(itemStatus) // 'fixed'
console.log(flag1) // true
console.log(otherFlags) // [false, false]
```

### Readonly

```typescript
type ReadonlySkills = readonly string[]
type ReadonlyRecord = readonly [number, string]

const skills: ReadonlySkills = ['html', 'css', 'javascript']
skills[0] = 'abc' // ❌
skills.push('typescript') // ❌

const data: ReadonlyRecord = [1, 'user']
data[0] = 5 // ❌
data.push('something else') // ❌
```

### Enums

```typescript
enum StatusCode {
  SUCCESS, // 0
  IN_PROCESS, // 1
  FAILED, // 2
}

enum Roles {
  User = 3, // 3
  Manager, // 4
  Admin, // 5
}

enum TaskStatus {
  Planned = 'planned', // 'planned'
  InProcess = 'process', // 'process'
  Done = 'completed', // 'completed'
  Canceled = 'canceled' // 'canceled'
}

const taskStatus: TaskStatus = TaskStatus.Done // 'completed'
```

Constant Enums:

```typescript
enum StatusCode {
  Success,
  InProcess,
  Failed,
} // will be compiled into `function` in javascript

const enum ConstStatusCode {
  Success,
  InProcess,
  Failed,
} // will be compiled into `const` value in javascript
```

> Heterogeneous enums are not recommended.

## Advanced Types

### Union Types

```typescript
let id: number | string = '123'
id = 123

const arr: (number | string)[] = [1, 'user'] // (number | string)[]

const multitype: number | string | boolean = true
```

#### Type Narrowing

```typescript
const logData = (data: boolean | number | string) => {
  if (typeof data === 'string') {
    console.log(
      data.trim() // `data` has only `string` type here (narrowed to `string`)
    )
  }
  else if (typeof data === 'number') {
    console.log(
      data.toFixed(2) // `data` has only `number` type here (narrowed to `number`)
    )
  } else {
    console.log(data) // `data` has only `boolean` type here (narrowed to `boolean`)
  }
}

const logError = (error: string | string[]) => {
  if (Array.isArray(error)) { // narrow `error` to array of `string` (`string[]`)
    console.log(
      error.join(' ') // `error` is narrowed to array of `string` (`string[]`)
    )
  } else { // `error` can be only `string` here
    console.log(
      error.trim() // `error` is narrowed to `string`
    )
  }
}

const logObject = (obj: { a: number } | { b: number }) => {
  if ('a' in obj) {
    console.log(obj.a)
  } else {
    console.log(obj.b)
  }
}
```

### Literal Types

```typescript
// consts are always inferred to literal types
const numConst = 5 // type: 5
const strConst = 'abc' // type: 'abc'

let numVar = 5 // type: number
let strVar = 'abc' // type: string

// manually defined literal type for a variable
let numFive: 5 = 5 // type: 5
numFive = 10 // ❌

// manually defined literal type for a variable
let strAbc: 'abc' = 'abc' // type: 'abc'
strAbc = 'def' // ❌

// literal type with union
let method: 'get' | 'post' = 'get'
method = 'patch' // ❌
```

#### Type Assertion

```typescript
let method: 'get' | 'post' = 'get'
let myMethod = 'post'

method = myMethod // ❌

// type assertion can help here
method = myMethod as 'post' // ✅
```

Two ways of writing type assertions:

```typescript
interface User {
  name: string
}

const user1 = { name: 'Sveta' } as User // ✅
const user2 = <User>{ name: 'Alex' } // ❌ not recommended, will not work in React
```

> Be careful with type assertions. It should **not** be used to avoid type-checking.

### Type Aliases

```typescript
type HttpMethod = 'get' | 'post'
type HttpExtendedMethod = HttpMethod | 'put' | 'patch' | 'delete'
// 'get' | 'post' | 'put' | 'patch' | 'delete'

type MyString = string
type MyNumber = number

type MyObjectOne = {
  a: number
}

type MyObjectTwo = {
  b: number
}

type MyAnyObject = MyObjectOne | MyObjectTwo
// { a: number } | { b: number }

let method: HttpExtendedMethod = 'post'
method = 'patch' // ✅

let obj: MyAnyObject = {
  b: 5,
} // ✅
```

#### Function Types

```typescript
type User = {
  name: string
  age: number
}

// function type definition
type MyFunc = (name: string, age: number) => User

// function type usage
const createUser: MyFunc = (name, age) => {
  return {
    name,
    age,
  }
}

const user = createUser('Alex', 33)
console.log(user) // { name: 'Alex', age: 33 }
```

#### Object types

✅ Either with nothing after each field definition:

```typescript
type User = {
  name: string
  age: number
  skills: string[]
}
```

✅ or with comma:

```typescript
type User = {
  name: string,
  age: number,
  skills: string[],
}
```

✅ or with semicolon:

```typescript
type User = {
  name: string;
  age: number;
  skills: string[];
}
```

are valid.

Object types with methods:

```typescript
type User = {
  name: string
  age: number
  role: string

  log: () => string
}

const user: User = {
  name: 'Alex',
  age: 33,
  role: 'admin',
  log() {
    return `${this.name}: ${this.age}`
  },
}

console.log(user.log()) // 'Alex: 33'
```

#### Intersection Types

```typescript
type User = {
  name: string
  age: number
}

type Role = {
  role: string
}

type UserExtended = User & Role
// {
//   name: string
//   age: number
//   role: string
// }

const user: UserExtended = {
  name: 'Alex',
  age: 33,
  role: 'admin',
}
```

> You should avoid intersection of two object types which have the same fields.

### Interfaces

- all methods defined in an interface must be implemented in a class that implements the interface
- all properties in an interface must be implemented as public in the class
- methods in the class must have signatures compatible with those in the interface:
  - a method cannot take more arguments than defined in the interface
  - a method can take fewer arguments than defined in the interface
  - the return type of a method must be the same or more specific than the return type specified in the interface
- methods in an interface cannot be marked as `async`
- a method in a class can be `async` and return a `Promise<T>`, where `T` matches the return type defined in the interface.


✅ Either with nothing after each field definition:

```typescript
interface User {
  name: string
  age: number
  skills: string[]
}
```

✅ or with comma:

```typescript
interface User {
  name: string,
  age: number,
  skills: string[],
}
```

✅ or with semicolon:

```typescript
interface User {
  name: string;
  age: number;
  skills: string[];
}
```

are valid.

Interface extension:

```typescript
interface User {
  name: string
  age: number
  skills: string[]
}

interface UserExtended extends User {
  role: string
}

const user: UserExtended = {
  name: 'Alex',
  age: 33,
  skills: ['javascript', 'typescript'],
  role: 'admin',
}
```

Multiple interface extension:

```typescript
interface User {
  name: string
  age: number
  skills: string[]
}

interface Role {
  role: string
}

interface UserExtended extends User, Role {
  createdAt: Date
}

const user: UserExtended = {
  name: 'Alex',
  age: 33,
  skills: ['javascript', 'typescript'],
  role: 'admin',
  createdAt: new Date(),
}
```

Interfaces with methods:

```typescript
interface User {
  name: string
  age: number
  role: string

  log: () => string
}

const user: User = {
  name: 'Alex',
  age: 33,
  role: 'admin',
  log() {
    return `${this.name}: ${this.age}`
  },
}

console.log(user.log()) // 'Alex: 33'
```

### Index properties

```typescript
type TWithIndex = {
  name: string
  [key: number]: string
}

interface IWithIndex {
  name: string
  [key: number]: string
}

const obj1: TWithIndex = {
  name: 'something',
  1: 'one',
  2: 'two',
  3: 'three',
}

const obj2: IWithIndex = {
  name: 'something',
  1: 'one',
  2: 'two',
  3: 'three',
}
```

Strings as keys are also allowed:

```typescript
type MyDict = {
  [key: string]: string
}

const obj: MyDict = {
  '1': 'one',
  '2': 'two',
  '3': 'three',
}
```

### Interfaces vs Types

> Main difference between interfaces and types is that **types can be intersected and unioned** with any other type or interface but **interfaces can't**.

Only types can be used to describe primitives:

```typescript
type MyNumber = number
type MyNumberOrString = number | string
```

Interfaces with the same name will be merged:

```typescript
interface User {
  name: string
}

interface User {
  age: number
}

const user: User = {
  name: 'Alex',
  age: 33,
}
```

> It's a good way to expand external functionality but should be avoided among your own code.

Types can't be merged that way:

```typescript
type User = {
  name: string
}

type User = {
  age: number
} // ❌
```

### Optional

Optional object properties:

```typescript
interface User {
  name: string
  age?: number // ≠ age: number | undefined ❗
}

const user: User = {
  name: 'Alex',
} // ✅
```

Optional function or method arguments:

```typescript
const multiply = (a: number, b?: number): number => { // equivalent to (a: number, b: number | undefined) ✅
  if (!b) {
    return a * a
  }
  return a * b
}

console.log(multiply(5, 2)) // 10
console.log(multiply(5)) // 25
```

Default function or method arguments:

```typescript
const multiply = (a: number, b: number = 10): number => a * b

console.log(multiply(3, 3)) // 9
console.log(multiply(5)) // 50
```

Optional chaining:

```typescript
type User = {
  name?: string
}

const user: User = {}

// safely access the `name` property of `user` if `user` is `null` or `undefined`, returning `undefined` instead of throwing an error
console.log(user?.name) // undefined

// forcefully access the `name` property of `user`, assuming we know `user` is neither `null` nor `undefined`
console.log(user!.name) // undefined
```

Nullish coalescing:

```typescript
const str: string | null = null

// returns `str` if it's neither `null` nor `undefined` otherwise returns 'something else'
console.log(str ?? 'something else') // 'something else'
```

### `void`

```typescript
const funcVoid = (): void => {
  console.log('something') // must not return anything
}

const funcUndefined = (): undefined => {
  return undefined // can only return `undefined` or nothing
}

const funcNothingUndef = (): undefined => {} // ✅
const funcNothing = () => {} // ✅ returns `void` type implicitly

const valVoid = funcVoid() // void
const valUndefined = funcUndefined() // undefined
const valNothingUndef = funcNothingUndef() // undefined
const valNothing = funcNothing() // void
```

Can be used in function types:

```typescript
type VoidFunc = () => void

const funcVoidTyped: VoidFunc = () => {
    return 'something' // ✅
}

const valVoidTyped = funcVoidTyped() // void

const funcVoidUntyped = (): void => {
    return 'something' // ❌
}
```

> In case a function is defined by type alias which returns `void` type it can actually return any value.

```typescript
const skills = ['javascript', 'typescript', 'devops']

type User = {
    name: string
    skills: string[]
}

const user: User = {
    name: 'Alex',
    skills: [],
}

// returning `void` type in the signature of the callback in `forEach` provides compatibility with every type of value can be returned there
skills.forEach(skill => user.skills.push(skill)) // callback implicitly returns `void`

console.log(user)
// {
//   "name": "Alex",
//   "skills": [
//     "javascript",
//     "typescript",
//     "devops"
//   ]
// }
```

### `unknown`

`unknown` is used when we don't know what's in there but still want to have strict type-checking. **It should be narrowed later.**

> `unknown` must be used instead of `any`!

```typescript
let outer: unknown

outer = true // ✅
outer = 1 // ✅
outer = 'something' // ✅

let inner: string = outer // ❌
```

vs

```typescript
let outer: any

outer = true // ✅
outer = 1 // ✅
outer = 'something' // ✅

let inner: string = outer // ✅❗
```

#### Narrowing `unknown`

```typescript
const processOuter = (value: unknown): void => {
  if (typeof value === 'number') {
    console.log(value.toFixed(2)) // `value` is narrowed to `number`
  } else if (typeof value === 'string') {
    console.log(value.trim()) // `value` is narrowed to `string`
  } else {
    console.log(value) // `value` remains `unknown` here
  }
}
```

#### Usage in Error Handling

```typescript
try {
  throw new Error('Something went wrong')
} catch (err) { // `err` is `unknown` and should be narrowed
  if (err instanceof Error) {
    console.log(`Error: ${err.message}`) // 'Error: Something went wrong'
  }
}
```

#### Intersection and union with `unknown`

```typescript
type UnknownOrNumber = unknown | number // unknown
type UnknownAndNumber = unknown & number // number
```

### `never`

Used when we never reach any value, for example, when a function only throws an error and never returns anything:

```typescript
const throwError = (): never => {
  throw new Error('An error occured')
}
```

It's also useful to mark a block of the code that is never reached but can be potentially reached after extending functionality:

```typescript
type PaymentAction = 'checkout' | 'refund'

const processAction = (action: PaymentAction): void => {
  switch (action) {
    case 'checkout':
      // `action` is narrowed to 'checkout'
      break
    case 'refund':
      // `action` is narrowed to 'refund'
      break
    default:
      // `action` is narrowed to `never`
      const _: never = action // ✅ will be never reached
      throw new Error('Not yet available')
  }
}

type PaymentActionExtended = 'checkout' | 'refund' | 'reject'

const processActionExtended = (action: PaymentActionExtended): void => {
  switch (action) {
    case 'checkout':
      // `action` is narrowed to 'checkout'
      break
    case 'refund':
      // `action` is narrowed to 'refund'
      break
    default:
      // `action` is narrowed to 'reject' here
      const _: never = action // ❌ will cauase compiler error so we need to implement 'reject' case
      throw new Error('Not yet available')
  }
}
```

### `null`

> `strictNullChecks` in `tsconfig.json` is responsible for allowing or disallowing `null` value in `boolean`, `number`, `string`, `undefined` types.

With `strictNullChecks` set to `true` it's only allowed to set the `null` value to `null`, `unknown` or `any` type. **You should never disable that option**.

#### `null` vs `undefined`

- `null` means the value that is undefined **explicitly**
- `undefined` means the value that is undefined **implicitly**.

### Type Coercion

```typescript
let str: string = 'abc'
let num: number = 123
str = num // ❌
str = num.toString() // ✅
```

#### Custom Type Coercion

```typescript
interface Box {
  size: number
  color: string
}

interface Sphere {
  size: number
}

// mapping function
const boxToSphere = (box: Box): Sphere => {
  return {
    size: box.size,
  }
}

const box: Box = {
  size: 123,
  color: 'green',
}

// ✅ type coercion using the mapping function
const sphere1: Sphere = boxToSphere(box) // Sphere { size: 123 }

// ❌ bad way of type coercion: the result object may actually have unwanted properties though they are unreachable in typescript but will be present in javascript which may cause side effects
const sphere2: Sphere = {
  ...box,
}

// ❌ worst way of type coercion: the result object will also be just a link to another object
const sphere3: Sphere = box
```

### Type Guards

```typescript
// type guard function
const isString = (value: string | number): value is string => {
  return typeof value === 'string'
}

const logSomething = (value: string | number) => {
  // type guard function can be used to narrow types
  if (isString(value)) {
    console.log(value.trim())
  } else {
    console.log(value.toFixed(2))
  }
}
```

Type guards for objects:

```typescript
interface User { name: string }
interface UserWithRole { name: string; role: string }

// preferred type guard
const isUserWithRole =
  (user: User | UserWithRole): user is UserWithRole => {
    return 'role' in user
  }

// not recommended
const isUserWithRoleAlt =
  (user: User | UserWithRole): user is UserWithRole => {
    return (user as UserWithRole).role !== undefined
  }
```

#### `asserts`

> `asserts` keyword marks a type guard which should throw an error if the result expression is not true.
> `asserts` [can't be used in arrow functions](https://github.com/microsoft/TypeScript/issues/34523).

```typescript
interface User {
  name: string
}

// type guard which should throw an error if the assertion is not true
function assertUser(obj: unknown): asserts obj is User {
  if (typeof obj === 'object' && !!obj && 'name' in obj) {
    return
  }
  throw new Error('This is not a valid `User`')
}

const obj = {} // unknown object from the external api
assertUser(obj) // will throw an error if `obj` is not `User`
obj.name = 'Alex' // now we are sure that `obj` is `User` and has the property `name`
```

## Classes

### Classes Overview

```typescript
class User {
  name: string // `strictPropertyInitialization` is recommended to be set to `false` in `tsconfig.json` to have uninitialized properties in classes

  constructor(name: string) {
    this.name = name
  }
}

const user = new User('Alex')
```

Extended example:

```typescript
enum PaymentStatus {
  Holded,
  Processed,
  Reversed,
}

class Payment {
  id: number
  status: PaymentStatus = PaymentStatus.Holded
  createdAt: Date = new Date()
  updatedAt: Date

  constructor(id: number) {
    this.id = id
  }

  getLifeTime(): number {
    return new Date().getTime() - this.createdAt.getTime()
  }

  unhold(): void {
    if (this.status === PaymentStatus.Processed) {
      throw new Error(`The payment can't be undone`)
    }
    this.status = PaymentStatus.Reversed
    this.updatedAt = new Date()
  }
}

const payment = new Payment(1)
payment.unhold()
console.log(payment)
// Payment: {
//   "status": 2,
//   "createdAt": "2024-10-07T15:46:53.682Z",
//   "id": 1,
//   "updatedAt": "2024-10-07T15:46:53.682Z"
// }
```

### Methods Overload

```typescript
class User {
  // `strictPropertyInitialization` is recommended to be set to `false` in `tsconfig.json` to have uninitialized properties in classes
  name: string
  age: number

  // overload signature 1
  constructor(name?: string, age?: number)
  // overload signature 2
  constructor(name: string, age?: number)

  // implementation signature
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  // overload is also available for other methods

  // overload signature
  logName(greet?: string): void

  // implementation signature
  logName(greet: string): void {
    console.log(`[${greet}]: ${this.name}`)
  }
}

const user1 = new User() // User { name: undefined, age: undefined }
const user2 = new User('Alex') // User { name: 'Alex', age: undefined }
const user3 = new User('Elena', 33) // User { name: 'Elena', age: 33 }
```

Extended example:

```typescript
class User {
  skills: string[]

  addSkill(skill: string): void
  addSkill(skills: string[]): void
  addSkill(skillOrSkills: string | string[]): void {
    if (typeof skillOrSkills === 'string')
      this.skills.push(skillOrSkills)
    else
      this.skills.concat(skillOrSkills)
  }
}
```

> Functions can be overloaded as well.

```typescript
function decorateLog(message: string): string
function decorateLog(message: number): number
function decorateLog(message: number | string): number | string {
  if (typeof message === 'string')
    return `[LOG]: ${message.trim()}`
  else
    return `[LOG]: ${message.toFixed(2)}`
}

console.log(decorateLog('  abc ')) // "[LOG]: abc" 
console.log(decorateLog(123.456789)) // "[LOG]: 123.46"
```

### Getters and Setters

> Setters and getters can **not** be `async`. Thus, to use `await` we can only use methods.

```typescript
class User {
  _login: string
  _age: number

  get login(): string {
    return this._login
  }

  set login(login: string) {
    this._login = `user-${login}`
  }
}
```

### `implements`

```typescript
interface ISwitchable {
  isOn: boolean
  turnOn(): void
  turnOff(): void
}

interface IDimmable {
  brightness: number
  setBrightness(level: number): void
}

class SmartLight implements ISwitchable, IDimmable {
  isOn: boolean = false
  brightness: number = 0

  turnOn(): void {
    this.isOn = true
    this.brightness = 100
  }

  turnOff(): void {
    this.isOn = false
    this.brightness = 0
  }

  setBrightness(level: string | number): void {
    if (typeof level === 'string') {
      this.brightness = parseInt(level)
    } else {
      this.brightness = level
    }
  }
}
```

### `extends`

```typescript
type PaymentStatus = 'new' | 'paid'

class Payment {
  id: number
  status: PaymentStatus = 'new'

  constructor(id: number) {
    this.id = id
  }

  pay(): void {
    this.status = 'paid'
  }
}

class PersistedPayment extends Payment {
  databaseId: number
  paidAt: Date

  constructor() {
    const id = Math.ceil(Math.random() * 100)
    super(id)
  }

  save() {
    console.log('Saved to the database')
  }

  // `override` keyword indicates that the method is an override and will cause a compilation error if the method doesn't exist in the parent class
  // without `override` it's still a valid override but the compiler will not check whether the method exists in the parent class, which can lead to potential issues if the method in the parent class is removed
  override pay(date?: Date): void {
    super.pay() // call the parent method `pay()` (but it's not mandatory to call `super` in an override method)
    if (date) {
      this.paidAt = date
    }
  }
}

const payment = new PersistedPayment()

console.log(payment.status) // new
payment.pay()
console.log(payment.status) // paid
```

#### Usage `super` in `constructor`s

A `super` call in a child `constructor`:
- must be called before accessing `this` in the constructor of the child class
- must be the first statement in the constructor when the child class contains initialized properties.

#### Extending `Error` class

```typescript
class HttpError extends Error {
  code: number

  constructor(message: string, code: number = 500) {
    super(message)
    this.code = code
  }
}

try {
  throw new HttpError('Not found', 404)
} catch (error) {
  if (error instanceof HttpError)
    console.log(`[ERROR]: [${error.code}] ${error.message}`) // [ERROR]: [404] Not found
}
```

### Inheritance vs Composition

```typescript
class User {
  name: string
}

class Users extends Array<User> {
  // ❌ bad way, will have all the array methods which should be overridden otherwise they may not make sense
}

// ✅ composition
class Users2 {
  users: User[]

  // we only have methods we really need to implement
  add(user: User) {
    this.users.push(user)
  }
}
```

```typescript
class User {
  name: string
}

class Payment {
  date: Date
}

class UserWithPayment extends Payment {
  // ❌ bad way, because we have an intersection of two independent domains
}

// ✅ composition
class UserWithPayment2 {
  user: User
  payment: Payment

  constructor(user: User, payment: Payment) {
    this.user = user
    this.payment = payment
  }
}
```

```typescript
// ✅ inheritance is a good choice here because we don't intersect domains and we really need to extend the original Error class
class CustomError extends Error {}
```

### Property Access Modifiers

```typescript
type UnitSystem = 'metric' | 'imperial'

class Shape {
  public color: string // accessible from everywhere, including direct access from an instance of the class
  protected measurement: UnitSystem = 'metric' // only accessible within the class and within all its children
  private metaData: string[] // only accessible within the class
  #createdAt: Date // javascript private property, only accessible within the class, will stay private in javascript runtime as well
}

class Box extends Shape {
  public setMeasurement(measurement: UnitSystem) {
    this.measurement = measurement // ✅
  }
}

const box = new Box()
box.color // ✅
box.setMeasurement('imperial') // ✅

box.measurement // ❌
box.metaData // ❌
box.#createdAt // ❌
```

### `static`

```typescript
class Service {
  private static properties: string[] = [] // should be initialized, otherwise it may cause side effects in runtime

  // static properties and methods are `public` by default
  static addProperty(value: string) {
    // `this` in static methods refers to the class itself
    this.properties.push(value)
  }

  static findProperty(value: string): boolean {
    return !!this.properties.find(item => item.includes(value))
  }

  // block of the static code is like a constructor but for the class itself
  static {
    this.addProperty('initial')
  }

  constructor(private name: string) {
    // static properties and methods can be called within the object context (even in counstructors) through the class name
    Service.addProperty(name)
  }

  getName() {
    return this.name
  }

  setName(name: string): boolean {
    if (Service.findProperty(name)) {
      this.name = name
      return true
    }
    return false
  }


}

console.log(Service.findProperty('initial')) // true

const service = new Service('initial')
console.log(service.getName()) // 'initial'

// static (class context)
Service.addProperty('foo')

// object context
service.setName('foo')
console.log(service.getName()) // 'foo'
```

### `this`

```typescript
class Payment {
  private date: Date = new Date()

  // ✅ typing `this` ensures typescript warns about context loss
  getDateSafe(this: Payment) {
    return this.date
  }

  // ❗ without typing `this`, context may be lost
  getDateUnsafe() {
    return this.date
  }

  // ✅ arrow function preserves `this` context
  getDateArrow = () => {
    return this.date
  }
}

const payment = new Payment()

const user = {
  id: 1,
  paymentDate: payment.getDateUnsafe.bind(payment), // ✅ explicitly bind `this` to prevent context loss
  paymentDateArrow: payment.getDateArrow, // ✅ arrow function keeps `this` bound to `payment`
  paymentDateWrongSafe: payment.getDateSafe, // ❌ typescript error due to `this` type mismatch
  paymentDateWrongUnsafe: payment.getDateUnsafe, // ❗ no typescript error, but `this` is lost, which may cause side effects in runtime
}

console.log(user.paymentDate()) // ✅ 2024-10-08T21:25:52.793Z
console.log(user.paymentDateArrow()) // ✅ 2024-10-08T21:25:52.793Z
console.log(user.paymentDateWrongSafe()) // ❌ typescript error
console.log(user.paymentDateWrongUnsafe()) // ❗ undefined

class PaymentPersisted extends Payment {
  save() {
    return this.getDateArrow() // ✅
  }

  saveWrong() {
    return super.getDateArrow() // ❌ can't call the method that is defined by arrow function in the parent class
  }
}
```

#### Typing `this`

```typescript
class UserBuilder {
  name: string

  // `this` is special type that dynamically refers to the type of the current class name (will refer to a child class if the method is called in the child class context)
  setName(name: string): this {
    this.name = name
    return this
  }

  // type guard to check whether `this` is `AdminBuilder`
  isAdmin(): this is AdminBuilder {
    return this instanceof AdminBuilder
  }
}

class AdminBuilder extends UserBuilder {
  // child class should have unique properties (methods) otherwise type narrowing may not work as expected
  roles: string[]
}

const user = new UserBuilder().setName('Alex') // user: UserBuilder
const admin = new AdminBuilder().setName('Oxana') // admin: AdminBuilder

const userOrAdmin: UserBuilder | AdminBuilder = new UserBuilder()

if (userOrAdmin.isAdmin()) {
  userOrAdmin // userOrAdmin: AdminBuilder
} else {
  userOrAdmin // userOrAdmin: UserBuilder
}
```

### Abstract classes and methods

> Comparing to interfaces, abstract classes can contain implementation.

- abstract classes cannot be instantiated directly
- abstract methods can only appear within an abstract class
- abstract methods should not have an implementation
- abstract methods must be implemented in child classes.

```typescript
abstract class A { // cannot be instantiated
  public abstract a(): void // should not have an implementation, can be only defined in an abstract class

  public b() {
    console.log('b')
  }

  public c() {
    this.a() // abstract method can be called within a non-abstract method
  }

}

class B extends A { // must implement all abstract methods that are defined in the parent classes
  public a(): void {
    console.log('a')
  }
}

// const a = new A() // ❌
const b = new B()
b.a() // a
b.b() // b
b.c() // a
```

## TypeScript Compiler

### Architecture

```
+-------------------+
|        IDE        |
+-------------------+
          |
          |
+--------------------+
|      ts.server     |
+--------------------+
          |
          |
+--------------------+        +---------------------------------+
|  Language Service  |        |   `tsc` (Standalone compiler)   |
+--------------------+        +---------------------------------+
+---------------------------------------------------------------+
|                     Core TypeScript Compiler                  |
+---------------------------------------------------------------+

```

### `tsconfig` options

```javascript
{
  "compilerOptions": {
    "target": "es2016", // target javascript standard
    "lib": [ // libs to use in the environment
      "DOM",
      "ES2016"
    ],
    "module": "commonjs", // what module system to use
    "rootDir": "./src", // where the source typescript files are stored (to avoid possible conflicts)
    "baseUrl": "./src", // base directory to resolve module paths like `import { helperFunction } from 'utils/helpers'`
    "paths": { // set of entries that re-map imports to additional lookup locations
      "@utils/*": ["utils/*"], // `import { helperFunction } from '@utils/helpers'`
      "@components/*": ["components/*"] // `import { Button } from '@components/Button'`
    },
    "resolveJsonModule": true, // enable importing .json files
    "allowJs": true, // allow js files in the typescript project
    "checkJs": true, // check js files in they are allowed
    "outDir": "./build", // where to compile (the original structure will be preserved)
    "removeComments": true, // remove comments
    "noEmitOnError": true, // don't build files if any error occured
    "sourceMap": true, // if any runtime error occured it will be possible to know the source typescript file and line
    "declaration": true, // generate *.d.ts files from typescript and javascript files
    "declarationDir": "./types" // output directory for *.d.ts files
  },
  "files": ["app.ts"], // concrete files that should be compiled
  "include": ["**/app*.ts"], // patterns to include
  "exclude": ["**/something.ts"], // patterns to exclude
  "extends": "./parent-tsconfig.json" // merge the top-level tsconfig with the current
}
```

#### Strict type-checking

```javascript
{
  "compilerOptions": {
    ...,
    "strict": true, // enable all strict type-checking options
    "noImplicitAny": true, // error if `any` type appears implicitly
    "strictNullChecks": true, // possible `null` or `undefined` values will be considered
    "strictFunctionTypes": true, // strict function type checking
    "strictBindCallApply": true, // check that the arguments for 'bind', 'call', 'apply' match the original function
    "strictPropertyInitialization": false, // check for class properties that are declared but not set in the constructor
    "noImplicitThis": true, // enable error reporting when `this` is given the type `any`
    "useUnknownInCatchVariables": true, // catch clause variables are `unknown` instead of `any`
    "alwaysStrict": true, // ensure 'use strict' is always enabled in javascript files
    ...
  },
}
```

#### Additional options

```javascript
{
  "compilerOptions": {
    ...,
    "noUnusedLocals": false, // warn when local variables aren't read
    "noUnusedParameters": false, // warn when a function parameter isn't read
    "noFallthroughCasesInSwitch": true, // warn cases in `switch` statements without `break`
    "allowUnreachableCode": false, // disable warnings for unreachable code
    "noImplicitOverride": true, // ensure overriding members in derived classes are marked as `override`
    "noPropertyAccessFromIndexSignature": true, // error if we call a property defined as `[key: KT]: VT`
    ...
  },
}
```

## Generics

> Generic is a placeholder for a type, used as a template in functions, classes, or interfaces to represent any valid type. The type remains consistent throughout the function, class or interface (where this generic is defined for), meaning it cannot change once replaced with a specific type.

```typescript
function identity<T>(data: T): T {
  return data
}
```

### Built-in Generics

```typescript
const num: Array<number> = [1, 2, 3]

async function test() {
  const a = await new Promise<number>((resolve, reject) => {
    resolve(1)
  })
}

const access: Record<string, boolean> = { // { [key: string]: boolean }
  readable: true,
  writable: false,
  executable: false,
}
```

### Generics in Functions

```typescript
function logMiddleware<T>(data: T): T {
  console.log(data)
  return data
}

const res1 = logMiddleware(10)            // res1: 10 = 10
const res2 = logMiddleware('abc')         // res2: 'abc' = 'abc'
let res3 = logMiddleware('abc')           // res3: string = 'abc'

// we can specify the generic type explicitly when call
const res4 = logMiddleware<number>(10)    // res4: number = 10
const res5 = logMiddleware<string>('abc') // res5: string = 'abc'

function getHalf<T>(data: Array<T>): Array<T> {
  const resultLength = data.length / 2
  return data.splice(0, resultLength)
}

getHalf([1, 3, 4])         // function getHalf<number>(data: number[]): Array<number>
getHalf<number>([1, 3, 4]) // function getHalf<number>(data: number[]): Array<number>

// function signature with generics
const getHalfCopy: <T>(data: Array<T>) => Array<T> = getHalf

getHalfCopy([1, 3, 4])     // getHalfCopy: <number>(data: number[]) => Array<number>
```

### Generics in Types and Interfaces

```typescript
interface ILogLine<T> {
  timeStamp: Date
  data: T
}

type LogLineType<T> = {
  timeStamp: Date
  data: T
}

const logLine: ILogLine<{ a: number }> = {
  timeStamp: new Date(),
  data: {
    a: 1
  }
}

const logLineType: LogLineType<{ b: string }> = {
  timeStamp: new Date(),
  data: {
    b: 'abc',
  }
}
```

### Generic `extends`

```typescript
class Vehicle { // it can be an interface or a type as well
  constructor(public run: number) {}
}

class Car extends Vehicle { // it can be an interface as well
  capacity: number
}

function kmToMiles<T extends Vehicle>(vehicle: T): T {
  vehicle.run = vehicle.run * 0.62
  return vehicle
}

const vehicle = kmToMiles(new Vehicle(15))
console.log(vehicle.run) // 9.3

const car = kmToMiles(new Car(5))
console.log(car.run) // 3.1

const other = kmToMiles({ run: 1 }) // this literal object also corresponds to `Vehicle` even though it's not literally an instance of `Vehicle`
console.log(other.run) // 0.62

// we can extend primitive types as well
function logId<T extends string | number, Y>(
  // function arguments
  id: T,
  additionalData: Y
): { // return type
  id: T,
  data: Y
} {
  // function body
  return { id, data: additionalData }
}
```

### Generics in Classes

```typescript
class Resp<D, E> {
  constructor(public data?: D, public error?: E) {}
}

const resp = new Resp<string, number>('data')

class HTTPResp<F> extends Resp<string, number>  {
  code: F

  setCode(code: F) {
    this.code = code
  }
}

const resp2 = new HTTPResp()
```

### Mixins

#### Mixin vs Composition

##### Mixin

```typescript
class Animal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  move() {
    console.log(`${this.name} is moving`)
  }
}

function Swimmer<T extends { new (...args: any[]): {} }>(Base: T) {
  return class extends Base {
    swim() {
      console.log(`${(this as any).name} is swimming`)
    }
  }
}

const SwimmableAnimal = Swimmer(Animal)

const duck = new SwimmableAnimal('Duck')
duck.move() // Duck is moving
duck.swim() // Duck is swimming
```

##### Composition

```typescript
class Swimmer {
  constructor(public name: string) {}
  swim() {
    console.log(`${this.name} is swimming`)
  }
}

class Animal {
  constructor(public name: string) {}
  move() {
      console.log(`${this.name} is moving`)
  }
}

class Duck {
  private animal: Animal
  private swimmer: Swimmer

  constructor(name: string) {
      this.animal = new Animal(name)
      this.swimmer = new Swimmer(name)
  }

  move() {
      this.animal.move()
  }

  swim() {
      this.swimmer.swim()
  }
}

const duck = new Duck('Duck')
duck.move() // Duck is moving
duck.swim() // Duck is swimming
```

#### Advanced Mixin with type-checking

```typescript
// type definition for a class constructor
type Constructor = new (...args: any[]) => {}

// `<T = {}>` means default value for the generic if it's not passed explicitly
type GConstructor<T = {}> = new (...args: any[]) => T

class ListClass {
  constructor(public items: string[]) {}
}

class AccordionClass {
  isOpened: boolean
}

type ListType = GConstructor<ListClass>
type AccordionType = GConstructor<AccordionClass>

class ExtendedListClass extends ListClass {
  first() {
    return this.items[0]
  }
}

function ExtendedList<TBase extends ListType & AccordionType>(Base: TBase) {
  return class ExtendedList extends Base {
    // `first` is available here
    // `isOpened` is available here
    // `items` is available here
    first() {
      return this.items[0]
    }
  }
}

// for this class type-checking will force us to define `isOpened: boolean` and `items: string[]`
class AccordionListClass {
  isOpened: boolean = true
  items: string[] = []
  constructor(items: string[]) {
    this.items = items
  }
}

const list = ExtendedList(AccordionListClass)
const res = new list(['first', 'second'])

console.log(res.first()) // first
console.log(res.isOpened) // true
console.log(res.items[0]) // first
```

## Advanced Types

### `keyof`

```typescript
interface IUser {
  name: string
  age: number
}

type KeysOfUser = keyof IUser

const key: KeysOfUser = 'age' // can be only either 'name' or 'age'

function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key] // ✅ we can safely call `obj[key]` because we are limited with only existing keys of `obj`
}

const user: IUser = {
  name: 'Alex',
  age: 33,
}

const userName = getValue(user, 'name') // ✅
const userAge = getValue(user, 'age') // ✅
const userSomething = getValue(user, 'something') // ❌
```

### `typeof`

#### Type narrowing / JavaScript runtime

```typescript
let foo: string | number =
  Math.random() > 0.5 ?
    'abc' : 123

if (typeof foo === 'string') {
  // foo: string
} else {
  // foo: number
}
// foo: string | number
```

#### Getting type of the value / TypeScript feature

```typescript
let foo: string | number =
  Math.random() > 0.5 ?
    'abc' : 123

let bar: typeof foo
// bar: string | number
// foo: string | number

const user = {
  name: 'Alex',
}

type UserType = typeof user
// {
//   name: string
// }

type KeyOfUser = keyof typeof user // 'name'

enum Direction {
  Up, // 0
  Down, // 1
}

type DirectionType = keyof typeof Direction // 'Up' | 'Down'

const direction: DirectionType = 'Up'

console.log(Direction[direction]) // 0
```

### Indexed Access Types

```typescript
interface MyUser {
  name: string
  phones: string[]
}

const myUser: MyUser = {
  name: 'Alex',
  phones: ['123', '456', '789']
}

// getting type of a type/interface field by accessing its index
type MyUserNameType = MyUser['name'] // string

const FieldName = 'name'
type MyUserNameTypeInvalid = MyUser[FieldName] // ❌

type MyUserNameTypeValid = MyUser[typeof FieldName] // ✅ typeof FieldName === 'name' → MyUser['name']

type UserPhones = MyUser['phones'] // string[]
type UserPhone = MyUser['phones'][number] // string

// convert array of strings to a type of unioned string literals
const roles = ['user', 'manager', 'admin'] as const
type Role = typeof roles[number] // 'user' | 'manager' | 'admin'
```

### Conditional Types

Different interfaces depending on a value:

```typescript
interface HTTPResponse<T extends 'success' | 'failed'> {
	code: number
	data: T extends 'success' ? string : Error
  errorInfo: T extends 'success' ? null : string
}

const suc: HTTPResponse<'success'> = {
	code: 200,
	data: 'done',
  errorInfo: null,
}

const err: HTTPResponse<'failed'> = {
	code: 500,
	data: new Error(),
  errorInfo: 'Something went wrong',
}
```

Better (in some cases) way to overload functions:

```typescript
class User {
	id: number
	name: string
}

class UserPersisted extends User {
	dbId: string
}

function getUserOverloaded(id: number): User
function getUserOverloaded(dbId: string): UserPersisted
function getUserOverloaded(dbIdOrId: string | number): User | UserPersisted {
	if (typeof dbIdOrId === 'number') {
		return new User()
	} else {
		return new UserPersisted()
	}
}

type UserOrUserPersisted<T extends string | number> = T extends number ? User : UserPersisted

function getUser<T extends string | number>(id: T): UserOrUserPersisted<T> {
	if (typeof id === 'number') {
    // need to explicitly cast to `UserOrUserPersisted<T>` because `typeof id === 'number'` is an only JavaScript runtime check and is not related to type-checking in TypeScript
		return new User() as UserOrUserPersisted<T>
	} else {
		return new UserPersisted() as UserOrUserPersisted<T>
	}
}

const res = getUser(1) // User
const res2 = getUser('abc') // UserPersisted
```

### `infer`

> `infer` operator allows to get a type of a specific structure within the conditional expression of a conditional type.

```typescript
// bad-typed function from an external module
function runTransaction(transaction: {
	fromTo: [string, string]
}) {
	console.log(transaction)
}

// a type which captures the first argument of a compatible function type
type GetFirstArg<T> = T extends (first: infer First, ...args: any[]) => any ? First : never

const transaction: GetFirstArg<typeof runTransaction> = {
	fromTo: ['1', '2']
}

runTransaction(transaction) // { fromTo: [ '1', '2' ] }
```

### Mapped Types

> Mapped types are a special type in TypeScript that allow the creation of new types by transforming the properties of an existing type.

Basic usage:

```typescript
type User = {
  name: string
  age: number
  email?: string
}

// mapped type
type ReadonlyUser = {
  readonly [K in keyof User]: User[K]
}
// {
//   readonly name: string;
//   readonly age: number;
//   readonly email?: string;
// }
```

Advanced usage:

```typescript
type AccessType = 'read' | 'update' | 'create'

type UserRoles = {
	customers?: AccessType,
	projects?: AccessType,
	adminPanel?: AccessType,
}

// ❌ a type made from another type by hands (we can lose the connection between these two types if one of them is changed)
type UserAltRoles = {
	customers?: boolean,
	projects?: boolean,
	adminPanel?: boolean,
}

// type mapper
type MapToBoolean<Type> = {
	+readonly [Property in keyof Type]-?: boolean // set every property of <Type> readonly and mandatory
}
// +readonly ... // set the property readonly
// -readonly ... // unset the property readonly
// ...+? // set the property optional
// ...-? // set the property mandatory

// ✅ mapping the type
type UserMappedRoles = MapToBoolean<UserRoles>
// {
//   readonly customers: boolean;
//   readonly projects: boolean;
//   readonly adminPanel: boolean;
// }
```

### Template Literal Types

```typescript
type ReadOrWrite = 'read' | 'write';
type Bulk = 'bulk' | ''

// string literal type
type Access = `can${Capitalize<ReadOrWrite>}${Capitalize<Bulk>}` // 'canRead' | 'canReadBulk' | 'canWrite' | 'canWriteBulk'

// getting parts of a string literal type
type ReadOrWriteBulk<T> = T extends `can${infer R}` ? R : never
type T = ReadOrWriteBulk<Access> // 'Read' | 'Write' | 'ReadBulk' | 'WriteBulk'
```

