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
        db = client.db('examDB');
        console.log("Connected to MongoDB - examDB");
        app.listen(5000, () => console.log("Server is running on port 5000"));
    } catch (err) {
        console.error("Error:", err);
    }
}

// Register & Login Authentication
app.post('/api/auth', async (req, res) => {
    const { username, password, action } = req.body;
    try {
        if (action === 'register') {
            await db.collection('users').insertOne({ username, password, history: [] });
            res.json({ success: true, message: "Registered! Now login." });
        } else {
            const user = await db.collection('users').findOne({ username, password });
            if (user) res.json({ success: true, username: user.username });
            else res.status(401).json({ error: "Invalid Credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Backend Evaluation & Result Storage
const correctAnswers = { q1: 'Tokens', q2: 'RSA', q3: 'useEffect' };

app.post('/api/submit', async (req, res) => {
    const { username, answers } = req.body;
    let score = 0;
    
    // Evaluate Responses
    if (answers.q1 === correctAnswers.q1) score += 10;
    if (answers.q2 === correctAnswers.q2) score += 10;
    if (answers.q3 === correctAnswers.q3) score += 10;

    try {
        // Secure Storage of Result
        await db.collection('users').updateOne(
            { username },
            { $push: { history: { date: new Date(), score } } }
        );
        res.json({ success: true, score });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

connectDB();