import React from "react";
import { UserType, TopicConfidence } from "@/app/types";

type MatchButtonProps = {
  currentUser: UserType;
  onMatch: (user: UserType) => void;
  disabled: boolean;
  activeUserConfidence: TopicConfidence[];
};

const MatchButton: React.FC<MatchButtonProps> = ({
  currentUser,
  onMatch,
  disabled,
  activeUserConfidence,
}) => {
  const fetchRandomUser = async () => {
    const res = await fetch(
      `/api/quick-find?email=${currentUser.email}&course=${currentUser.course_code}`
    );
    const quickFind = await res.json();
    const courseUsers = quickFind.courseUsers;
    const randomCourseUser =
      courseUsers[Math.floor(Math.random() * courseUsers.length)];
    return randomCourseUser;
  };

  const handleClick = async () => {
    const randomUser = await fetchRandomUser();
    console.log("Random user", randomUser);
    onMatch(randomUser);
  };
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${
        disabled ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
      } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
    >
      Quick Find
    </button>
  );
};

export default MatchButton;
