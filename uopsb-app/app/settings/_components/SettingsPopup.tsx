import React, { useState } from "react";
import Popup from "@/app/_components/Popup";
import { useRouter } from "next/navigation";

const SettingsPopup: React.FC = () => {
  const [show, setShow] = useState(true);
  const title = "Update Settings";
  const content = <p>Your settings have been updated successfully.</p>;
  const router = useRouter();

  const onClose = () => {
    router.push("/settings");
    setShow(false);
  };

  const handleConfirm = async () => {
    router.push("/settings");
    setShow(false);
  };

  return (
    <Popup
      show={show}
      title={title}
      content={content}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
};

export default SettingsPopup;
