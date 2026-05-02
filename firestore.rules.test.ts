import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { 
  initializeTestEnvironment, 
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

const PROJECT_ID = 'rules-test-project';
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: 'localhost',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Security Rules', () => {
  const aliceId = 'alice-uid';
  const bobId = 'bob-uid';
  const aliceAuth = { uid: aliceId, token: { email_verified: true, email: 'alice@example.com' } };
  const bobAuth = { uid: bobId, token: { email_verified: true, email: 'bob@example.com' } };
  const unverifiedAuth = { uid: aliceId, token: { email_verified: false, email: 'alice@example.com' } };
  const adminAuth = { uid: 'admin-uid', token: { email_verified: true, email: 'chaewon2681@snu.ac.kr' } };
  const internalUserAuth = { uid: 'internal-uid', token: { email_verified: false, email: '123456789@fluencyflow.app' } };

  function getAliceDb() {
    return testEnv.authenticatedContext(aliceId, aliceAuth.token).firestore();
  }

  function getBobDb() {
    return testEnv.authenticatedContext(bobId, bobAuth.token).firestore();
  }

  function getUnverifiedDb() {
    return testEnv.authenticatedContext(aliceId, unverifiedAuth.token).firestore();
  }

  function getAdminDb() {
    return testEnv.authenticatedContext('admin-uid', adminAuth.token).firestore();
  }

  function getUnauthenticatedDb() {
    return testEnv.unauthenticatedContext().firestore();
  }

  function getInternalUserDb() {
    return testEnv.authenticatedContext('internal-uid', internalUserAuth.token).firestore();
  }

  const validProfile = {
    userId: aliceId,
    email: 'alice@example.com',
    name: 'Alice',
    role: 'student',
    collectedItems: [],
    sessionsCount: 0,
    ornamentInventory: {},
    updatedAt: '2024-01-01T00:00:00Z'
  };

  describe('UserProfile', () => {
    it('allows a verified user to create their own profile', async () => {
      const db = getAliceDb();
      const profileDoc = doc(db, 'users', aliceId);
      await expect(setDoc(profileDoc, validProfile)).resolves.toBeUndefined();
    });

    it('denies an unverified user from creating a profile', async () => {
      const db = getUnverifiedDb();
      const profileDoc = doc(db, 'users', aliceId);
      await expect(setDoc(profileDoc, validProfile)).rejects.toThrow();
    });

    it('allows a user with @fluencyflow.app domain to create profile even if unverified', async () => {
      const db = getInternalUserDb();
      const internalId = 'internal-uid';
      const profileDoc = doc(db, 'users', internalId);
      await expect(setDoc(profileDoc, {
        ...validProfile,
        userId: internalId,
        email: '123456789@fluencyflow.app'
      })).resolves.toBeUndefined();
    });

    it('denies creating a profile for another user', async () => {
      const db = getAliceDb();
      const profileDoc = doc(db, 'users', bobId);
      await expect(setDoc(profileDoc, { ...validProfile, userId: bobId })).rejects.toThrow();
    });

    it('denies profile creation with missing fields', async () => {
      const db = getAliceDb();
      const profileDoc = doc(db, 'users', aliceId);
      const invalidProfile = { ...validProfile };
      delete (invalidProfile as any).role;
      await expect(setDoc(profileDoc, invalidProfile)).rejects.toThrow();
    });

    it('allows owner to update specific fields', async () => {
      const admin = getAdminDb();
      await setDoc(doc(admin, 'users', aliceId), validProfile);

      const db = getAliceDb();
      await expect(updateDoc(doc(db, 'users', aliceId), { 
        name: 'Alice Updated', 
        updatedAt: '2024-01-01T01:00:00Z' 
      })).resolves.toBeUndefined();
    });

    it('denies owner from updating immutable fields', async () => {
      const admin = getAdminDb();
      await setDoc(doc(admin, 'users', aliceId), validProfile);

      const db = getAliceDb();
      await expect(updateDoc(doc(db, 'users', aliceId), { role: 'teacher' })).rejects.toThrow();
    });
  });

  describe('Sessions', () => {
    const validSession = {
      id: 'sess1',
      timestamp: Date.now(),
      transcript: [],
      scenarioTitle: 'Intro'
    };

    it('denies session creation if user profile does not exist', async () => {
      const db = getAliceDb();
      const sessDoc = doc(db, 'users', aliceId, 'sessions', 'sess1');
      await expect(setDoc(sessDoc, validSession)).rejects.toThrow();
    });

    it('allows session creation if user profile exists', async () => {
      const admin = getAdminDb();
      await setDoc(doc(admin, 'users', aliceId), validProfile);

      const db = getAliceDb();
      const sessDoc = doc(db, 'users', aliceId, 'sessions', 'sess1');
      await expect(setDoc(sessDoc, validSession)).resolves.toBeUndefined();
    });

    it('denies session creation for another user', async () => {
      const admin = getAdminDb();
      await setDoc(doc(admin, 'users', bobId), { ...validProfile, userId: bobId });

      const db = getAliceDb();
      const sessDoc = doc(db, 'users', bobId, 'sessions', 'sess1');
      await expect(setDoc(sessDoc, validSession)).rejects.toThrow();
    });
  });

  describe('Admin Access', () => {
    it('allows admin to list all users', async () => {
      const db = getAdminDb();
      await expect(getDocs(collection(db, 'users'))).resolves.toBeDefined();
    });

    it('denies non-admin from listing all users', async () => {
      const db = getAliceDb();
      await expect(getDocs(collection(db, 'users'))).rejects.toThrow();
    });
  });
});
