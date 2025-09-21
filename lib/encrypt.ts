import crypto from "crypto";
import pbkdf2 from "pbkdf2";

async function deriveAesKey(password: string, salt: Uint8Array) {
  const derivedKey = pbkdf2.pbkdf2Sync(password, salt, 1000, 32, "sha512");
  const subtle = crypto?.subtle ?? window.crypto.subtle;
  const importedKey = await subtle.importKey(
    "raw",
    derivedKey,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  const derivedAesKey = await subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000, // A high number of iterations for security
      hash: "SHA-256",
    },
    importedKey,
    { name: "AES-GCM", length: 256 },
    true, // The derived key should be extractable
    ["encrypt", "decrypt"] // The key can be used for encryption and decryption
  );
  return derivedAesKey;
}

async function decrypt(
  password: string,
  salt: Uint8Array,
  iv: Uint8Array,
  data: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const derivedAesKey = await deriveAesKey(password, salt);
      const subtle = crypto?.subtle ?? window.crypto.subtle;
      const result = await subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        derivedAesKey,
        Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
      );
      return resolve(new TextDecoder().decode(result));
    } catch (error) {
      return reject(error);
    }
  });
}

async function encrypt(
  password: string,
  salt: Uint8Array,
  iv: Uint8Array,
  data: string
) {
  return new Promise(async (resolve, reject) => {
    try {
      const derivedAesKey = await deriveAesKey(password, salt);
      const subtle = crypto?.subtle ?? window.crypto.subtle;
      const result = await subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        derivedAesKey,
        new TextEncoder().encode(data)
      );

      return resolve(
        btoa(
          String.fromCharCode.apply(null, Array.from(new Uint8Array(result)))
        )
      );
    } catch (error) {
      return reject(error);
    }
  });
}

export const MASTER_KEY = "encryption:master-key";
export { decrypt, encrypt };
