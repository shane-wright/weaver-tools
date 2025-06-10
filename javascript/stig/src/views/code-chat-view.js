import ChatForm from "../components/chat-form.js"
import ChatDialog from "../components/chat-dialog.js"
import Container from "../components/container.js"
import HR from "../components/hr.js"
import H4 from "../components/h4.js"
import Icon from "../components/icon.js"
import Nav from "../components/nav.js"
import QuestionModal from "../components/question-modal.js"
import Toast from "../components/toast.js"
import TextBox from "../components/text-box.js"

import { chat } from "../managers/ai-manager.js"
import { exportMessages, getProjectInfo, readFile } from "../managers/data-manager.js"

// @function render
// @description Renders dynamic JavaScript components into the "mainContent" div defined in ../index.html.
// @param None
// @returns Promise<void> (directly affects the DOM)
const render = async () => {
    let mainContent = tibr.getElement("mainContent")

    let viewContainer = Container({
        id: "codeChatView",
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
    viewContainer.append(renderSelectFolder())
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
    tibr.data.projects.selectedFile = { name: "", path: "", content: "", }
}

// @function animate
// @description Animates the chat interface by refreshing models, selecting the current model, attaching files if any, and rendering messages.
// @param None
// @returns Promise<void>
const animate = async () => {
    let chatInput = tibr.getElement("chatInput")
    chatInput.value = ""

    if(tibr.data.projects.projectPath) {
        tibr.getElement("folderInput").value = tibr.data.projects.projectPath
        getProjectInfo(tibr.data.projects.projectPath, onMessage)
    }

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
    header.append(renderExportIcon())

    return header
}

// @function renderSelectFolder
// @description Renders a component for selecting directories in lab view.
// @returns {Object} The Container for folder selection components.
const renderSelectFolder = () => {
    let selectFolderContainer = Container({
        id: "selectFolderContainer",
        style: {
            display: "flex",
            flexDirection: "row",
            alignItems: "top",
            gap: "10px",
            height: "60px",
            marginTop: "10px",
            marginBottom: "10px",
        },
    })

    let folderInput = TextBox({
        id: "folderInput",
        placeholder: "Project Path (ex: /Users/developer/workspace)",
    })

    folderInput.addEventListener("keydown", (event) => {
        if(event.key === "Enter") {
            event.preventDefault()
            let projectPath = tibr.getElement("folderInput").value
            tibr.data.projects.projectPath = projectPath

            getProjectInfo(tibr.data.projects.projectPath, onMessage)
        }
    })

    selectFolderContainer.append(folderInput)

    return selectFolderContainer
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
        placeholder: "Output markdown file (ex: /Users/developer/workspace/chat-log.md)",
        onSave: async () => {
            let exportModal = tibr.getElement("exportModal")
            let filePath = exportModal.app.getDescription()

            await exportMessages(filePath, tibr.data.ai.messages, onMessage)

            exportModal.app.closeModal()
        }
    })
}

// @function displaySourceCode
const displaySourceCode = (sourceCode) => {
    tibr.data.ai.messages = []
    tibr.data.ai.sessionId = uuidv4()

    let sourceCodeMessage = formatSourceCode(sourceCode)
    const chatDialog = tibr.getElement("chatDialog")

    chatDialog.app.addMessage("user", sourceCodeMessage)
}

// @function renderDirectoryList
// @returns {Object} The directoryList element
const renderDirectoryList = (directories) => {
    let directoryList = Container({
        id: "directoryList",
        style: {
            marginBottom: "10px",
        },
    })

    let parentDirectory = Container({
        id: "parentDirectory",
        style: {
            color: "cyan",
            border: "1px solid",
            borderRadius: "4px",
            borderColor: "#777777",
            margin: "2px",
            padding: "2px",
            paddingLeft: "10px",
        },
        onClick: async (event) => {
            event.preventDefault()

            await initialize()

            let folderInput = tibr.getElement("folderInput")
            let directory = folderInput.value

            let parts = directory.split("/")
            parts.pop()

            let parentDirectory = parts.join('/')

            folderInput.value = parentDirectory

            let projectPath = tibr.getElement("folderInput").value
            tibr.data.projects.projectPath = projectPath

            getProjectInfo(tibr.data.projects.projectPath, onMessage)
        },
    })

    parentDirectory.append("..")

    parentDirectory.addEventListener("mouseenter", () => {
        parentDirectory.style.borderColor = "#FFFFFF"
    });

    parentDirectory.addEventListener("mouseleave", () => {
        parentDirectory.style.borderColor = "#777777"
    })

    directoryList.append(parentDirectory)

    for(let directory of directories) {
        let directoryItem = Container({
            style: {
                color: "cyan",
                border: "1px solid",
                borderRadius: "4px",
                borderColor: "#777777",
                margin: "2px",
                padding: "2px",
                paddingLeft: "10px",
            },
            onClick: (event) => {
                event.preventDefault()

                let folderInput = tibr.getElement("folderInput")
                folderInput.value += `/${directory}`

                let projectPath = tibr.getElement("folderInput").value
                tibr.data.projects.projectPath = projectPath

                getProjectInfo(tibr.data.projects.projectPath, onMessage)
            },
        })

        directoryItem.addEventListener("mouseenter", () => {
            directoryItem.style.borderColor = "#FFFFFF"
        });

        directoryItem.addEventListener("mouseleave", () => {
            directoryItem.style.borderColor = "#777777"
        })

        directoryItem.append(directory)

        directoryList.append(directoryItem)
    }

    return directoryList
}

