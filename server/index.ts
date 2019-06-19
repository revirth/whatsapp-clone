import { ApolloServer, gql, PubSub } from "apollo-server-express";
import express from "express";
import cors = require("cors");
import { chats } from "./db";
import bodyParser = require("body-parser");
import schema from "./schema";
import http from "http";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/_ping", (req, res) => {
  res.send("pong");
});

app.get("/chats", (req, res) => {
  res.json(chats);
});

const pubsub = new PubSub();
const server = new ApolloServer({
  schema,
  context: () => ({ pubsub })
});

server.applyMiddleware({
  app,
  path: "/graphql"
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const port = process.env.PORTREACT_APP_SERVER_URL || 4000;

httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
