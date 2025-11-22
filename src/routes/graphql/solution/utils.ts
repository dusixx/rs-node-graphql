import {
  GraphQLBoolean as Bool,
  GraphQLEnumType as Enum,
  GraphQLFloat as Float,
  GraphQLInt as Int,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';

export { Bool, Enum, Float, Int, List, NonNull, ObjectType, StringType, UUIDType };

export const isObject = (obj: unknown): obj is Record<string, unknown> => {
  return obj != null && typeof obj === 'object';
};

export const hasOwnKeys = <T extends object>(
  obj: unknown,
  ...keys: (keyof T)[]
): obj is T => {
  return isObject(obj) && keys.every((key) => Object.hasOwn(obj, key));
};
