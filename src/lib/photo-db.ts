// LocalStorage utility for storing traveler-uploaded HD photos

const STORE_KEY = 'pakvista-gallery-photos';

export type TravelerPhoto = {
    id: string;
    name: string;         // uploader's name
    location: string;     // e.g. "Hunza Valley"
    caption: string;
    dataUrl: string;      // base64 data URL of the HD image
    uploadedAt: string;
    fileSize: number;     // in bytes
};

function getStoredPhotos(): TravelerPhoto[] {
    if (typeof window === 'undefined') return [];
    try {
        const item = window.localStorage.getItem(STORE_KEY);
        if (item) {
            return JSON.parse(item) as TravelerPhoto[];
        }
    } catch (e) {
        console.error("Failed to parse stored photos", e);
    }
    return [];
}

function setStoredPhotos(photos: TravelerPhoto[]) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORE_KEY, JSON.stringify(photos));
    } catch (e) {
         console.error("Failed to store photos", e);
    }
}

export async function savePhoto(photo: TravelerPhoto): Promise<void> {
    const photos = getStoredPhotos();
    photos.push(photo);
    setStoredPhotos(photos);
    return Promise.resolve();
}

export async function getAllPhotos(): Promise<TravelerPhoto[]> {
    const photos = getStoredPhotos();
    return Promise.resolve(photos.reverse());
}

export async function deletePhoto(id: string): Promise<void> {
    let photos = getStoredPhotos();
    photos = photos.filter(p => p.id !== id);
    setStoredPhotos(photos);
    return Promise.resolve();
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
