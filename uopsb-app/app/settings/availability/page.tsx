"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/AuthContext";
import { WeeklySlotStates } from "@/app/types";
import SettingsPopup from "../_components/SettingsPopup";
import AvailabilitySelection from "@/app/_components/AvailabilitySelection";
import { weeklyStatesToSelectedSlots } from "@/lib/utils";

const SettingsAvailability = () => {
  const { user, setUser } = useAuth();
  const [slotAvailabilityStates, setSlotAvailabilityStates] =
    useState<WeeklySlotStates>([]);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  if (!user) return;

  const handleUpdateButtonClick = async () => {
    const updatedSlots = weeklyStatesToSelectedSlots(slotAvailabilityStates);
    console.log(updatedSlots);
    const response = await fetch(`/api/availability?email=${user.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSlots),
    });
    const updatedUser = (await response.json());
    setUser(updatedUser);
    setShowSettingsPopup(true);
  };

  function handleAvailabilityChange(slotStates: WeeklySlotStates): void {
    setSlotAvailabilityStates(slotStates);
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Settings</h1>
      <section className="flex justify-center mb-8">
        {user && (
          <AvailabilitySelection
            userAvailabilitySlots={user.availability_slots}
            onChange={handleAvailabilityChange}
          />
        )}
      </section>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleUpdateButtonClick}
      >
        Update
      </button>
      {showSettingsPopup && <SettingsPopup />}
    </div>
  );
};

export default SettingsAvailability;
