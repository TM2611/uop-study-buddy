import { MatchType } from "@/app/types";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const body = await req.text();
    const matchCriteria = JSON.parse(body);
    const id = req.nextUrl.searchParams.get("id");
    const topic = matchCriteria.topic;
    const match_type: MatchType = matchCriteria.match_type;

    if (!id || !topic || !match_type) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request",
        }),
        { status: 400 }
      );
    }

    if (match_type === "Department") {
      const deptUsers = await getUsersByDepartment(id);
      if (deptUsers.length) {
        console.log(deptUsers.length, "users in department");
        return new NextResponse(
          JSON.stringify({
            message: `${deptUsers.length} users in department"`,
            deptUsers,
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
      const similarUsers = await getUsersBySimilarity(id);
      if (similarUsers.length) {
        console.log(similarUsers.length, "similar users");
        return new NextResponse(
          JSON.stringify({
            message: `${similarUsers.length} similar users"`,
            similarUsers,
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
      const confidenceUsers = await getUsersByConfidence(id, topic);
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

async function getUsersByDepartment(id: string) {
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
      [id]
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

async function getUsersByConfidence(id: string, topic: string) {
  // TODO: return users with high confidence in the topic
  return [];
}
