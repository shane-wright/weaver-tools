const { invoke } = window.__TAURI__.core

// @func getAIResponse
export const getAIResponse = async (model, messages) => {
    console.log('Current model:', model)

    let response = await invoke('chat', { model: model, messages: messages })
    return(JSON.parse(response))
}

// @func getLocalModels
export const getLocalModels = async () => {
    try {
        const availableModels = await invoke('get_local_models')
        return availableModels
    } catch (error) {
        console.error('Failed to get local models:', error)
        return []
    }
}
