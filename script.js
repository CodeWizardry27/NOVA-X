const chatIcon = document.getElementById('chatIcon');
const chatPopup = document.getElementById('chatPopup');
const closeChat = document.getElementById('closeChat');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const chatBody = document.getElementById('chatBody');

// Show the chat popup when the chat icon is clicked
chatIcon.addEventListener('click', () => {
    chatPopup.style.display = 'flex';
    chatPopup.classList.toggle('show');

    // Focus on the input box when the chat opens
    userInput.focus();

    // Display the welcome message if it's the first time opening
    if (chatBody.children.length === 0) {
        displayWelcomeMessage();
    }
});

// Hide the chat popup when the close button is clicked
closeChat.addEventListener('click', () => {
    chatPopup.classList.remove('show');
    setTimeout(() => {
        chatPopup.style.display = 'none';
        chatBody.innerHTML = ''; // Clear chat content
    }, 300); // Match with the CSS animation duration
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

        // Create and add logo for user message
        const userLogo = document.createElement('div');
        userLogo.classList.add('logo');
        userLogo.innerText = 'me'; // User text
        userMessageElement.appendChild(userLogo);

        // Use textContent instead of innerHTML to avoid injection issues
        const userTextElement = document.createElement('span');
        userTextElement.textContent = message;
        userMessageElement.appendChild(userTextElement);
        chatBody.appendChild(userMessageElement);

        // Add hover effect to user's message
        addHoverEffect(userMessageElement);

        // Clear the input field
        userInput.value = '';

        // Display loading animation while waiting for response
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('loading');
        loadingElement.innerHTML = '<span>Generating Response</span><span class="dots">...</span>';
        chatBody.appendChild(loadingElement);

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
            // Remove loading animation
            chatBody.removeChild(loadingElement);

            // Display the bot's response letter by letter
            const botMessageElement = document.createElement('div');
            botMessageElement.classList.add('bot-message');

            // Create and add logo for bot message
            const botLogo = document.createElement('div');
            botLogo.classList.add('logo');
            botLogo.innerText = 'AI'; // Bot text
            botMessageElement.appendChild(botLogo);

            chatBody.appendChild(botMessageElement);

            // Add hover effect to bot's message
            addHoverEffect(botMessageElement);

            // Function to display text letter by letter
            typeText(botMessageElement, data.reply);

            // Scroll to the bottom of the chat
            chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(error => {
            console.error('Error sending message:', error);
            // Remove loading animation in case of error
            chatBody.removeChild(loadingElement);
        });
    }
}

// Function to type text letter by letter
function typeText(element, text, delay = 50) {
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            const textNode = document.createTextNode(text.charAt(index));
            element.appendChild(textNode);
            index++;
        } else {
            clearInterval(interval);
        }
        // Scroll to the bottom as text is typed
        chatBody.scrollTop = chatBody.scrollHeight;
    }, delay);
}


function displayWelcomeMessage() {
    const welcomeMessage = document.createElement('div');
    welcomeMessage.classList.add('bot-message');
    welcomeMessage.innerHTML = `<div class="logo">AI</div>Hey! I'm NOVA-X, How can i assist you today?`;
    chatBody.appendChild(welcomeMessage);
}

// Function to add hover effect
function addHoverEffect(messageElement) {
    messageElement.addEventListener('mouseenter', () => {
        messageElement.style.transform = 'scale(1.05)';
        messageElement.style.backgroundColor = '#e0e0e0';
    });

    messageElement.addEventListener('mouseleave', () => {
        messageElement.style.transform = 'scale(1)';
        messageElement.style.backgroundColor = '';
    });
}
