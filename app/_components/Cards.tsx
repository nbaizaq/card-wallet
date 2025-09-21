import CardList from "./CardList";
import UseAppwrite from "../appwrite-client";
import { ENCRYPTION_IV, ENCRYPTION_SALT } from "@/lib/card";
import { Account, type Models } from "appwrite";
import Header from "./Header";

async function createSaltAndIv({ account, prefs }: { account: Account, prefs: Models.Preferences }) {
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
  const { account } = await UseAppwrite();
  const user = await account.get();

  let iv: Uint8Array<ArrayBuffer> | null = user.prefs[ENCRYPTION_IV] ? new TextEncoder().encode(user.prefs[ENCRYPTION_IV]) : null;
  let salt: Uint8Array<ArrayBuffer> | null = user.prefs[ENCRYPTION_SALT] ? new TextEncoder().encode(user.prefs[ENCRYPTION_SALT]) : null;

  if (!iv || !salt) {
    console.log("creating salt and iv");
    const { salt: _salt, iv: _iv } = await createSaltAndIv({ account, prefs: user.prefs });
    salt = _salt;
    iv = _iv;
  }

  return (
    <div>
      <Header className="mb-4" user={user} />
      <CardList salt={salt} iv={iv} />
    </div>
  )
}