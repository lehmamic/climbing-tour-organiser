import { GroupMember as Member } from "@/model/group";

export interface GroupMembersProps {
  member: Member;
};

export const GroupMember: React.FunctionComponent<GroupMembersProps> = async ({ member }) => {
  return (
    <div>
      { member.user?.name }
    </div>
  );
};
