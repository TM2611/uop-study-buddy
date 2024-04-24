import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const client = await pool.connect();

    const sessionID = request.nextUrl.searchParams.get("sessionID");
    const userID = request.nextUrl.searchParams.get("userID");
    const body = await request.json();
    const rating = body.rating;
    const feedback = body.feedback;
    const query =
      "UPDATE student_session SET rating = $1, feedback = $2 WHERE session_id = $3 AND user_id = $4";

    await client.query(query, [rating, feedback, sessionID, userID]);
    return new NextResponse(
      JSON.stringify({
        message: "Feedback saved successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "An error occurred while saving feedback",
      }),
      { status: 500 }
    );
  }
}
