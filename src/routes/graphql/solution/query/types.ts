import { MemberTypeId as MemberTypeEnum } from '../../../member-types/schemas.js';
import { UUIDType } from '../../types/uuid.js';
import { FieldResolverContext, UserWithSubs } from '../common/types.js';
import {
  Bool,
  Enum,
  Float,
  GraphQLObjectType,
  Int,
  List,
  ObjectType,
  StringType,
} from '../common/utils.js';

const basic = MemberTypeEnum.BASIC;
const business = MemberTypeEnum.BUSINESS;

export const MemberTypeId = Enum({
  name: 'MemberTypeId',
  values: {
    [basic]: { value: basic },
    [business]: { value: business },
  },
});

export const MemberType = ObjectType({
  name: 'Member',
  fields: {
    id: { type: MemberTypeId },
    discount: { type: Float },
    postsLimitPerMonth: { type: Int },
  },
});

export const PostType = ObjectType({
  name: 'Post',
  fields: {
    id: { type: UUIDType },
    title: { type: StringType },
    content: { type: StringType },
  },
});

export const ProfileType = ObjectType<{ memberTypeId: string }, FieldResolverContext>({
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
});

export const UserType: GraphQLObjectType = ObjectType<UserWithSubs, FieldResolverContext>(
  {
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
        type: List(PostType),
        resolve: async ({ id }, _args, { loaders }) => {
          return await loaders.userPosts.load(id);
        },
      },
      userSubscribedTo: {
        type: List(UserType),
        resolve: async ({ userSubscribedTo }, _args, { loaders }) => {
          return await loaders.users.loadMany(
            userSubscribedTo?.map((s) => s.authorId) ?? [],
          );
        },
      },
      subscribedToUser: {
        type: List(UserType),
        resolve: async ({ subscribedToUser }, _args, { loaders }) => {
          return await loaders.users.loadMany(
            subscribedToUser?.map((s) => s.subscriberId) ?? [],
          );
        },
      },
    }),
  },
);
