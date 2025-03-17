const { invoke } = window.__TAURI__.core

// @function chat
export const chat = async (model, messages) => {
    let data = {
        model: model,
        messages: messages,
        sessionId: tibr.data.ai.sessionId,
    }

    let response = await invoke('chat', data)
    return(JSON.parse(response))
}

// @function getLocalModels
export const getLocalModels = async () => {
    try {
        const availableModels = await invoke('get_local_models')
        return availableModels
    }
    catch (error) {
        console.error('Failed to get local models:', error)
        return []
    }
}
