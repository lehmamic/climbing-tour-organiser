import {Avatar, Button, Card, CardBody, Input} from "@nextui-org/react";
import {LoaderFunction, json, ActionFunction} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import * as React from "react";
import { GroupMember } from "~/models/group";
import {getGroup, getGroupMembers} from "~/services/groups.server";
import {inviteGroupMember} from "~/services/email.server";

export const loader: LoaderFunction = async ({ params }) => {
  const members = await getGroupMembers(params.groupId ?? '');
  if (!members) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return json(members);
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
    <div className="flex flex-col gap-4">
      {members.map(m => (
        <Card key={m.userRef}>
          <CardBody>
            <div className="flex gap-2">
              <Avatar size={'lg'} /><span>{m.user?.email}</span>
            </div>
          </CardBody>
        </Card>
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
