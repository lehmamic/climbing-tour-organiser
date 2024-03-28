import {LoaderFunction, redirect} from '@remix-run/node';
import {getUserSession} from '~/utils/session.server';
import {verifyInvitationToken} from "~/services/token.server";
import {getGroup, updateGroup} from "~/services/groups.server";
import {GroupMemberRole} from "~/models/group";
import {userRef} from "~/services/users.server";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect(`/login?redirectTo=${encodeURIComponent(request.url)}`)
  }

  const token = new URL(request.url).searchParams.get('token');
  if (!token) {
    return null;
  }

  const decoded = verifyInvitationToken(token);
  if (!decoded.success ||!decoded.data) {
    return null;
  }

  const group = await getGroup(decoded.data.groupId);
  const meAsMember = group.members
    .find(m => m.userRef === sessionUser.sub);

  if (!meAsMember) {
    group.members.push({
      userRef: userRef(sessionUser.sub),
      role: GroupMemberRole.Member,
    });
    await updateGroup(group);
  }

  return redirect(`/groups/${decoded.data.groupId}`);
};
