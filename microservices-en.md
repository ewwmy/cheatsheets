# Microservices

## Notation

[C4 model](https://c4model.com/) is a commonly used notation system but might be redundant.

### Improved Notation

- **Basics**:
  - Application
  - Module
  - Component
- **Links**:
  - Inner
  - Outer (Requests)
  - DTO
- **Additional**:
  - Details (List)

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

### Monolithic Architecture

#### Pros

- Easy to develop (at start).
- Easy to test (at start).
- Easy to deploy.
- Easy to scale.

#### Cons

- Long way from commit to deploy (each step becomes longer due to higher whole application size and complexity).
- Build can be slow (needs to build the whole application).
- Horizontal scaling requires more resources (one module may require more memory but other module may require more CPU).
- As an application grows it may lead to higher coupling.
- As tech stack becomes obsolete it's hard to replace it with other overall the application (even just upgrading framework or version of programming language can be challenging).

### Microservices

#### Pros

- Fast way from commit to deploy (for distinct microservice).
- Fast build (for distinct microservice).
- More efficient horizontal scaling.
- Tech stach can be changed for each microservice independently.
- High durability (the whole service can remain working even if one or more microservices are down).
- Easy to maintain (no need to keep the entire architecture in mind).
- More Agile-friendly.

#### Cons

- Sophisicated decomposition (wrong decomposition may cost a lot).
- Complicated deploy (requires DevOps, CI/CD knowledge).
- Hard to maintain consistency of the whole application (requires strict contracts and asynchronous calls between microservices).
  - It also may cause worse performance as the data is transferred via network between microservices.
- More complicated logging and monitoring.

### What to choose?

#### Monolithic

- Small pet project.
- Small team.
- Requirements are not clear / Startup.
- No DevOps team.

#### Microservices

- Sophisicated project with clear requirements, ready to scale.
- Strong team.
- Educational purpose / Practicing microservices.

### Scalability

#### Horizontal (scale out)

Scaling horizontally (out/in) means adding or removing nodes, such as adding a new computer to a distributed software application. An example might involve scaling out from one web server to three.

#### Vertical (scale up)

Scaling vertically (up/down) means adding resources to (or removing resources from) a single node, typically involving the addition of CPUs, memory or storage to a single computer.

### Scaling Monolithic

#### Simple Load Balancer

```
                              │
                              │ Request
                              V
                        Load Balancer
                              │ *
        ┌─────────────────────┼──────────────────────────┐
        │                     │                          │
        V                     V                          V
┌────────────────┐   ┌─────────────────┐         ┌────────────────┐
│   Monolith 1   │   │   Monolith 2    │   ...   │   Monolith N   │   Instances of the same app
└────────────────┘   └─────────────────┘         └────────────────┘
        │                     │                          │
        └─────────────────────┼──────────────────────────┘
                              │
                              V
                      ┌──────────────┐
                      │   Database   │
                      └──────────────┘
```

#### Content Balancer

```
                              │
                              │ Request
                              V
                        Load Balancer
                              │
        ┌─────────────────────┼──────────────────────────┐
        │ /a/*                │ /b/*                     │ /z/*
        V                     V                          V
┌────────────────┐   ┌─────────────────┐         ┌────────────────┐
│   Monolith 1   │   │   Monolith 2    │   ...   │   Monolith N   │   Instances of the same app
└────────────────┘   └─────────────────┘         └────────────────┘
        │                     │                          │
        └─────────────────────┼──────────────────────────┘
                              │
                              V
                      ┌──────────────┐
                      │   Database   │
                      └──────────────┘
```

### Scaling Microservices

#### Functional scaling

```
                              │
                              │ Request
                              V
                            Router
                              │
        ┌─────────────────────┼──────────────────────────┐
        │ /a/*                │ /b/*                     │ /z/*
        V                     V                          V
┌────────────────┐   ┌─────────────────┐         ┌────────────────┐
│     App 1      │   │      App 2      │   ...   │     App N      │
└────────────────┘   └─────────────────┘         └────────────────┘
        │                     │                          │
        └─────────────────────┼──────────────────────────┘
                              │
                              V
                      ┌──────────────┐
                      │   Database   │
                      └──────────────┘
```

#### Mixed (Functional / Load) scaling

```
                              │
                              │ Request
                              V
                            Router
                              │
        ┌─────────────────────┼───────────────────────────┐
        │ /a/*                │ /b/*                      │ /z/*
        V                     V                           V
┌────────────────┐   ┌─────────────────┐         ┌───────┐ ┌───────┐
│                │   │                 │         │ App N │ │ App N │
│     App 1      │   │      App 2      │   ...   └───────┘ └───────┘
│                │   │                 │         ┌───────┐ ┌───────┐
└────────────────┘   └─────────────────┘         │ App N │ │ App N │
        │                     │                  └───────┘ └───────┘
        │                     │                           │
        └─────────────────────┼───────────────────────────┘
                              │
                              V
                      ┌──────────────┐
                      │   Database   │
                      └──────────────┘
```

### Decomposition

#### Service

**Service** (**Microservice**) is a separable application which is a part of the main application that is responsible for a certain task (or set of tasks) and can function independently.

#### Properties of a Service

- Least coupling with other services.
- Adequate size:
  - Avoid too small microservices that are responsible for just an inadequately tiny task (e.g., **Users**, **Roles**, **UserSync**, **UserAccessRules**) as well as too large microservices (e.g., god-like microservice).
- Not changing contracts with other services.

#### Interactions with a Service

##### Input

- **Command**: a request that **changes** the state of the service (e.g., create post).
- **Query**: a request that does **not** change the state of the service (e.g., get last 10 posts).

##### Output

- **Event**: a message that informs other services of the state change.

> Input and Output of a Service can be considered as public API (or contract) of the service.

#### How to Decompose?

##### Non-team related Decomposition

- Business tasks (e.g., **Calculations**, **Users**).
- Domain (e.g., **Payments**, **Incomes**, **Buyers**, **Sellers**).

##### Team related Decomposition

Each team can create microservices that are responsible for the team proficiency (typically by business tasks).

### Decomposition algorithm

1. Determine **User Stories** and list used **Nouns**.
2. According to the listed **Nouns** from **User Stories** determine functional **Blocks** and relations between them.
3. Group functional **Blocks** into **Services** based on their **Domains**. Ideally, one **Service** should reflect one **Domain**.
4. Revise **Services** (e.g., group small related **Services** together into one **Service** to avoid redundancy).

#### 1. Determine User Stories

Template of a User Story:

> I am ..., want ..., (to ...).

or

> As a ... I want ... (to ...).

Example:

- As a **Student** I want to:

  - Register and buy a desired **Course**.
  - Watch **Videos**, pass **Tests**, and watch the **Progress**.
  - Leave **Reviews** about passed courses.
  - Subscribe to **Newsletters** about new courses.

- As a **Teacher** I want to:

  - Create **Courses**, **Tests**, and upload **Table of contents** of the courses.
  - Upload **Images** and **Videos** for **Lessons**.
  - Add new **Posts** to the **Blog** and send **Newsletters**.
  - Accept **Payments** for **Courses**.
  - Send **Email Notifications**.

At this step it's important to determine the nouns:

- Student
- Payment (as a student wants to buy a course and a teacher needs to get the money, we need to proceed payments)
- Course
- Test
- Progress
- Video
- Review
- Subscription (to newsletters)
- Teacher
- Table of contents (for a course)
- Image
- Blog
- Notification

#### 2. Determine functional Blocks and relations between them

```
              Authentication
                    │
        ┌───────────┴───────────┐
        │                       │
Student Profile            Teacher Profile
        │                       │
        └───────────┬───────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
     Payment                  Course
                                │
                    ┌───────────┴───────────┐
                    │                       │
                  Lesson                 Review

Post ────── Subscription

File   Newsletter
```

> Links between blocks mean closely related entities but not necessarily imply real relations in terms of software development or database development.

#### DDD

**Domain-Driven Design (DDD)** is a software development approach based on modeling the domain. A domain is a specific area of knowledge and processes that the software reflects. Each domain has clear boundaries, which are called a **Bounded Context**.

#### 3. Group functional Blocks into Services based on their Domains

- Student Profile + Authentication → **Users**
- Teacher Profile + Authentication → **Teachers**
- Payment → **Payments**
- File → **Files**
- Course + Lesson → **Course**
- Review → **Review**
- Post + Subscription → **Blog**
- Newsletter → **Email**

#### 4. Revise Services

- **Users** + **Teachers** → **Accounts** (the only difference is a flag)
- **Course** + **Review** → **Course** (reviews are only for courses, therefore it's a part of a course)
- **Blog** - Subscription → **Blog** (subscription is more likely related to the newsletters)
- **Email** + Subscription → **Email**

Therefore, as the result, we have the following **Services**:

- **Accounts**
- **Payments**
- **Files**
- **Course**
- **Blog**
- **Email**

> Note: These 4 steps might not the final representation of the architecture. It can change as the development goes.

## Monorepo

A **monorepo** is a software-development strategy in which the code for a number of projects (services) is stored in the same repository.

### Pros

- Easier code reuse.
- Shared contracts between projects without the need to publish them as separate NPM packages.
- Shared libraries.
- Centralized dependency management (can be a disadvantage in some cases).
- Centralized CI/CD pipelines (can be a disadvantage in some cases).
- Large-scale code refactoring.
- Collaboration across teams.

### Cons

- Loss of version segregation.
- Slower performance of IDE and VCS.
- Lack of per-project access control.
- Often limited to only one programming language.

### When to use monorepo

- 5-10 projects.
- Shared contracts / libraries are needed.
- A single programming language / framework across projects.

### Monorepo tools for Node.js projects

- **Nx**
- **Lerna**: multiple dependencies, custom builders
- NPM / Yarn / pnpm workspaces
- Turborepo
- Rush

#### Nx

##### Pros

- Easy to use.
- Convenient CLI tools.
- Presets (plugins) for lots of frameworks.
- Ready for use configuration.

##### Cons

- Centralized dependencies (single `package.json` through all projects).
- Build through **webpack** only.

##### Structure of Nx project

```
📂 apps
  📂 project1                     Project root
    📂 src                        Source files of a project
      📂 app                      Application root (e.g., NestJS app root)
      📂 assets                   Application assets (if needed, e.g., email templates)
      📂 environments             ENV-files (default TS-files are not recommennded to use)
      📄 main.ts                  Main file (e.g., NestJS bootstrap file)
    📄 project.json               Project configuration (build, serve, lint, test, proxy, replace path, etc.)
    📄 tsconfig.app.json          Project-specific TSConfig files
    📄 tsconfig.json              Project-specific TSConfig files
  📂 project2                     Project root
  📂 project3                     Project root
📂 dist                           Built files (📂 dist + 📂 node_modules → Docker)
  📂 apps
    📂 project1                   Built files of a project
      📂 assets
      📄 main.js
      📄 main.js.map
    📂 project2                   Built files of a project
    📂 project3                   Built files of a project
📂 libs                           Shared libraries, interfaces, contracts
📂 node_modules
📂 tools                          Nx Tools
  📂 generators
  📄 tsconfig.tools.json
📄 nx.json                        Nx Configuration
📄 package-lock.json
📄 package.json
📄 tsconfig.base.json             Base TSConfig for all project-specific TSConfigs
📄 workspace.json                 Projects and their folders
```

##### Create new shared library for interfaces (NestJS)

```bash
# Generate new shared module
nx g @nrwl/nest:lib interfaces

# Delete unnecessary module file and remove its export from index.ts
rm libs/interfaces/src/lib/interfaces.module.ts
echo "" > libs/interfaces/src/index.ts

# Manually create necessary interface
cat <<EOF > libs/interfaces/src/lib/user.interface.ts
export interface IUser {
  name: string
}
EOF

# Add exports from index.ts
cat <<EOF > libs/interfaces/src/index.ts
export * from './lib/user.interface'
EOF
```

Later in any place:

```typescript
import { IUser } from '@scope-name/interfaces' // This path alias is automatically defined in tsconfig.base.json
```

##### Generate new NestJS modules, services, controllers

```bash
nx g module app/user --project=project1
nx g service app/user --project=project1
nx g controller app/user --project=project1
```

#### Lerna

##### Pros

- Multiple dependencies (separate `package.json` for each project).
- Custom builders.

##### Cons

- Hard to configure.

## Microservices Communication

- Communication styles and dimentions (1-1, 1-\*).
- Simple communication (HTTP).
- Broker-based communication (asynchronous).
- Reducing synchronous communication.

### Communication Styles

|              | 1-1                                                      | 1-\*                                           |
| ------------ | -------------------------------------------------------- | ---------------------------------------------- |
| Synchronous  | Request/Response                                         | —                                              |
| Asynchronous | Asynchronous Request/Response <br> One-way Notifications | Publish/Subscribe <br> Publish/Async Responses |

#### Sync / Async

- **Synchronous** — The sender expects a timely response from the service and might even block while it waits.
- **Asynchronous** — The sender doesn't block, and the response, if any, isn't necessarily sent immediately.

#### One-to-one

- **Request/Response** — One service sends a request to a service and waits for a response. The sender can block while waiting. This is an interaction style that generally results in services being tightly coupled.
- **Asynchronous Request/Response** — One service sends a request to a service, which replies asynchronously. The sender doesn't block while waiting.
- **One-way Notifications** — One service sends a request to a service and doesn't expect any response.

#### One-to-many

- **Publish/Subscribe** — One service publishes a notification message, which is consumed by zero or more interested services.
- **Publish/Async Responses** — One service publishes a request message and then waits for a certain amount of time for responses from interested services.

### Data Formats

#### Plain Text

> `JSON` `XML`

- Easy to read.
- Back compatibility:
  - We can safely add a new JSON field and it will work.

#### Binary

> `Protobuf`

- Compact.
- Strict types:
  - No back compatibility.
- Better for high-load.

### Contracts

> **Contract** is an agreed structure of a request and a response between certain microservices.

- JSON Schema.
- TypeScript classes.
- TypeScript interfaces.
- etc.

> Better to use typed contracts (with TypeScript, Golang, Java, C#, etc.). It adds compile-time type-checking which prevents incompatibility errors after updates.

#### Example

```typescript
export class Request {
  @IsString()
  login: string

  @IsString()
  password: string
}
```

￬

```
Service
```

￬

```typescript
export class Response {
  access_token: string
}
```

#### Sharing Contracts

- Shared libraries (in case of monorepo).
- Published NPM packages.

### Transport

#### Sync

- **HTTP**
  - Easy to generate documentation
  - Service have to be available
- **gRPC**
  - More optimized

#### Async

- **RabbitMQ**
  - IMQP Protocol
  - High capacity
  - Variety of queue pattenrs
- **Kafka**
  - Durable
  - Message reprocessing
  - Lower performance
- **Redis**
  - In-memory database
  - Can work with queues with **Redis Pub/Sub**
  - Simple queue
  - Fast

### Synchronous Communication

#### Problems

- Poor **Availability**:
  - The whole application can fail if one of the services is down.
  - Tight coupling of the services causes reducing the total availability of the application (failure probabilities multiply).
- Complicated **Service Discovery**:
  - Each service should know IP addresses / ports / credentials of other services.

#### Solving Problems

##### Poor Availability

- Set a **timeout** for outgoing requests.
- Set a **limit** on the number of **active (in-flight) requests** — i.e., requests that have been sent and are still awaiting a response.

> If the timeout is exceeded or the number of active requests reaches the configured limit, the service should **fail fast** and return a `503 Service Unavailable` response without attempting to send more requests.

```
┌───────────────────────────────────────┐             ┌───────────────┐
│               ┌──────────────────────┐│   Timeout   │               │
│   Service 1   │ Middleware / Limiter ││------------>│   Service 2   │
│               └───────────┬──────────┘│             │               │
└───────────────────────────┼───────────┘             └───────────────┘
                            │
                    Fail fast if limit
                    of active requests
                    is reached
```

##### Complicated Service Discovery

- Client-Side Registration (Self-Register)
- Platform-Managed Registration (Auto-Register)

###### Client-Side Registration

> Each service is responsible for registering itself with a third-party service registry.

```
┌─────────┐             ┌──────────────┐
│   API   │------------>│   Payments   │
└────┬────┘             └───────┬──────┘
     │                          │
     V                          V
┌──────────────────────────────────────┐
│ Registry                             │
│                                      │
│ 10.12.34.102 payments                │
│ 10.12.34.103 users                   │
│ ...                                  │
└──────────────────────────────────────┘
```

Implementations:

- Apache ZooKeeper
- Consul

###### Platform-Managed Registration

> The orchestration platform manages service registration and routing automatically.

Implementations:

- Kubernetes
- Docker / Docker Swarm

#### When to use Synchronous Communication

- Small number of loosely coupled services
- Low request frequency
- Services run as single instances or behind a simple load balancer
- Real-time (immediate) response is required
- Service discovery is available
- Advantage of HTTP documentation and tooling (e.g., Swagger).

### Broker-Based (Asynchronous) Communication

> A broker is a middleware component that enables services to exchange messages asynchronously via queues or topics. It handles message delivery, buffering, and routing between producers and consumers.

```
┌─────────────────┐                       ┌─────────────────┐
│       API       ├-----------╳----------˃│    Payments     │
├─────────────────┤                       ├─────────────────┤
│       Lib       │                       │       Lib       │
└────────┬────────┘                       └─────────────────┘
         │                                         ˄
         │                 Broker                  │
         │        ┌───────────────────────┐        │
         └───────˃│        Channel        ├────────┘
                  └───────────────────────┘
                      📨 [Header, Body]
```

#### Broker-Based Communication Styles

##### Asynchronous Request/Response

```
             📨 [Header (correlationId), Body]
                  ┌───────────────────────┐
         ┌────────┤     Reply Channel     │˂───────┐
         │        └───────────────────────┘        │
         ˅                                         │
┌─────────────────┐                       ┌────────┴────────┐
│       API       │                       │    Payments     │
└────────┬────────┘                       └─────────────────┘
         │                                         ˄
         │        ┌───────────────────────┐        │
         └───────˃│    Request Channel    ├────────┘
                  └───────────────────────┘
        📨 [Header (correlationId, replyChannel), Body]
```

- `correlationId` — a unique value used to relate a response to its original message.
- `replyChannel` — the name of the channel where the response should be sent.

##### One-way Notifications

```
┌─────────────────┐                       ┌─────────────────┐
│     Course      │                       │    Payments     │
└────────┬────────┘                       └─────────────────┘
         │                                         ˄
         │        ┌───────────────────────┐        │
         └───────˃│    Request Channel    ├────────┘
                  └───────────────────────┘
                      📨 [Header, Body]
```

##### Publish/Subscribe

```
┌─────────────────┐                       ┌─────────────────┐
│     Course      │                       │    Payments     │
└────────┬────────┘                       └─────────────────┘
         │                                         ˄
         │      ┌───────────────────────────┐      │
         └─────˃│    CourseEvent Channel    ├──────┤
                └───────────────────────────┘      │
                      📨 [Header, Body]            ˅
                                          ┌─────────────────┐
                                          │  Notifications  │
                                          └─────────────────┘
```

##### Publish/Async Responses

```
                📨 [Header (correlationId, author), Body]
                    ┌────────────────────────────────┐
         ┌──────────┤    CourseEvent ReplyChannel    │˂────────┐˂──────────────┐
         │          └────────────────────────────────┘         │               │
         ˅                                                     │               │
┌─────────────────┐                                   ┌────────┴────────┐      │
│     Course      │                                   │    Payments     │      │
└────────┬────────┘                                   └─────────────────┘      │
         │                                                     ˄               │
         │            ┌───────────────────────────┐            │               │
         └───────────˃│    CourseEvent Channel    ├────────────┤               │
                      └───────────────────────────┘            │               │
            📨 [Header (correlationId, replyChannel), Body]    ˅               │
                                                      ┌─────────────────┐      │
                                                      │  Notifications  ├──────┘
                                                      └─────────────────┘
```

- `correlationId` — a unique value used to relate a response to its original message.
- `replyChannel` — the name of the channel where responses should be sent.
- `author` — the name of the responding service (e.g., `Payments`, `Notifications`).

#### Advantages

- **Loose coupling** between services.
  - Services communicate indirectly through the broker, so they don’t need to know about each other’s existence, implementation details, or availability. This reduces dependencies and improves modularity.
- **Message buffering.**
  - The broker acts as a buffer: it stores messages if the consumer is busy, slow, or temporarily unavailable. This prevents message loss and helps balance the load.
- Support for **different communication patterns**.
  - Broker-based systems allow for various messaging patterns (one-to-one, one-to-many, with or without responses). This provides flexibility in how services interact.
- Message **persistence** (optional).
  - Brokers can save messages to disk, ensuring reliability. Even if a service crashes or restarts, the messages won't be lost and can still be delivered once the system recovers.

#### Problems

- **Complicated** logic when working with **multiple service instances**.
- **Message duplication** in case of crashes
  - For example, if an in-flight message was delivered but the broker didn't receive an acknowledgment due to a crash, it may redeliver the message.
- **Transactional messaging**.
  - For example, ensuring both a database write and message publish happen atomically.

#### Solving Problems

##### Multiple Service Instances

- Use the **Round Robin** algorithm to distribute messages between instances:

```
┌─────────────────┐                         ┌────────────────┐
│     Course      │                         │   Payments/1   │
└────────┬────────┘                         └────────────────┘
         │                                         ˄
         │      ┌───────────────────────────┬──────┴──────┐
         └─────˃│    CourseEvent Channel    | Round Robin │
                └───────────────────────────┴──────┬──────┘
                                                   ˅
                                            ┌────────────────┐
                                            │   Payments/2   │
                                            └────────────────┘
```

> Be cautious with multiple instances — they require coordination to avoid duplicated cron jobs, race conditions in timers, etc.

##### Message Duplicates

- Use `ACK` / `NACK` flags to indicate whether a message was processed successfully.
- When a message is received, check whether the required action has already been performed. If so, skip the message to avoid performing it twice.

##### Transactional Messaging

- Use the **Outbox Pattern**:

```
          ┌─────────────────┐
          │     Course      │
          └────────┬────────┘
                   │
-------------------│----------------------------------
                   │ Transaction
      ┌────────────┴────────────┐
      ˅                         ˅
┌──────────┐              ┌────────────┐   Database
│   Data   │              │   Outbox   │
└──────────┘              └────────────┘
                                ˄
--------------------------------│---------------------
                                │ Pick message to send
                    ┌───────────┘
                    ˅
            ┌────────────────┐       ┌───────────────────────────┐
            │   Broker Lib   ├──────˃│    CourseEvent Channel    │
            └────────────────┘       └───────────────────────────┘
```

> The `Outbox` is a dedicated table that stores messages to be sent. It ensures consistency between local database operations and external message publishing, preventing cases where a record is saved (for example, in `Data` table) but the message is lost.

### Minimizing Synchronous Communication

#### Problem

```
                                     Check whether
        Buy                           the course
    the course   ┌───────────────┐   is not bought   ┌───────────────┐
────────────────►│      API      ├──────────────────►│    Account    │
                 └───────┬───┬───┘                   └───────────────┘
                         │   │           Get
                         │   │          price        ┌───────────────┐
                         │   └──────────────────────►│    Course     │
                         │                           └───────────────┘
                         │               Get
                         │            payment ID     ┌───────────────┐
                         └──────────────────────────►│    Payment    │
                                                     └───────────────┘

Legend:
  ──────────► Synchronous call
```

1. Buy the course.
2. Check whether the course is not bought.
3. Get price.
4. Get payment ID.

If any service fails, the entire client request fails — just like in a monolithic system.

#### Solution

```
                                     Check whether
       Buy                             the course
   the course    ┌───────────────┐   is not bought   ┌───────────────┐
────────────────►│      API      ├------------------►│    Account    │
◄────────────────┤               │                   │               │
   Immediately   └───────┬───┬───┘                   └───────────────┘
  respond with           ╎   ╎           Get
  a purchase ID          ╎   ╎          price        ┌───────────────┐
                         ╎   └----------------------►│    Course     │
   Periodically          ╎                           └───────────────┘
 check the status        ╎               Get
 of payment by the       ╎            payment ID     ┌───────────────┐
 given purchase ID       └--------------------------►│    Payment    │
────────────────────────────────────────────────────►│               │
                                                     └───────────────┘

Legend:
  ──────────► Synchronous call
  ----------► Asynchronous call
```

1. Buy the course.
2. Immediately respond with a purchase ID.
3. Periodically check the status of payment by the given purchase ID (through WebSocket or long polling).
4. Check whether the course is not bought (queued).
5. Get price (queued).
6. Get payment ID (queued).

This approach decouples services and improves resilience. The client receives an immediate response and isn't denied because of service delays or failures. As long as dependent services recover within allowed timeouts, the client request can still complete successfully.

## RabbitMQ

RabbitMQ can be run in [Docker](https://hub.docker.com/_/rabbitmq). For development / learning purpose it's recommended to use images with the `*-management` suffix in tag, which means the image contains **web interface** (username `guest`, password `guest` by default).

Example of `docker-compose` file to run RabbitMQ:

```yaml
services:
  rmq:
    image: rabbitmq:4.1-management
    restart: always
    ports:
      - '15672:15672'
      - '5672:5672'
```

### Under the Hood

#### General Scheme

```
                                             ┌──────────────┐     ┌──────────────┐
                                        ┌───►│ Queue        ├────►│ Consumer     │
                                        │    └──────────────┘     └──────────────┘
┌──────────────┐     ┌──────────────┐   │
│ Publisher    ├────►│ Exchannge    ├───┤
└──────────────┘     └──────────────┘   │
                                        │    ┌──────────────┐     ┌──────────────┐
                                        └───►│ Queue        ├────►│ Consumer     │
                                             └──────────────┘     └──────────────┘
```

#### Terms

- **Publisher** — sends messages to the **exchange**.
- **Exchange** — routes messages to one or more **queues** based on rules.
- **Queue** — holds messages until they're consumed.
- **Consumer** — receives and processes messages from a queue.
- **Routing Key** — a string specified by the **publisher** for the message and used by the **exchange** to route the message to the appropriate **queues**, based on the predefined **bindings**.
- **Binding** — a rule that links an **exchange** to a **queue**, using a **routing key**.
- **Channel** — a lightweight path over a connection to send or receive messages.
  - **Prefetch Count** — limits the number of unacknowledged messages a **consumer** can receive at a time, ensuring it doesn't get overwhelmed.
- **Connection** — a TCP link between the client and the message broker.

#### Delivery and Routing Properties

- Delivery tag
- Redelivered
- Exchange
- **Routing key**
- Consumer tag

#### Message Structure

- Properties
  - Headers
- Payload (Body)

#### Message Properties

| Property         | Type                | Description                                                                                             | Required? |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------------------- | --------- |
| Delivery mode    | Enum (1 or 2)       | 2 for `persistent`, 1 for `transient`. Some client libraries expose this property as a boolean or enum. | Yes       |
| Type             | String              | Application-specific message type, e.g. "orders.created"                                                | No        |
| Headers          | Map (string => any) | An arbitrary map of headers with string header names                                                    | No        |
| Content type     | String              | Content type, e.g. `application/json`. Used by applications, not core RabbitMQ                          | No        |
| Content encoding | String              | Content encoding, e.g. `gzip`. Used by applications, not core RabbitMQ                                  | No        |
| Message ID       | String              | Arbitrary message ID                                                                                    | No        |
| Correlation ID   | String              | Helps correlate requests with responses, see [tutorial 6](https://www.rabbitmq.com/tutorials)           | No        |
| Reply To         | String              | Carries response queue name, see [tutorial 6](https://www.rabbitmq.com/tutorials)                       | No        |
| Expiration       | String              | [Per-message TTL](https://www.rabbitmq.com/docs/ttl)                                                    | No        |
| Timestamp        | Timestamp           | Application-provided timestamp                                                                          | No        |
| User ID          | String              | User ID, [validated](https://www.rabbitmq.com/docs/validated-user-id) if set                            | No        |
| App ID           | String              | Application name                                                                                        | No        |

#### Message Payload

Can be any type of data, either plain text or binary.

```json
{
  "email": "abc@example.com",
  "name": "Abc"
}
```

#### Getting Messages

> **Warning**: Getting messages from a queue is a destructive action, meaning once the message is consumed, it is no longer available in the queue unless it is explicitly **nacked**.

##### Message Statuses

- **Ready** — message is published and waiting to be delivered.
- **Unacked** — message has been delivered to a consumer but not yet acknowledged.
- **Acked** — message has been acknowledged and removed from the queue.
- **Dead-lettered** — message has been rejected, expired, or failed and is moved to a Dead Letter Exchange (DLX).

##### Actions on Messages

- **Publish** — send a new message to a queue.
- **Ack** — acknowledge a message as successfully processed; it will be removed from the queue.
- **Nack** — negative acknowledgment. The message can be requeued or dead-lettered depending on the settings.
- **Reject** — similar to nack, but typically used for a single message.
- **Requeue** — return the message to the queue to be redelivered later.

#### Queue Properties

- **Name**
- **Durable** — the queue will survive a broker restart.
- **Exclusive** — used by only one connection and the queue will be deleted when that connection closes.
- **Auto-delete** — queue that has had at least one consumer is deleted when last consumer unsubscribes.
- **Arguments** — optional; used by plugins and broker-specific features such as message TTL, queue length limit, etc.

> Note: Messages will be stored on disk only if they are marked as **persistent**.

#### Asynchronous Request/Response Implementation

```
                                           ╎ properties: { correlation_id: 1 }
                                           ╎ payload: { response }
                       ┌───────────────┐   ╎
        ┌──────────────┤  ReplyQueue   │◄──┴─────────────────────────────────┐
        │              └───────────────┘                                     │
        │                  Exclusive                                         │
        │                                 ╎ binding: my_route                │
        ▼                                 ╎                                  │
┌───────────────┐      ┌───────────────┐  ╎   ┌───────────────┐      ┌───────┴───────┐
│   Publisher   ├──┬──►│   Exchange    ├──┴──►│     Queue     ├─────►│   Consumer    │
└───────────────┘  ╎   └───────────────┘      └───────────────┘      └───────────────┘
                   ╎
                   ╎ routing_key: my_route
                   ╎ properties: { correlation_id: 1, reply_to: 'ReplyQueue' }
                   ╎ payload: { request }
```

#### Publish/Subscribe Implementation

```
                                                ╎ binding: my_event
                                                ╎
                                                ╎   ┌───────────────┐      ┌───────────────┐
                                             ┌──┴──►│    Queue 1    ├─────►│   Consumer    │
                                             │      └───────────────┘      └───────────────┘
┌───────────────┐      ┌───────────────┐     │
│   Publisher   ├──┬──►│   Exchange    ├─────┤
└───────────────┘  ╎   └───────────────┘     │
                   ╎                         │      ┌───────────────┐      ┌───────────────┐
                   ╎ routing_key: my_event   └──┬──►│    Queue 2    ├─────►│   Consumer    │
                   ╎ payload: { info }          ╎   └───────────────┘      └───────────────┘
                                                ╎
                                                ╎ binding: my_event
```

### Exchange Types

- Direct
- Topic
- Fanout
- Headers

#### Direct

Routes to one or more bound queues, streams or exchanges using an **exact equivalence** of a binding's **routing key**.
For example, a **routing key** `my.event` will match `my.event` binding key only.

#### Topic

Uses pattern matching of the message's **routing key** to the binding key **pattern**:

- `*` — any word
- `#` — any amount of words or empty

For example, a **routing key** `my.event` will match the patterns:

- `my.*`
- `*.event`

#### Fanout

Routes a copy of every message to **every queue**, stream or exchange bound to it. The message's **routing key** is competely **ignored**.

#### Headers

Routes a message by matching the **headers** of the message to bindings' headers. The message's **routing key** is competely **ignored**.

For example, a message with `format=pdf, type=report` will only match to `format=pdf, type=report` and will not match to `format=bin, type=report` bindings' headers.

#### Other Exchange Types

##### Default

The default exchange is a **direct exchange** that has several special properties:

- It always exists (is pre-declared).
- Its name for AMQP 0-9-1 clients is an empty string — `""`.
- When a queue is declared, RabbitMQ will automatically bind that queue to the **default exchange** using the **queue name** as the **routing key**.

##### Dead Letter

Messages from a queue can be "dead-lettered", which means these messages are republished to an exchange when any of the following events occur:

- The message is [negatively acknowledged](https://www.rabbitmq.com/docs/confirms) by an AMQP 1.0 receiver using the [`rejected`](https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-messaging-v1.0-os.html#type-rejected) outcome or by an AMQP 0.9.1 consumer using `basic.reject` or `basic.nack` with `requeue` parameter set to `false`.
- The message expires due to [per-message TTL](https://www.rabbitmq.com/docs/ttl).
- The message is dropped because its queue exceeded a [length limit](https://www.rabbitmq.com/docs/maxlength).
- The message is returned more times to a quorum queue than the [delivery-limit](https://www.rabbitmq.com/docs/quorum-queues#poison-message-handling).

If an entire [queue expires](https://www.rabbitmq.com/docs/ttl#queue-ttl), the messages in the queue are **not** dead-lettered.

##### `amq.rabbitmq.trace`

`amq.rabbitmq.trace` is used by the [message tracing mechanism](https://www.rabbitmq.com/docs/firehose).

### Bindings

**Bindings** define the relationship between an **exchange** and a **queue**, using a **routing key** to control which messages should go to which queues.

> They act like rules. Messages with **routing key** `X` go to **queue** `A`.

#### Example

Bindings for `OrderEvents` exchange (type: `direct`):

| Routing key       | Queue             |
| ----------------- | ----------------- |
| `order.placed`    | `RestaurantQueue` |
| `order.placed`    | `DeliveryQueue`   |
| `order.delivered` | `MarketingQueue`  |

A message with routing key `order.placed` goes to:

- `RestaurantQueue` — so the kitchen can start preparing the order
- `DeliveryQueue` — to assign a courier

A message with routing key `order.delivered` goes only to:

`MarketingQueue` — to trigger a follow-up email with a discount or feedback form

### Example

```bash
npm init -y
npm i amqplib

touch publisher.js
touch consumer.js
touch docker-compose.yml
```

`package.json`:

```json
{
  ...
  "type": "module",
  ...
}

```

`docker-compose.yml`:

```yaml
services:
  rmq:
    image: rabbitmq:4.1-management
    restart: always
    ports:
      - '15672:15672'
      - '5672:5672'
```

#### Simple Example (Publish/Subscribe)

`publisher.js`:

```javascript
import { connect } from 'amqplib'

const run = async () => {
  try {
    // create a connection
    const connection = await connect('amqp://localhost')

    // create a channel within the connection
    const channel = await connection.createChannel()

    // create an exchange (if was not created)
    await channel.assertExchange('my-exchange', 'topic', { durable: true })

    // publish a message to the exchange with 'my.command' routing key
    channel.publish('my-exchange', 'my.command', Buffer.from('Hello, world!'))
    // the message will be `ready` after publishing
  } catch (e) {
    console.error(e)
  }
}

run()
```

`consumer.js`:

```javascript
import { connect } from 'amqplib'

const run = async () => {
  try {
    // create a connection
    const connection = await connect('amqp://localhost')

    // create a channel within the connection
    const channel = await connection.createChannel()

    // create an exchange (if was not created)
    await channel.assertExchange('my-exchange', 'topic', { durable: true })

    // create a queue
    const queue = await channel.assertQueue('my-queue', { durable: true })

    // bind the queue to the exchange via 'my.command' routing key
    await channel.bindQueue(queue.queue, 'my-exchange', 'my.command')

    // get messages
    channel.consume(queue.queue, message => {
      if (!message) {
        return
      }

      // read the message
      console.log(message.content.toString())
      // the message will be `unacked` after reading and `ready` again
      // if the consumer disconnects

      if (true) {
        // some logic here...

        // acknowledge the message to delete it from the queue
        channel.ack(message)
      }
    })
  } catch (e) {
    console.error(e)
  }
}

run()
```

Run:

```bash
# start rabbitmq
docker compose up -d
# web interface is available at http://localhost:15672/ (login: guest, password: guest)

# run consumer (will wait for messages)
node consumer.js

# run publisher (will send a message to the exchange and the consumer will read and acknowledge it)
node publisher.js

# consumer.js:
# Hello, world!

docker compose down
```

##### Auto-acknowledge messages

```javascript
// get messages
channel.consume(
  queue.queue,
  message => {
    if (!message) {
      return
    }

    // read the message
    console.log(message.content.toString())
  },
  {
    // auto-acknowledge the message
    noAck: true,
  }
)
```

#### Extended Example (Publish/Async Responses)

`publisher.js`:

```javascript
import { connect } from 'amqplib'

const run = async () => {
  try {
    // create a connection
    const connection = await connect('amqp://localhost')

    // create a channel within the connection
    const channel = await connection.createChannel()

    // create an exchange (if was not created)
    await channel.assertExchange('my-exchange', 'topic', { durable: true })

    // create a queue for the reply
    const replyQueue = await channel.assertQueue('', { exclusive: true })
    // - '' — generates unique name
    // - exclusive — only available for the current client (this publisher)
    // and will be deleted after the client disconnects

    // consume the reply message
    channel.consume(replyQueue.queue, message => {
      if (!message) {
        return
      }

      // read the reply message with its correlationId
      console.log(message.properties.correlationId, message.content.toString())

      // acknowledge the message to delete it from the queue
      channel.ack(message)
    })

    // publish a message to the exchange with 'my.command' routing key
    channel.publish('my-exchange', 'my.command', Buffer.from('Hello, world!'), {
      // set up the queue name for replies
      replyTo: replyQueue.queue,
      // set up the ID to match the response with the request
      correlationId: '123', // must be auto-generated in real projects
    })
    // the message will be `ready` after publishing
  } catch (e) {
    console.error(e)
  }
}

run()
```

`consumer.js`:

```javascript
import { connect } from 'amqplib'

const run = async () => {
  try {
    // create a connection
    const connection = await connect('amqp://localhost')

    // create a channel within the connection
    const channel = await connection.createChannel()

    // create an exchange (if was not created)
    await channel.assertExchange('my-exchange', 'topic', { durable: true })

    // create a queue
    const queue = await channel.assertQueue('my-queue', { durable: true })

    // bind the queue to the exchange via 'my.command' routing key
    await channel.bindQueue(queue.queue, 'my-exchange', 'my.command')

    // get messages
    channel.consume(queue.queue, message => {
      if (!message) {
        return
      }

      // read the message
      console.log(message.content.toString())

      // if the original message has the field `replyTo` (the name of the queue to accept replies)
      // we must reply to that queue directly
      if (message.properties.replyTo) {
        channel.sendToQueue(
          // use `replyTo` of the original message as the queue name to send the reply to
          message.properties.replyTo,
          Buffer.from('World says hi!'),
          {
            // pass `correlationId` of the original message to match the response with the request
            correlationId: message.properties.correlationId,
          }
        )

        // acknowledge the message to delete it from the queue
        channel.ack(message)
      }
    })
  } catch (e) {
    console.error(e)
  }
}

run()
```

Run:

```bash
# start rabbitmq
docker compose up -d
# web interface is available at http://localhost:15672/ (login: guest, password: guest)

# run consumer (will wait for messages)
node consumer.js

# run publisher (will send a message to the exchange and the consumer will read and acknowledge it)
node publisher.js

# consumer.js:
# Hello, world!

# publisher.js
# 123 World says hi!

docker compose down
```

#### Advanced Example (RPC over Queues)

`publisher.js`:

```javascript
import { connect } from 'amqplib'
import { randomUUID } from 'crypto'

const pendingResponses = new Map()

const run = async () => {
  try {
    // create a connection
    const connection = await connect('amqp://localhost')

    // create a channel within the connection
    const channel = await connection.createChannel()

    // create an exchange (if was not created)
    await channel.assertExchange('my-exchange', 'topic', { durable: true })

    // create a queue for the reply
    const replyQueue = await channel.assertQueue('', { exclusive: true })
    // - '' — generates unique name
    // - exclusive — only available for the current client (this publisher)
    // and will be deleted after the client disconnects

    // consume the reply message (listen once)
    channel.consume(replyQueue.queue, message => {
      if (!message) {
        return
      }

      // get the correlationId of the reply message
      const correlationId = message.properties.correlationId
      // get the resolve function for the reply message with the given correlationId
      const resolve = pendingResponses.get(correlationId)

      // if the resolve function is "callable"
      if (resolve) {
        // resolve the awaiting promise with the reply message content
        resolve(message.content.toString())
        // delete the Map item with the correlationId key
        pendingResponses.delete(correlationId)
      }

      // acknowledge the message to delete it from the queue
      channel.ack(message)
    })

    // function to send message and await response
    const sendMessage = content => {
      // generate a uinque correlationId
      const correlationId = randomUUID()

      // return a promise that will be resolved "on the reply read"
      return new Promise(resolve => {
        // copy the resolve function to the Map with the generated correlationId
        pendingResponses.set(correlationId, resolve)

        // publish a message to the exchange with the 'my.command' routing key
        channel.publish('my-exchange', 'my.command', Buffer.from(content), {
          // set up the queue name for replies
          replyTo: replyQueue.queue,
          // set up correlationId with the generated one
          correlationId,
        })
      })
    }

    // example usage
    const response = await sendMessage('Hello, world!')
    console.log('Got response:', response)
  } catch (e) {
    console.error(e)
  }
}

run()
```

`consumer.js`:

```javascript
import { connect } from 'amqplib'

const run = async () => {
  try {
    // create a connection
    const connection = await connect('amqp://localhost')

    // create a channel within the connection
    const channel = await connection.createChannel()

    // create an exchange (if was not created)
    await channel.assertExchange('my-exchange', 'topic', { durable: true })

    // create a queue
    const queue = await channel.assertQueue('my-queue', { durable: true })

    // bind the queue to the exchange via 'my.command' routing key
    await channel.bindQueue(queue.queue, 'my-exchange', 'my.command')

    // get messages
    channel.consume(queue.queue, message => {
      if (!message) {
        return
      }

      // read the message
      console.log(message.content.toString())

      // if the original message has the field `replyTo` (the name of the queue to accept replies)
      // we must reply to that queue directly
      if (message.properties.replyTo) {
        channel.sendToQueue(
          // use `replyTo` of the original message as the queue name to send the reply to
          message.properties.replyTo,
          Buffer.from('World says hi!'),
          {
            // pass `correlationId` of the original message to match the response with the request
            correlationId: message.properties.correlationId,
          }
        )

        // acknowledge the message to delete it from the queue
        channel.ack(message)
      }
    })
  } catch (e) {
    console.error(e)
  }
}

run()
```

Run:

```bash
# start rabbitmq
docker compose up -d
# web interface is available at http://localhost:15672/ (login: guest, password: guest)

# run consumer (will wait for messages)
node consumer.js

# run publisher (will send a message to the exchange and the consumer will read and acknowledge it)
node publisher.js

# consumer.js:
# Hello, world!

# publisher.js
# Got response: World says hi!

docker compose down
```

## Implementation

### Contracts

Contract:

- Where to send.
- What to send.
- What to receive.

#### Create Shared Contracts (NestJS)

```bash
# Generate new shared module to share contracts
nx g @nrwl/nest:lib contracts

# Delete unnecessary module file and remove its export from index.ts
rm libs/contracts/src/lib/contracts.module.ts
echo "" > libs/contracts/src/index.ts

# Create a structure for contracts: one service — one directory
mkdir libs/contracts/src/lib/accounts
mkdir libs/contracts/src/lib/payments
mkdir libs/contracts/src/lib/email
# ...

# Create contracts for a service: one contract — one *.ts file
touch libs/contracts/src/lib/accounts/account.login.ts
touch libs/contracts/src/lib/accounts/account.register.ts
```

Topic structure:

```
<to-service>.<command-name>.<command-type>
```

Command type:

- `command`
- `query`
- `event`

> Disable ESLint namespece restriction for TypeScript: `"@typescript-eslint/no-namespace": "off"`.

`libs/contracts/src/lib/accounts/account.login.ts`:

```typescript
// ...

export namespace AccountLogin {
  export const topic = 'account.login.command'

  export class Request {
    @IsEmail()
    email: string

    @IsString()
    password: string
  }

  export class Response {
    access_token: string
  }
}
```

`libs/contracts/src/lib/accounts/account.register.ts`:

```typescript
// ...

export namespace AccountRegister {
  export const topic = 'account.register.command'

  export class Request {
    @IsEmail()
    email: string

    @IsString()
    password: string

    @IsString()
    @IsOptional()
    displayName?: string
  }

  export class Response {
    email: string
  }
}
```

`libs/contracts/src/index.ts`:

```typescript
export * from './lib/accounts/account.login'
export * from './lib/accounts/account.register'
```

#### Contracts Usage

`apps/accounts/src/app/auth/auth.controller.ts`:

```typescript
// ...
@Controller()
export class AuthController {
  // ...

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(
    @Body() { email, password }: AccountLogin.Request
  ): Promise<AccountLogin.Response> {
    // ...
  }

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(
    @Body() dto: AccountRegister.Request
  ): Promise<AccountRegister.Response> {
    // ...
  }

  // ...
}
// ...
```

## API Design

### API Design Styles

- Microservices as API
- API Gateway
- GraphQL Gateway
- Backend for Frontend (BFF)

#### Microservices as API

> Each microservice provides its own public API. Microservices don't communicate with each other.

```
                                   /get-courses      ┌──────────────┐
                              ┌─────────────────────►│   Courses    │
                              │                      └──────────────┘
┌──────────────┐              │
│  Web client  ├─────────────►│
└──────────────┘              │
                              │  /get-paid-courses   ┌──────────────┐
                              ├─────────────────────►│   Payments   │
                              │                      └──────────────┘
┌──────────────┐              │
│  Mobile app  ├─────────────►│
└──────────────┘              │
                              │       /login         ┌──────────────┐
                              └─────────────────────►│    Users     │
                                                     └──────────────┘
```

##### Pros

- **Easy to implement** on the backend side.

##### Cons

- **Data aggregation** on a frontend side.
- **Logic duplication** on each frontend client.
- **Complicated authentication** and authorization (need for validation in every service).

##### Usecases

- Totally different domains of services (not intersected).

#### API Gateway

> Centralized API, that accepts requests from all the clients and routes them to the services.

```
                                                         get.courses      ┌──────────────┐
                                                   ┌─────────────────────►│   Courses    │
                                                   │                      └──────────────┘
┌──────────────┐                                   │
│  Web client  ├──┐                                │
└──────────────┘  │                                │
                  │ /get-my-courses  ┌─────────┐   │   get.paid.courses   ┌──────────────┐
                  ├─────────────────►│   API   ├───┼─────────────────────►│   Payments   │
                  │                  └─────────┘   │                      └──────────────┘
┌──────────────┐  │                                │
│  Mobile app  ├──┘                                │
└──────────────┘                                   │
                                                   │        login         ┌──────────────┐
                                                   └─────────────────────►│    Users     │
                                                                          └──────────────┘
```

##### Pros

- **Single entrypoint**.
- **Data aggregation** on the backend side.
- **No logic duplication**.
- **Pattern Command/Query (CQRS)**.

##### Cons

- API service tends to become thick because of logic concentration.

##### What to use API service for

- Authentication
- Rate limiting
- Caching
- Metric collection
- Logging

##### What to avoid in API service

- Complicated business logic

#### GraphQL Gateway

> Same as **API Gateway** but uses **GraphQL** service as an entrypoint.

#### Backend for Frontend (BFF)

> Each type of client has its own API gateway.

```
                                                      get.courses      ┌──────────────┐
                                                ┌─────────────────────►│   Courses    │
                                                │                      └──────────────┘
┌──────────────┐        ┌──────────────┐        │
│  Web client  ├───────►│   Web API    ├───────►│
└──────────────┘        └──────────────┘        │
                                                │   get.paid.courses   ┌──────────────┐
                                                ├─────────────────────►│   Payments   │
                                                │                      └──────────────┘
┌──────────────┐        ┌──────────────┐        │
│  Mobile app  ├───────►│  Mobile API  ├───────►│
└──────────────┘        └──────────────┘        │
                                                │        login         ┌──────────────┐
                                                └─────────────────────►│    Users     │
                                                                       └──────────────┘
```

##### Pros

- **Convenient for frontend**.
- All pros of **API Gateway**.

##### Cons

- **Logic duplication** on each API service.
- All cons of **API Gateway**.
