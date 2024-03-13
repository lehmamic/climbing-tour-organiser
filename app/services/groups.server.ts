
import { getFirestore } from "firebase-admin/firestore";
import { Group } from "~/models/group";
import { firebase_admin_app } from "~/utils/firebase.server";

export const GROUPS_COLLECTION: string = 'groups';

export const createGroup = async (name: string, description?: string): Promise<Group> => {
  const group: Group = {
    name,
    description,
  };

  const db = getFirestore(firebase_admin_app);
  const result = await db.collection(GROUPS_COLLECTION)
    .add(group);
  // const result = await addDoc(collection(db, GROUPS_COLLECTION), group);

  return { ...group, id: result.id }
}
