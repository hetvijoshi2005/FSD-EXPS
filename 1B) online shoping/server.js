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
        db = client.db('shoppingDB');
        console.log("Successfully connected to MongoDB - shoppingDB");
        app.listen(5000, () => console.log("Server is running on port 5000"));
    } catch (err) {
        console.error("Error:", err);
    }
}

// 1. Authentication (Minimal Validation)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        res.json({ success: true, username });
    } else {
        res.status(400).json({ error: "Invalid credentials" });
    }
});

// 2. Product Listing & Search
app.get('/api/products', (req, res) => {
    const products = [
        { id: 101, name: 'Wireless Mouse', price: 500 },
        { id: 102, name: 'Mechanical Keyboard', price: 2000 },
        { id: 103, name: 'Monitor 24-inch', price: 9000 },
        { id: 104, name: 'USB-C Cable', price: 250 }
    ];
    
    const { search } = req.query;
    if (search) {
        const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        return res.json(filtered);
    }
    res.json(products);
});

// 3. Order Management (Save to DB)
app.post('/api/orders', async (req, res) => {
    try {
        const result = await db.collection('orders').insertOne(req.body);
        res.json({ success: true, orderId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

connectDB();