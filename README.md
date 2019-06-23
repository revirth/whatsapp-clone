# whatsapp-clone


### client

##### REACT


- [ts-node](https://github.com/TypeStrong/ts-node) is an interpreter that will transpile required .ts files into JavaScript at runtime.
- `REACT_APP_` prefix - environment variables will be defined on process.env - [Adding Custom Environment Variables](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables)


### Apollo
- apollo-client - Apollo-Client's core package
- apollo-cache-inmemory - The data store that will be used to cache the results.
- apollo-link-http - Get GraphQL results over a network using HTTP fetch

### GraphQL
- graphql-tag - is used to parse the GraphQL string to an AST, something which is required when using Apollo Client

- mutation 
  - optimisticResponse
  
- GraphQL fragment - shared piece of query logic
- [Code Generator](https://graphql-code-generator.com/) - generate TypeScript definitions given a GraphQL schema, and a set of GraphQL documents
  - codegen.yml - provide the code generator with the GraphQL schema, GraphQL documents, the output path of the type definition file/s and a set of plug-ins.
- @graphql-codegen/typescript - Will generate the core TypeScript types from our GraphQL schema.
- @graphql-codegen/typescript-resolvers - Will generate resolvers signatures with the generated TypeScript types.
  
  
### WS
- http://websocket.org/quantum.html

#### GraphQL
- subscriptions-transport-ws - a transport layer that understands how client and GraphQL API communicates with each other. The spec has GQL_INIT GQL_UPDATE GQL_DATA events.
- apollo-link-ws - Will establish a WS connection.
- apollo-link - Will enable WS and HTTP connections co-exist in a single client.
- apollo-utilities - Includes utility functions that will help us analyze a GraphQL AST.

  
### Test
- [Jest](https://jestjs.io) can be used to test both client and server logic

####  3 kinds of tests
- Unit tests - test a single component, independently from other components
- Integration tests - test a component in relation to other components (how well do they co-work with each other).
- e2e tests (end to end) - test a complete, from the moment I clicked on a button in the user interface until the data gets back from the server and shown on the screen.

#### npm
- jest-fetch-mock - mock responses emitted by the Fetch API.
- jest-dom - add custom matchers that will help us examine HTML contents of DOM elements.
