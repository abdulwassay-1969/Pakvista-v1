import ImageKit from "imagekit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

async function testAuth() {
  try {
    const params = imagekit.getAuthenticationParameters();
    console.log("Auth Parameters Generated:", params);
    
    // Attempt a tiny test upload (empty string or small buffer) to verify credentials
    // Note: This might fail logic-wise but should pass authentication-wise
    console.log("Testing credentials with a dummy list request...");
    const files = await imagekit.listFiles({ limit: 1 });
    console.log("Successfully authenticated! Files found:", files.length);
  } catch (err: any) {
    console.error("Auth Test Failed!");
    console.error("Error Message:", err.message);
    console.error("Full Error:", err);
  }
}

testAuth();
