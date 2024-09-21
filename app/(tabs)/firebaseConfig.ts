import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVj2Zn7Flv8Gs1V14DfkyhxGV6dcmgjHI",
  authDomain: "liferules-1bb5b.firebaseapp.com",
  projectId: "liferules-1bb5b",
  storageBucket: "liferules-1bb5b.appspot.com",
  messagingSenderId: "694929948598",
  appId: "1:694929948598:web:17dbe053ff906c91c78b17"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

