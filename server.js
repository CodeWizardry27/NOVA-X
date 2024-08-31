// server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE chat (id INTEGER PRIMARY KEY, message TEXT, sender TEXT)");
});

//Hardcoded OpenAI API key (not recommended for production)
const OPENAI_API_KEY = 
// Function to get GPT response from OpenAI API
const getGptResponse = async (message) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo', // Or 'gpt-4' if applicable
            messages: [{ role: 'user', content: message }],
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`, // Use hardcoded API key
                'Content-Type': 'application/json',
             }
    });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error communicating with GPT:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Route to handle incoming messages
app.post('/message', async (req, res) => {
    const { message, sender } = req.body;

    if (!message || !sender) {
        return res.status(400).json({ error: 'Message and sender are required' });
    }

    // Insert user message into database
    db.run(`INSERT INTO chat (message, sender) VALUES (?, ?)`, [message, sender], function(err) {
        if (err) {
            console.error("Error inserting user message into database:", err.message);
            return res.status(500).json({ error: 'Failed to save user message' });
        }
    });

    try {
        // Get response from GPT
        const gptResponse = await getGptResponse(message);

        // Insert GPT response into database
        db.run(`INSERT INTO chat (message, sender) VALUES (?, ?)`, [gptResponse, 'bot'], function(err) {
            if (err) {
                console.error("Error inserting GPT response into database:", err.message);
                return res.status(500).json({ error: 'Failed to save GPT response' });
            }
            res.json({ message: gptResponse });
        });
    } catch (error) {
        console.error("Error communicating with GPT:", error.message);
        res.status(500).json({ error: 'Failed to communicate with GPT' });
    }
});

// Route to retrieve chat history
app.get('/messages', (req, res) => {
    db.all(`SELECT * FROM chat`, [], (err, rows) => {
        if (err) {
            console.error("Error retrieving chat history:", err.message);
            return res.status(500).json({ error: 'Failed to retrieve chat history' });
        }
        res.json(rows);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
