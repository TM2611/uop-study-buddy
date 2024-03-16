"use client";

import React, { useState, useEffect } from "react";
import { UserType } from "@/app/types";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const StudyUsers: React.FC = () => {
  const searchParams = useSearchParams();
  const [matchedUsers, setMatchedUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      const user_id = searchParams.get("id");
      const topic = searchParams.get("topic");
      const match_type = searchParams.get("match_type");
      const res = await fetch(
        `/api/match?id=${user_id}&topic=${topic}&match_type=${match_type}`
      );
      const data = await res.json();
      const users = data.users;
      console.log(users);
      setMatchedUsers(users);
      setIsLoading(false);
    };
    fetchMatchedUsers();
  }, []);

  return isLoading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="text-white text-3xl">Searching...</div>
    </div>
  ) : (
    <div>
      <Link href="/study">Back to Search</Link>
      <h1>Matched Users</h1>
      {matchedUsers.map((user) => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  );
};

export default StudyUsers;
