
import { DocumentData } from "firebase-admin/firestore";
import { doc } from "firebase/firestore";
import { Group } from "~/models/group";
import { Paged } from "~/models/paged";
import { firestoreConverter, getFirestoreDatabase } from "~/utils/firebase.server";

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
  const db = getFirestoreDatabase();
  const collectionRef = db.collection(GROUPS_COLLECTION);

  const result = await collectionRef
    .withConverter(firestoreConverter<Group>())
    .orderBy('name')
    .startAt(skip)
    .limit(take)
    .get();

    const totalCount = await collectionRef
      .count()
      .get();

  return { data: result.docs.map(s => <Group>s.data()), totalCount: totalCount.data().count }
}

export const getGroup = async (id: string): Promise<Group> => {
  const db = getFirestoreDatabase();
  const collectionRef = db.collection(GROUPS_COLLECTION);

  const result = await collectionRef
    .withConverter(firestoreConverter<Group>())
    .doc(id)
    .get();

    return <Group>result.data() ?? null;
}
