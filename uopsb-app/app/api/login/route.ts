import { NextResponse } from "next/server";
import { getUserByEmail } from "../../../server/database";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function POST(request: { json: () => any }) {
  try {
    console.log("in login/route.ts");
    const creds = await request.json();
    const user = await getUserByEmail(creds.email);
    if (user) {
      // User already exists
      console.log("user already exists, logging in");
      return new NextResponse(
        JSON.stringify({
          message: "User already exists, logged in successfully",
          user,
        }),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          message: "User does not exist",
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "An error occurred while logging in",
      }),
      { status: 500 }
    );
  }
}
