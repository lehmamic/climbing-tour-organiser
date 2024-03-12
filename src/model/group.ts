import { ObjectId } from 'mongodb';

export const GROUPS_COLLECTION_NAME = 'groups';

export type GroupMemberRole = 'owner' | 'member';
export const GroupMemberRole = {
  Owner: 'owner' as GroupMemberRole,
};

export interface GroupMember {
  role: GroupMemberRole;
  userId: string;
}

export interface Group {
  _id: ObjectId;
  name: string;
  description: string;
  members: GroupMember[];
}
