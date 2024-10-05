# TypeScript

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

