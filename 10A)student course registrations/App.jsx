import { useState } from 'react';
import './App.css';

function App() {
  // State for all registered courses
  const [registrations, setRegistrations] = useState([
    { id: 1, student: 'Hetvi Joshi', course: 'Data Science', semester: '5' }
  ]);

  // Form states
  const [student, setStudent] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  
  // State to track if we are updating an existing record
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!student || !course || !semester) return alert("Please fill all fields!");

    if (editId) {
      // Update existing record
      const updatedList = registrations.map(reg => 
        reg.id === editId ? { id: editId, student, course, semester } : reg
      );
      setRegistrations(updatedList);
      setEditId(null); // Reset edit mode
    } else {
      // Add new record
      const newRecord = { id: Date.now(), student, course, semester };
      setRegistrations([...registrations, newRecord]);
    }

    // Clear form
    setStudent('');
    setCourse('');
    setSemester('');
  };

  const handleEdit = (reg) => {
    // Populate form with existing data
    setStudent(reg.student);
    setCourse(reg.course);
    setSemester(reg.semester);
    setEditId(reg.id);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Student Course Registration</h1>
      </header>

      <div className="main-content">
        {/* Form Section */}
        <div className="form-card">
          <h2>{editId ? '✏️ Update Registration' : '📝 Add New Course'}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Student Name" value={student} onChange={e => setStudent(e.target.value)} />
            <input type="text" placeholder="Course Name (e.g., AI, React)" value={course} onChange={e => setCourse(e.target.value)} />
            <select value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="" disabled>Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
            </select>
            <button type="submit" className={editId ? 'update-btn' : 'add-btn'}>
              {editId ? 'Update Details' : 'Register Course'}
            </button>
            {editId && (
              <button type="button" className="cancel-btn" onClick={() => {
                setEditId(null); setStudent(''); setCourse(''); setSemester('');
              }}>Cancel</button>
            )}
          </form>
        </div>

        {/* View Section */}
        <div className="list-card">
          <h2>📚 Registered Courses</h2>
          {registrations.length === 0 ? <p>No courses registered yet.</p> : (
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.student}</td>
                    <td>{reg.course}</td>
                    <td>Sem {reg.semester}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(reg)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;