// @function renderFileList
// @returns {Object} The directoryList element
const renderFileList = (files) => {
    let fileList = Container({
        id: "fileList",
        style: {
            marginBottom: "10px",
        },
    })

    for(let file of files) {
        let fileItem = Container({
            style: {
                color: "gold",
                border: "1px solid",
                borderRadius: "4px",
                borderColor: "#777777",
                margin: "2px",
                padding: "2px",
                paddingLeft: "10px",
            },
            onClick: (event) => {
                event.preventDefault()

                let folderInput = tibr.getElement("folderInput")
                folderInput.value += `/${file}`

                let filePath = tibr.getElement("folderInput").value

                readFile(filePath, onMessage)
            },
        })

        fileItem.addEventListener("mouseenter", () => {
            fileItem.style.borderColor = "#FFFFFF"
        });

        fileItem.addEventListener("mouseleave", () => {
            fileItem.style.borderColor = "#777777"
        })

        fileItem.append(file)

        fileList.append(fileItem)
    }

    return fileList
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
    for(let message of tibr.data.ai.messages) {
        chatDialog.app.addMessage(message.role, message.content)
    }
}

// @function executeChat
// @description Sends the user's message to the AI and handles the response.
// @param {string} message The user's message
// @returns Promise<void>
const executeChat = async (message) => {
    let toast = tibr.getElement("toast")

    const chatDialog = tibr.getElement("chatDialog")
    const chatForm = tibr.getElement("chatForm")

    toast.app.show("Generating Response")

    chatForm.app.setDisabled(true)

    let sourceCodeMessage = ""
    if(
        (tibr.data.ai.messages.length === 0) &&
        (tibr.data.projects.selectedFile.name && tibr.data.projects.selectedFile.name.length > 0)
    ) {

        sourceCodeMessage = formatSourceCode(tibr.data.projects.selectedFile)
        sourceCodeMessage += `\n\n---\n\n${message}\n`
    }
    else {
        sourceCodeMessage = message
    }

    if(tibr.data.ai.messages.length === 0) {
        tibr.getElement("chatDialog").innerHTML = ""
    }

    tibr.data.ai.messages.push({ role: "user", content: sourceCodeMessage })
    chatDialog.app.addMessage("user", sourceCodeMessage)

    const chatResponse = await fetchAIResponse("tibrcode:latest", tibr.data.ai.messages)

    if (chatResponse) {
        toast.app.show("Response ready")
        tibr.data.ai.messages.push({ role: "assistant", content: chatResponse.message.content })

        const chatDialog = tibr.getElement("chatDialog")
        chatDialog.app.clearMessages()

        chatDialog.append(renderDirectoryList([]))

        renderMessages()
    } else {
        toast.app.show("Response error")
    }

    chatForm.app.setDisabled(false)
    tibr.getElement("chatInput").focus()
}

// @function formatSourceCode
const formatSourceCode = (sourceCode) => {
    const sourceCodeMessage = `
# CODE ${sourceCode.name}
\`\`\`
${sourceCode.content}
\`\`\`
`
    return sourceCodeMessage
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
        const chatDialog = tibr.getElement("chatDialog")

        chatDialog.app.clearMessages()

        chatDialog.append(renderDirectoryList([]))

        tibr.data.projects.selectedFile = message.data
        displaySourceCode(tibr.data.projects.selectedFile)

        tibr.getElement("directoryList").scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    if(message.topic === "exportMessagesResponse") {
        tibr.getElement("toast").app.show(`Saved ${message.filePath}`, 4000)
    }

    if(message.topic === "getProjectInfoResponse") {
        let chatDialog = tibr.getElement("chatDialog")
        chatDialog.innerHTML = ""

        chatDialog.append(renderDirectoryList(message.data.directories))
        chatDialog.append(renderFileList(message.data.files))
    }
}

export { render, displaySourceCode }
