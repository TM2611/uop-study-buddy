import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { URL } from "url";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const courseCode = url.searchParams.get("course");

    const courseUsers = await getUsersByCourse(email || "", courseCode || "");
    if (courseUsers.length) {
      console.log(courseUsers.length, " users on course");
      return new NextResponse(
        JSON.stringify({
          message: `${courseUsers.length}, " users on course"`,
          courseUsers,
        }),
        { status: 200 }
      );
    } else {
      console.log("No users on course");
      //TODO: return all users
      return new NextResponse(
        JSON.stringify({
          message: "No users on course",
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "An error occurred while fetching users",
      }),
      { status: 500 }
    );
  }
}

async function getUsersByCourse(email: string, courseCode: string) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "SELECT * FROM user WHERE course_code = $1 AND email != $2",
      [courseCode, email]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}
