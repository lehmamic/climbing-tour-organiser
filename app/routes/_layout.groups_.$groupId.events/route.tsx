import * as React from "react";
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import { Group } from "~/models/group";
import { useRouteLoaderData } from "@remix-run/react";
import { type loader as groupLoader } from "~/routes/_layout.groups_.$groupId/route";

const EventsPage: React.FunctionComponent = () => {
  const groupLoaderData: Group = useRouteLoaderData<typeof groupLoader>("routes/_layout.groups_.$groupId");
  return (
    <div>
      <div>
        <Button as={Link} href={`/groups/${groupLoaderData.id}/events/create`} type="button" color="primary" className="not-prose">Create an event</Button>
      </div>
    </div>
  );
}

export default EventsPage;
