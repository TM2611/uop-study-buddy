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
      `SELECT s.*, av.availability AS availability_slots, tp.topics AS confidence, bk.bookings
        FROM student s
        JOIN course c1 ON s.course_code = c1.course_code
        JOIN course c2 ON c1.department_id = c2.department_id
        LEFT JOIN (
            SELECT user_id, array_agg(json_build_object('day', day, 'start_hour', start_hour, 'end_hour', end_hour)) as availability
            FROM availability
            GROUP BY user_id
        ) av ON s.id = av.user_id
        LEFT JOIN (
            SELECT sc.user_id, array_agg(json_build_object('topic_id', t.id, 'topic_name', t.name, 'confidence_value', sc.confidence_value)) as topics
            FROM student_confidence sc
            JOIN topic t ON sc.topic_id = t.id
            GROUP BY sc.user_id
        ) tp ON s.id = tp.user_id
        LEFT JOIN (
            SELECT ss.user_id, array_agg(json_build_object('start_hour', s.start_hour, 'end_hour', s.end_hour, 'date', s.date, 'status', s.status, 'session_id', s.id, 'requester_id', u.id, 'email', u.email, 'given_name', u.given_name, 'family_name', u.family_name, 'picture', u.picture, 'course_code', c.course_code, 'course_name', c.name, 'topic_name', t.name, 'requester_confidence', sc.confidence_value)) as bookings
            FROM session s
            INNER JOIN topic t ON s.topic_id = t.id
            INNER JOIN student_session ss ON s.id = ss.session_id
            INNER JOIN student_session ss_other ON s.id = ss_other.session_id AND ss_other.user_id != ss.user_id
            INNER JOIN student u ON ss_other.user_id = u.id
            INNER JOIN course c ON u.course_code = c.course_code
            LEFT JOIN student_confidence sc ON sc.user_id = u.id AND sc.topic_id = t.id
            WHERE s.status = 'ACCEPTED'
            GROUP BY ss.user_id
        ) bk ON s.id = bk.user_id
        WHERE c2.course_code = (
            SELECT course_code
            FROM student
            WHERE id = $1
        )
        ORDER BY s.id;`,
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
