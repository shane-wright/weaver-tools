const { invoke } = window.__TAURI__.core

// @function getProjectInfo
export const getProjectInfo = async (projectPath, onMessage) => {
    addToRecents(projectPath)

    try {
        const data = await invoke('get_project_info', { projectPath })
        onMessage({
            topic: "getProjectInfoResponse",
            data: data,
        })
    } catch (error) {
        console.error('Failed to get source code:', error)
        onMessage({
            topic: "getProjectInfoResponse",
            data: {}
        })
    }
}

// @function readFile
export async function readFile(filePath, onMessage) {
    try {
        const content = await invoke('read_file', { filePath })
        const pathParts = filePath.split('/')
        const fileName = pathParts.pop()
        const directoryPath = pathParts.join('/')
        
        onMessage({
            topic: "readFileResponse",
            data: {
                path: filePath,
                name: fileName,
                content: content,
            },
        })
    } catch (error) {
        console.error('Failed to read file:', error)
        onMessage({
            topic: "readFileResponse",
            data: {
                path: "",
                name: "",
                content: "",
            },
        })
    }
}

// @function saveFile
export async function saveFile(data, filePath, onMessage) {
    try {
        const status = await invoke('save_file', { data, filePath })
        onMessage({
            topic: "saveFileResponse",
            data: {
                status: status,
            }
        })
        return status
    }
    catch (error) {
        console.error('Failed to save file:', error)
        onMessage({
            topic: "saveFileResponse",
            status: "error",
        })

        return "error"
    }
}

// @function exportMessages
export async function exportMessages(filePath, messages, onMessage) {
    try {
        let data = "# Chat Log\n\n"

        for(let message of messages) {
            data += `**[${message.role}]**\n`
            data += `${message.content}\n\n`
        }

        await invoke('save_file', { data, filePath })

        onMessage({ topic: "exportMessagesResponse", filePath: filePath })
    } catch (error) {
        console.error('Failed to export messages:', error)
        onMessage({ topic: "exportMessagesResponse", error: error.message })
    }
}

// @function exportPDF 
// @description Exports markdown files from a project path to a PDF
export async function exportPDF(projectPath, onMessage) {
    try {
        // Call the Tauri 'export_markdown' command with the project path
        const pdfPath = await invoke('export_markdown', { projectPath })

        // Send a success message with the generated PDF path
        onMessage({
            topic: "exportPDFResponse",
            status: "success",
            pdfPath: pdfPath,
        })
    }
    catch (error) {
        // Log the error for debugging purposes
        console.error('Failed to export PDF:', error)

        // Send an error message with the error details
        onMessage({
            topic: "exportPDFResponse",
            status: "error",
            error: error.toString(),
        })
    }
}

const addToRecents = (projectPath) => {
    let recents

    recents = tibr.data.projects.recents

    let cleanRecents = []
    for(let recent of recents) {
        if(recent !== projectPath) {
            cleanRecents.push(recent)
        }
    }

    cleanRecents.push(projectPath)

    let trimmedLength = Math.min(10, cleanRecents.length + 1)
    const trimmedRecents = cleanRecents.slice(-trimmedLength)

    tibr.data.projects.recents = trimmedRecents
}
