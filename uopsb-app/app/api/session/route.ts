import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { SessionSlot } from "@/app/types";
import { convertDateToYMD } from "@/lib/utils";

interface SessionData {
  requester_id: string;
  receiver_id: string;
  topic: number;
  sessionSlots: SessionSlot[];
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const requestBody = await req.text();
    const request = JSON.parse(requestBody);
    const requester_id = request.requester_id;
    const receiver_id = request.receiver_id;
    const topic = request.topic;
    const encodedSessions = request.sessions;
    const sessionSlots = JSON.parse(decodeURIComponent(encodedSessions ?? ""));
    const sessionData: SessionData = {
      requester_id,
      receiver_id,
      topic,
      sessionSlots,
    };

    const isCreatedSession = await sessionCreation(sessionData);
    if (isCreatedSession) {
      return new NextResponse(
        JSON.stringify({
          message: "Session created successfully",
        }),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          message: "Session could not be created",
        }),
        { status: 501 }
      );
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function sessionCreation(sessionData: SessionData) {
  const { requester_id, receiver_id, topic, sessionSlots } = sessionData;
  try {
    for (const slot of sessionSlots) {
      await insertSession(slot, requester_id, receiver_id, topic);
    }
    return true;
  } catch (err) {
    console.error("sessionCreation", err);
    throw err;
  }
}

async function insertSession(
  slot: SessionSlot,
  requester_id: string,
  receiver_id: string,
  topic: number
) {
  const client = await pool.connect();

  console.log("slot", slot);
  console.log("requester_id", requester_id);
  console.log("receiver_id", receiver_id);
  console.log("topic", topic);

  try {
    // Insert the session into the session table
    const sessionResult = await client.query(
      `INSERT INTO session (topic_id, start_hour, end_hour, date, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [
        topic,
        slot.start_hour,
        slot.end_hour,
        convertDateToYMD(slot.date),
        "PENDING",
      ]
    );

    const sessionId = sessionResult.rows[0].id;
    console.log("ID OF SESSION: ", sessionId);
    // Insert the requester and receiver into the student_session table
    await client.query(
      `INSERT INTO student_session (session_id, user_id, is_requester) VALUES ($1, $2, $3)`,
      [sessionId, requester_id, true]
    );

    await client.query(
      `INSERT INTO student_session (session_id, user_id, is_requester) VALUES ($1, $2, $3)`,
      [sessionId, receiver_id, false]
    );
  } catch (err) {
    console.error("insertSession", err);
    throw err;
  } finally {
    client.release();
  }
}
