import { Client, Account } from "node-appwrite";

export default function UseAppwrite() {
  const client = new Client();
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  const account = new Account(client);
  return {
    client: client,
    account,
  };
}

export { ID } from "appwrite";
