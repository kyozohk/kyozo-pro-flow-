// Firebase configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set custom metadata for CORS
const storageCustomMetadata = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Configure Firebase Storage for development environment
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Add CORS headers to storage requests
  const originalXhr = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    const args = Array.prototype.slice.call(arguments);
    const originalOnReadyStateChange = this.onreadystatechange;
    
    if (url && typeof url === 'string' && url.includes('firebasestorage.googleapis.com')) {
      this.onreadystatechange = function() {
        if (this.readyState === 4) {
          // Add CORS headers to the response
          Object.defineProperty(this, 'getAllResponseHeaders', {
            value: function() {
              return 'access-control-allow-origin: *\r\n' + 
                     'access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS\r\n' + 
                     'access-control-allow-headers: Content-Type\r\n';
            }
          });
        }
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments);
        }
      };
    }
    
    return originalXhr.apply(this, args);
  };
}

export { app, auth, db, storage, storageCustomMetadata };
