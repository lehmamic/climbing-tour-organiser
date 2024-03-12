import { MONGODB_DATABASE, clientPromise } from '@/lib/mongodb';
import { USERS_COLLECTION_NAME, User } from '@/model/user';

export const ensureUser = async (sub: string, name: string, email: string) => {
  const client = await clientPromise;
  const db = client.db(MONGODB_DATABASE);

  await db.collection<User>(USERS_COLLECTION_NAME).updateOne({ sub }, { $setOnInsert: { sub, name, email } }, { upsert: true });
};
