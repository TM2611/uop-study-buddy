import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "../../../server/database";

export async function POST(request: { json: () => any }) {
  try {
    const creds = await request.json();
    const user = await getUserByEmail(creds.email);

    if (user) {
      // User already exists
      return new NextResponse(
        JSON.stringify({
          message: "User already exists, logged in successfully",
          user,
        }),
        { status: 200 }
      );
    } else {
      // Create user
      const response = await createUser(creds);
      if (!response) throw new Error("Could not create user");
      return new NextResponse(
        JSON.stringify({
          message: "User created successfully",
          user: creds,
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "An error occurred while logging in the user",
      }),
      { status: 500 }
    );
  }
}
