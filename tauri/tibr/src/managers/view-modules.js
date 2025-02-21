const viewModules = {
    default: "AiChatView",
    views: {
        DashboardView: {
            modulePath: "../views/dashboard-view",
            label: "Dashboard",
            showInHeader: true,
        },
        AiChatView: {
            modulePath: "../views/ai-chat-view",
            label: "TIBR AI",
            showInHeader: true,
        },
        LabView: {
            modulePath: "../views/lab-view",
            label: "Lab",
            showInHeader: true,
        },
        TibrCodeView: {
            modulePath: "../views/tibr-code-view",
            label: "TIBR Code",
            showInHeader: false,
        },
        ProfileView: {
            modulePath: "../views/profile-view",
            label: "Profile",
            showInHeader: true,
        },
    }
}

export default viewModules
