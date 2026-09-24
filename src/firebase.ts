import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseConfigured = Object.values(config).every(Boolean)

export const firebaseApp = firebaseConfigured
  ? getApps().length ? getApp() : initializeApp(config)
  : null

export const auth = firebaseApp ? getAuth(firebaseApp) : null
export const googleProvider = new GoogleAuthProvider()

export const db = firebaseApp
  ? initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    })
  : null

export async function keepSession() {
  if (auth) await setPersistence(auth, browserLocalPersistence)
}
