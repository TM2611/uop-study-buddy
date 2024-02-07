import { getFormPopulation } from "@/server/database";
import { NextResponse } from "next/server";

export async function GET(request: { json: () => any }) {
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
