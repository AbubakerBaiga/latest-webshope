import React from 'react';

const Cart = ({ cartItems }) => {
  console.log('cartItems: ', cartItems); // This will log the cartItems passed as props

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">Cart Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cartItems.length > 0 ? (
          cartItems.map((cartItem) => (
            <div key={cartItem.item.id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{cartItem.item.title}</h3>
              <p>{cartItem.item.description}</p>
              <p className="text-sm text-gray-600">
                Added on: {new Date(cartItem.item.date_added).toLocaleDateString()}
              </p>
              <p className="text-lg font-semibold">${cartItem.item.price}</p>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
