import { Button, Input, Textarea } from "@nextui-org/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import * as React from "react";
import { createGroup } from "~/services/groups.server";
import { getUserSession } from "~/utils/session.server";


export const action: ActionFunction = async ({ request }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect(`/login?redirectTo=${encodeURIComponent(request.url)}`)
  }

  const form = await request.formData();
  const name = form.get("name")?.toString() ?? '';
  const description = form.get("description")?.toString();

  const group = await createGroup(sessionUser?.sub, name, description);

  return redirect(`/groups/${group.id}`);
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
