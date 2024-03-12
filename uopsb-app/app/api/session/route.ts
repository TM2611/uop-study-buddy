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
const validSessionTypes = ["all", "booked", "requests"] as const;
type SessionType = (typeof validSessionTypes)[number];

const sessionTypeFunctions = {
  all: getAllUserSessions,
  booked: getUserBookings,
  requests: getUserSessionsRequests,
};

export async function GET(req: NextRequest, res: NextResponse) {
  const client = await pool.connect();
  const userId = req.nextUrl.searchParams.get("id");
  const sessionType: SessionType = req.nextUrl.searchParams.get(
    "type"
  ) as SessionType;
  if (!userId) {
    return new NextResponse("User ID missing or invalid", { status: 400 });
  }
  if (!sessionType || !validSessionTypes.includes(sessionType)) {
    return new NextResponse("Session type missing or invalid", { status: 400 });
  }

  try {
    let sessions;
    const sessionFunction = sessionTypeFunctions[sessionType];
    if (sessionFunction) {
      sessions = await sessionFunction(userId);
    } else {
      return new NextResponse("Session type missing or invalid", {
        status: 400,
      });
    }

    return sessions
      ? new NextResponse(JSON.stringify(sessions), { status: 200 })
      : new NextResponse("No existing sessions found", { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    client.release();
  }
}

async function getUserBookings(userId: string) {
  const client = await pool.connect();

  try {
    const query = `
        SELECT
          s.start_hour,
          s.end_hour,
          s.date
        FROM
          session s
          INNER JOIN student_session ss ON s.id = ss.session_id
        WHERE
          ss.user_id = $1 AND
          s.status = 'ACCEPTED';
      `;
    const result = await client.query(query, [userId]);
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}

async function getAllUserSessions(userId: string) {
  const client = await pool.connect();

  try {
    const query = `
          SELECT
            s.start_hour,
            s.end_hour,
            s.date,
            s.status
          FROM
            session s
            INNER JOIN student_session ss ON s.id = ss.session_id
          WHERE
            ss.user_id = $1;
        `;
    const result = await client.query(query, [userId]);
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}

async function getUserSessionsRequests(userId: string) {
  const client = await pool.connect();

  try {
    const query = `
    SELECT
    s.start_hour,
    s.end_hour,
    s.date,
    s.status,
    s.id as session_id,
    u.id as requester_id,
    u.email,
    u.given_name,
    u.family_name,
    u.picture,
    c.course_code,
    c.name as course_name,
    t.name as topic_name,
    sc.confidence_value as requester_confidence
  FROM
    session s
    INNER JOIN topic t ON s.topic_id = t.id
    INNER JOIN student_session ss ON s.id = ss.session_id
    INNER JOIN student_session ss_other ON s.id = ss_other.session_id AND ss_other.user_id != ss.user_id
    INNER JOIN student u ON ss_other.user_id = u.id
    INNER JOIN course c ON u.course_code = c.course_code
    LEFT JOIN student_confidence sc ON sc.user_id = u.id AND sc.topic_id = t.id
  WHERE
    ss.user_id = $1;
        `;
    const result = await client.query(query, [userId]);
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}
