# EventStoreDB starter project

This is a tiny Node.js project for learning the basics of EventStoreDB:

- start a local EventStoreDB instance with Docker
- append a couple of events to a stream
- read the events back from that stream

## Prerequisites

- Node.js
- Docker Desktop

## Install dependencies

```bash
npm install
```

## Start EventStoreDB

```bash
npm run db:up
```

The EventStoreDB UI will be available at:

- <http://localhost:2113>

## Run the sample

```bash
npm start
```

That writes two events into the stream `order-123-demo` and reads them back.

If you want a brand-new stream each run, use:

```bash
npm run start:fresh
```

## Stop EventStoreDB

```bash
npm run db:down
```

The setup uses plain `docker` commands, so you do not need Docker Compose installed.

## What to learn next

- use stream names per aggregate, like `order-123`
- model facts as events, such as `order-created` and `order-confirmed`
- rebuild state by replaying the stream
- add optimistic concurrency with a specific expected revision
