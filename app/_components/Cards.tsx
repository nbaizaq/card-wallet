import CardList from "./CardList";
import UseAppwrite from "../appwrite-client";
import { ENCRYPTION_IV, ENCRYPTION_SALT } from "@/lib/card";
import { type Models } from "appwrite";
import Header from "./Header";

async function createSaltAndIv({ prefs }: { prefs: Models.Preferences }) {
  const { account } = await UseAppwrite();

  const _salt = crypto.getRandomValues(new Uint8Array(16));
  const _iv = crypto.getRandomValues(new Uint8Array(12));
  await account.updatePrefs({
    prefs: {
      ...prefs,
      [ENCRYPTION_SALT]: new TextDecoder('utf-8').decode(_salt),
      [ENCRYPTION_IV]: new TextDecoder('utf-8').decode(_iv),
    }
  });
  return {
    salt: _salt,
    iv: _iv,
  }
}

export default async function Cards() {
  async function fetchUser() {
    try {
      const { account } = await UseAppwrite();
      return await account.get();
    } catch {
      return undefined;
    }
  }

  const user: Models.User | undefined = await fetchUser();
  let salt: Uint8Array<ArrayBuffer> | undefined;
  let iv: Uint8Array<ArrayBuffer> | undefined;
  if (user) {
    iv = user.prefs[ENCRYPTION_IV] ? new TextEncoder().encode(user.prefs[ENCRYPTION_IV]) : undefined;
    salt = user.prefs[ENCRYPTION_SALT] ? new TextEncoder().encode(user.prefs[ENCRYPTION_SALT]) : undefined;

    if (!iv || !salt) {
      const { salt: _salt, iv: _iv } = await createSaltAndIv({ prefs: user.prefs });
      salt = _salt;
      iv = _iv;
    }
  }

  return (
    <div className="mobile-container">
      <Header className="mb-4" user={user} />
      <CardList salt={salt} iv={iv} />
    </div>
  )
}