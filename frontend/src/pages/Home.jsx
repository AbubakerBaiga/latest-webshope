// pages/Home.jsx
import React, { useState, useEffect } from "react";
import {apiService} from "../services/apiService";
import ItemList from "../components/ItemList";
import SearchBar from "../components/SearchBar";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import AddItemForm from "../components/AddItemForm";
import Cart from "../pages/Cart";

const Home = () => {
  const [cartItems, setCartItems] = useState([]); 
  const [items, setItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [message, setMessage] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const closeLogin = () => setShowLogin(false);
  const closeRegister = () => setShowRegister(false);
  const closeAddItem = () => setShowAddItem(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleAddItem = () => {
    setShowAddItem(true); // Function to show the AddItemForm
  };
  const handleViewCart = () => {
    setShowCart(true); // Show the Cart
    fetchCartItems(); // Fetch cart items when opening the cart
  };
const handleLoginSuccess = (userData) => {
  console.log('User logged in:', userData);
  localStorage.setItem('token', userData.token); // Store the token in local storage
  setIsLoggedIn(true); // Update the login state
  closeLogin(); // Close the login form
};
const fetchCartItems = async () => {
  try {
    const fetchedCartItems = await apiService.viewCartItems();
    let res=await fetchedCartItems.json()
    setCartItems(res); // Update the cart items state
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
  }
};

const handleLogout = async () => {
  try {
    let response=await apiService.logout();
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    await response.json();
    localStorage.removeItem('token'); // Remove the token from local storage
    setIsLoggedIn(false); // Update the login state
  } catch (error) {
    const errorMessage = typeof error.message === 'object' ? JSON.stringify(error.message) : error.message;
    console.error('Failed to log out:', errorMessage);
  }
};


  const resetSearch = async () => {
    await fetchItems(); // Fetch all items again
  };
  const populateDatabase = async () => {
    try {
      let response = await apiService.populateDB();
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      response = await response.json();
      setMessage(response.message);
      fetchItems();
    } catch (error) {
      setMessage("Failed to populate database");
      console.error(error);
    }
  };

  const fetchItems = async () => {
    try {
      const fetchedItems = await apiService.getItems();
  const data = await fetchedItems.json();

      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items:",error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      // If the search query is empty, fetch all items
      fetchItems();
      return;
    }
    try {
      const searchResults = await apiService.searchItems(query);
      const data = await searchResults.json();

      setItems(data);
    } catch (error) {
      console.error("Failed to search items:", error);
    }
  };
  const handleAddToCart = async (itemId) => {
    if (!isLoggedIn) {
      alert("Please login to add items to cart");
      return;
    }
    try {
      const response = await apiService.addToCart(itemId);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessage(data.message);
      fetchCartItems(); // Fetch updated cart items
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  useEffect(() => {
    // Check if the user is logged in when the component mounts
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);
  useEffect(() => {
    fetchItems();
  }, []);
  useEffect(() => {
        if (message !== "") {
            // Clear the message after 2 seconds
            const timer = setTimeout(() => {
                setMessage("");
            }, 2000);

            // Clean up the timer
            return () => clearTimeout(timer);
        }
    }, [message]);
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
      <button
              onClick={populateDatabase}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-300 mx-2"
            >
              Populate DB
            </button>
        {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 mr-2"
            >
              Logout
            </button>
            <button
              onClick={handleAddItem}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mx-2"
            >
              Add New Item
            </button>
            <button
              onClick={handleViewCart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mx-2"
            >
              View Cart
            </button>
            
          </>
        ) : (
          <>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mr-2"
            >
              Login
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
            >
              Register
            </button>
          </>
        )}
      </div>

      {message && (
        <div
          className="transition duration-300 mx-2 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Message: </strong>
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      <SearchBar onSearch={handleSearch} reset={resetSearch} />
      <ItemList items={items} onAddToCart={handleAddToCart} />
      {showLogin && <LoginForm onClose={closeLogin} onLoginSuccess={handleLoginSuccess} />}
      {showRegister && <RegisterForm onClose={closeRegister} />}
      {showAddItem && <AddItemForm onClose={closeAddItem} onItemAdded={fetchItems} />}
{showCart && <Cart cartItems={cartItems} onClose={() => setShowCart(false)} />}

    </div>
  );
};

export default Home;
