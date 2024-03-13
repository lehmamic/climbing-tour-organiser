import * as React from "react";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { NextUIProvider } from "@nextui-org/react";

import stylesheet from "~/tailwind.css";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet }
];

export async function loader() {
  return json({
    ENV: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    },
  });
}

const App: React.FunctionComponent = () => {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider navigate={navigate}>
          <Outlet />
          <ScrollRestoration />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(
                data.ENV
              )}`,
            }}
          />
          <Scripts />
          <LiveReload />
        </NextUIProvider>
      </body>
    </html>
  );
}

export default App;
