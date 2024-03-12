import * as React from 'react';
import { ActionFunction, redirect } from '@remix-run/node';
import { Form, Link, useFetcher } from '@remix-run/react';
import { auth as serverAuth } from "~/utils/firebase.server";
import { auth as clientAuth } from "~/utils/firebase.client";
import { session } from '~/utils/cookies';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const idToken = form.get("idToken")?.toString() ?? '';

  // Verify the idToken is actually valid
  await serverAuth.verifyIdToken(idToken);

  const jwt = await serverAuth.createSessionCookie(idToken, {
    // 5 days - can be up to 2 weeks
    expiresIn: 60 * 60 * 24 * 5 * 1000,
  });

  return redirect("/", {
    headers: {
      "Set-Cookie": await session.serialize(jwt),
    },
  });
};

const LoginPage: React.FunctionComponent = () => {
  const fetcher = useFetcher();

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;

    try {
      const credential = await signInWithEmailAndPassword(clientAuth, email, password);
      const idToken = await credential.user.getIdToken();

      // Trigger a POST request which the action will handle
      fetcher.submit({ idToken }, { method: "post", action: "/login" });
    } catch (e: Error) {
      // Handle errors...
    }
  }

  return (
    <div className="login">
      <h1>Login Page</h1>

      <Form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
      </Form>

      <Link to="/signup">Create Account</Link>
    </div>
  );
}

export default LoginPage;
