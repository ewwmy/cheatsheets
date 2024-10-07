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

```json
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
tsc ./app.ts # compile ./app.ts into ./app.js
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

// type guard which throws an error if the assertion is not true
function assertUser(obj: unknown): asserts obj is User {
  if (typeof obj === 'object' && !!obj && 'name' in obj) {
    return
  }
  throw new Error('This is not a valid `User`')
}

const obj = {} // unknown object from the external api
assertUser(obj) // will throw an error if `obj` is not `User`
obj.name = 'Alex' // we are sure here that `obj` is `User` and has the property `name`
```

## Classes

### Overload

```typescript
class User {
  name: string // need to set `"strictPropertyInitialization": false` in `tsconfig.json`
  age: number // need to set `"strictPropertyInitialization": false` in `tsconfig.json`

  constructor()
  constructor(name: string)
  constructor(age: number)
  constructor(ageOrName?: string | number) {
    if (typeof ageOrName === 'string')
      this.name = ageOrName
    else if (typeof ageOrName === 'number')
      this.age = ageOrName
  }
}

const user1 = new User()
const user2 = new User('Alex')
const user3 = new User(33)

console.log(user1, user2, user3)
// User: {}
// User: { "name": "Alex" }
// User: { "age": 33 }
```

