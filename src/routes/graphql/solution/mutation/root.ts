import { Prisma } from '@prisma/client';
import { FieldResolverContext } from '../../index.js';
import { PostType, ProfileType, UserType } from '../query/types.js';
import { NonNull, ObjectType, StringType, UUIDType } from '../utils.js';
import {
  ChangePostInputType,
  ChangeProfileInputType,
  ChangeUserInputType,
  CreatePostInputType,
  CreateProfileInputType,
  CreateUserInputType,
} from './types.js';

export const RootMutationType = new ObjectType<unknown, FieldResolverContext>({
  name: 'RootMutationType',
  fields: {
    createUser: {
      type: UserType,
      args: { dto: { type: new NonNull(CreateUserInputType) } },
      resolve: (_src, { dto }: { dto: Prisma.UserCreateInput }, { prisma }) => {
        return prisma.user.create({ data: dto });
      },
    },
    createProfile: {
      type: ProfileType,
      args: { dto: { type: new NonNull(CreateProfileInputType) } },
      resolve: (_src, { dto }: { dto: Prisma.ProfileCreateInput }, { prisma }) => {
        return prisma.profile.create({ data: dto });
      },
    },
    createPost: {
      type: PostType,
      args: { dto: { type: new NonNull(CreatePostInputType) } },
      resolve: async (_src, { dto }: { dto: Prisma.PostCreateInput }, { prisma }) => {
        return await prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new NonNull(UUIDType) },
        dto: { type: new NonNull(ChangePostInputType) },
      },
      resolve: async (
        _src,
        { id, dto }: { id: string; dto: Prisma.PostUpdateInput },
        { prisma },
      ) => {
        return await prisma.post.update({ where: { id }, data: dto });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new NonNull(UUIDType) },
        dto: { type: new NonNull(ChangeProfileInputType) },
      },
      resolve: (
        _src,
        { id, dto }: { id: string; dto: Prisma.ProfileUpdateInput },
        { prisma },
      ) => {
        return prisma.profile.update({ where: { id }, data: dto });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new NonNull(UUIDType) },
        dto: { type: new NonNull(ChangeUserInputType) },
      },
      resolve: (
        _src,
        { id, dto }: { id: string; dto: Prisma.UserUpdateInput },
        { prisma },
      ) => {
        return prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: StringType,
      args: {
        id: { type: new NonNull(UUIDType) },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        await prisma.user.delete({ where: { id } });
        return id;
      },
    },
    deletePost: {
      type: StringType,
      args: {
        id: { type: new NonNull(UUIDType) },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        await prisma.post.delete({ where: { id } });
        return id;
      },
    },
    deleteProfile: {
      type: StringType,
      args: {
        id: { type: new NonNull(UUIDType) },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        await prisma.profile.delete({ where: { id } });
        return id;
      },
    },
    subscribeTo: {
      type: StringType,
      args: {
        userId: { type: new NonNull(UUIDType) },
        authorId: { type: new NonNull(UUIDType) },
      },
      resolve: async (
        _src,
        { userId: id, authorId }: { userId: string; authorId: string },
        { prisma },
      ) => {
        await prisma.user.update({
          where: { id },
          data: { userSubscribedTo: { create: { authorId } } },
        });
        return authorId;
      },
    },
    unsubscribeFrom: {
      type: StringType,
      args: {
        userId: { type: new NonNull(UUIDType) },
        authorId: { type: new NonNull(UUIDType) },
      },
      resolve: async (
        _src,
        { userId: subscriberId, authorId }: { userId: string; authorId: string },
        { prisma },
      ) => {
        await prisma.subscribersOnAuthors.delete({
          where: { subscriberId_authorId: { subscriberId, authorId } },
        });
        return authorId;
      },
    },
  },
});
