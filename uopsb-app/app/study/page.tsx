"use client";

import QuickFind from "../_components/QuickFind";
import { useAuth } from "@/app/AuthContext";
import { fetchUserAvailability, fetchUserConfidence } from "@/lib/api";
import ConfidenceList from "@/app/_components/ConfidenceList";
import { useEffect, useState } from "react";
import { TopicConfidence } from "../types";

const Study = () => {
  const { user } = useAuth();
  const [activeUserConfidence, setActiveUserConfidence] = useState<
    TopicConfidence[]
  >([]); // Holds the active user's list of topics and confidence value for each

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
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Select a Topic to Study:
        </h2>
        <div className="m-4">
          <select className="border rounded p-2">
            {activeUserConfidence.map((x) => (
              <option key={x.topic_name} value={x.topic_name}>
                {x.topic_name}
              </option>
            ))}
            <option value="no_topic">No topic</option>
          </select>
        </div>
        <h2 className="text-2xl font-semibold mb-4">
          Match with Study Buddies:
        </h2>
        <div className="m-4">
          <QuickFind currentUser={user} />
        </div>
      </section>
    </div>
  );
};

export default Study;
