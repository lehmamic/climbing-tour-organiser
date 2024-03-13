import * as React from 'react';
import { ActionFunction } from '@remix-run/node';
import { Form, Link, useFetcher } from '@remix-run/react';
import { firebase_app } from "~/utils/firebase";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { createUserSession } from '~/utils/session.server';
import { Button, Input } from '@nextui-org/react';

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
    } catch (e: unknown) {
      // Handle errors...
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link to="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
            Flowbite
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <Form className="space-y-6" onSubmit={handleSubmit}>
                <Input type="email" name="email" label="Your email" id="email" variant="bordered" className="block w-full" placeholder="name@company.com" isRequired />
                <Input type="password" name="password" label="Password" id="password" variant="bordered" placeholder="••••••••" className="block w-full" isRequired />
                {/* <div className="flex items-center justify-between">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                        </div>
                    </div>
                    <Link to="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</Link>
                </div> */}
                <Button type="submit" color="primary" className='w-full py-2.5 font-medium'>Sign in</Button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don’t have an account yet? <Link to="/signup" className="font-medium text-primary hover:underline dark:text-primary">Register</Link>
                </p>
              </Form>
            </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
