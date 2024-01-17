import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../server/database";
import { getUserByEmail } from "../../server/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  if (req.method === "POST") {
    try {
      const creds = req.body;
      const user = await getUserByEmail(creds.email);
      if (user) {
        // User already exists
        res.status(200).json({
          message: "User already exists, logged in successfully",
          user,
        });
      } else {
        // Create user
        const response = await createUser(creds);
        if (!response) throw new Error("Could not create user");
        res
          .status(200)
          .json({ message: "User created successfully", user: creds });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while logging in the user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
