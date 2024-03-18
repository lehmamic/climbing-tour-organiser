import { User } from "./user";

export type GroupMemberRole = 'owner' | 'member';

export const GroupMemberRole = {
  Owner: 'owner' as GroupMemberRole,
  Member: 'member' as GroupMemberRole,
};

export interface GroupMember {
  userRef: string;
  user?: User;
  role: GroupMemberRole;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: GroupMember[];
}
