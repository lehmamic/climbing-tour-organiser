import { Tab, Tabs } from "@nextui-org/react";
import {LoaderFunction, json, redirect} from "@remix-run/node";
import { Outlet, useLoaderData, useMatch } from "@remix-run/react";
import * as React from "react";
import { Group } from "~/models/group";
import { getGroup } from "~/services/groups.server";
import { userRef } from "~/services/users.server";
import { getUserSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect(`/login?redirectTo=${encodeURIComponent(request.url)}`)
  }

  const group = await getGroup(params.groupId ?? '');
  if (!group) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (!group.members.find(m => m.userRef === userRef(sessionUser.sub))) {
    throw new Response(null, {
      status: 403,
      statusText: "Forbidden",
    });
  }

  return json(group);
};

const GroupPage: React.FunctionComponent = () => {
  const group: Group = useLoaderData<typeof loader>();
  const match = useMatch('/groups/:groupId/:lastPart')

  return (
    <div>
      <h1>{group.name}</h1>

      <Tabs selectedKey={match?.params.lastPart ?? 'about'} variant="underlined" className="not-prose">
        <Tab key="about" title="About" href={`/groups/${group.id}`} />
        <Tab key="events" title="Events" href={`/groups/${group.id}/events`}/>
        <Tab key="members" title="Members" href={`/groups/${group.id}/members`} />
      </Tabs>

      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default GroupPage;
