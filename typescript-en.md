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

### Type Assertion (Утверждение типа)

Tell TypeScript to treat a value as a specific type.

```typescript
let value: any = "Hello World";
let strLength: number = (value as string).length;
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
const numConst = 5 // type: 5
const strConst = 'abc' // type: 'abc'
let numVar = 5 // type: number
let strVar = 'abc' // type: string
```

```typescript
type ReadonlySkills = readonly string[]
type ReadonlyRecord = readonly [number, string]

const skills: ReadonlySkills = ['html', 'css', 'javascript']
skills[0] = 'abc' // ❌

const data: ReadonlyRecord = [1, 'user']
data[0] = 5 // ❌
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

