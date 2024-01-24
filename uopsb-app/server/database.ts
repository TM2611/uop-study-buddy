import BetterSqlite3 from "better-sqlite3";
import fs from "fs";
import path from "path";
import { Course, FormPopulation, CreateUserType } from "@/app/types";

// Connecting to or creating a new SQLite database file
function init() {
  const dbInit = new BetterSqlite3("./collection.db", { verbose: console.log });
  const migrationFile = path.join(
    process.cwd(),
    "server",
    "migrations-sqlite",
    "v1_user_login.sql"
  );
  const migrationSql = fs.readFileSync(migrationFile, "utf8");

  dbInit.exec(migrationSql);
  return dbInit;
}
const dbConn = init();

export async function createUser(creds: CreateUserType) {
  const db = await dbConn;
  console.log(creds);
  const email = creds.email;
  const upNum = creds.email.match(/\d+/); // Extract the UP number email
  const fname = creds.given_name;
  const lname = creds.family_name;
  const picture = creds.picture;
  const year = creds.year;
  const courseCode = creds.course;
  const gender = creds.gender;
  const stmnt = await db
    .prepare(
      `INSERT INTO student (id, email, fname, lname, picture, year, course_code, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(upNum, email, fname, lname, picture, year, courseCode, gender);
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

export async function getFormPopulation() {
  const db = await dbConn;
  const courses = (await db.prepare("SELECT * FROM course").all()) as Course[];
  const formPopulation: FormPopulation = {
    courses,
  };
  return formPopulation;
}
