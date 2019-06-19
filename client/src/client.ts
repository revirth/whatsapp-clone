import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloLink, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";

const httpUri = `${process.env.REACT_APP_SERVER_URL}/graphql`;
const wsUri = httpUri.replace(/^http?/, "ws");

const httpLink = new HttpLink({
  uri: httpUri
});

const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true // automatic reconnect
  }
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const link = ApolloLink.from([terminatingLink]);

const inMemoryCache = new InMemoryCache();

export default new ApolloClient({
  link,
  cache: inMemoryCache
});
