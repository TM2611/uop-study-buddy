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
    const fetchData = async () => {
      const availableSlots = await fetchUserAvailability(user.email);
      const userConfidence = await fetchUserConfidence(user.email);
      setAvailabilitySlots(availableSlots);
      setConfidence(userConfidence);
    };

    fetchData();
  }, [user.email]);

  return (
    <div className="relative max-w-60 rounded overflow-hidden shadow-lg bg-white">
      <img
        className="w-60 h-auto object-cover"
        src={user.picture}
        alt={`${user.given_name} ${user.family_name} - Profile`}
      />

      <div className="px-4 py-2">
        <div className="font-bold text-lg mb-1">{`${user.given_name} ${user.family_name}`}</div>
        <p className="text-gray-700 text-sm">{user.email}</p>
        <p className="text-gray-700 text-sm">Year: {user.year}</p>
        <p className="text-gray-700 text-sm">Course: {user.course_code}</p>
      </div>

      <section className="flex m-1">
        <div className="flex justify-evenly w-1/2">
          <button
            type="button"
            aria-label="Show availableSlots"
            onClick={() => setShowAvailabilityOverlay(true)}
            className="text-blue-500 flex items-center justify-center p-1"
          >
            <MdOutlineEventAvailable size={24} />
          </button>

          <button
            type="button"
            aria-label="Show confidence"
            onClick={() => setShowConfidenceOverlay(true)}
            className="text-blue-500 flex items-center justify-center p-1"
          >
            <IoBulbOutline size={24} />
          </button>
        </div>
        <button
          onClick={() => {
            setShowSessionSelection(true);
            setSelectedUser(user);
          }}
          className="text-blue-500 border bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline w-1/2"
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
