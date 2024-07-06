import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBXnnIHnqP_HrwlblUXqk1KuZztCORRjGg",
  authDomain: "datmetrics-6aa86.firebaseapp.com",
  projectId: "datmetrics-6aa86",
  storageBucket: "datmetrics-6aa86.appspot.com",
  messagingSenderId: "498621462870",
  appId: "1:498621462870:web:9de7a36d606c9778a2fef7",
  measurementId: "G-RGHWDNRSTQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
