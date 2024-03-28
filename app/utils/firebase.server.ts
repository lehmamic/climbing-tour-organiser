import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert, getApp, AppOptions } from "firebase-admin/app";
import { getEnv } from "./get-env";

const env = getEnv();

const { privateKey } = JSON.parse(env.FIREBASE_ADMIN_PRIVATE_KEY);
const firebaseAdminConfig: AppOptions = {
  credential: cert({
      projectId: env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    })
}

export const firebase_admin_app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApp();

export const getFirestoreDatabase = () => getFirestore(firebase_admin_app);

export const firestoreConverter = <T>() => ({
  toFirestore: (data: Partial<T>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (<any>data).id;
    return data;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => ({ ...snap.data(), id: snap.id }) as T
})
