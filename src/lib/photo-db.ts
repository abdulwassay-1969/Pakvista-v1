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

export async function savePhoto(photo: Omit<TravelerPhoto, 'id' | 'dataUrl'> & { dataUrl: string }): Promise<void> {
    try {
        // 1. Upload to ImageKit
        // ImageKit node SDK expects a string (base64 is fine), or a Buffer/Stream
        const uploadResponse = await imagekit.upload({
            file: photo.dataUrl, // base64 data URL
            fileName: `photo-${Date.now()}`,
            folder: "/gallery"
        });

        // 2. Save metadata to Firestore (keeping your existing DB)
        await addDoc(collection(db, COLLECTION_NAME), {
            name: photo.name,
            location: photo.location,
            caption: photo.caption,
            dataUrl: uploadResponse.url,
            storagePath: uploadResponse.fileId, // Use fileId for easier deletion
            uploadedAt: photo.uploadedAt,
            fileSize: photo.fileSize,
            createdAt: new Date().toISOString()
        });
    } catch (e: any) {
        console.error("ImageKit/Firestore Error:", e);
        throw new Error(e.message || "Failed to upload photo to the new free storage.");
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

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "Seed image";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
