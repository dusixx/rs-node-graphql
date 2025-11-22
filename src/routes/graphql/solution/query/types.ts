import { MemberTypeId as MemberTypeEnum } from '../../../member-types/schemas.js';
import { UUIDType } from '../../types/uuid.js';
import { FieldResolverContext, UserWithSubs } from '../common/types.js';
import { Bool, Enum, Float, Int, List, ObjectType, StringType } from '../common/utils.js';

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
        resolve: async ({ memberTypeId }, _args, { loaders }) => {
          return await loaders.memberTypes.load(memberTypeId);
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
      resolve: async ({ id }, _args, { loaders }) => {
        return await loaders.userProfiles.load(id);
      },
    },
    posts: {
      type: new List(PostType),
      resolve: async ({ id }, _args, { loaders }) => {
        return await loaders.userPosts.load(id);
      },
    },
    userSubscribedTo: {
      type: new List(UserType),
      resolve: async ({ userSubscribedTo }, _args, { loaders }) => {
        return await loaders.users.loadMany(
          userSubscribedTo?.map((s) => s.authorId) ?? [],
        );
      },
    },
    subscribedToUser: {
      type: new List(UserType),
      resolve: async ({ subscribedToUser }, _args, { loaders }) => {
        return await loaders.users.loadMany(
          subscribedToUser?.map((s) => s.subscriberId) ?? [],
        );
      },
    },
  }),
});
