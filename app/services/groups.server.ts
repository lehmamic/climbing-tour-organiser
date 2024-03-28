import { Group, GroupMember, GroupMemberRole } from "~/models/group";
import { Paged } from "~/models/paged";
import { firestoreConverter, getFirestoreDatabase } from "~/utils/firebase.server";
import { getUserByRef, userRef as ref } from "./users.server";
import { Filter } from "firebase-admin/firestore";

export const GROUPS_COLLECTION: string = 'groups';

export const createGroup = async (userId: string, name: string, description?: string): Promise<Group> => {
  const db = getFirestoreDatabase();

  const group: Partial<Group> = {
    name,
    description,
    members: [
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userRef: ref(userId),
        role: GroupMemberRole.Owner,
      },
    ],
  };

  const result = await db.collection(GROUPS_COLLECTION)
    .withConverter(firestoreConverter<Group>())
    .add(group);

  return <Group>{ ...group, id: result.id };
}

export const updateGroup = async (group: Group): Promise<void> => {
  const db = getFirestoreDatabase();
  await db.collection(GROUPS_COLLECTION)
    .withConverter(firestoreConverter<Group>())
    .doc(group.id)
    .set(group);
}

export const getGroups = async(userId: string, skip: number, take: number): Promise<Paged<Group>> => {
  const db = getFirestoreDatabase();
  const collectionRef = db.collection(GROUPS_COLLECTION);

  const userRef = ref(userId);
  const result = await collectionRef
    .withConverter(firestoreConverter<Group>())
    .where(Filter.or(
      Filter.where('members', 'array-contains', { userRef, role: GroupMemberRole.Owner }),
      Filter.where('members', 'array-contains', { userRef, role: GroupMemberRole.Member })
    ))
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

export const getGroupMembers = async(id: string): Promise<GroupMember[]> => {
  const db = getFirestoreDatabase();
  const collectionRef = db.collection(GROUPS_COLLECTION);

  const result = await collectionRef
    .withConverter(firestoreConverter<Group>())
    .doc(id)
    .get();

    const group = result.data();
    if (!group?.members) {
      return [];
    }


    const groupMembersWithUser: GroupMember[] = [];
    for (const member of group.members) {
      const user = await getUserByRef(member.userRef);
      groupMembersWithUser.push({ ...member, user })
    }

    return groupMembersWithUser;
};
