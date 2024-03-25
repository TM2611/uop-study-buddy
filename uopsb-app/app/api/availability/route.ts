import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { extractUpNum } from "@/lib/utils";
import { AvailabilitySlot } from "@/app/types";

export async function GET(req: NextRequest, res: NextResponse) {
  const client = await pool.connect();

  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) throw new Error("Email parameter required");

    const upNum = extractUpNum(email);
    const result = await client.query(
      "SELECT day, start_hour, end_hour FROM availability WHERE user_id = $1",
      [upNum]
    );
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

    const upNum = extractUpNum(email);
    const body = await req.text();
    const slots: AvailabilitySlot[] = JSON.parse(body);

    // Delete existing availability entries for the user
    await client.query(`DELETE FROM availability WHERE user_id = $1`, [upNum]);

    await Promise.all(
      slots.map((slot) => {
        const { day, start_hour, end_hour } = slot;
        return client.query(
          `INSERT INTO availability (user_id, day, start_hour, end_hour) VALUES ($1, $2, $3, $4)`,
          [upNum, day, start_hour, end_hour]
        );
      })
    );

    const userQuery =
      "SELECT * FROM user_availability_confidence WHERE email = $1";
    const user = await client.query(userQuery, [email]);

    return NextResponse.json(user.rows[0], { status: 201 });
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
