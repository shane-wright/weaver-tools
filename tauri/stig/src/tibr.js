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
            views: {
                default: "StigChatView",
            },
        },
        view: {},
    }

    initialize()
}
