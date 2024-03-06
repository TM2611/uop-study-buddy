"use client";

import MatchButton from "../_components/MatchButton";
import UserMatchCard from "../_components/UserMatchCard";
import { useAuth } from "@/app/AuthContext";
import { fetchUserConfidence } from "@/lib/api";
import ConfidenceList from "@/app/_components/ConfidenceList";
import { useEffect, useState } from "react";
import { TopicConfidence, UserType } from "../types";

const Study = () => {
  const { user } = useAuth();
  const [activeUserConfidence, setActiveUserConfidence] = useState<
    TopicConfidence[]
  >([]); // Holds the active user's list of topics and confidence value for each
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const activeUserConfidence = await fetchUserConfidence(user.email);
      setActiveUserConfidence(activeUserConfidence);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleMatch = (user: UserType) => {
    setSelectedUser(user);
    setShowProfileCard(true);
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopic(event.target.value);
  };

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
          <select
            className="border rounded p-2"
            value={selectedTopic}
            onChange={handleTopicChange}
          >
            <option value="" disabled>
              Please select
            </option>
            {activeUserConfidence.map((x) => (
              <option key={x.topic_name} value={x.topic_name}>
                {x.topic_name}
              </option>
            ))}
            <option value="n/a">N/A</option>
          </select>
        </div>
        <h2 className="text-2xl font-semibold mb-4">
          Match with Study Buddies:
        </h2>
        <div className="m-4">
          <MatchButton
            currentUser={user}
            activeUserConfidence={activeUserConfidence}
            onMatch={handleMatch}
            disabled={!selectedTopic}
          />
        </div>
      </section>
      {showProfileCard && selectedUser && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Matched Study Buddy:</h2>
          <div className="m-4">
            <UserMatchCard user={selectedUser} />
          </div>
        </section>
      )}
    </div>
  );
};

export default Study;
