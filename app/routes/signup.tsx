import * as React from 'react';
import { ActionFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { signUp } from "~/utils/auth.server";
import { createUserSession } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

//   invariant(
//     formData?.email && typeof formValues?.email === 'string',
//     "email is empty or isn't a string type",
// )
//   invariant(
//     formData?.password && typeof formValues?.password === 'string',
//     "password is empty or isn't a string type",
// )

  const email = formData.get("email");
  const password = formData.get("password");

  const { user } = await signUp(email, password );
  const token = await user.getIdToken();
  return createUserSession(token, "/");
};

const SignUpPage: React.FunctionComponent = () => {
  return (
    <div className="signup">
      <h1>Sign Up Page</h1>

      <Form method="post">
        <p>
          <label>
            Email
            <input type="email" name="email" />
          </label>
        </p>
        <p>
          <label>
            Password
            <input type="password" name="password" />
          </label>
        </p>

        <button type="submit">Sign Up</button>
      </Form>

      <Link to="/login">Go to Login</Link>
    </div>
  );
}

export default SignUpPage;
