import { Card, CardHeader } from "@nextui-org/react";
import {LoaderFunction, json, redirect} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import * as React from "react";
import { Group } from "~/models/group";
import { Paged } from "~/models/paged";
import { getGroups } from "~/services/groups.server";
import { getUserSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect(`/login?redirectTo=${encodeURIComponent(request.url)}`)
  }

  console.dir(sessionUser);
  const groups = await getGroups(sessionUser.uid, 0, 10);
  return json(groups);
};

const GroupsPage: React.FunctionComponent = () => {
  const groups: Paged<Group> = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Groups</h1>
      <div className="flex flex-wrap gap-2">
        {groups.data.map(g => (
          <Link key={g.id} to={`/groups/${g.id}`} className="not-prose">
            <Card className="h-[200px] w-[200px]">
              <CardHeader className="">
                {/* <p className="text-tiny uppercase font-bold">What to watch</p> */}
                <h4 className="text-tiny uppercase font-bold">{g.name}</h4>
              </CardHeader>
              {/* <Image
                removeWrapper
                alt="Card background"
                className="z-0 w-full h-full object-cover"
                src="/images/card-example-4.jpeg"
              /> */}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GroupsPage;
