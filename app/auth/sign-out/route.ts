import UseAppwrite from "@/app/appwrite-client";
import { cookies } from "next/headers";

export async function POST() {
  const { account } = await UseAppwrite();
  const session = await account.getSession({
    sessionId: "current",
  });
  await account.deleteSession({
    sessionId: session.$id,
  });

  const cookieStore = await cookies();
  cookieStore.delete(
    `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
  );

  return Response.json({ message: "Logged out" });
}
