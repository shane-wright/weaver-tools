import ChatForm from "../components/chat-form.js"
import ChatDialog from "../components/chat-dialog.js"
import Container from "../components/container.js"
import HR from "../components/hr.js"
import H4 from "../components/h4.js"
import Icon from "../components/icon.js"
import Nav from "../components/nav.js"
import QuestionModal from "../components/question-modal.js"
import StigSelector from "../components/stig-selector.js"
import Toast from "../components/toast.js"

import { chat, getLocalModels } from "../managers/ai-manager.js"
import { exportMessages, readFile } from "../managers/data-manager.js"

// @function render
// @description Renders dynamic JavaScript components into the "mainContent" div defined in ../index.html.
// @param None
// @returns Promise<void> (directly affects the DOM)
const render = async () => {
    let mainContent = tibr.getElement("mainContent")

    let viewContainer = Container({
        id: "stigChatView",
        classes: ["container-fluid"],
        style: {
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden"
        }
    })

    mainContent.append(viewContainer)

    await initialize()

    viewContainer.append(renderToast())
    viewContainer.append(renderExportModal())
    viewContainer.append(renderHeader())
    viewContainer.append(renderChatApp())

    await animate()
}

// @function initialize
// @description Initializes the AI chat session by setting up data and retrieving available models.
// @param None
// @returns Promise<void>
const initialize = async () => {
    tibr.data.ai.messages = []
    tibr.data.ai.sessionId = uuidv4()
}

// @function animate
// @description Animates the chat interface by refreshing models, selecting the current model, attaching files if any, and rendering messages.
// @param None
// @returns Promise<void>
const animate = async () => {
    // load stigs
    readFile("../data/stigs.json", onMessage)

    let chatInput = tibr.getElement("chatInput")

    chatInput.value = ""

    renderMessages()
    chatInput.focus()
}

// @function renderToast
// @description Renders the toast component for displaying messages.
// @param None
// @returns HTMLElement The toast element
const renderToast = () => {
    return Toast({
        id: "toast",
    })
}

// @function renderHeader
// @description Renders the header of the chat interface, including navigation, model selector, and icons.
// @param None
// @returns HTMLElement The header element
const renderHeader = () => {
    let header = Container({
        id: "chatHeader",
        style: {
            display: "flex",
            gap: "10px",
            marginTop: "5px",
        }
    })

    header.append(Nav({}))
    header.append(renderStigSelector())
    header.append(renderNewChatIcon())
    header.append(renderExportIcon())

    return header
}

// @function renderNewChatIcon
// @description Renders the icon for starting a new chat.
// @param None
// @returns HTMLElement The new chat icon element
const renderNewChatIcon = () => {
    return Icon({
        id: "newChatIcon",
        classes: ["ri-chat-new-line"],
        style: { fontSize: "36px" },
        onClick: async () => {
            let chatDialog = tibr.getElement("chatDialog")
            if(chatDialog) {
                chatDialog.app.clearMessages()
            }

            await initialize()
            await animate()
        }
    })
}

// @function renderExportIcon
// @returns {Object} The Icon component for export
const renderExportIcon = () => {
    return Icon({
        id: "exportIcon",
        classes: ["ri-export-line"],
        style: { fontSize: "36px" },
        onClick: async () => {
            if(tibr.data.ai.messages && tibr.data.ai.messages.length > 0) {
                tibr.getElement("exportModal").app.openModal()
            }
            else {
                tibr.getElement("toast").app.show("No messages to export")
            }
        },
    })
}

// @func renderExportModal
const renderExportModal = () => {
    return QuestionModal({
        id: "exportModal",
        placeholder: "Output markdown file (ex: /Users/developer/workspace/projects/chat-log.md)",
        onSave: async () => {
            let exportModal = tibr.getElement("exportModal")
            let filePath = exportModal.app.getDescription()

            await exportMessages(filePath, tibr.data.ai.messages, onMessage)

            exportModal.app.closeModal()
        }
    })
}

// @function renderStigSelector
const renderStigSelector = () => {
    return StigSelector({
        id: "stigSelector",
        onChange: (e) => {
            let stigName = e.target.value

            tibr.data.stig.name = stigName
            displayStig(stigName)
        }
    })
}

// @function displayStig
const displayStig = (stigName) => {
    tibr.data.ai.messages = []
    tibr.data.ai.sessionId = uuidv4()

    let stigMessage = formatStig(tibr.data.stig.stigMap[stigName])
    const chatDialog = tibr.getElement("chatDialog")

    chatDialog.app.clearMessages()
    chatDialog.app.addMessage("user", stigMessage)
}

// @function renderChatApp
// @description Renders the main chat application container, including the dialog and form.
// @param None
// @returns HTMLElement The chat app container element
const renderChatApp = () => {
    let chatApp = Container({
        id: "chatApp",
        style: {
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
        }
    })

    chatApp.append(renderChatDialog())
    chatApp.append(HR({ style: { margin: "10px 0" } }))
    chatApp.append(renderChatForm())

    return chatApp
}

