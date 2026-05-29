import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('shop'); // 'shop' or 'cart'

  // Fetch Products with Search API Communication
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/products?search=${search}`)
        .then(res => res.json())
        .then(data => setProducts(data));
    }
  }, [search, user]);

  const handleLogin = () => {
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) setUser(data.username);
      else alert("Enter both username and password");
    });
  };

  const placeOrder = () => {
    if (cart.length === 0) return alert("Cart is empty");
    fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, items: cart, total: cart.reduce((s, c) => s + c.price, 0) })
    })
    .then(res => res.json())
    .then(data => {
      alert(`Order placed successfully! ID: ${data.orderId}`);
      setCart([]);
      setView('shop');
    });
  };

  if (!user) {
    return (
      <div className="container login-box">
        <h2>Login / Register</h2>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h2>Welcome, {user}</h2>
        <div>
          <button onClick={() => setView('shop')}>Shop</button>
          <button onClick={() => setView('cart')} className="cart-btn">Cart ({cart.length})</button>
        </div>
      </header>

      {view === 'shop' ? (
        <div>
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-bar"
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
          <div className="product-list">
            {products.map(p => (
              <div key={p.id} className="card">
                <h3>{p.name}</h3>
                <p>₹{p.price}</p>
                <button onClick={() => setCart([...cart, p])}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2>Your Cart</h2>
          {cart.map((c, i) => <p key={i}>{c.name} - ₹{c.price}</p>)}
          <h3>Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}</h3>
          <button className="checkout-btn" onClick={placeOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
}

export default App;