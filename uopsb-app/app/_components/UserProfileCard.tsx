import React, { useEffect, useState } from "react";
import { SlotDetails, UserType } from "@/app/types";
import Overlay from "./Overlay";
import AvailabilityList from "./AvailabilityList";

interface UserProfileCardProp {
  user: UserType;
}

const UserProfileCard: React.FC<UserProfileCardProp> = ({ user }) => {
  const [showAvailability, setShowAvailability] = useState(false);
  const [slots, setSlots] = useState<SlotDetails[]>([]);

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
    return [
      { day: "MON", start_hour: 9, end_hour: 11 },
      { day: "TUE", start_hour: 14, end_hour: 16 },
      // ...
    ];
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
        <p className="text-gray-700 text-base">Gender: {user.gender}</p>
      </div>
      
      <button
        onClick={() => setShowAvailability(true)}
        className="text-blue-500 underline"
      >
        Click here to view availability
      </button>

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
