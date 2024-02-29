import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { SlotDetails, UserProfileType } from "@/app/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const userProfile: UserProfileType = JSON.parse(body);
    const isCreatedUser = await createUser(userProfile);
    if (isCreatedUser) {
      return new NextResponse(
        JSON.stringify({
          message: "User created successfully",
        }),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          message: "User could not be created",
        }),
        { status: 501 }
      );
    }
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

async function createUser(userProfile: UserProfileType) {
  const client = await pool.connect();
  const email = userProfile.email;
  const upNum = userProfile.email.match(/\d+/); // Extract the UP number email
  const given_name = userProfile.given_name;
  const family_name = userProfile.family_name;
  const picture = userProfile.picture;
  const year = Number(userProfile.year);
  const courseCode = userProfile.course_code;
  const gender = userProfile.gender;
  const slots = userProfile.slots;
  const TopicConfidence = userProfile.topic_confidence;

  try {
    const stmnt = await client.query(
      `INSERT INTO student (id, email, given_name, family_name, picture, year, course_code, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [upNum, email, given_name, family_name, picture, year, courseCode, gender]
    );
    if (stmnt.rowCount !== 1) throw new Error("Could not create user");

    for (const topicConfidence of TopicConfidence) {
      await insertTopicConfidence(upNum, topicConfidence);
    }

    // Insert each slot entry into the slot table
    for (const availability of slots) {
      await insertSlots(upNum, availability);
    }

    return true;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}

async function insertTopicConfidence(
  studentId: RegExpMatchArray | null,
  topicConfidence: { topic_id: number; confidence_value: number }
) {
  const client = await pool.connect();
  const { topic_id, confidence_value } = topicConfidence;

  try {
    const stmnt = await client.query(
      `INSERT INTO student_confidence (user_id, topic_id, confidence_value) VALUES ($1, $2, $3)`,
      [studentId, topic_id, confidence_value]
    );
    if (stmnt.rowCount !== 1)
      throw new Error("Could not insert topic confidence");
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}

async function insertSlots(
  studentId: RegExpMatchArray | null,
  slot: SlotDetails
) {
  const client = await pool.connect();
  const { day, start_hour, end_hour } = slot;

  try {
    const stmnt = await client.query(
      `INSERT INTO slot (user_id, day, start_hour, end_hour) VALUES ($1, $2, $3, $4)`,
      [studentId, day, start_hour, end_hour]
    );
    if (stmnt.rowCount !== 1) throw new Error("Could not insert slot");
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}
