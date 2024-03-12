import * as React from 'react';
import { ActionFunction } from '@remix-run/node';
import { Form, Link, useFetcher } from '@remix-run/react';
import { firebase_app } from "~/utils/firebase.client";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { createUserSession } from '~/utils/session.server';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const idToken = form.get("idToken")?.toString() ?? '';

  return await createUserSession(idToken, '/');
};

const LoginPage: React.FunctionComponent = () => {
  const fetcher = useFetcher();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;

    try {
      const auth = getAuth(firebase_app);
      const credential = await signInWithEmailAndPassword(auth, email, password);
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
