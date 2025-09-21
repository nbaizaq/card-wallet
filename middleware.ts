import { cookies } from "next/headers";
import UseAppwriteClient from "@/app/appwrite-client";
import { NextRequest, NextResponse } from "next/server";

const config = {
  path: ["/", "/auth/sign-in"],
};

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!config.path.includes(pathname)) return NextResponse.next();

  const authData = await getAuthData();
  const _isAuthenticated = authData !== null;
  if (pathname === "/") {
    if (_isAuthenticated) {
      return NextResponse.next();
    }

    return await redirectToSignIn(request);
  } else if (pathname === "/auth/sign-in") {
    if (_isAuthenticated) {
      return await redirectToHome(request);
    }

    await deleteAuthData();
    return NextResponse.next();
  }
}

async function getAuthData() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(
    `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
  );

  async function fetchUser() {
    if (!authToken?.value) throw new Error("No auth token found");

    const { account, client } = await UseAppwriteClient();
    client.setSession(authToken?.value);
    const user = await account.get();
    return user;
  }

  try {
    return await fetchUser();
  } catch {
    return null;
  }
}

async function redirectToSignIn(request: NextRequest) {
  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = "/auth/sign-in";
  await deleteAuthData();
  return NextResponse.redirect(nextUrl);
}

async function deleteAuthData() {
  const cookieStore = await cookies();
  cookieStore.delete(
    `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
  );
}

function redirectToHome(request: NextRequest) {
  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = "/";
  return NextResponse.redirect(nextUrl);
}
