// AvailabilityList.tsx
import React from "react";
import Overlay from "./Overlay";

interface SlotType {
  day: string;
  start_hour: number;
  end_hour: number;
}

interface AvailabilityListProps {
  slots: SlotType[];
  setShowAvailability: (show: boolean) => void;
}

const formatHour = (hour: number): string => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12;
  return `${adjustedHour} ${suffix}`;
};

const AvailabilityList: React.FC<AvailabilityListProps> = ({
  slots,
  setShowAvailability,
}) => {
  return (
    <Overlay onClose={() => setShowAvailability(false)}>
      <div>
        <h3 className="text-lg font-bold mb-4">Availability</h3>
      </div>
      <ul className="space-y-1">
        {slots.map((slot, index) => (
          <li key={index} className="text-gray-700 text-base">
            {slot.day}: {formatHour(slot.start_hour)} -{" "}
            {formatHour(slot.end_hour)}
          </li>
        ))}
      </ul>
    </Overlay>
  );
};

export default AvailabilityList;
