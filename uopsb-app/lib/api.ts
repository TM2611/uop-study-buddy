import { AvailabilitySlot, TopicConfidence } from "@/app/types";

export async function fetchUserAvailability(
  userEmail: string
): Promise<AvailabilitySlot[]> {
  const response = await fetch(`/api/availability?email=${userEmail}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user availableSlots");
  }
  const data: AvailabilitySlot[] = await response.json();
  return data;
}

export async function fetchUserConfidence(
  userEmail: string
): Promise<TopicConfidence[]> {
  const response = await fetch(`/api/confidence?email=${userEmail}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user confidence");
  }
  const data: TopicConfidence[] = await response.json();
  console.log("userConfidence", data);
  return data;
}
