import { MemberTypeId } from '../query/types.js';
import {
  Bool,
  Float,
  InputObjectType,
  Int,
  NonNull,
  StringType,
  UUIDType,
} from '../utils.js';

export const ChangePostInputType = new InputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: StringType },
    content: { type: StringType },
  },
});

export const ChangeProfileInputType = new InputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: Bool },
    yearOfBirth: { type: Int },
    memberTypeId: { type: MemberTypeId },
  },
});

export const ChangeUserInputType = new InputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: StringType },
    balance: { type: Float },
  },
});

export const CreatePostInputType = new InputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new NonNull(StringType) },
    content: { type: new NonNull(Float) },
    authorId: { type: new NonNull(UUIDType) },
  },
});

export const CreateProfileInputType = new InputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new NonNull(Bool) },
    yearOfBirth: { type: new NonNull(Int) },
    memberTypeId: { type: new NonNull(MemberTypeId) },
    userId: { type: new NonNull(UUIDType) },
  },
});

export const CreateUserInputType = new InputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new NonNull(StringType) },
    balance: { type: new NonNull(Float) },
  },
});
