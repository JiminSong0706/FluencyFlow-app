import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { 
  initializeFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  serverTimestamp, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to session to ensure user starts logged out on fresh browser starts
setPersistence(auth, browserSessionPersistence).catch(err => {
  console.error("Failed to set auth persistence:", err);
});

// Use initializeFirestore to configure specific settings like long polling
// which helps in environments with restrictive firewalls (e.g. some university networks).
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, (firebaseConfig as any).firestoreDatabaseId || '(default)');
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Error handler helper
export const handleFirestoreError = (error: any, operationType: OperationType, path: string | null = null) => {
  if (error?.code === 'permission-denied' || error?.message?.includes('Missing or insufficient permissions')) {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }
  throw error;
};

// Test connection on boot
export async function testFirebaseConnection() {
  try {
    const testDoc = doc(db, 'test', 'connection');
    await getDocFromServer(testDoc);
  } catch (error: any) {
    if (error?.message?.includes('client is offline')) {
      console.error("Firebase connection test failed: client is offline");
    }
  }
}

// Auth wrappers
const formatIdToEmail = (id: string) => {
  if (id.includes('@')) return id;
  return `${id}@fluencyflow.app`; // Append internal domain for ID-based login
};

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signUpWithEmail = async (id: string, pass: string, name: string) => {
  const email = formatIdToEmail(id.trim());
  const res = await createUserWithEmailAndPassword(auth, email, pass.trim());
  await updateProfile(res.user, { displayName: name.trim() });
  return res;
};

export const loginWithEmail = (id: string, pass: string) => {
  const email = formatIdToEmail(id.trim());
  return signInWithEmailAndPassword(auth, email, pass.trim());
};

export const logout = () => signOut(auth);
export const subscribeToAuth = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);
