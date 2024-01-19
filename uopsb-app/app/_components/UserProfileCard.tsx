import React from "react";

interface UserProfileCardProps {
    fname: string;
    lname: string;
    email: string;
    picture: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({fname, lname, email, picture}) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white">
      <img className="w-full h-48 object-cover" src={picture} alt="UOP Student Image"/>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{`${fname} ${lname}`}</div>
        <p className="text-gray-700 text-base">{email}</p>
      </div>
    </div>
  );
};

export default UserProfileCard;
