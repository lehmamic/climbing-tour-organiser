
import { DocumentData } from "firebase-admin/firestore";
import { Group } from "~/models/group";
import { Paged } from "~/models/paged";
import { getFirestoreDatabase } from "~/utils/firebase.server";

export const GROUPS_COLLECTION: string = 'groups';

export const createGroup = async (name: string, description?: string): Promise<Group> => {
  const group: Group = {
    name,
    description,
  };

  const db = getFirestoreDatabase();
  const result = await db.collection(GROUPS_COLLECTION)
    .add(group);

  return { ...group, id: result.id }
}

export const getGroups = async(skip: number, take: number): Promise<Paged<Group>> => {
  const converter = <T>() => ({
    toFirestore: (data: Partial<T>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (<any>data).id;
      return data;
    },
    fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => ({ ...snap.data(), id: snap.id }) as T
  })

  const db = getFirestoreDatabase();
  const collectionRef = db.collection(GROUPS_COLLECTION);

  const result = await collectionRef
    .withConverter(converter<Group>())
    .orderBy('name')
    .startAt(skip)
    .limit(take)
    .get();

    const totalCount = await collectionRef
      .count()
      .get();

  return { data: result.docs.map(s => <Group>s.data()), totalCount: totalCount.data().count }
}
