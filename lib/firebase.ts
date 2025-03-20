import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  printifyApiKey?: string;
  printifyShopId?: string;
  stripeAccountId?: string;
  createdAt: string;
  updatedAt: string;
}

export async function signIn(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signUp(email: string, password: string, displayName: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user profile in Firestore
  const userProfile: UserProfile = {
    uid: userCredential.user.uid,
    email,
    displayName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
  
  return userCredential.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() as UserProfile : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function updatePrintifyCredentials(
  uid: string,
  apiKey: string,
  shopId: string
): Promise<void> {
  await updateUserProfile(uid, {
    printifyApiKey: apiKey,
    printifyShopId: shopId,
  });
}

export async function updateStripeAccountId(
  uid: string,
  stripeAccountId: string
): Promise<void> {
  await updateUserProfile(uid, {
    stripeAccountId,
  });
}

export { auth, db }; 