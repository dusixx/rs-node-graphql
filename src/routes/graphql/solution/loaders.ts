import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';

export const getLoaders = (prisma: PrismaClient) => {
  return {
    memberTypes: new DataLoader<string, MemberType>(
      async (ids): Promise<MemberType[]> => {
        const memberTypes = await prisma.memberType.findMany({
          where: { id: { in: [...ids] } },
        });
        const map = new Map<string, MemberType>(memberTypes.map((mt) => [mt.id, mt]));

        return ids.map((id) => map.get(id)!);
      },
    ),

    userProfiles: new DataLoader<string, Profile>(async (ids): Promise<Profile[]> => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: [...ids] } },
      });
      const map = new Map<string, Profile>(profiles.map((p) => [p.userId, p]));

      return ids.map((id) => map.get(id)!);
    }),

    userPosts: new DataLoader<string, Post[]>(async (ids): Promise<Post[][]> => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: [...ids] } },
      });
      const map = new Map<string, Post[]>();

      posts.forEach((post) => {
        const authorPosts = map.get(post.authorId) ?? [];
        map.set(post.authorId, authorPosts.concat(post));
      });
      return ids.map((authorId) => map.get(authorId)!);
    }),

    users: new DataLoader<string, User>(async (ids): Promise<User[]> => {
      const users = await prisma.user.findMany({
        where: { id: { in: [...ids] } },
        include: { userSubscribedTo: true, subscribedToUser: true },
      });
      const map = new Map<string, User>(users.map((u) => [u.id, u]));

      return ids.map((id) => map.get(id)!);
    }),
  };
};
