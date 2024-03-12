import { App, initializeApp, getApps, cert, getApp, AppOptions } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { getEnv } from "./get-env";

let app: App;
let auth: Auth;

const env = getEnv();

const { privateKey } = JSON.parse(env.FIREBASE_ADMIN_PRIVATE_KEY);
const firebaseAdminConfig: AppOptions = {
  credential: cert({
      projectId: env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    })
}

const firebase_admin_app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApp();

export { firebase_admin_app };
