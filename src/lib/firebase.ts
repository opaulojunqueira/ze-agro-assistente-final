
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Validate required environment variables
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if all required environment variables are present
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => `VITE_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

if (missingVars.length > 0) {
  console.error('❌ Firebase configuration error: Missing environment variables');
  console.error('📝 Missing variables:', missingVars.join(', '));
  console.error('🔧 Please create a .env file in your project root with the Firebase configuration');
  console.error('📋 Use .env.example as a template');
  
  throw new Error(
    `Firebase configuration incomplete. Missing environment variables: ${missingVars.join(', ')}. ` +
    'Please create a .env file with your Firebase configuration.'
  );
}

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey,
  authDomain: requiredEnvVars.authDomain,
  projectId: requiredEnvVars.projectId,
  storageBucket: requiredEnvVars.storageBucket,
  messagingSenderId: requiredEnvVars.messagingSenderId,
  appId: requiredEnvVars.appId
};

console.log('🔥 Initializing Firebase with project:', requiredEnvVars.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
