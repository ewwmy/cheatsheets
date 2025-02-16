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

## Getting into Microservices

### Scalability

#### Horizontal (scale out)

Scaling horizontally (out/in) means adding or removing nodes, such as adding a new computer to a distributed software application. An example might involve scaling out from one web server to three.

#### Vertical (scale up)

Scaling vertically (up/down) means adding resources to (or removing resources from) a single node, typically involving the addition of CPUs, memory or storage to a single computer.

### Monolithic Architecture

#### Pros

- Easy to develop (at start)
- Easy to test (at start)
- Easy to deploy
- Easy to scale

#### Cons

- Long way from commit to deploy (each step becomes longer due to higher whole application size and complexity)
- Build can be slow (needs to build the whole application)
- Horizontal scaling requires more resources (one module may require more memory but other module may require more CPU)
- As an application grows it may lead to higher coupling
- As tech stack becomes obsolete it's hard to replace it with other overall the application (even just upgrading framework or version of programming language can be challenging).

### Microservices

#### Pros

- Fast way from commit to deploy (for distinct microservice)
- Fast build (for distinct microservice)
- More efficient horizontal scaling
- Tech stach can be changed for each microservice independently
- High durability (the whole service can remain working even if one or more microservices are down)
- Easy to maintain (no need to keep the entire architecture in mind)
- More Agile-friendly.

#### Cons

- Sophisicated decomposition (wrong decomposition may cost a lot)
- Complicated deploy (requires DevOps, CI/CD knowledge)
- Hard to maintain consistency of the whole application (requires strict contracts and asynchronous calls between microservices)
  - It also may cause worse performance as the data is transferred via network between microservices
- More complicated logging and monitoring.

### What to choose?

#### Monolithic

- Small pet project
- Small team
- Requirements are not clear / Startup
- No DevOps team.

#### Microservices

- Sophisicated project with clear requirements, ready to scale
- Strong team
- Educational purpose / Practicing microservices.
