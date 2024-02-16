import React from "react";
import { UserType } from "@/app/types";

interface UserProfileCardProp {
  user: UserType;
}

const UserProfileCard: React.FC<UserProfileCardProp> = ({ user }) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white">
      <img
        className="w-full h-48 object-cover"
        src={user.picture}
        alt={`${user.given_name} ${user.family_name} - Profile`}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{`${user.given_name} ${user.family_name}`}</div>
        <p className="text-gray-700 text-base">{user.email}</p>
        <p className="text-gray-700 text-base">Year: {user.year}</p>
        <p className="text-gray-700 text-base">Course: {user.course_code}</p>
        <p className="text-gray-700 text-base">Gender: {user.gender}</p>
      </div>
    </div>
  );
};

export default UserProfileCard;
