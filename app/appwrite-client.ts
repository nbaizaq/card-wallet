import { Client, Account } from "appwrite";
import { cookies } from "next/headers";

export default async function UseAppwrite() {
  const client = new Client();
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(
      `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    );
    if (!authToken?.value) throw new Error("No auth token found");
    client.setSession(authToken?.value);
  } catch {}

  const account = new Account(client);
  return {
    client,
    account,
  };
}

export { ID } from "appwrite";
