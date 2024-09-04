require('dotenv').config();
const express = require('express');
const { HfInference } = require('@huggingface/inference');

const app = express();
const port = 3000;

// Replace with your actual Hugging Face API key
const API_KEY = process.env.API_KEY;
const inference = new HfInference(API_KEY);

app.use(express.json());
app.use(express.static('public'));

// Function to handle chat completion
async function getChatCompletion(message) {
    let responseContent = '';

    for await (const chunk of inference.chatCompletionStream({
        model: 'mistralai/Mistral-Nemo-Instruct-2407',
        messages: [{ role: 'user', content: message }],
        max_tokens: 500,
    })) {
        responseContent += chunk.choices[0]?.delta?.content || '';
    }

    return responseContent;
}

// Handle chat requests
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).send({ error: 'Message is required' });
    }

    try {
        const reply = await getChatCompletion(message);
        res.send({ reply });
    } catch (error) {
        console.error('Error communicating with Hugging Face:', error.message);
        res.status(500).send({ error: 'Error communicating with Hugging Face API' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
