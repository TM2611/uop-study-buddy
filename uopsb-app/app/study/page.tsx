"use client";

import MatchButton from "../_components/MatchButton";
import UserMatchCard from "../_components/UserMatchCard";
import { useAuth } from "@/app/AuthContext";
import { fetchUserConfidence } from "@/lib/api";
import ConfidenceList from "@/app/_components/ConfidenceList";
import { useEffect, useState } from "react";
import { Topic, TopicConfidence, UserType } from "../types";
import SessionSelection from "../_components/SessionSelection";

type SelectedTopic = {
  name: string | null;
  id: number | null;
};

const defaultSelectedTopic: SelectedTopic = {
  id: 0,
  name: "",
};

const Study = () => {
  const { user } = useAuth();
  const [activeUserConfidence, setActiveUserConfidence] = useState<
    TopicConfidence[]
  >([]); // Holds the active user's list of topics and confidence value for each
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [selectedTopic, setSelectedTopic] =
    useState<SelectedTopic>(defaultSelectedTopic);
  const [showSessionSelection, setShowSessionSelection] = useState(false);

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

  const handleStudyButtonClick = () => {
    setShowSessionSelection(!showSessionSelection);
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const name = selectedOption.value;
    const id = Number(selectedOption.getAttribute("data-id"));
    id
      ? setSelectedTopic({ id, name })
      : setSelectedTopic({ id: null, name: null });
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
            value={selectedTopic.name || "No Topic"}
            onChange={handleTopicChange}
          >
            <option value="" disabled>
              Please select
            </option>
            {activeUserConfidence.map((x) => (
              <option
                key={x.topic_name}
                value={x.topic_name}
                data-id={x.topic_id.toString()}
              >
                {x.topic_name}
              </option>
            ))}
            <option key="No Topic" value="No Topic" data-id={"none"}>
              No Topic
            </option>
          </select>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Match with Study Buddy:</h2>
        <div className="m-4">
          <MatchButton
            currentUser={user}
            activeUserConfidence={activeUserConfidence}
            onMatch={handleMatch}
            selectedTopic={selectedTopic}
          />
        </div>
      </section>
      {showProfileCard && selectedUser && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Matched Study Buddy:</h2>
          <div className="m-4">
            <UserMatchCard
              user={selectedUser}
              onStudyButtonClick={handleStudyButtonClick}
              showSessionSelection={showSessionSelection}
            />
          </div>
        </section>
      )}
      {showSessionSelection && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <button
              onClick={() => setShowSessionSelection(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-600"
            >
              &times;
            </button>
            <SessionSelection
              setShowSessionSelection={setShowSessionSelection}
              selectedUser={selectedUser}
              selectedTopic={selectedTopic}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Study;
