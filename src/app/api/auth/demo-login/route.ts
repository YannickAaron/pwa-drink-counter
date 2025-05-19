import { NextRequest, NextResponse } from "next/server";
import { signIn } from "~/server/auth";

export async function GET(req: NextRequest) {
  // Use the signIn function to create a session for the demo user
  return signIn("demo-credentials", {
    username: "demo",
    password: "demo",
    redirect: true,
    redirectTo: "/",
  });
}