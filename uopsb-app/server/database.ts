import BetterSqlite3 from "better-sqlite3";
import fs from "fs";
import path from "path";

// Connecting to or creating a new SQLite database file
function init() {
  const dbInit = new BetterSqlite3("./collection.db", { verbose: console.log });
  const migrationFile = path.join(
    process.cwd(),
    "server",
    "migrations-sqlite",
    "v1_user_login.sql",
  );
  const migrationSql = fs.readFileSync(migrationFile, "utf8");

  dbInit.exec(migrationSql);
  return dbInit;
}
const dbConn = init();

export async function createUser(creds: {
  email: string;
  family_name: string;
  given_name: string;
  picture: string;
}) {
  const db = await dbConn;
  const email = creds.email;
  const upNum = creds.email.match(/\d+/); // Extract the UP number email
  const fname = creds.given_name;
  const lname = creds.family_name;
  const picture = creds.picture;
  const date = new Date().toISOString();
  const stmnt = await db
    .prepare(
      `INSERT INTO student (id, email, fname, lname, picture) VALUES (?, ?, ?, ?, ?)`,
    )
    .run(upNum, email, fname, lname, picture);
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
