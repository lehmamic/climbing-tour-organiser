import { ObjectId } from 'mongodb';
import { User } from './user';

export const GROUPS_COLLECTION_NAME = 'groups';

export type GroupMemberRole = 'owner' | 'member';
export const GroupMemberRole = {
  Owner: 'owner' as GroupMemberRole,
};

export interface GroupMember {
  role: GroupMemberRole;
  userId: ObjectId;
  user?: User;
}

export interface Group {
  _id: ObjectId;
  name: string;
  description?: string;
  members: GroupMember[];
}
