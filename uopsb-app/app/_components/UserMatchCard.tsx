import React, { useEffect, useState } from "react";
import { SlotDetails, TopicConfidence, UserType } from "@/app/types";
import Overlay from "./Overlay";
import AvailabilityList from "./AvailabilityList";
import ConfidenceListOverlay from "./ConfidenceListOverlay";
import { MdOutlineEventAvailable } from "react-icons/md";
import { IoBulbOutline } from "react-icons/io5";

interface UserProfileCardProp {
  user: UserType;
}

const UserMatchCard: React.FC<UserProfileCardProp> = ({ user }) => {
  const [slots, setSlots] = useState<SlotDetails[]>([]);
  const [confidence, setConfidence] = useState<TopicConfidence[]>([]);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userSlots = await fetchUserAvailability(user.email);
      const userConfidence = await fetchUserConfidence(user.email);
      setSlots(userSlots);
      setConfidence(userConfidence);
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

  async function fetchUserConfidence(
    userEmail: string
  ): Promise<TopicConfidence[]> {
    const response = await fetch(`/api/confidence?email=${userEmail}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user confidence");
    }
    const data: TopicConfidence[] = await response.json();
    console.log("userConfidence", data);
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
            aria-label="Show confidence"
            onClick={() => setShowConfidence(true)}
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
      {showConfidence && (
        <Overlay onClose={() => setShowConfidence(false)}>
          <div>
            <h3 className="text-lg font-bold mb-4">Confidence</h3>
            <ConfidenceListOverlay confidence={confidence} />
          </div>
        </Overlay>
      )}
    </div>
  );
};

export default UserMatchCard;
