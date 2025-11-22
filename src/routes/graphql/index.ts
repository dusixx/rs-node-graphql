import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { RootMutationType } from './solution/mutation/root.js';
import { getLoaders } from './solution/query/loaders.js';
import { RootQueryType } from './solution/query/root.js';

const DEPTH_LIMIT = 5;

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

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

export default plugin;
