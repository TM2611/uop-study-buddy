import React, { useEffect, useState } from "react";
import { SlotDetails, UserType } from "@/app/types";
import Overlay from "./Overlay";
import AvailabilityList from "./AvailabilityList";

interface UserProfileCardProp {
  user: UserType;
}

const UserProfileCard: React.FC<UserProfileCardProp> = ({ user }) => {
  const [slots, setSlots] = useState<SlotDetails[]>([]);
  const [showAvailability, setShowAvailability] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userSlots = await fetchUserAvailability(user.email);
      setSlots(userSlots);
    };

    fetchData();
  }, [user.email]);

  async function fetchUserAvailability(
    userEmail: string
  ): Promise<SlotDetails[]> {

    const response = await fetch(`/api/availability?email=${userEmail}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user availability");
    }
    const data: SlotDetails[] = await response.json();
    return data;
  }

  return (
    <div className="relative max-w-xs rounded overflow-hidden shadow-lg bg-white">
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
        {/* <p className="text-gray-700 text-base">Gender: {user.gender}</p> */}
      </div>

      <div className="flex justify-evenly">
        <button
          onClick={() => setShowAvailability(true)}
          className="text-blue-500 border border-purple-800 block text-center py-2 w-1/3"
        >
          Availability
        </button>
      </div>
      {showAvailability && (
        <Overlay onClose={() => setShowAvailability(false)}>
          <div>
            <h3 className="text-lg font-bold mb-4">Availability</h3>
            <AvailabilityList slots={slots} />
          </div>
        </Overlay>
      )}
    </div>
  );
};

export default UserProfileCard;
