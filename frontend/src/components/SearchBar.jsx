// components/SearchBar.jsx
import React, { useState } from 'react';

const SearchBar = ({ onSearch, reset }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    if (query.trim()) {
      onSearch(query);
    } else {
      reset(); 
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex justify-center p-4">
      <input
        type="search"
        placeholder="Search items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border border-gray-300 rounded-l"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
