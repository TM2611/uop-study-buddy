import React, { useState } from "react";
import UserProfileCard from "../../_components/UserProfileCard";
import { UserType } from "@/app/types";

type QuickFindProps = {
  currentUser: UserType;
};

const QuickFind: React.FC<QuickFindProps> = ({ currentUser }) => {
  const [selectedStudent, setSelectedStudent] = useState<UserType | null>(null);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const fetchRandomStudent = async () => {
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
    const randomStudent = await fetchRandomStudent();
    console.log("Random Student", randomStudent);
    setSelectedStudent(randomStudent);
    setShowProfileCard(true);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Quick Find
      </button>
      {showProfileCard && selectedStudent && (
        <UserProfileCard user={selectedStudent} />
      )}
    </div>
  );
};

export default QuickFind;
