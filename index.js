// - derive key from password and salt
// - encrypt data with derived key as key and data

// - derive key from password and salt
// - decrypt data with derived key as key and data

const crypto = require("crypto");
const pbkdf2 = require("pbkdf2");
const subtle = crypto.subtle;

const password = "my-password";

const salt = crypto.getRandomValues(new Uint8Array(16)); // A unique, random salt for each encryption
const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM requires a 12-byte IV
const data = {
  name: "OPTIMA",
  currency: "KGS",
  holder: "NURBEK BAIZAKOV",
  number: "4169585355110809",
  cvv: "194",
  expire: "09/2029",
  pin: "9798",
};
const plaintext = JSON.stringify(data);

console.log("salt", salt);

// const hashedValue = subtle.digest('SHA-256', new TextEncoder().encode('some-secret'))

async function deriveAesKey(password, salt) {
  var derivedKey = pbkdf2.pbkdf2Sync(password, salt, 1000, 32, "sha512");
  console.log("derivedKey", derivedKey.toString("hex"));

  const importedKey = await subtle.importKey(
    "raw",
    new TextEncoder().encode(derivedKey),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return subtle.deriveKey(
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
}

async function encryptWithDerivedKey(derivedAesKey, plaintext) {
  const encryptedData = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    derivedAesKey,
    new TextEncoder().encode(plaintext)
  );

  // Return both the IV and the encrypted data
  return { encryptedData };
}

// // Example usage

// // Assume 'userPassword' is a variable holding the user's password
deriveAesKey(password, salt).then((derivedKey) => {
  encryptWithDerivedKey(derivedKey, plaintext).then(
    (result) => {
      // console.log("Encrypted data:", result.encryptedData);
      // You should store the salt, IV, and encrypted data for later decryption

      subtle
        .decrypt(
          {
            name: "AES-GCM",
            iv: iv,
          },
          derivedKey,
          result.encryptedData
        )
        .then((data) => {
          console.log("Decrypted data:", new TextDecoder().decode(data));
        });
    }
  );
});
