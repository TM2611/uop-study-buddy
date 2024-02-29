import React, { useEffect, useState } from "react";
import { SlotDetails, UserType } from "@/app/types";
import Overlay from "./Overlay";
import AvailabilityList from "./AvailabilityList";
import { MdOutlineEventAvailable } from "react-icons/md";
import { IoBulbOutline } from "react-icons/io5";

interface UserProfileCardProp {
  user: UserType;
}

const UserMatchCard: React.FC<UserProfileCardProp> = ({ user }) => {
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

      <section className="flex">
        <div className="flex justify-evenly w-1/2">
          <button
            type="button"
            aria-label="Show availability"
            onClick={() => setShowAvailability(true)}
            className="text-blue-500 flex items-center justify-center p-2"
          >
            <MdOutlineEventAvailable size={30} />
          </button>

          <button
            type="button"
            aria-label="Show availability"
            onClick={() => console.log("Confidence button clicked")}
            className="text-blue-500 flex items-center justify-center p-2"
          >
            <IoBulbOutline size={30} />
          </button>
        </div>
        <button
          onClick={() => console.log("Study button clicked")}
          className="text-blue-500 border bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
        >
          Study
        </button>
      </section>
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

export default UserMatchCard;
