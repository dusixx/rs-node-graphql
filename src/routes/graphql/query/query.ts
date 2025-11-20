import { PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';
import users from '../../users/index.js';
import { GraphQLContext } from '../types/context.js';
import {
  Bool,
  Enum,
  Float,
  Int,
  List,
  NonNull,
  ObjectType,
  StringType,
} from '../types/utils.js';
import { UUIDType } from '../types/uuid.js';
// import { MemberTypeId } from '../../member-types/schemas.js';

// MemberTypeId
export const MemberTypeId = new Enum({
  name: 'MemberId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

// MemberType
export const MemberType = new ObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: new NonNull(MemberTypeId) },
    discount: { type: new NonNull(Float) },
    postsLimitPerMonth: { type: new NonNull(Int) },
  }),
});

// Post
export const PostType = new ObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new NonNull(UUIDType) },
    title: { type: new NonNull(StringType) },
    content: { type: new NonNull(StringType) },
  }),
});

// Profile
export const ProfileType = new ObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new NonNull(UUIDType) },
    isMale: { type: new NonNull(Bool) },
    yearOfBirth: { type: new NonNull(Int) },
    memberType: { type: new NonNull(MemberType) },
  }),
});

// User
export const UserType: ObjectType = new ObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new NonNull(UUIDType) },
    name: { type: new NonNull(StringType) },
    balance: { type: new NonNull(Float) },
    profile: { type: ProfileType },
    posts: { type: new NonNull(new List(new NonNull(PostType))) },
    userSubscribedTo: { type: new NonNull(new List(new NonNull(UserType))) },
    subscribedToUser: { type: new NonNull(new List(new NonNull(UserType))) },
  }),
});

// RootQueryType
// resolve(source, args, context)
export const QueryType = new ObjectType<unknown, GraphQLContext>({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new NonNull(new List(new NonNull(MemberType))),
      resolve: (_a, _b, { prisma }) => {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new NonNull(MemberTypeId) } },
      resolve: async (_a, { id }: { id: string }, { prisma }) => {
        return await prisma.memberType.findUnique({ where: { id } });
      },
    },
    users: {
      type: new NonNull(new List(new NonNull(UserType))),
      resolve: (_a, _b, { prisma }) => {
        return prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: new NonNull(UUIDType) } },
      resolve: async (_a, { id }: { id: string }, { prisma }) => {
        return await prisma.user.findUnique({ where: { id } });
      },
    },
    posts: {
      type: new NonNull(new List(new NonNull(PostType))),
      resolve: (_a, _b, { prisma }) => {
        return prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: { id: { type: UUIDType } },
      resolve: async (_a, { id }: { id: string }, { prisma }) => {
        return await prisma.post.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new NonNull(new List(new NonNull(ProfileType))),
      resolve: (_a, _b, { prisma }) => {
        return prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: UUIDType } },
      resolve: async (_a, { id }: { id: string }, { prisma }) => {
        return await prisma.profile.findUnique({ where: { id } });
      },
    },
  }),
});
