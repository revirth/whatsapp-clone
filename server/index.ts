import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import cors = require("cors");
import { chats } from "./db";
import bodyParser = require("body-parser");
import schema from "./schema";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/_ping", (req, res) => {
  res.send("pong");
});

app.get("/chats", (req, res) => {
  res.json(chats);
});

const server = new ApolloServer({ schema });

server.applyMiddleware({
  app,
  path: "/graphql"
});

const port = process.env.PORTREACT_APP_SERVER_URL || 4000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
