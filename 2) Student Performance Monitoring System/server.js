import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('studentPerformanceDB');
        console.log("Connected to MongoDB - studentPerformanceDB");
        app.listen(5000, () => console.log("Server is running on port 5000"));
    } catch (err) {
        console.error("Error:", err);
    }
}

// Login Authentication API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Simple dummy check for Teacher/Admin login
    if (username === 'admin' && password === '1234') {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Get Students (with Search/Filter)
app.get('/api/students', async (req, res) => {
    const { search } = req.query;
    let query = {};
    if (search) {
        // Case-insensitive search on student name
        query = { name: { $regex: search, $options: 'i' } };
    }
    try {
        const students = await db.collection('records').find(query).toArray();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add New Student Record
app.post('/api/students', async (req, res) => {
    try {
        await db.collection('records').insertOne(req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

connectDB();