import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log("DEBUG ENV:");
console.log("PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log("API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "EXISTS" : "MISSING");

import { db } from './src/lib/firebase';
import { collection, addDoc, getDocs, limit, query } from 'firebase/firestore';

async function test() {
  try {
    console.log("Attempting to read from 'photos' collection...");
    const q = query(collection(db, 'photos'), limit(1));
    const snap = await getDocs(q);
    console.log("Success! Found docs:", snap.size);
  } catch (e: any) {
    console.error("Firebase Error:", e.message);
    console.error("Firebase Code:", e.code);
  }
  process.exit(0);
}

test();
