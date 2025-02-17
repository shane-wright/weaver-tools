import { initialize } from "./managers/tibr-manager.js"

window.onload = async () => {
    window.tibr = {
        socket: null,
        nav: {
            views: [],
        },
        data: {
            ai: {
                model: null,
                messages: [],
                history: [],
                availableModels: [],
                chatHistoryId: null,
            },
            code: {
                projectPath: "",
                files: [],
                selectedFiles: [],
            },
            profile: {},
        },
        view: {},
    }

    initialize()
}
