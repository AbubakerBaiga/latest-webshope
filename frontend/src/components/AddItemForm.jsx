import React, { useState } from 'react';
import {apiService} from '../services/apiService';

const AddItemForm = ({ onClose, onItemAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await apiService.addItem(title, description, price);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Ensure this line is correctly parsing the JSON
      console.log(data); // Log the parsed data
      onItemAdded(data.item); // Update the item list with the new item, assuming data.item is the newly added item
      onClose(); // Close the modal after adding the item
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Item</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Item
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
  );
};

export default AddItemForm;
