import React from "react";

interface UserProfileCardProp {
  user: Record<string, any>;
}

const UserProfileCard: React.FC<UserProfileCardProp> = ({ user }) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white">
      <img
        className="w-full h-48 object-cover"
        src={user.picture}
        alt="UOP Student Image"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{`${user.fname} ${user.lname}`}</div>
        <p className="text-gray-700 text-base">{user.email}</p>
      </div>
    </div>
  );
};

export default UserProfileCard;
