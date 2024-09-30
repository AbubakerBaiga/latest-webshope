import React from 'react';

const Toast = ({ message, onClose }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 m-8 w-64 bg-white rounded shadow-lg px-6 py-4">
      <div className="flex justify-between items-center">
        <div>{message}</div>
        <button onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default Toast;
