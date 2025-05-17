
import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCOBgRzwyRVyb7YgUeFYdtP8IzDZ6myEQs",
  authDomain: "gna-complaint.firebaseapp.com",
  projectId: "gna-complaint",
  storageBucket: "gna-complaint.firebasestorage.app",
  messagingSenderId: "547796177350",
  appId: "1:547796177350:web:e017c01b801598fc7222c7",
  databaseURL: "https://gna-complaint-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

export { app, database };
