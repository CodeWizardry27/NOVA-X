const chatIcon = document.getElementById('chatIcon');
const chatPopup = document.getElementById('chatPopup');
const closeChat = document.getElementById('closeChat');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const chatBody = document.getElementById('chatBody');

// Show the chat popup when the chat icon is clicked
chatIcon.addEventListener('click', () => {
    chatPopup.style.display = 'flex';
});

// Hide the chat popup when the close button is clicked
closeChat.addEventListener('click', () => {
    chatPopup.style.display = 'none';
});

// Send the message when the send button is clicked
sendButton.addEventListener('click', () => {
    sendMessage();
});

// Send the message when the Enter key is pressed
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();

    if (message) {
        // Display the user's message in the chat body
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('user-message');
        userMessageElement.innerText = message;
        chatBody.appendChild(userMessageElement);

        // Clear the input field
        userInput.value = '';

        // Optionally, send the message to your server or API
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        })
        .then(response => response.json())
        .then(data => {
            // Display the bot's response in the chat body
            const botMessageElement = document.createElement('div');
            botMessageElement.classList.add('bot-message');
            botMessageElement.innerText = data.reply;
            chatBody.appendChild(botMessageElement);

            // Scroll to the bottom of the chat
            chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    }
}

