import { MatchType } from "@/app/types";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const topic_id = req.nextUrl.searchParams.get("topic_id");
    const match_type = req.nextUrl.searchParams.get("match_type");
    const user_id = req.nextUrl.searchParams.get("id");

    if (!user_id || !topic_id || !match_type) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request",
        }),
        { status: 400 }
      );
    }

    if (match_type === "Department") {
      const users = await getUsersByDepartment(user_id);
      if (users.length) {
        console.log(users.length, "users in department");
        return new NextResponse(
          JSON.stringify({
            message: `${users.length} users in department"`,
            users,
          }),
          { status: 200 }
        );
      } else {
        console.log("No users in department");
        return new NextResponse(
          JSON.stringify({
            message: "No users in department",
          }),
          { status: 200 }
        );
      }
    } else if (match_type === "Similarity") {
      const users = await getUsersBySimilarity(user_id);
      if (users.length) {
        console.log(users.length, "similar users");
        return new NextResponse(
          JSON.stringify({
            message: `${users.length} similar users"`,
            users,
          }),
          { status: 200 }
        );
      } else {
        console.log("No similar users");
        return new NextResponse(
          JSON.stringify({
            message: "No similar users",
          }),
          { status: 200 }
        );
      }
    } else if (match_type === "Confidence") {
      const confidenceUsers = await getUsersByConfidence(user_id, topic_id);
      if (confidenceUsers.length) {
        console.log(confidenceUsers.length, "users with high confidence");
        return new NextResponse(
          JSON.stringify({
            message: `${confidenceUsers.length} users with high confidence"`,
            confidenceUsers,
          }),
          { status: 200 }
        );
      } else {
        console.log("No users with high confidence");
        return new NextResponse(
          JSON.stringify({
            message: "No users with high confidence",
          }),
          { status: 200 }
        );
      }
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

async function getUsersByDepartment(user_id: string) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT s.*
      FROM student s
      JOIN course c1 ON s.course_code = c1.course_code
      JOIN course c2 ON c1.department_id = c2.department_id
      WHERE c2.course_code = (
          SELECT course_code
          FROM student
          WHERE id = $1
      );`,
      [user_id]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}

async function getUsersBySimilarity(id: string) {
  return [];
  /* 
    TODO: Use jaccard similarity to find users with similar topic confidence,
    return users with similar topic confidence (above a certain threshold, 0.75)
    */
}

async function getUsersByConfidence(id: string, topic_id: string) {
  // TODO: return users with high confidence in the topic
  return [];
}
