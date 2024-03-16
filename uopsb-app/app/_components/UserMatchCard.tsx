import React, { useEffect, useState } from "react";
import { AvailabilitySlot, TopicConfidence, UserType } from "@/app/types";
import { fetchUserAvailability, fetchUserConfidence } from "@/lib/api";
import AvailabilityOverlay from "./AvailabilityOverlay";
import ConfidenceOverlay from "./ConfidenceOverlay";
import { MdOutlineEventAvailable } from "react-icons/md";
import { IoBulbOutline } from "react-icons/io5";

interface UserProfileCardProp {
  user: UserType;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserType>>;
  setShowSessionSelection: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserMatchCard: React.FC<UserProfileCardProp> = ({
  user,
  setSelectedUser,
  setShowSessionSelection,
}) => {
  const [availableSlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(
    []
  );
  const [confidence, setConfidence] = useState<TopicConfidence[]>([]);
  const [showAvailabilityOverlay, setShowAvailabilityOverlay] = useState(false);
  const [showConfidenceOverlay, setShowConfidenceOverlay] = useState(false);

  useEffect(() => {
    setSelectedUser(user);
    const fetchData = async () => {
      const availableSlots = await fetchUserAvailability(user.email);
      const userConfidence = await fetchUserConfidence(user.email);
      setAvailabilitySlots(availableSlots);
      setConfidence(userConfidence);
    };

    fetchData();
  }, [user.email]);

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
      </div>

      <section className="flex">
        <div className="flex justify-evenly w-1/2">
          <button
            type="button"
            aria-label="Show availableSlots"
            onClick={() => setShowAvailabilityOverlay(true)}
            className="text-blue-500 flex items-center justify-center p-2"
          >
            <MdOutlineEventAvailable size={30} />
          </button>

          <button
            type="button"
            aria-label="Show confidence"
            onClick={() => setShowConfidenceOverlay(true)}
            className="text-blue-500 flex items-center justify-center p-2"
          >
            <IoBulbOutline size={30} />
          </button>
        </div>
        <button
          onClick={() => setShowSessionSelection(true)}
          className="text-blue-500 border bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
        >
          Study
        </button>
      </section>
      {showAvailabilityOverlay && (
        <AvailabilityOverlay
          availableSlots={availableSlots}
          setShowAvailabilityOverlay={setShowAvailabilityOverlay}
        />
      )}
      {showConfidenceOverlay && (
        <ConfidenceOverlay
          confidence={confidence}
          setShowConfidenceOverlay={setShowConfidenceOverlay}
        />
      )}
    </div>
  );
};

export default UserMatchCard;
