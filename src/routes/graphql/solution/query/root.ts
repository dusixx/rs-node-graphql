import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { FieldResolverContext } from '../../index.js';
import { UUIDType } from '../../types/uuid.js';
import { hasOwnKeys, List, ObjectType } from '../utils.js';
import {
  MemberType,
  MemberTypeId,
  PostType,
  ProfileType,
  UserSubs,
  UserType,
} from './types.js';

export const RootQueryType = new ObjectType<unknown, FieldResolverContext>({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new List(MemberType),
      resolve: (_src, _args, { prisma }) => {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeId } },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        return await prisma.memberType.findUnique({ where: { id } });
      },
    },
    users: {
      type: new List(UserType),
      resolve: async (_src, _ars, { prisma, loaders }, resolveInfo) => {
        const fields = parseResolveInfo(resolveInfo)?.fieldsByTypeName.User;
        const include: Partial<Record<keyof UserSubs, boolean>> = {};

        include.userSubscribedTo = hasOwnKeys<UserSubs>(fields, 'userSubscribedTo');
        include.subscribedToUser = hasOwnKeys<UserSubs>(fields, 'subscribedToUser');

        const users = await prisma.user.findMany({ include });
        users.forEach((user) => {
          loaders.users.prime(user.id, user);
        });

        return users;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: UUIDType } },
      resolve: async (_srs, { id }: { id: string }, { loaders }) => {
        return loaders.users.load(id);
      },
    },
    posts: {
      type: new List(PostType),
      resolve: (_srs, _args, { prisma }) => {
        return prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: { id: { type: UUIDType } },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        return await prisma.post.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new List(ProfileType),
      resolve: (_src, _args, { prisma }) => {
        return prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: UUIDType } },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        return prisma.profile.findUnique({ where: { id } });
      },
    },
  },
});
