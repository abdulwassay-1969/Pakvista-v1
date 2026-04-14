import ImageKit from "imagekit";

let imagekitInstance: ImageKit | null = null;

export const getImageKit = () => {
  if (!imagekitInstance) {
    if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
      console.warn("⚠️ ImageKit environment variables are missing.");
      // Return a dummy instance or handle error inside the caller
    }
    
    const publicKey = (process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "").trim();
    const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY || "").trim();
    const urlEndpoint = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").trim();

    imagekitInstance = new ImageKit({
      publicKey: publicKey || "missing",
      privateKey: privateKey || "missing",
      urlEndpoint: urlEndpoint || "missing",
    });
  }
  return imagekitInstance;
};
