import BetterSqlite3 from "better-sqlite3";
import fs from "fs";
import path from "path";
import { Course, FormPopulation, UserType } from "@/app/types";

// Connecting to or creating a new SQLite database file
function init() {
  const dbInit = new BetterSqlite3("./collection.db", { verbose: console.log });
  const migrationFile = path.join(
    process.cwd(),
    "server",
    "migrations-sqlite",
    "v2_dummy_users.sql"
  );
  const migrationSql = fs.readFileSync(migrationFile, "utf8");

  dbInit.exec(migrationSql);
  return dbInit;
}
const dbConn = init();

export async function createUser(creds: UserType) {
  const db = await dbConn;
  console.log(creds);
  const email = creds.email;
  const upNum = creds.email.match(/\d+/); // Extract the UP number email
  const given_name = creds.given_name;
  const family_name = creds.family_name;
  const picture = creds.picture;
  const year = creds.year;
  const courseCode = creds.course;
  const gender = creds.gender;
  const stmnt = await db
    .prepare(
      `INSERT INTO student (id, email, given_name, family_name, picture, year, course_code, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
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
  return true;
}

export async function getUserByEmail(email: string) {
  const db = await dbConn;
  const user = await db
    .prepare("SELECT * FROM student WHERE email = ?")
    .get(email);
  return user;
}

export async function getUsersByCourse(courseCode: string) {
  const db = await dbConn;
  const users = await db
    .prepare("SELECT * FROM student WHERE course_code = ?")
    .all(courseCode);
  return users;
}

export async function getFormPopulation() {
  const db = await dbConn;
  const courses = (await db.prepare("SELECT * FROM course").all()) as Course[];
  const formPopulation: FormPopulation = {
    courses,
  };
  return formPopulation;
}
