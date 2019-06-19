import { importSchema } from "graphql-import";
import resolvers from "./resolvers";
import { makeExecutableSchema, IResolvers } from "graphql-tools";

const typeDefs = importSchema("schema/typeDefs.graphql");

export default makeExecutableSchema({
  resolvers: resolvers as IResolvers,
  typeDefs
});
