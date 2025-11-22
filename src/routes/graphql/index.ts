import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { getLoaders } from './solution/loaders.js';
import { RootQueryType } from './solution/query/root.js';

const DEPTH_LIMIT = 5;

export type FieldResolverContext = {
  prisma: PrismaClient;
  loaders: ReturnType<typeof getLoaders>;
};

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler({ body }) {
      const { query, variables } = body;

      const errors = validate(schema, parse(query), [depthLimit(DEPTH_LIMIT)]);
      if (errors.length > 0) {
        return { errors };
      }

      return graphql({
        schema,
        source: query,
        contextValue: {
          prisma,
          loaders: getLoaders(prisma),
        },
        variableValues: variables,
      });
    },
  });
};

// schema {
//   query: RootQueryType
//   mutation: Mutations
// }
export const schema = new GraphQLSchema({
  query: RootQueryType,
  // mutation,
});

export default plugin;
