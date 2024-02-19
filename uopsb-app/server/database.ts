import BetterSqlite3 from "better-sqlite3";
import fs from "fs";
import path from "path";
import {
  Course,
  FormPopulation,
  Topic,
  UserType,
  UserProfileType,
  SlotDetails,
} from "@/app/types";

// Connecting to or creating a new SQLite database file
function init() {
  const dbInit = new BetterSqlite3("./collection.db", { verbose: console.log });
  const migrationFile = path.join(
    process.cwd(),
    "server",
    "migrations-sqlite",
    "v3_setup_form.sql"
  );
  const migrationSql = fs.readFileSync(migrationFile, "utf8");

  dbInit.exec(migrationSql);
  return dbInit;
}
const dbConn = init();

async function insertTopicConfidence(
  studentId: RegExpMatchArray | null,
  topicConfidence: { topic_id: number; confidence_value: number }
) {
  const db = await dbConn;
  const { topic_id, confidence_value } = topicConfidence;
  const stmnt = await db
    .prepare(
      `INSERT INTO user_confidence (user_id, topic_id, confidence_value) VALUES (?, ?, ?)`
    )
    .run(studentId, topic_id, confidence_value);

  if (stmnt.changes !== 1) throw new Error("Could not insert topic confidence");
}

async function insertSlots(
  studentId: RegExpMatchArray | null,
  slot: SlotDetails
) {
  const db = await dbConn;
  const { day, start_hour, end_hour } = slot;
  const stmnt = await db
    .prepare(
      `INSERT INTO slot (user_id, day, start_hour, end_hour) VALUES (?, ?, ?, ?)`
    )
    .run(studentId, day, start_hour, end_hour);

  if (stmnt.changes !== 1) throw new Error("Could not insert slot");
}

export async function createUser(userProfile: UserProfileType) {
  const db = await dbConn;
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
  const stmnt = await db
    .prepare(
      `INSERT INTO user (id, email, given_name, family_name, picture, year, course_code, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      upNum,
      email,
      given_name,
      family_name,
      picture,
      year,
      courseCode,
      gender
    );
  if (stmnt.changes !== 1) throw new Error("Could not create user");

  for (const topicConfidence of TopicConfidence) {
    await insertTopicConfidence(upNum, topicConfidence);
  }

  // Insert each slot entry into the slot table
  for (const availability of slots) {
    await insertSlots(upNum, availability);
  }

  return true;
}

export async function getUserByEmail(email: string) {
  const db = await dbConn;
  const user = await db
    .prepare("SELECT * FROM user WHERE email = ?")
    .get(email);
  return user;
}

export async function getUsersByCourse(email: string, courseCode: string) {
  const db = await dbConn;
  const users = await db
    .prepare("SELECT * FROM user WHERE course_code = ? AND email != ?")
    .all(courseCode, email);
  return users;
}

export async function getFormPopulation() {
  const db = await dbConn;
  const courses = (await db
    .prepare("SELECT * FROM course ORDER BY name")
    .all()) as Course[];
  const topics = (await db.prepare("SELECT * FROM topic").all()) as Topic[];
  const formPopulation: FormPopulation = {
    courses,
    topics,
  };
  return formPopulation;
}
