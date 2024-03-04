import pool from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
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

async function getUserByEmail(email: string) {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM student WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}
