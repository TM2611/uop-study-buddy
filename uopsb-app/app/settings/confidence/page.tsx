"use client";
import React, { useState } from "react";
import ConfidenceGrid, {
  TopicConfidenceButton,
} from "@/app/_components/ConfidenceGrid";
import { useAuth } from "@/app/AuthContext";
import { TopicConfidence } from "@/app/types";
import SettingsPopup from "../_components/SettingsPopup";

const SettingsConfidence = () => {
  const { user, setUser } = useAuth();
  if (!user) return;

  const currentConfidence = user.confidence;
  const [confidence, setConfidence] = useState(currentConfidence);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  const handleConfidenceSelect = (
    selectedConfidence: TopicConfidenceButton[]
  ) => {
    const updatedConfidence = selectedConfidence.map((confidence) => {
      const { buttonColor, ...rest } = confidence;
      return rest;
    });
    setConfidence(updatedConfidence);
  };

  const handleUpdateButtonClick = async () => {
    const changedConfidence = confidence.filter(
      (confidence: TopicConfidence, index: number) => {
        return (
          confidence.confidence_value !==
          currentConfidence[index].confidence_value
        );
      }
    );
    const response = await fetch(`/api/confidence?email=${user.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changedConfidence),
    });
    const updatedUser = (await response.json()).data[0];
    setUser(updatedUser);
    setShowSettingsPopup(true);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Settings</h1>
      <section className="flex justify-center mb-8">
        {user && (
          <ConfidenceGrid
            onConfidenceSelect={handleConfidenceSelect}
            userAvailabilityConfidence={user}
            filteredTopics={currentConfidence}
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

export default SettingsConfidence;
