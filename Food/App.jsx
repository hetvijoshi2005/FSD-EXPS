import { useState } from 'react';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  // Static Food Data
  const menu = [
    { id: 1, name: 'Margherita Pizza', price: 299, emoji: '🍕' },
    { id: 2, name: 'Veg Burger', price: 149, emoji: '🍔' },
    { id: 3, name: 'French Fries', price: 99, emoji: '🍟' },
    { id: 4, name: 'Cold Coffee', price: 120, emoji: '🥤' }
  ];

  const addToCart = (item) => setCart([...cart, item]);
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    
    fetch('http://localhost:5000/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, total: totalAmount })
    })
    .then(res => res.json())
    .then(data => {
      setOrderMessage(data.message);
      setCart([]); // Empty cart after order
      setShowCart(false); // Go back to menu
      setTimeout(() => setOrderMessage(''), 3000); // Hide message after 3 secs
    })
    .catch(err => console.error("Error:", err));
  };

  return (
    <div className="container">
      <header>
        <h1>🍔 Foodie Web</h1>
        <button className="cart-toggle" onClick={() => setShowCart(!showCart)}>
          {showCart ? 'Back to Menu' : `🛒 Cart (${cart.length})`}
        </button>
      </header>

      {orderMessage && <div className="success-banner">{orderMessage}</div>}

      {!showCart ? (
        <div className="menu-grid">
          {menu.map((item) => (
            <div key={item.id} className="food-card">
              <div className="food-emoji">{item.emoji}</div>
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <button className="add-btn" onClick={() => addToCart(item)}>Add</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="cart-section">
          <h2>Your Cart</h2>
          {cart.length === 0 ? <p>No items added yet.</p> : (
            <ul>
              {cart.map((item, index) => (
                <li key={index}>{item.name} <span>₹{item.price}</span></li>
              ))}
            </ul>
          )}
          <h3>Total: ₹{totalAmount}</h3>
          <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
        </div>
      )}
    </div>
  );
}

export default App;