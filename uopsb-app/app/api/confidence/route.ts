import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { extractUpNum } from "@/lib/utils";

export async function GET(req: NextRequest, res: NextResponse) {
  const client = await pool.connect();

  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) throw new Error("Email parameter required");

    const upNum = extractUpNum(email);
    const query = `SELECT t.id as topic_id, t.name as topic_name, sc.confidence_value
    FROM student_confidence sc
    JOIN topic t ON sc.topic_id = t.id
    WHERE sc.user_id = $1;`;
    const result = await client.query(query, [upNum]);
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
