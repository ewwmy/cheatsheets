# Microservices

## Notation

[C4 model](https://c4model.com/) is a commonly used notation system but might be redundant.

### Improved Notation

- **Basics**
  - Application
  - Module
  - Component
- **Links**
  - Inner
  - Outer (Requests)
  - DTO
- **Additional**
  - Details (List).

#### Application

It's a whole application within a microservice. Can include **Modules** or **Components**.

```
        App
┌------------------┐
╎                  ╎
└------------------┘
```

#### Module

It can be specific module like in a NestJS application or just virtual module by grouping **Components** of a specific domain.

```
┌──────────────────┐
│      Module      │
├──────────────────┤
│                  │
│                  │
└──────────────────┘
```

#### Component

Basically **Component** is a class that represents a part of a module, e.g., `UsersController`.

```
┌───────────────────┐
│   **Component**   │
└───────────────────┘
```

Additional information can be provided inside:

```
┌────────────────────────────┐
│ **Component**   Controller │
│                            │
│  Component description...  │
└────────────────────────────┘
```

#### Inner Link

**Inner Link** implies any internal connection between **Components**. Arrow means an internal call and points to the **Component** whose function or method is called.

```
────────>
─────────
```

#### Outer Link

```
-------->
---------
```

**Outer Link** means a network connection or a network call from or into a **Component**, e.g., HTTP request, RMQ message, SQL query, etc. Arrow shows the direction of a call. Can be between two **Components** (typically of two different **Applications**) or a **Component** and outer application or API.

Examples:

```
      HTTP      ┌─────────────────────────┐
--------------->│   **UsersController**   │
   get_users    └─────────────────────────┘
```

```
┌────────────────────────┐       HTTP
│   **WeatherService**   │----------------->   Outer Weather API
└────────────────────────┘   get_weather
```

#### DTO

DTO means a class or other data structure that represents the transferring data.

```
╭───────────────╮
│ CreateUserDto │
╰───────────────╯
```

Additionally, a type can be specified besides the name (e.g., `Event`, `Query`, `Command`):

```
╭───────────────────────╮
│ CreateUserDto   Query │
╰───────────────────────╯
```

Example:

```
┌─────────────────────────┐     ╭───────────────╮     ┌──────────────────────┐
│   **UsersController**   ├─────┤ CreateUserDto ├────>│   **UsersService**   │
└─────────────────────────┘     ╰───────────────╯     └──────────────────────┘
```

#### Details (List)

Can be used to provide any list-based information, e.g., table structure, object fields, available methods, etc.

```
┌────────────┐
│    Get     │
├────────────┤
│    List    │
├────────────┤
│    Send    │
└────────────┘
```
