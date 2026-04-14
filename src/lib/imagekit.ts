import ImageKit from "imagekit";

// Server-side instance (for deletions and auth generation)
let imagekitInstance: ImageKit | null = null;

export const getImageKit = () => {
  if (!imagekitInstance) {
    const publicKey = (process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "").trim();
    const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY || "").trim();
    const urlEndpoint = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").trim();

    if (!publicKey || !privateKey || !urlEndpoint) {
      console.warn("⚠️ ImageKit environment variables are missing.");
    }

    imagekitInstance = new ImageKit({
      publicKey: publicKey || "missing",
      privateKey: privateKey || "missing",
      urlEndpoint: urlEndpoint || "missing",
    });
  }
  return imagekitInstance;
};

// Client-side config helper
export const IK_CONFIG = {
  publicKey: (process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "").trim(),
  urlEndpoint: (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").trim(),
};
