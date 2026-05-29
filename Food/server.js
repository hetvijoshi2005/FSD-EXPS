import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Dummy API route to handle order placement
app.post('/api/order', (req, res) => {
    const { items, total } = req.body;
    console.log(`Received order for ${items.length} items. Total: ₹${total}`);
    
    // Sirf success message return kar raha hai
    res.json({ success: true, message: "Order placed successfully!" });
});

app.listen(5000, () => console.log("Minimal Backend running on port 5000"));