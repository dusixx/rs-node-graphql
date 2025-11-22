import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLNullableType,
  GraphQLObjectType,
  GraphQLType,
} from 'graphql';

export {
  GraphQLBoolean as Bool,
  GraphQLFloat as Float,
  GraphQLObjectType,
  GraphQLInt as Int,
  GraphQLString as StringType,
} from 'graphql';
export { UUIDType } from '../../types/uuid.js';

export const NonNull = <T extends GraphQLNullableType>(
  ...args: ConstructorParameters<typeof GraphQLNonNull<T>>
) => {
  return new GraphQLNonNull<T>(...args);
};

export const Enum = (...args: ConstructorParameters<typeof GraphQLEnumType>) => {
  return new GraphQLEnumType(...args);
};

export const InputObjectType = (
  ...args: ConstructorParameters<typeof GraphQLInputObjectType>
) => {
  return new GraphQLInputObjectType(...args);
};

export const ObjectType = <T = unknown, U = unknown>(
  ...args: ConstructorParameters<typeof GraphQLObjectType<T, U>>
): GraphQLObjectType<T, U> => {
  return new GraphQLObjectType<T, U>(...args);
};

export const List = <T extends GraphQLType>(
  ...args: ConstructorParameters<typeof GraphQLList<T>>
) => {
  return new GraphQLList<T>(...args);
};

export const isObject = (obj: unknown): obj is Record<string, unknown> => {
  return obj != null && typeof obj === 'object';
};

export const hasOwnKeys = <T extends object>(
  obj: unknown,
  ...keys: (keyof T)[]
): obj is T => {
  return isObject(obj) && keys.every((key) => Object.hasOwn(obj, key));
};
