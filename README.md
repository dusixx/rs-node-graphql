## 🚀 Install

```sh
git clone git@github.com:dusixx/rs-node-graphql.git
cd rs-node-graphql
git checkout dev
npm ci
```

```sh
# Create .env file from .env.example
cp .env.example .env

# Apply db migrations
npx prisma migrate deploy

# Seed db
npx prisma db seed
```

## 🧪 Run tests

```sh
# Run all tests at once
npm test
```

```sh
# Ensure critical files remain unchanged
npm run test-integrity

# Run tests one by one
npm run test-queries
npm run test-mutations
npm run test-rule
npm run test-loader
npm run test-loader-prime
```

## 🟢 Node version

```sh
# package.json
"engines": {
  "node": ">=22.0.0"
}
# .npmrc
engine-strict=true
```

## 🟣 Useful things

- Start server: `npm run start`
- Database GUI: `npx prisma studio`
- Reset database: `npx prisma migrate reset` (includes seeding)
- Test REST API (Swagger): [[::1]:8000/docs](http://localhost:8000/docs)
- Use a GraphQL [client](https://learning.postman.com/docs/sending-requests/graphql/graphql-overview/) with [introspection](https://graphql.org/learn/introspection/) support for testing.