// @function renderChatDialog
// @description Renders the chat dialog container where messages are displayed.
// @param None
// @returns HTMLElement The chat dialog container element
const renderChatDialog = () => {
    let chatDialogContainer = Container({
        id: "chatDialogContainer",
        style: {
            flex: "1 1 auto",
            overflowY: "auto",
            minHeight: "0",
        }
    })

    let chatDialog = ChatDialog({
        id: "chatDialog",
    })

    chatDialogContainer.append(chatDialog)

    return chatDialogContainer
}

// @function renderChatForm
// @description Renders the chat form for user input.
// @param None
// @returns HTMLElement The chat form container element
const renderChatForm = () => {
    let chatFormContainer = Container({
        id: "chatFormContainer", 
        style: {
        }
    })

    let chatForm = ChatForm({
        id: "chatForm",
        responsive: true,
        style: {
            flex: "0 0 auto",
        },
        onSubmit: () => {
            let chatInput = tibr.getElement("chatInput")
            let message = chatInput.value

            chatInput.value = ""

            executeChat(message)
        }
    })

    chatFormContainer.append(chatForm)

    return chatFormContainer
}

// @function renderMessages
// @description Renders the chat messages in the dialog.
// @param None
// @returns Promise<void>
const renderMessages = async () => {
    const chatDialog = tibr.getElement("chatDialog")

    chatDialog.app.clearMessages()

    for(let message of tibr.data.ai.messages) {
        chatDialog.app.addMessage(message.role, message.content)
    }
}

// Model-specific token limits (adjust based on Ollama documentation)
const modelTokenLimits = {
    "tinyllama:latest": 2048,
    "gemma2:2b": 8192,
    "granite3.1-dense:2b": 131072,
    "stig:latest": 131072,
}

// @function estimateTokens
const estimateTokens = (text) => Math.ceil(text.length / 4) // Rough estimate: 1 token ≈ 4 chars

// @function executeChat
// @description Sends the user's message to the AI and handles the response.
// @param {string} message The user's message
// @returns Promise<void>
const executeChat = async (message) => {
    let toast = tibr.getElement("toast")

    const chatDialog = tibr.getElement("chatDialog")
    const chatForm = tibr.getElement("chatForm")

    // Estimate tokens for the message and history
    const totalTokens = estimateTokens(message) + estimateTokens(JSON.stringify(tibr.data.ai.messages))

    const stigModel = "stig:latest"
    const maxTokens = modelTokenLimits[stigModel] || 4096

    if (totalTokens > maxTokens) {
        toast.app.show("Message too large. Please export message.")
        return
    }
    else {
        toast.app.show(`Generating Response (${totalTokens} / ${maxTokens})`)
    }

    chatForm.app.setDisabled(true)

    let stigMessage = ""
    if(tibr.data.ai.messages.length === 0) {
        stigMessage = formatStig(tibr.data.stig.stigMap[tibr.data.stig.name])
        stigMessage += `\n\n---\n\n${message}\n`
    }
    else {
        stigMessage = message
    }

    if(tibr.data.ai.messages.length === 0) {
        tibr.getElement("chatDialog").innerHTML = ""
    }

    tibr.data.ai.messages.push({ role: "user", content: stigMessage })
    chatDialog.app.addMessage("user", stigMessage)

    const chatResponse = await fetchAIResponse("stig:latest", tibr.data.ai.messages)

    if (chatResponse) {
        toast.app.show("Response ready")
        tibr.data.ai.messages.push({ role: "assistant", content: chatResponse.message.content })

        renderMessages()
    } else {
        toast.app.show("Response error")
    }

    chatForm.app.setDisabled(false)
    tibr.getElement("chatInput").focus()
}

// @function formatStig
const formatStig = (stig) => {
    const stigMessage = `
# STIG ${stig.name} (${stig.category})

${stig.title}

## Description

${stig.description}

## Check Text

${stig.checktext}

## Fix Text

${stig.fixtext}
`
    return stigMessage
}

// @function fetchAIResponse
// @description Fetches the AI's response to the chat messages.
// @param {string} model The AI model to use
// @param {Object[]} messages The array of chat messages
// @returns Promise<Object|string> The AI's response or an empty string on error
const fetchAIResponse = async (model, messages) => {
    try {
        const timeoutMs = 90000 // 90 seconds
        const chatResponse = await Promise.race([
            chat(model, messages),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), timeoutMs)
            )
        ])

        if (chatResponse) {
            return chatResponse
        }
        else {
            return ""
        }
    }
    catch (error) {
            return ""
    }
}

// @function onMessage
// @description Processes incoming messages and updates the view based on message topic.
// @param {Object} message - The message object with topic and content data.
const onMessage = async (message) => {
    if(message.topic === "readFileResponse") {
        let stigs = JSON.parse(message.data.content)

        tibr.getElement("stigSelector").app.addItems(stigs)

        const stigName = tibr.getElement("stigSelector").value

        tibr.data.stig.stigs = stigs
        tibr.data.stig.name = stigName
        tibr.data.stig.stigMap = Object.fromEntries(stigs.map((item) => [item.name, item]));

        displayStig(stigName)
    }

    if(message.topic === "exportMessagesResponse") {
        tibr.getElement("toast").app.show(`Saved ${message.filePath}`, 4000)
    }
}

export { render, displayStig }
