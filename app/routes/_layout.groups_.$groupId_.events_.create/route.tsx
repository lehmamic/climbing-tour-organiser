import { Button, Input, Textarea } from "@nextui-org/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import * as React from "react";


export const action: ActionFunction = async ({ request }) => {
  return null;
};

const CreateEventPage: React.FunctionComponent = () => {
  return (
    <>
      <h1>Create an event</h1>
      <Form method="POST" className="space-y-6">
        <Input type="text" name="name" label="Name" id="name" variant="bordered" placeholder="Name your group" isRequired className="block w-full" />
        <Textarea name="details" label="details" id="details" variant="bordered" placeholder="Details about the event" isRequired className="block w-full" />
        <Button type="submit" color="primary">Create</Button>
      </Form>
    </>
  );
}

export default CreateEventPage;
