import {Avatar, Button, Input} from "@nextui-org/react";
import {LoaderFunction, json, ActionFunction} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import * as React from "react";
import { GroupMember } from "~/models/group";
import {getGroup, getGroupMembers} from "~/services/groups.server";
import {inviteGroupMember} from "~/services/email.server";

export const loader: LoaderFunction = async ({ params }) => {
  const group = await getGroupMembers(params.groupId ?? '');
  if (!group) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return json(group);
};

export const action: ActionFunction = async ({ params, request }) => {
  const group = await getGroup(params.groupId ?? '');
  if (!group) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const form = await request.formData();
  const email = form.get("email")?.toString() ?? '';

  await inviteGroupMember(email, group);
  return null;
};

const MembersPage: React.FunctionComponent = () => {
  const members: GroupMember[] = useLoaderData<typeof loader>();

  return (
    <div>
      {members.map(m => (
        <div key={m.userRef} className="flex gap-2"><Avatar></Avatar>{m.user?.email}</div>
      ))}
      <div>
        <Form method="POST">
          <Input type="email" name="email" label="Email" id="email" variant="bordered" placeholder="name@company.com" isRequired />
          <Button type="submit">Invite</Button>
        </Form>
      </div>

    </div>
  );
}

export default MembersPage;
