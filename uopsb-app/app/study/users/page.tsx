"use client";

import React, { useState, useEffect, useMemo } from "react";
import { UserAvailabilityConfidence } from "@/app/types";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SessionSelection from "@/app/_components/SessionSelection";
import UserMatchCard from "@/app/_components/UserMatchCard";
import { useAuth } from "@/app/AuthContext";

const defaultUser: UserAvailabilityConfidence = {
  email: "",
  family_name: "",
  given_name: "",
  picture: "",
  year: 0,
  course_code: "",
  availability_slots: [],
  confidence: [],
  bookings: [],
};

type SelectedTopic = {
  name: string;
  id: string;
};

const defaultSelectedTopic: SelectedTopic = {
  id: "",
  name: "None",
};

const StudyUsers: React.FC = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [matchedUsers, setMatchedUsers] = useState<
    UserAvailabilityConfidence[]
  >([]);
  const sameYearUsers = useMemo(
    () => (user ? matchedUsers?.filter((u) => u.year === user.year) : []),
    [matchedUsers, user]
  );

  const sameCourseUsers = useMemo(
    () =>
      user
        ? matchedUsers?.filter((u) => u.course_code === user.course_code)
        : [],
    [matchedUsers, user]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] =
    useState<UserAvailabilityConfidence>(defaultUser);
  const [selectedTopic, setSelectedTopic] =
    useState<SelectedTopic>(defaultSelectedTopic);
  const [showSessionSelection, setShowSessionSelection] = useState(false);

  const [filter, setFilter] = useState<"year" | "course" | "off">("off");

  const toggleFilter = () => {
    if (filter === "off") {
      setFilter("year");
    } else if (filter === "year") {
      setFilter("course");
    } else {
      setFilter("off");
    }
  };

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      const user_id = user.id;
      const topic = searchParams.get("topic");
      const topic_id = searchParams.get("topic_id");
      const match_type = searchParams.get("match_type");
      if (!user_id || !topic || !topic_id || !match_type) {
        console.log("Invalid request");
        throw new Error(
          "Invalid request - topic, topic_id, or match_type missing"
        );
      }
      const res = await fetch(
        `/api/match?id=${user_id}&topic_id=${topic_id}&match_type=${match_type}`
      );
      const data = await res.json();
      const users = data.users;
      setSelectedTopic({ name: topic, id: topic_id });
      setMatchedUsers(users);
      setIsLoading(false);
    };
    if (user) {
      fetchMatchedUsers();
    }
  }, [user]);

  return isLoading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="text-white text-3xl">Searching...</div>
    </div>
  ) : (
    <div className="p-3">
      <div className="flex justify-between items-center mb-4">
        <Link
          href="/study"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Search
        </Link>
        <div>
          <span className="mr-2 font-bold">Filter:</span>
          <button
            onClick={toggleFilter}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "off"
                ? "bg-gray-300 text-white"
                : filter === "year"
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            {filter === "off" ? "Off" : filter === "year" ? "Year" : "Course"}
          </button>
        </div>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {(filter === "year"
          ? sameYearUsers
          : filter === "course"
          ? sameCourseUsers
          : matchedUsers
        )?.map((user) => (
          <div key={user.email}>
            <UserMatchCard
              user={user}
              setSelectedUser={setSelectedUser}
              setShowSessionSelection={setShowSessionSelection}
            />
          </div>
        ))}
      </section>
      {showSessionSelection && selectedUser && (
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

export default StudyUsers;
