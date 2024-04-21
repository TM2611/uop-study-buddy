import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { SessionCreation, SessionSlot } from "@/app/types";
import { convertDMYToYMD } from "@/lib/utils";


export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const requestBody = await req.text();
    const request = JSON.parse(requestBody);
    const partner_id = request.partner_id;
    const requester_id = request.requester_id;
    const topic = request.topic;
    const encodedSessions = request.sessions;
    const sessionSlots = JSON.parse(decodeURIComponent(encodedSessions ?? ""));
    const sessionData: SessionCreation = {
      partner_id,
      requester_id,
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

async function sessionCreation(sessionData: SessionCreation) {
  const { partner_id, requester_id, topic, sessionSlots } = sessionData;
  try {
    for (const slot of sessionSlots) {
      await insertSession(partner_id, requester_id, topic, slot);
    }
    return true;
  } catch (err) {
    console.error("sessionCreation", err);
    throw err;
  }
}

async function insertSession(
  partner_id: string,
  requester_id: string,
  topic: number | null,
  slot: SessionSlot
) {
  const client = await pool.connect();

  try {
    // Insert the session into the session table
    const sessionResult = await client.query(
      `INSERT INTO session (topic_id, start_hour, end_hour, date, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [
        topic,
        slot.start_hour,
        slot.end_hour,
        convertDMYToYMD(slot.date),
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
      [sessionId, partner_id, false]
    );
  } catch (err) {
    console.error("insertSession", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  const client = await pool.connect();
  const userId = req.nextUrl.searchParams.get("id");

  if (!userId) {
    return new NextResponse("User ID missing or invalid", { status: 400 });
  }

  try {
    const sessions = await getAllUserSessions(userId);
    return new NextResponse(JSON.stringify(sessions), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
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
    s.status,
    s.id as session_id,
    ss_other.user_id as partner_id,
    ss.is_requester as is_user_request,
    u.email,
    u.given_name,
    u.family_name,
    u.picture,
    c.course_code,
    c.name as course_name,
    t.topic_name as topic_name,
    sc.confidence_value as partner_confidence
  FROM
    session s
    LEFT JOIN topic t ON s.topic_id = t.topic_id
    INNER JOIN student_session ss ON s.id = ss.session_id
    INNER JOIN student_session ss_other ON s.id = ss_other.session_id AND ss_other.user_id != ss.user_id
    INNER JOIN student u ON ss_other.user_id = u.id
    INNER JOIN course c ON u.course_code = c.course_code
    LEFT JOIN student_confidence sc ON sc.user_id = u.id AND sc.topic_id = t.topic_id
  WHERE
    ss.user_id = $1;`;
    const result = await client.query(query, [userId]);
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
  const client = await pool.connect();
  const sessionId = req.nextUrl.searchParams.get("session");
  const body = await req.json();
  const status = body.status;
  if (!sessionId || !status) {
    return new NextResponse("Session ID or status missing or invalid", {
      status: 400,
    });
  }

  try {
    const query = `
        UPDATE session
        SET status = $1
        WHERE id = $2;
        `;
    await client.query(query, [status, sessionId]);
    return new NextResponse("Session status updated successfully", {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    client.release();
  }
}
