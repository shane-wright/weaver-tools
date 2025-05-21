import { initViewManager, switchView } from "./managers/view-manager.js";

// Initialize global state
if (!window.tibr) {
    window.tibr = {};
}

// Initialize application state
if (!window.tibr.app) {
    window.tibr.app = {
        initialized: false,
        initializationError: null
    };
}

const initializeApplication = async () => {
    try {
        // Don't initialize twice
        if (window.tibr.app.initialized) {
            console.log("Application already initialized");
            return true;
        }

        // Initialize view manager
        const viewManagerInitialized = initViewManager();
        if (!viewManagerInitialized) {
            throw new Error("Failed to initialize view manager");
        }

        // Switch to greeting view
        const viewLoaded = await switchView("greeting");
        if (!viewLoaded) {
            throw new Error("Failed to load greeting view");
        }

        window.tibr.app.initialized = true;
        console.log("Application initialized successfully");
        return true;
    } catch (error) {
        console.error("Error initializing application:", error);
        window.tibr.app.initializationError = error.message;
        return false;
    }
};

// Initialize the application when the DOM is loaded
window.addEventListener("DOMContentLoaded", initializeApplication);
