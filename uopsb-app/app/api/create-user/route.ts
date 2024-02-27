import { NextResponse } from "next/server";
import { createUser } from "../../../server/database";
import { UserProfileType } from "@/app/types";

export async function POST(request: any) {
  try {
    const body = await request.text();
    const userProfile: UserProfileType = JSON.parse(body);
    const isCreatedUser = await createUser(userProfile);
    if (isCreatedUser) {
      return new NextResponse(
        JSON.stringify({
          message: "User created succssfully",
        }),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          message: "User could not be created",
        }),
        { status: 501 }
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
