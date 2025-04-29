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
- **Asynchronous Request-Response** — One service sends a request to a service, which replies asynchronously. The sender doesn't block while waiting.
- **One-way Notifications** — One service sends a request to a service and doesn't expect any response.

#### One-to-many

- **Publish/Subscribe** — One service publishes a notification message, which is consumed by zero or more interested services.
- **Publish/Async Responses** — One service publishes a request message and then waits for a certain amount of time for responses from interested services.
