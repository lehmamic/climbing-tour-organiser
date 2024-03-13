import { Button, Input, Textarea } from "@nextui-org/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import * as React from "react";
import { createGroup } from "~/services/groups.server";
import { getUserSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect('/login');
  }

  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name")?.toString() ?? '';
  const description = form.get("name")?.toString();

  console.log('POST create groups')

  await createGroup(name, description);

  return redirect('/groups')
};

const CreateGroupPage: React.FunctionComponent = () => {
  return (
    <>
      <h1>Create a group</h1>
      <Form method="POST" className="space-y-6">
        <Input type="text" name="name" label="Name" id="name" variant="bordered" placeholder="Name your group" isRequired className="block w-full" />
        <Textarea name="description" label="description" id="description" variant="bordered" placeholder="Describe your group" className="block w-full" />
        <Button type="submit" color="primary">Create</Button>
      </Form>
    </>
  );
}

export default CreateGroupPage;
