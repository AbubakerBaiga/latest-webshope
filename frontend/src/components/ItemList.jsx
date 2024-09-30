// components/ItemList.jsx
import React from 'react';

const ItemList = ({ items,onAddToCart }) => {
  if (!Array.isArray(items)) {
    console.error('Expected items to be an array but received:', items);
    return <div>Incorrect data format received.</div>;
  }
  console.log(items)
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">Items for Sale</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{item.title}</h3>
              <p>{item.description}</p>
              <p className="text-sm text-gray-600">Added on: {new Date(item.date_added).toLocaleDateString()}</p>
              <p className="text-lg font-semibold">${item.price}</p>
              <button
                        onClick={() => onAddToCart(item.id)}
                        className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add to Cart
                    </button>
            </div>
          ))
        ) : (
          <h2>No items found</h2>
        )}
      </div>
    </div>
  );
};

export default ItemList;
