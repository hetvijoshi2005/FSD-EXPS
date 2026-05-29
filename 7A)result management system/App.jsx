import { useState } from 'react';
import './App.css';

function App() {
  // Dummy student data
  const initialStudents = [
    { roll: '101', name: 'Amit Sharma', subject: 'Compiler Design', marks: 85, grade: 'A' },
    { roll: '102', name: 'Priya Singh', subject: 'Cryptography', marks: 92, grade: 'A+' },
    { roll: '103', name: 'Rahul Verma', subject: 'DWM', marks: 45, grade: 'C' },
    { roll: '104', name: 'Neha Gupta', subject: 'Compiler Design', marks: 78, grade: 'B+' },
    { roll: '105', name: 'Rohan Das', subject: 'Cryptography', marks: 32, grade: 'F' }
  ];

  const [searchTerm, setSearchTerm] = useState('');

  // Filter students based on search input (Roll No or Name)
  const filteredStudents = initialStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.roll.includes(searchTerm)
  );

  return (
    <div className="dashboard-container">
      <header>
        <h1>Student Result Management</h1>
      </header>

      <div className="controls">
        <input 
          type="text" 
          placeholder="Search by Roll No or Name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.roll}>
                  <td>{student.roll}</td>
                  <td>{student.name}</td>
                  <td>{student.subject}</td>
                  <td>{student.marks}</td>
                  <td className={`grade-${student.grade.replace('+', 'plus')}`}>
                    <strong>{student.grade}</strong>
                  </td>
                  <td>
                    <span className={`status-badge ${student.marks >= 40 ? 'pass' : 'fail'}`}>
                      {student.marks >= 40 ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No results found for "{searchTerm}"</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;