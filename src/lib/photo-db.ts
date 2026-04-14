'use server';

import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { db } from "./firebase";
import { imagekit } from "./imagekit";

export type TravelerPhoto = {
    id: string;           
    name: string;         
    location: string;     
    caption: string;
    dataUrl: string;      // This will now be the ImageKit URL
    storagePath?: string; // This will now be the ImageKit FileID (for deletion)
    uploadedAt: string;
    fileSize: number;     
};

const COLLECTION_NAME = "photos";

export async function savePhoto(photo: Omit<TravelerPhoto, 'id' | 'dataUrl' | 'storagePath'> & { url: string, fileId: string }): Promise<void> {
    try {
        // 1. Save metadata to Firestore (details provided by client)
        await addDoc(collection(db, COLLECTION_NAME), {
            name: photo.name,
            location: photo.location,
            caption: photo.caption,
            dataUrl: photo.url,
            storagePath: photo.fileId,
            uploadedAt: photo.uploadedAt,
            fileSize: photo.fileSize,
            createdAt: new Date().toISOString()
        });
    } catch (e: any) {
        console.error("Firestore Error:", e);
        throw new Error(e.message || "Failed to save photo details to database.");
    }
}

export async function getAllPhotos(): Promise<TravelerPhoto[]> {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<TravelerPhoto, 'id'>)
        }));
    } catch (e) {
        console.error("Failed to fetch photos from Firestore", e);
        return [];
    }
}

export async function deletePhoto(id: string, fileId?: string): Promise<void> {
    try {
        // 1. Delete from Firestore
        await deleteDoc(doc(db, COLLECTION_NAME, id));

        // 2. Delete from ImageKit if fileId is provided
        if (fileId) {
            await imagekit.deleteFile(fileId);
        }
    } catch (e) {
        console.error("Failed to delete photo from ImageKit/Firestore", e);
        throw new Error("Could not delete the photo.");
    }
}


