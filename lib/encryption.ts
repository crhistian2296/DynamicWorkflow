import crypto from "crypto";
import "server-only";

const ALG = "aes-256-cbc"; //key length must be 256 bits (32 bytes) and IV must be 12 bytes for AES-GCM
// openssl rand -hex 32
// https://generate-random.org/encryption-key-generator

export const symmetricEncrypt = (data: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key)
    throw new Error("Encryption key not found in environment variables");
  const iv = crypto.randomBytes(16); // AES-CBC requires a 16-byte IV
  const cipher = crypto.createCipheriv(ALG, Buffer.from(key, "hex"), iv);

  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Combine IV and ciphertext for storage
  const combined = `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  return combined;
  // Example output: iv (16 bytes):ciphertext
};

export const symmetricDecrypt = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key)
    throw new Error("Encryption key not found in environment variables");

  const [ivHex, encryptedHex] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedData = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALG, Buffer.from(key, "hex"), iv);
  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

// export const encrypt = async (plaintext: string, key: CryptoKey) => {
//   const iv = crypto.getRandomValues(new Uint8Array(12));
//   const encoder = new TextEncoder();
//   const ciphertext = await crypto.subtle.encrypt(
//     {
//       name: ALG,
//       iv,
//     },
//     key,
//     encoder.encode(plaintext),
//   );

//   // Combine IV and ciphertext for storage
//   const combined = new Uint8Array(iv.length + ciphertext.byteLength);
//   combined.set(iv, 0);
//   combined.set(new Uint8Array(ciphertext), iv.length);

//   return btoa(String.fromCharCode(...combined));
// };

// export const decrypt = async (ciphertext: string, key: CryptoKey) => {
//   const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
//   const iv = combined.slice(0, 12);
//   const encryptedData = combined.slice(12);

//   const decrypted = await crypto.subtle.decrypt(
//     {
//       name: ALG,
//       iv,
//     },
//     key,
//     encryptedData,
//   );

//   const decoder = new TextDecoder();
//   return decoder.decode(decrypted);
// };
