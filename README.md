# Test chat application using Prisma + tRPC
# Project template example created by [@alexdotjs](https://twitter.com/alexdotjs).

**This is really meant to teach me modern framework architecture and testing applications. Not to mention RPC seems pretty cool so here we are :p The final goal is to build an optimized real time chat application and learn more best practices.**
## Setup

**yarn:**
```bash
yarn create next-app --example https://github.com/trpc/trpc --example-path examples/next-prisma-starter trpc-prisma-starter
cd trpc-prisma-starter
yarn
yarn dx
```

**npm:**
```bash
npx create-next-app --example https://github.com/trpc/trpc --example-path examples/next-prisma-starter trpc-prisma-starter
cd trpc-prisma-starter
yarn
yarn dx
```


### Requirements

- Node >= 14
- Docker (for running Postgres)

## Development

### Start project

```bash
yarn create next-app --example https://github.com/trpc/trpc --example-path examples/next-prisma-starter trpc-prisma-starter
cd trpc-prisma-starter
yarn
yarn dx
```

### Commands

```bash
yarn build      # runs `prisma generate` + `prisma migrate` + `next build`
yarn db-nuke    # resets local db
yarn dev        # starts next.js
yarn dx         # starts postgres db + runs migrations + seeds + starts next.js 
yarn test-dev   # runs e2e tests on dev
yarn test-start # runs e2e tests on `next start` - build required before
yarn test:unit  # runs normal jest unit tests
yarn test:e2e   # runs e2e tests
```

## Deployment
Vercel eventually