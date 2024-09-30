// apiService.js

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/shope/";
console.log("API_BASE_URL: ", API_BASE_URL);

async function fetchAndStoreCsrfToken() {
  try {
    console.log('fehcing')
    const response = await fetch(`${API_BASE_URL}api/get-csrf`);
    console.log(response)
    const data = await response.json();
    console.log(data)
    localStorage.setItem('csrfToken', data.csrfToken);
    return data.csrfToken
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
}
function getCsrfToken() {
  return localStorage.getItem('csrfToken');
}

const getAuthHeaders = async () => {
  return {
    "Content-Type": "application/json",
    'Authorization':`Token ${getCsrfToken()}`,
  };
};
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }
  const data = await response.json();
  return await JSON.parse(data); // Make sure to parse the JSON string into an array
};

const apiService = {
  fetchCsrf: getCsrfToken,
  populateDB: async () => {
    const response = await fetch(`${API_BASE_URL}api/populate_db/`, {
      method: "POST",
      headers,
    });
    return await response;
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}api/logout/`, {
      method: "POST",
      headers,
    });
    return await response;
  },

  getItems: async () => {
    const response = await fetch(`${API_BASE_URL}api/items/`, {
      method: "GET",
      headers,
    });
    return await response;
  },

  searchItems: async (query) => {
    const response = await fetch(
      `${API_BASE_URL}api/search_items/?query=${encodeURIComponent(query)}`,
      {
        headers,
      }
    );
    return await response;
  },

  createAccount: async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}api/create_account/`, {
      method: "POST",
      headers,
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
  },

  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}api/login/`, {
      method: "POST",
      headers,
      body: JSON.stringify({ username, password }),
    });
    return await response;
  },

  addItem: async (title, description, price) => {
    const response = await fetch(`${API_BASE_URL}api/add_item/`, {
      method: "POST",
      headers: await getAuthHeaders(), // Use the auth headers
      body: JSON.stringify({ title, description, price }),
    });
    console.log('asd')
    return await response;
  },

  addToCart: async (itemId) => {
    const response = await fetch(`${API_BASE_URL}api/add_to_cart/${itemId}/`, {
      method: "POST",
      headers: await getAuthHeaders()
    });
    return await response;
  },

  viewCartItems: async () => {
    const response = await fetch(`${API_BASE_URL}api/cart/items/`, {
      headers: await getAuthHeaders()

    });
    return await response;
  },
};


export {
  apiService
};
