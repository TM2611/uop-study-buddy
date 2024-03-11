import React from 'react';

interface PopupProps {
  show: boolean;
  title: string;
  content: JSX.Element;
  onConfirm: (() => Promise<void>) | null;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({
  show,
  title,
  content,
  onConfirm,
  onClose,
}) => {
  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">{title}</h3>
          {content}
          {onConfirm && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={onConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded shadow-md mr-2"
              >
                Confirm
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow-md"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default Popup;