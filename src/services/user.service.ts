import { MONGODB_DATABASE, clientPromise } from '@/lib/mongodb';
import { USERS_COLLECTION_NAME, User } from '@/model/user';
import { Claims } from '@auth0/nextjs-auth0';

export const ensureUser = async (sub: string, name: string, email: string): Promise<void> => {
  const client = await clientPromise;
  const db = client.db(MONGODB_DATABASE);

  await db.collection<User>(USERS_COLLECTION_NAME)
    .updateOne({ sub }, { $setOnInsert: { sub, name, email } }, { upsert: true });
};

export const getUserBySub = async (sub: string): Promise<User | null> => {
  if (!sub) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db(MONGODB_DATABASE);

  return await db.collection<User>(USERS_COLLECTION_NAME)
    .findOne({ sub });
}
