import { User } from '@prisma/client';
import { MemberTypeId as MemberTypeEnum } from '../../../member-types/schemas.js';
import { FieldResolverContext } from '../../index.js';
import { UUIDType } from '../../types/uuid.js';
import { Bool, Enum, Float, Int, List, ObjectType, StringType } from '../utils.js';

export type UserSubs = {
  subscribedToUser?: { subscriberId: string }[];
  userSubscribedTo?: { authorId: string }[];
};

type UserWithSubs = User & UserSubs;

export const MemberTypeId = new Enum({
  name: 'MemberTypeId',
  values: {
    [MemberTypeEnum.BASIC]: { value: MemberTypeEnum.BASIC },
    [MemberTypeEnum.BUSINESS]: { value: MemberTypeEnum.BUSINESS },
  },
});

export const MemberType = new ObjectType({
  name: 'Member',
  fields: {
    id: { type: MemberTypeId },
    discount: { type: Float },
    postsLimitPerMonth: { type: Int },
  },
});

export const PostType = new ObjectType({
  name: 'Post',
  fields: {
    id: { type: UUIDType },
    title: { type: StringType },
    content: { type: StringType },
  },
});

export const ProfileType = new ObjectType<{ memberTypeId: string }, FieldResolverContext>(
  {
    name: 'Profile',
    fields: {
      id: { type: UUIDType },
      isMale: { type: Bool },
      yearOfBirth: { type: Int },
      memberType: {
        type: MemberType,
        resolve: ({ memberTypeId }, _args, { loaders }) => {
          return loaders.memberTypes.load(memberTypeId);
        },
      },
    },
  },
);

export const UserType: ObjectType = new ObjectType<UserWithSubs, FieldResolverContext>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: StringType },
    balance: { type: Float },
    profile: {
      type: ProfileType,
      resolve: ({ id }, _args, { loaders }) => {
        return loaders.userProfiles.load(id);
      },
    },
    posts: {
      type: new List(PostType),
      resolve: ({ id }, _args, { loaders }) => {
        return loaders.userPosts.load(id);
      },
    },
    userSubscribedTo: {
      type: new List(UserType),
      resolve: ({ userSubscribedTo }, _args, { loaders }) => {
        return loaders.users.loadMany(userSubscribedTo?.map((s) => s.authorId) ?? []);
      },
    },
    subscribedToUser: {
      type: new List(UserType),
      resolve: ({ subscribedToUser }, _args, { loaders }) => {
        return loaders.users.loadMany(subscribedToUser?.map((s) => s.subscriberId) ?? []);
      },
    },
  }),
});
