"use client";

import { useAuth } from "@/app/AuthContext";
import { fetchUserConfidence } from "@/lib/api";
import ConfidenceList from "@/app/_components/ConfidenceList";
import { useEffect, useState } from "react";
import { SelectedTopic, TopicConfidence, UserType } from "../types";
import MatchForm from "../_components/MatchForm";

const Study = () => {
  const { user } = useAuth();
  const [activeUserConfidence, setActiveUserConfidence] = useState<
    TopicConfidence[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const activeUserConfidence = await fetchUserConfidence(user.email);
      setActiveUserConfidence(activeUserConfidence);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Find a Study Buddy</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Topic Confidence:</h2>
        <div className="m-4">
          <ConfidenceList confidence={activeUserConfidence} />
        </div>
      </section>

      <MatchForm activeUserConfidence={activeUserConfidence} />
    </div>
  );
};

export default Study;
