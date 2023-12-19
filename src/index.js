const { ApolloServer, PubSub } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const { getUserId } = require("./utils");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Subscription = require("./resolvers/Subscription");
const Vote = require("./resolvers/Vote");
const cors = require("cors");

const resolvers = {
  Query,
  Mutation,
  Link,
  User,
  Subscription,
  Vote,
};

const prisma = new PrismaClient();
const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => ({
    ...req,
    prisma,
    pubsub,
    userId: req && req.headers.authorization ? getUserId(req) : null,
  }),
});

server.listen().then(({ url }) => {
  console.log(`Server listening on port ${url}`);
});
