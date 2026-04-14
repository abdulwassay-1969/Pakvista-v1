import ImageKit from "imagekit";

let imagekitInstance: ImageKit | null = null;

export const getImageKit = () => {
  if (!imagekitInstance) {
    if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
      console.warn("⚠️ ImageKit environment variables are missing.");
      // Return a dummy instance or handle error inside the caller
    }
    
    imagekitInstance = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "missing",
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "missing",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "missing",
    });
  }
  return imagekitInstance;
};
