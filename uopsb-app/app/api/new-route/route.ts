import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Connect to the database using the connection pool
    const client = await pool.connect();

    const result = await client.query("SELECT * FROM department");

    // Release the connection back to the pool
    client.release();

    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "An error occurred while fetching data from the database" },
      { status: 500 }
    );
  }
}
