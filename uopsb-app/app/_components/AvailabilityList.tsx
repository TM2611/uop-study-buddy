// AvailabilityList.tsx
import React from 'react';

interface SlotType {
  day: string;
  start_hour: number;
  end_hour: number;
}

interface AvailabilityListProps {
  slots: SlotType[];
}

const formatHour = (hour: number): string => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const adjustedHour = hour % 12 || 12;
  return `${adjustedHour} ${suffix}`;
};

const AvailabilityList: React.FC<AvailabilityListProps> = ({ slots }) => {
  return (
    <ul className="space-y-1">
      {slots.map((slot, index) => (
        <li key={index} className="text-gray-700 text-base">
          {slot.day}: {formatHour(slot.start_hour)} - {formatHour(slot.end_hour)}
        </li>
      ))}
    </ul>
  );
};

export default AvailabilityList;