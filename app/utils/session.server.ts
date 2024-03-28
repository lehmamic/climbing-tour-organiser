import { session } from '~/utils/cookies';
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { getEnv } from "./get-env";
import { firebase_admin_app } from './firebase.server';
import { DecodedIdToken, getAuth } from "firebase-admin/auth";

const env = getEnv();
const sessionSecret = env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set!");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const getDecodedIdToken = async (idToken: string): Promise<DecodedIdToken> => {
  const auth = getAuth(firebase_admin_app);
  return await auth.verifyIdToken(idToken);
}

async function getSessionToken(idToken: string) {
  const auth = getAuth(firebase_admin_app);
  const decodedToken = await auth.verifyIdToken(idToken);
  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error("Recent sign in required");
  }
  const twoWeeks = 60 * 60 * 24 * 14 * 1000;
  return await auth.createSessionCookie(idToken, { expiresIn: twoWeeks });
}

async function createUserSession(idToken: string, redirectTo: string) {
  const token = await getSessionToken(idToken);
  const session = await storage.getSession();
  session.set("token", token);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

async function getUserSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  const cookieSession = await storage.getSession(cookie);
  const token = cookieSession.get("token");
  if (!token) {
    return null;
  }

  try {
    const auth = getAuth(firebase_admin_app);
    const tokenUser = await auth.verifySessionCookie(token, true);
    return tokenUser;
  } catch (error) {
    return null;
  }
}

async function getCurrentUser(idToken: DecodedIdToken) {
  const auth = getAuth(firebase_admin_app);
  return await auth.getUser(idToken.sub);

}

async function destroySession(request: Request, redirectTo: string) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const newCookie = await storage.destroySession(session);

  return redirect(redirectTo, { headers: { "Set-Cookie": newCookie } });
}

export { createUserSession, getUserSession, getCurrentUser, destroySession};
