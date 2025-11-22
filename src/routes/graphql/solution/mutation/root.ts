import { Prisma } from '@prisma/client';
import { FieldResolverContext } from '../common/types.js';
import { NonNull, ObjectType, StringType, UUIDType } from '../common/utils.js';
import { PostType, ProfileType, UserType } from '../query/types.js';
import {
  ChangePostInputType,
  ChangeProfileInputType,
  ChangeUserInputType,
  CreatePostInputType,
  CreateProfileInputType,
  CreateUserInputType,
} from './types.js';

export const RootMutationType = ObjectType<unknown, FieldResolverContext>({
  name: 'RootMutationType',
  fields: {
    createUser: {
      type: UserType,
      args: { dto: { type: NonNull(CreateUserInputType) } },
      resolve: async (_src, { dto }: { dto: Prisma.UserCreateInput }, { prisma }) => {
        return await prisma.user.create({ data: dto });
      },
    },
    createProfile: {
      type: ProfileType,
      args: { dto: { type: NonNull(CreateProfileInputType) } },
      resolve: async (_src, { dto }: { dto: Prisma.ProfileCreateInput }, { prisma }) => {
        return await prisma.profile.create({ data: dto });
      },
    },
    createPost: {
      type: PostType,
      args: { dto: { type: NonNull(CreatePostInputType) } },
      resolve: async (_src, { dto }: { dto: Prisma.PostCreateInput }, { prisma }) => {
        return await prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: NonNull(UUIDType) },
        dto: { type: NonNull(ChangePostInputType) },
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
        id: { type: NonNull(UUIDType) },
        dto: { type: NonNull(ChangeProfileInputType) },
      },
      resolve: async (
        _src,
        { id, dto }: { id: string; dto: Prisma.ProfileUpdateInput },
        { prisma },
      ) => {
        return await prisma.profile.update({ where: { id }, data: dto });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: NonNull(UUIDType) },
        dto: { type: NonNull(ChangeUserInputType) },
      },
      resolve: async (
        _src,
        { id, dto }: { id: string; dto: Prisma.UserUpdateInput },
        { prisma },
      ) => {
        return await prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: StringType,
      args: {
        id: { type: NonNull(UUIDType) },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        await prisma.user.delete({ where: { id } });
        return id;
      },
    },
    deletePost: {
      type: StringType,
      args: {
        id: { type: NonNull(UUIDType) },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        await prisma.post.delete({ where: { id } });
        return id;
      },
    },
    deleteProfile: {
      type: StringType,
      args: {
        id: { type: NonNull(UUIDType) },
      },
      resolve: async (_src, { id }: { id: string }, { prisma }) => {
        await prisma.profile.delete({ where: { id } });
        return id;
      },
    },
    subscribeTo: {
      type: StringType,
      args: {
        userId: { type: NonNull(UUIDType) },
        authorId: { type: NonNull(UUIDType) },
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
        userId: { type: NonNull(UUIDType) },
        authorId: { type: NonNull(UUIDType) },
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
