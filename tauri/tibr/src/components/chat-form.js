/**
* ChatForm Component
* @param {Object} options - Configuration options for the chat form
* @param {string} [options.id] - ID for the chat form
* @param {string[]} [options.classes] - CSS classes for the chat form
* @param {Object} [options.style] - Inline styles for the chat form
* @param {Function} options.onSubmit - Submit event handler for the chat form
* @returns {HTMLFormElement} The configured chat form element
*/
// @func ChatForm
export default function ChatForm(options) {
    const chatForm = document.createElement('form')
    const chatInput = document.createElement('textarea')
    const chatSendButton = document.createElement('button')

    // Assign the id if provided.
    if(options.id) {
        chatForm.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
        chatForm.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(chatForm.style, options.style)
    }

    chatInput.id = 'chatInput'
    chatInput.style.resize = 'none'

    if(options.responsive === true) {
        chatInput.style.height = '200px'

        window.addEventListener('resize', adjustChatInputHeight)

        function adjustChatInputHeight() {
            if (window.matchMedia('(max-width: 768px), (max-height: 600px)').matches) { // Tablet and phone
                chatInput.style.height = '50px'
            } else {
                chatInput.style.height = '200px'
            }
        }
    }
    else {
        chatInput.style.height = '50px'
    }

    chatInput.placeholder = 'Type your message...'
    chatInput.required = true

    chatSendButton.id = 'chatSendButton'
    chatSendButton.type = 'submit'
    chatSendButton.textContent = 'Send'

    chatForm.appendChild(chatInput)
    chatForm.appendChild(chatSendButton)

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault()
        if (chatInput.value.trim()) {
            options.onSubmit(chatInput.value)
            chatInput.value = ''
        }
    })

    let chatFormApp = {
        id: options.id,
        setDisabled: (disabled) => { setDisabled(disabled) },
    }

    chatForm.app = chatFormApp

    return chatForm
}

function setDisabled(disabled) {
    tibr.getElement("chatInput").disabled = disabled
    tibr.getElement("chatSendButton").disabled = disabled
}
