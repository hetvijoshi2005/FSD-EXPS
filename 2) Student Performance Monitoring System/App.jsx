import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  
  // Form States
  const [name, setName] = useState('');
  const [marks, setMarks] = useState('');
  const [assignment, setAssignment] = useState('Pending');
  const [feedback, setFeedback] = useState('');

  // Fetch student records from API
  const fetchStudents = () => {
    fetch(`http://localhost:5000/api/students?search=${search}`)
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  useEffect(() => {
    if (isLoggedIn) fetchStudents();
  }, [search, isLoggedIn]);

  const handleLogin = () => {
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) setIsLoggedIn(true);
      else alert("Use admin / 1234 to login");
    });
  };

  const addRecord = () => {
    if (!name || !marks) return alert("Name and Marks are required");
    fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, marks, assignment, feedback })
    })
    .then(() => {
      fetchStudents(); // Refresh list
      setName(''); setMarks(''); setFeedback(''); // Clear form
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="container login">
        <h2>Teacher Login</h2>
        <input type="text" placeholder="Username (admin)" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password (1234)" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      <header>
        <h2>Student Performance Dashboard</h2>
        <button onClick={() => setIsLoggedIn(false)} className="logout-btn">Logout</button>
      </header>

      <div className="top-controls">
        <input 
          type="text" 
          placeholder="🔍 Search Student by Name..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="search-bar"
        />
      </div>

      <div className="main-content">
        <div className="form-section">
          <h3>Add New Record</h3>
          <input type="text" placeholder="Student Name" value={name} onChange={e => setName(e.target.value)} />
          <input type="number" placeholder="Marks (%)" value={marks} onChange={e => setMarks(e.target.value)} />
          <select value={assignment} onChange={e => setAssignment(e.target.value)}>
            <option value="Pending">Assignment: Pending</option>
            <option value="Submitted">Assignment: Submitted</option>
          </select>
          <input type="text" placeholder="Feedback/Remarks" value={feedback} onChange={e => setFeedback(e.target.value)} />
          <button onClick={addRecord}>Save Record</button>
        </div>

        <div className="list-section">
          <h3>Student Records</h3>
          {students.map((student, index) => (
            <div key={index} className="student-card">
              <h4>{student.name}</h4>
              <p><strong>Marks:</strong> {student.marks}%</p>
              <p><strong>Assignment:</strong> {student.assignment}</p>
              <p><strong>Feedback:</strong> {student.feedback}</p>
            </div>
          ))}
          {students.length === 0 && <p>No records found.</p>}
        </div>
      </div>
    </div>
  );
}

export default App;