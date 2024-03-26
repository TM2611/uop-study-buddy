import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { extractUpNum } from "@/lib/utils";

export async function GET(req: NextRequest, res: NextResponse) {
  const client = await pool.connect();

  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) throw new Error("Email parameter required");

    const userId = extractUpNum(email);
    const query = `SELECT t.topic_id as topic_id, t.topic_name as topic_name, sc.confidence_value
    FROM student_confidence sc
    JOIN topic t ON sc.topic_id = t.topic_id
    WHERE sc.user_id = $1;`;
    const result = await client.query(query, [userId]);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "An error occurred while fetching data from the database" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const client = await pool.connect();

  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) throw new Error("Email parameter required");

    const userId = extractUpNum(email);
    const topicConfidences = await req.json();
    if (!Array.isArray(topicConfidences))
      throw new Error("Request body must be an array");
    // Use Promise.all() and map() to await all update queries
    await Promise.all(
      topicConfidences.map((topicConfidence) => {
        const updateQuery = `
        INSERT INTO student_confidence (user_id, topic_id, confidence_value)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, topic_id)
        DO UPDATE SET confidence_value = EXCLUDED.confidence_value;
      `;
        return client.query(updateQuery, [
          userId,
          topicConfidence.topic_id,
          topicConfidence.confidence_value,
        ]);
      })
    );
    const userQuery =
      "SELECT * FROM user_availability_confidence WHERE email = $1";
    const result = await client.query(userQuery, [email]);
    return NextResponse.json(
      { message: "Data inserted successfully", data: result.rows },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "An error occurred while inserting data into the database" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
