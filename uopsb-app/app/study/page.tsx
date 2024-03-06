"use client";

import QuickFind from "../_components/QuickFind";
import { useAuth } from "@/app/AuthContext";
import { fetchUserAvailability, fetchUserConfidence } from "@/lib/api";
import ConfidenceList from "@/app/_components/ConfidenceList";
import { useEffect, useState } from "react";
import { TopicConfidence } from "../types";

const Study = () => {
  const { user } = useAuth();
  let activeUserConfidence: TopicConfidence[] = []; // Holds the active user's list of topics and confidence value for each 

  useEffect(() => {
    const fetchData = async () => {
      const userConfidence = await fetchUserConfidence(user.email);
      activeUserConfidence = userConfidence;
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div>
      <section>
        Your Topic Confidence:
        <div className="m-4">
          <ConfidenceList confidence={activeUserConfidence} />
        </div>
      </section>
      <section>
        <QuickFind currentUser={user} />
      </section>
    </div>
  );
};

export default Study;
