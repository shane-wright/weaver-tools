import { initialize } from "./managers/tibr-manager.js"

window.onload = async () => {
    window.tibr = {
        socket: null,
        nav: {
            views: [],
        },
        data: {
            stig: {
                stigs: [],
                stigMap: {},
                name: "",
            },
            ai: {
                messages: [],
                model: "gemma2:2b",
                history: [],
                availableModels: [],
                sessionId: "",
            },
            projects: {
                projectPath: "",
                files: [],
                recents: [],
                selectedFile: {
                    name: "",
                    path: "",
                    content: "",
                },
            },
            views: {
                default: "StigChatView",
            },
        },
        view: {},
    }

    initialize()
}
