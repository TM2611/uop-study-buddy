
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAllUserSessions } from "../session/route";
import { UserSessionData } from "@/app/types";

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  try {
    const sessionID = request.nextUrl.searchParams.get("sessionID");
    const userID = request.nextUrl.searchParams.get("userID");
    const body = await request.json();
    const rating = body.rating;
    const feedback = body.feedback;
    if (!sessionID || !userID) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid session ID or user ID",
        }),
        { status: 400 }
      );
    }
    const query =
      "UPDATE student_session SET rating = $1, feedback = $2 WHERE session_id = $3 AND user_id = $4 ";

    await client.query(query, [rating, feedback, sessionID, userID]);
    const updatedUserSessions: UserSessionData[] = await getAllUserSessions(
      userID,
      client
    );

    return new NextResponse(
      JSON.stringify({
        data: updatedUserSessions,
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
  } finally {
    client.release();
  }
}
