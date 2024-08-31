const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.querySelector('.chat-messages');

sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        // Send message to the server
        fetch('/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message, sender: 'user' }),
        })
        .then(response => response.json())
        .then(data => {
            // Display the user's message
            displayMessage(message, 'user-message');
            // Display GPT's response
            displayMessage(data.message, 'bot-message');
            userInput.value = ''; // Clear input
        });
    }
});

function displayMessage(message, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
}

function loadChatHistory() {
    fetch('/messages')
        .then(response => response.json())
        .then(data => {
            data.forEach(msg => {
                const className = msg.sender === 'user' ? 'user-message' : 'bot-message';
                displayMessage(msg.message, className);
            });
        });
}

window.onload = loadChatHistory;
