import SetupForm from "./SetupForm";
import { FormPopulation } from "@/app/types";

async function fetchFormData() {
  try {
    const formPopRes = await fetch(process.env.URL + "/api/setup-form", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("after fetch");
    if (formPopRes.ok) {
      const data = await formPopRes.json();
      const formPopulation: FormPopulation = data.formPopulation;
      return formPopulation;
    } else {
      console.log("FP ERROR");

      return {} as FormPopulation;
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return {} as FormPopulation;
  }
}

export default async function SetupFormPage() {
  const formPopulation = await fetchFormData();

  return (
    <div>
      <SetupForm {...formPopulation} />
    </div>
  );
}
