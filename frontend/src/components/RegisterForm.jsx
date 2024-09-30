import React, { useState } from 'react';
import {apiService} from '../services/apiService';
import Toast from './Toast'; // Make sure you have the Toast component imported

const RegisterForm = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Directly call the fetch inside the component for this specific request
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/create_account/`, {
        method: 'POST',
        headers: apiService.headers,
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.text(); // Get the response as text
  
      let parsedData;
      try {
        parsedData = JSON.parse(data); // Try to parse it as JSON
      } catch {
        // If an error occurs, assume the response isn't JSON formatted
        parsedData = data;
      }
  
      if (response.ok) {
        setToastMessage('Registration successful!');
        setTimeout(() => {
          setToastMessage(null);
          onClose(); // Close the modal after showing the toast
        }, 3000);
      } else {
        throw new Error(parsedData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setToastMessage(error.message || 'An unexpected error occurred.');
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      console.error(error.message);
    }
  };
  

  const closeToast = () => {
    setToastMessage(null);
  };

  return (
    <>
      <Toast message={toastMessage} onClose={closeToast} />
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Register</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Register
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default RegisterForm;
