import { useRouteLoaderData } from "@remix-run/react";
import * as React from "react";
import { Group } from "~/models/group";
import { type loader as groupLoader } from "~/routes/_layout.groups_.$groupId/route";

const AboutPage: React.FunctionComponent = () => {
  const groupLoaderData: Group = useRouteLoaderData<typeof groupLoader>("routes/_layout.groups_.$groupId");
  return (
    <>
      <div>
        about
      </div>
      <div>
        {groupLoaderData.description}
      </div>
    </>
  );
}

export default AboutPage;
