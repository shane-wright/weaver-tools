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

import { createChatDialog, getChatHistory, updateChatDialog } from "../managers/data-manager.js"
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
    viewContainer.append(renderChatApp())

    await animate()
}

// @func initialize
const initialize = async () => {
    if(tibr.data.code.selectedFiles.length === 0) {
        tibr.data.ai.messages = []
    }

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

    // add selectedFiles to messages
    if(tibr.data.code.selectedFiles.length > 0) {
        await attachFiles()
    }

    tibr.getElement("chatInput").focus()
}

// @func renderToast
const renderToast = () => {
    return Toast({
        id: "toast",
    })
}

// @func attachFiles
const attachFiles = async () => {
    // add selectedFiles to messages
    tibr.getElement("chatForm").app.setDisabled(true)

    let fileList = tibr.data.code.selectedFiles.map((file) => {
        return file.name
    }).join(", ")

    chatDialog.app.addMessage("user", `Please attach ${fileList}`)

    for(let file of tibr.data.code.selectedFiles) {
        let fileMessage = ""

        fileMessage = `# Here's a file attachment for reference:\n\n`
        fileMessage = `## File Attachment:\n\n ${file.name}\n\n`
        fileMessage = `## File Content:\n\n`
        fileMessage += `---\n`
        fileMessage += `${file.content}\n`
        fileMessage += `---\n\n`
        fileMessage += `
## Assistant instructions

Please do quiet inspection of the file and be prepard to answer questions.

Note the file attachment name (${file.name}) and analyze the file content.

Please answer with "File attached: ${file.name}" and a one-sentence summary of the file content\n
        `

        tibr.data.ai.messages.push({ role: 'user', content: fileMessage })

        const aiResponse = await fetchAIResponse()

        if (aiResponse) {
            toast.app.show(`${file.name} attached`)

            chatDialog.app.addMessage('ai', aiResponse.message.content)

            tibr.data.ai.messages.push({ role: 'assistant', content: aiResponse.message.content })
        }
    }

    // clear selectedFiles
    tibr.data.code.selectedFiles = []

    tibr.getElement("chatForm").app.setDisabled(false)
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
    header.append(renderNewChatIcon())
    header.append(renderFileSelectIcon())
    header.append(renderSaveIcon())

    return header
}

// @func renderFileSelectIcon
const renderFileSelectIcon = () => {
    return Icon({
        id: "fileSelectIcon",
        classes: ["ri-folder-add-line"],
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

            await initialize()
            await animate()
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
                createDraftChat(message)
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

            await createChatDialog(description, JSON.stringify(tibr.data.ai.messages))

            tibr.getElement("chatHistory").app.selectHistory(description)

            let toast = tibr.getElement("toast")
            toast.app.show(`Question saved: ${description}`)

            await initialize()
            await animate()

            saveModal.app.closeModal()
        }
    })
}

// @func renderMessages
const renderMessages = async () => {
    const chatDialog = tibr.getElement("chatDialog")
    for(let message of tibr.data.ai.messages) {
        chatDialog.app.addMessage(message.role, message.content)
    }
}

// @func createDraftChat
const createDraftChat = async (message) => {
    const chatDialog = tibr.getElement("chatDialog")

    chatDialog.app.addMessage("user", message)
    tibr.data.ai.messages.push({ role: 'user', content: message })

    tibr.getElement("toast").app.show("Added message")
}

// @func executeChat
const executeChat = async (message) => {
    let toast = tibr.getElement("toast")
    toast.app.show("Generating Response")

    const chatDialog = tibr.getElement("chatDialog")
    const chatForm = tibr.getElement("chatForm")

    chatForm.app.setDisabled(true)

    chatDialog.app.addMessage("user", message)

    tibr.data.ai.messages.push({ role: 'user', content: message })

    const aiResponse = await fetchAIResponse()

    if (aiResponse) {
        toast.app.show("Response ready")

        chatDialog.app.addMessage('ai', aiResponse.message.content)

        tibr.data.ai.messages.push({ role: 'assistant', content: aiResponse.message.content })

        chatForm.app.setDisabled(false);
        tibr.getElement("chatInput").focus();

    }
    else {
        toast.app.show("Response error")
        throw new Error('Invalid response format')
    }
}

const fetchAIResponse = async () => {
    try {
        const timeoutMs = 90000; // 90 seconds
        const aiResponse = await Promise.race([
            getAIResponse(tibr.data.ai.model, tibr.data.ai.messages),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
            )
        ]);

        if (aiResponse) {
            return aiResponse
        }
        else {
            return ""
        }
    }
    catch (error) {
            return ""
    }
}

export { render }
