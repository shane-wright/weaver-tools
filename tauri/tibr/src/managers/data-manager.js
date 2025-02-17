const { invoke } = window.__TAURI__.core

// Initialize the database
// @func initializeDatabase
export async function initializeDatabase() {
    try {
        await invoke('initialize_db')
    }
    catch (error) {
        console.error('Failed to initialize database:', error)
    }
}

// Save a message to the database
// @func saveChatDialog
export async function saveChatDialog(description, messages) {
    const id = uuidv4()

    try {
        await invoke('save_chat_dialog', { id, description, messages })
    } catch (error) {
        console.error('Failed to save message:', error)
    }
}

// Update a chat dialog in the database
// @func updateChatDialog
export async function updateChatDialog(id, messages) {
    try {
        await invoke('update_chat_dialog', { id, messages })
    } catch (error) {
        console.error('Failed to update chat dialog:', error)
    }
}

// Retrieve chat history from the database
// @func getChatHistory
export async function getChatHistory() {
    try {
        const chatData = await invoke('get_chat_history')

        let history = []
        for(let i = 0; i < chatData.length; i++) {
            let item = chatData[i]

            let historyItem = {}
            let j = 0

            historyItem.id = item[j]; j++
            historyItem.description = item[j]; j++
            historyItem.messages = JSON.parse(item[j]); j++

            history.push(historyItem)
        }

        return history
    } catch (error) {
        console.error('Failed to retrieve chat history:', error)
        return []
    }
}

// @func saveProfile
export async function saveProfile(email, preferences) {
    const id = uuidv4()

    try {
        await invoke('save_profile', { id, email, preferences })
    } catch (error) {
        console.error('Failed to save profile:', error)
    }
}

// @func getProfile
export async function getProfile() {
    try {
        const profiles = await invoke('get_profiles')

        let profile = {}
        if(profiles && profiles.length > 0) {
            let item = profiles[0]

            let j = 0
            profile.id = item[j]; j++
            profile.email = item[j]; j++
            profile.preferences = JSON.parse(item[j]); j++
        }

        return profile
    } catch (error) {
        console.error('Failed to retrieve profile:', error)
        return {}
    }
}

// Retrieve source code files
// @func getSourceCode
export async function getSourceCode(projectPath, onMessage) {
    try {
        const files = await invoke('get_source_code', { projectPath })
        onMessage({
            topic: "getSourceCodeResponse",
            files: files,
        })
    } catch (error) {
        console.error('Failed to get source code:', error)
        onMessage({
            topic: "getSourceCodeResponse",
            files: [],
        })
    }
}

// @func readFile
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

