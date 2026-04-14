
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// 1. Manually load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ Found .env.local');
  dotenv.config({ path: envPath });
} else {
  console.error('❌ .env.local NOT found at', envPath);
  process.exit(1);
}

// 2. Import Firebase and ImageKit after env is loaded
import { db } from './firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, query, limit } from 'firebase/firestore';
import { getImageKit } from './imagekit';

async function diagnose() {
  console.log('\n--- 🔥 Firebase Diagnosis ---');
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
  
  console.log(`API Key: ${apiKey.substring(0, 5)}... (Length: ${apiKey.length})`);
  console.log(`Project ID: ${projectId} (Length: ${projectId.length})`);

  if (projectId !== projectId.trim()) {
    console.error('❌ ERROR: Project ID has leading/trailing spaces!');
  }

  try {
    console.log('Attempting Firestore write to "diagnostics" collection...');
    const testDoc = await addDoc(collection(db, 'diagnostics'), {
      timestamp: new Date().toISOString(),
      message: 'Connectivity test from diagnostic script'
    });
    console.log('✅ Firestore Write SUCCESS. Doc ID:', testDoc.id);

    console.log('Attempting Firestore read...');
    const q = query(collection(db, 'diagnostics'), limit(1));
    const snapshot = await getDocs(q);
    console.log('✅ Firestore Read SUCCESS. Found', snapshot.size, 'docs.');

    console.log('Cleaning up test doc...');
    await deleteDoc(doc(db, 'diagnostics', testDoc.id));
    console.log('✅ Firestore Delete SUCCESS.');
  } catch (err: any) {
    console.error('❌ Firebase Error:', err.message);
    if (err.code) console.error('Error Code:', err.code);
  }

  console.log('\n--- 🖼️ ImageKit Diagnosis ---');
  const ikPubKey = (process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '').trim();
  const ikPrivKey = (process.env.IMAGEKIT_PRIVATE_KEY || '').trim();
  const ikEndpoint = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '').trim();

  console.log(`Public Key: ${ikPubKey.substring(0, 8)}... (Length: ${ikPubKey.length})`);
  console.log(`Private Key: ${ikPrivKey.substring(0, 5)}... (Length: ${ikPrivKey.length})`);
  console.log(`Endpoint: ${ikEndpoint} (Length: ${ikEndpoint.length})`);

  try {
    const ik = getImageKit();
    console.log('Testing ImageKit Auth Parameters generation...');
    const auth = ik.getAuthenticationParameters();
    console.log('✅ Auth Params generated:', {
      token: auth.token ? 'PRESENT' : 'MISSING',
      signature: auth.signature ? 'PRESENT' : 'MISSING',
      expire: auth.expire
    });

    console.log('Testing a small buffer upload (server-side)...');
    // Using a tiny valid image buffer (1x1 transparent pixel) or just text
    const testFile = Buffer.from('test-diagnostic-content');
    const uploadResult = await ik.upload({
      file: testFile,
      fileName: 'test-diag.txt',
      folder: '/diagnostics'
    });
    console.log('✅ ImageKit Upload SUCCESS. URL:', uploadResult.url);

    console.log('Cleaning up test file...');
    await ik.deleteFile(uploadResult.fileId);
    console.log('✅ ImageKit Delete SUCCESS.');

  } catch (err: any) {
    console.error('❌ ImageKit Error:', err.message);
    if (err.stack) console.error('Stack Trace:', err.stack);
  }
}

diagnose();
