import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Exam States
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer
  const [score, setScore] = useState(null);

  const handleAuth = () => {
    const action = isRegistering ? 'register' : 'login';
    fetch('http://localhost:5000/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, action })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        if (isRegistering) alert(data.message);
        else setUser(data.username);
      } else {
        alert(data.error);
      }
    });
  };

  // Timer Logic
  useEffect(() => {
    if (user && score === null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && score === null) {
      submitExam(); // Auto-submit when time is up
    }
  }, [timeLeft, user, score]);

  const submitExam = () => {
    fetch('http://localhost:5000/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, answers })
    })
    .then(res => res.json())
    .then(data => setScore(data.score));
  };

  if (!user) {
    return (
      <div className="container auth-box">
        <h2>{isRegistering ? 'Student Registration' : 'Student Login'}</h2>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleAuth}>{isRegistering ? 'Register' : 'Login'}</button>
        <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-auth">
          {isRegistering ? 'Already have an account? Login' : 'New here? Register'}
        </p>
      </div>
    );
  }

  return (
    <div className="container exam-box">
      <header>
        <h2>Welcome, {user}</h2>
        {score === null && <div className={`timer ${timeLeft < 15 ? 'danger' : ''}`}>Time Left: {timeLeft}s</div>}
      </header>

      {score === null ? (
        <div className="questions">
          <div className="q-card">
            <p>1. What is the primary output of a Lexical Analyzer?</p>
            <select onChange={e => setAnswers({ ...answers, q1: e.target.value })}>
              <option value="">Select...</option>
              <option value="Tokens">Tokens</option>
              <option value="Syntax Tree">Syntax Tree</option>
            </select>
          </div>
          
          <div className="q-card">
            <p>2. Which algorithm is widely used in asymmetric cryptography?</p>
            <select onChange={e => setAnswers({ ...answers, q2: e.target.value })}>
              <option value="">Select...</option>
              <option value="AES">AES</option>
              <option value="RSA">RSA</option>
            </select>
          </div>

          <div className="q-card">
            <p>3. In React, which hook handles side effects?</p>
            <select onChange={e => setAnswers({ ...answers, q3: e.target.value })}>
              <option value="">Select...</option>
              <option value="useState">useState</option>
              <option value="useEffect">useEffect</option>
            </select>
          </div>

          <button onClick={submitExam} className="submit-btn">Submit Exam</button>
        </div>
      ) : (
        <div className="result-box">
          <h2>Exam Completed!</h2>
          <h3>Your Final Score: {score} / 30</h3>
          <p>Result has been securely saved to the database.</p>
        </div>
      )}
    </div>
  );
}

export default App;