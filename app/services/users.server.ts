import { User } from '~/models/user';
import { firestoreConverter, getFirestoreDatabase } from '~/utils/firebase.server';

export const USERS_COLLECTION: string = 'users';

export const userRef = (userId: string): string => {
  return `${USERS_COLLECTION}/${userId}`;
}

export const createUser = async (sub: string, name?: string, email?: string): Promise<User> => {
  const user: Partial<User> = {
    name: name || null!,
    email: email || null!,
  };

  const db = getFirestoreDatabase();
  await db.collection(USERS_COLLECTION)
    .withConverter(firestoreConverter<User>())
    .doc(sub)
    .set(user, { merge: true });

  return <User>{ ...user, id: sub }
}

export const getUserByRef = async (ref: string): Promise<User> => {


  const db = getFirestoreDatabase();
  const userDoc = await db
    .doc(ref)
    .get();

  return <User>userDoc.data();
}
