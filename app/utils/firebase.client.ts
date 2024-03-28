import { initializeApp, getApps, FirebaseApp, FirebaseOptions, getApp } from "firebase/app";
import { Auth, getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";
import { getEnv } from "./get-env";

let firebase_app: FirebaseApp;

const env = getEnv();

const firebaseConfig: FirebaseOptions = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
    measurementId: env.FIREBASE_MEASUREMENT_ID,
};

if (getApps().length === 0) {
  firebase_app = initializeApp(firebaseConfig);
  const auth = getAuth(firebase_app);

  // Let Remix handle the persistence via session cookies.
  setPersistence(auth, inMemoryPersistence);
} else {
  firebase_app = getApp();
}

export { firebase_app };
