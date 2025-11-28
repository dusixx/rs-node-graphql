import {
  Bool,
  Float,
  InputObjectType,
  Int,
  NonNull,
  StringType,
  UUIDType,
} from '../common/utils.js';
import { MemberTypeId } from '../query/types.js';

export const ChangePostInputType = InputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: StringType },
    content: { type: StringType },
  },
});

export const ChangeProfileInputType = InputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: Bool },
    yearOfBirth: { type: Int },
    memberTypeId: { type: MemberTypeId },
  },
});

export const ChangeUserInputType = InputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: StringType },
    balance: { type: Float },
  },
});

export const CreatePostInputType = InputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: NonNull(StringType) },
    content: { type: NonNull(StringType) },
    authorId: { type: NonNull(UUIDType) },
  },
});

export const CreateProfileInputType = InputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: NonNull(Bool) },
    yearOfBirth: { type: NonNull(Int) },
    memberTypeId: { type: NonNull(MemberTypeId) },
    userId: { type: NonNull(UUIDType) },
  },
});

export const CreateUserInputType = InputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: NonNull(StringType) },
    balance: { type: NonNull(Float) },
  },
});
