"use server";

import UseAppwrite from "@/app/appwrite";
import { SigninFormSchema, FormState } from "../definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppwriteException } from "appwrite";

export async function signin(state: FormState, formData: FormData) {
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  const { account } = await UseAppwrite();

  try {
    const response = await account.createEmailPasswordSession({
      email,
      password,
    });

    const cookieStore = await cookies();
    cookieStore.set(
      `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      response.secret,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(response.expire),
        sameSite: "strict",
        path: "/",
      }
    );
  } catch (error: unknown) {
    try {
      if ("response" in (error as AppwriteException)) {
        const response = JSON.parse(
          (error as AppwriteException)?.response ?? "Something went wrong"
        );
        const message = response.message ?? "Something went wrong";
        return {
          error: message,
        };
      }
    } catch {}

    return {
      error: (error as Error)?.message ?? "Something went wrong",
    };
  }

  redirect("/");
}
