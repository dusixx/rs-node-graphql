import { PrismaClient, User } from '@prisma/client';
import { getLoaders } from '../query/loaders.js';

export type FieldResolverContext = {
  prisma: PrismaClient;
  loaders: ReturnType<typeof getLoaders>;
};

export type UserSubs = {
  subscribedToUser?: { subscriberId: string }[];
  userSubscribedTo?: { authorId: string }[];
};

export type UserWithSubs = User & UserSubs;
