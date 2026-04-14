import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { 
  ref, 
  uploadString, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { db, storage } from "./firebase";

export type TravelerPhoto = {
    id: string;           // Firestore document ID or specific ID
    name: string;         // uploader's name
    location: string;     // e.g. "Hunza Valley"
    caption: string;
    dataUrl: string;      // The permanent Firebase Storage URL
    storagePath?: string; // The path in Firebase Storage (to make deletion easier)
    uploadedAt: string;
    fileSize: number;     // in bytes
};

const COLLECTION_NAME = "photos";

export async function savePhoto(photo: Omit<TravelerPhoto, 'id' | 'dataUrl'> & { dataUrl: string }): Promise<void> {
    try {
        // 1. Upload the base64 image to Firebase Storage
        const photoId = `photo-${Date.now()}`;
        const storageRef = ref(storage, `gallery/${photoId}`);
        
        // uploadString handles the dataUrl format (base64)
        const snapshot = await uploadString(storageRef, photo.dataUrl, 'data_url');
        const downloadUrl = await getDownloadURL(snapshot.ref);

        // 2. Save metadata to Firestore
        await addDoc(collection(db, COLLECTION_NAME), {
            name: photo.name,
            location: photo.location,
            caption: photo.caption,
            dataUrl: downloadUrl,
            storagePath: `gallery/${photoId}`,
            uploadedAt: photo.uploadedAt,
            fileSize: photo.fileSize,
            createdAt: new Date().toISOString() // for sorting
        });
    } catch (e) {
        console.error("Failed to save photo to Firebase", e);
        throw new Error("Could not save photo to the cloud.");
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
        console.error("Failed to fetch photos from Firebase", e);
        return [];
    }
}

export async function deletePhoto(id: string, storagePath?: string): Promise<void> {
    try {
        // 1. Delete from Firestore
        await deleteDoc(doc(db, COLLECTION_NAME, id));

        // 2. Delete from Storage if path is provided
        if (storagePath) {
            const storageRef = ref(storage, storagePath);
            await deleteObject(storageRef);
        }
    } catch (e) {
        console.error("Failed to delete photo from Firebase", e);
        throw new Error("Could not delete the photo.");
    }
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "Seed image";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
