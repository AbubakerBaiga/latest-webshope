import React, { useState } from 'react';
import {apiService} from '../services/apiService';
import Toast from './Toast';

const LoginForm = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/login/`, {
        method: 'POST',
        headers: apiService.headers,
        body: JSON.stringify({ username, password }),
      });
  
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        data = await response.json(); // Parse JSON response
      console.log(data)

        localStorage.setItem('csrfToken', data.csrfToken);
      } else {
        const textData = await response.text();
        try {
          data = JSON.parse(textData); // Try to parse text response as JSON
        } catch (error) {
          data = textData; // Use text response directly if it's not JSON
        }
      }
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to log in. Please try again.');
      }
  
      setToastMessage('Logged in successfully!');
      onLoginSuccess(data);
      setTimeout(() => {
        setToastMessage(null);
        onClose(); // Close the modal after showing the toast
      }, 3000);
    } catch (error) {
      setToastMessage(error.message || 'An error occurred.');
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
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
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

export default LoginForm;
