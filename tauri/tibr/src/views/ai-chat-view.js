import ChatForm from "../components/chat-form.js"
import ChatDialog from "../components/chat-dialog.js"
import ChatHistory from "../components/chat-history.js"
import Container from "../components/container.js"
import HR from "../components/hr.js"
import H4 from "../components/h4.js"
import Icon from "../components/icon.js"
import ModelSelector from "../components/model-selector.js"
import Nav from "../components/nav.js"
import QuestionModal from "../components/question-modal.js"
import Toast from "../components/toast.js"

import { saveChatDialog, getChatHistory, updateChatDialog } from "../managers/data-manager.js"
import { getAIResponse, getLocalModels } from "../managers/ai-manager.js"

// @func render
const render = async () => {
    let mainContent = tibr.getElement("mainContent")

    let viewContainer = Container({
        id: "aiChatView",
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
    viewContainer.append(renderSaveModal())
    viewContainer.append(renderHeader())
    viewContainer.append(renderFileIndicator())
    viewContainer.append(renderChatApp())

    await animate()
}

// @func initialize
const initialize = async () => {
    tibr.data.ai.messages = []
    tibr.data.ai.history = await getChatHistory()
    tibr.data.ai.chatHistoryId = null

    tibr.data.ai.availableModels = await getLocalModels()

    if(! tibr.data.ai.model && tibr.data.ai.availableModels.length > 0) {
        if(tibr.data.profile.preferences) {
            tibr.data.ai.model = tibr.data.profile.preferences.ai.model
        }
        else {
            tibr.data.ai.model = tibr.data.ai.availableModels[0].name
        }
    }
}

// @func animate
const animate = async () => {
    tibr.getElement("chatHistory").app.refreshHistory()
    tibr.getElement("modelSelector").app.refreshModels()
    tibr.getElement("modelSelector").app.selectModel(tibr.data.ai.model)

    if(tibr.data.ai.messages.length === 0 && tibr.data.code.selectedFiles.length > 0) {
        for(let file of tibr.data.code.selectedFiles) {
            let fileMessage = ""

            if (file.name.endsWith('.md')) {
                fileMessage += file.content
            }
            else {
                fileMessage = `# ${file.name}\n\n`
                fileMessage += `\`\`\`\n`
                fileMessage += file.content
                fileMessage += `\`\`\`\n`
            }

            saveDraftChat(fileMessage)
        }
    }

    tibr.getElement("chatInput").focus()
}

// @func renderToast
const renderToast = () => {
    return Toast({
        id: "toast",
    })
}

// @func renderHeader
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
    header.append(renderChatHistory())
    header.append(renderModelSelector())
    header.append(renderFileSelectIcon())
    header.append(renderNewChatIcon())
    header.append(renderSaveIcon())

    return header
}

// @func renderFileSelectIcon
const renderFileSelectIcon = () => {
    return Icon({
        id: "fileSelectIcon",
        classes: ["ri-file-list-line"],
        style: { fontSize: "36px" },
        onClick: async () => {
            tibr.render("TibrCodeView")
        },
    })
}

// @func renderNewChatIcon
const renderNewChatIcon = () => {
    return Icon({
        id: "newChatIcon",
        classes: ["ri-add-line"],
        style: { fontSize: "36px" },
        onClick: async () => {
            let chatDialog = tibr.getElement("chatDialog")
            if(chatDialog) {
                chatDialog.app.clearMessages()
            }

            let chatHistory = tibr.getElement("chatHistory")
            if (chatHistory) {
                chatHistory.selectedIndex = 0
            }

            resetSelectedFiles()

            await initialize()
            await animate()

            console.log("Started a new chat")
        }
    })
}

// @func renderSaveIcon
const renderSaveIcon = () => {
    return Icon({
        id: "saveIcon",
        classes: ["ri-save-line"],
        style: { fontSize: "36px" },
        onClick: async (e) => {
            if (tibr.data.ai.messages.length === 0) {
                tibr.getElement("toast").app.show("No messages to save")
                return
            }
            
            if(tibr.data.ai.chatHistoryId) {
                await updateChatDialog(tibr.data.ai.chatHistoryId, JSON.stringify(tibr.data.ai.messages))
                tibr.getElement("toast").app.show("Chat dialog updated")
            }
            else {
                tibr.getElement("saveModal").app.openModal()
            }
        }
    })
}

// @func renderFileIndicator
const renderFileIndicator = () => {
    let fileIndicator = Container({
        id: "fileIndicator",
    })

    let selectedFileCount = tibr.data.code.selectedFiles.length
    fileIndicator.append(`${selectedFileCount} file(s) attached`)

    return fileIndicator
}

// @func resetSelectedFiles
const resetSelectedFiles = () => {
    tibr.data.code.selectedFiles = []

    let fileIndicator = tibr.getElement("fileIndicator")
    fileIndicator.innerHTML = ""
    fileIndicator.append(`0 file(s) attached`)
}

// @func renderChatHistory
const renderChatHistory = () => {
    return ChatHistory({
        id: "chatHistory",
        onChange: (e) => {
            if(tibr.data.ai.history) {
                let historyItemId = e.target.value

                let chatDialog = tibr.getElement("chatDialog")
                chatDialog.app.clearMessages()

                for(let historyItem of tibr.data.ai.history) {
                    if(historyItem.id === historyItemId) {
                        tibr.data.ai.chatHistoryId = historyItem.id
                        tibr.data.ai.messages = historyItem.messages

                        for(let message of tibr.data.ai.messages) {
                            chatDialog.app.addMessage(message.role, message.content)
                        }
                    }
                }
            }
        }
    })
}


// @func renderModelSelector
const renderModelSelector = () => {
    return ModelSelector({
        id: "modelSelector",
        onChange: (e) => {
            tibr.data.ai.model = e.target.value
        }
    })
}

// @func renderChatApp
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

// @func renderChatDialog
const renderChatDialog = () => {
    let chatDialogContainer = Container({
        id: "chatDialogContainer",
        style: {
            marginLeft: "40px",
            marginRight: "40px",
            flexGrow: 1,
            overflowY: "auto",
            paddingBottom: "10px",
        }
    })

    let chatDialog = ChatDialog({
        id: "chatDialog",
    })

    chatDialogContainer.append(chatDialog)

    return chatDialogContainer
}

// @func renderChatForm
const renderChatForm = () => {
    let chatFormContainer = Container({
        id: "chatFormContainer", 
        style: {
            marginLeft: "40px",
            marginRight: "40px",
        }
    })

    let chatForm = ChatForm({
        id: "chatForm",
        responsive: true,
        onSubmit: () => {
            let chatInput = tibr.getElement("chatInput")
            let message = chatInput.value

            chatInput.value = ""

            if(tibr.data.ai.model === "draft") {
                saveDraftChat(message)
                tibr.getElement("chatInput").focus()
            }
            else {
                executeChat(message)
            }
        }
    })

    chatFormContainer.append(chatForm)

    return chatFormContainer
}

// @func renderSaveModal
const renderSaveModal = () => {
    return QuestionModal({
        id: "saveModal",
        onSave: async () => {
            let saveModal = tibr.getElement("saveModal")
            let description = saveModal.app.getDescription()

            await saveChatDialog(description, JSON.stringify(tibr.data.ai.messages))

            let toast = tibr.getElement("toast")
            toast.app.show(`Question saved: ${description}`)

            await initialize()
            await animate()

            saveModal.app.closeModal()
        }
    })
}

// @func saveDraftChat
const saveDraftChat = async (message) => {
    const chatDialog = tibr.getElement("chatDialog")

    chatDialog.app.addMessage("user", message)

    tibr.data.ai.messages.push({ role: 'user', content: message })

    tibr.getElement("toast").app.show("Added message")
}

// @func executeChat
const executeChat = async (message) => {
    let toast = tibr.getElement("toast")
    toast.app.show("Generating Response")

    const chatForm = tibr.getElement("chatForm")
    chatForm.app.setDisabled(true)

    const chatDialog = tibr.getElement("chatDialog")

    chatDialog.app.addMessage("user", message)
    tibr.data.ai.messages.push({ role: 'user', content: message })

    try {
        const timeoutMs = 90000; // 90 seconds
        const aiResponse = await Promise.race([
            getAIResponse(tibr.data.ai.model, tibr.data.ai.messages),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
                )
        ])

        if (aiResponse) {
            toast.app.show("Response ready")
            console.log(aiResponse)
            chatDialog.app.addMessage('ai', aiResponse.message.content)
            tibr.data.ai.messages.push({ role: 'assistant', content: aiResponse.message.content })
        }
        else {
            toast.app.show("Response error")
            throw new Error('Invalid response format')
        }
    }
    catch (error) {
        console.error('Error:', error)
        chatDialog.addMessage('error', error.message || 'Sorry, something went wrong. Please try again.')
    }
    finally {
        // Re-enable the form
        chatForm.app.setDisabled(false)
        tibr.getElement("chatInput").focus()
    }
}

export { render }
