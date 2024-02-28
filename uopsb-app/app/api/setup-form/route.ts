import pool from "@/lib/db";
import { FormPopulation, Course, Topic } from "@/app/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("in setup-form/route.ts");
    const formPopulation = await getFormPopulation();
    if (!formPopulation) throw new Error("Could not retrieve form data");
    console.log("form data retrieved successfully");
    return new NextResponse(
      JSON.stringify({
        message: "Form data retrieved successfully",
        formPopulation,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "An error occurred while logging in the user",
      }),
      { status: 500 }
    );
  }
}

async function getFormPopulation() {
  const client = await pool.connect();

  try {
    const coursesResult = await client.query(
      "SELECT * FROM course ORDER BY name"
    );
    const topicsResult = await client.query("SELECT * FROM topic");

    const formPopulation: FormPopulation = {
      courses: coursesResult.rows as Course[],
      topics: topicsResult.rows as Topic[],
    };
    return formPopulation;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}
