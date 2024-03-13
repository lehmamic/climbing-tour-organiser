import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import * as React from "react";
import { Group } from "~/models/group";
import { getGroup } from "~/services/groups.service";
import { getUserSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return null;
  }

  const group = await getGroup(params.groupId ?? '');
  if (!group) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return json(group);
};

const GroupPage: React.FunctionComponent = () => {
  const group: Group = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{group.name}</h1>
    </div>
  );
}

export default GroupPage;
