import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, GraphQLSchema } from 'graphql';
import { QueryType } from './query/query.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLContext } from './types/context.js';

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
    async handler(req) {
      return graphql({
        schema,
        source: req.body.query,
        contextValue: {
          prisma,
        } as GraphQLContext,
        variableValues: req.body.variables,
      });
    },
  });
};

export const schema = new GraphQLSchema({
  query: QueryType,
  // mutation,
});

export default plugin;
