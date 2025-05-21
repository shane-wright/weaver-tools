// Initialize manager state in the global tibr object
if (!window.tibr) {
    window.tibr = {};
}

if (!window.tibr.viewManager) {
    window.tibr.viewManager = {
        initialized: false,
        currentView: null,
        previousView: null,
        viewHistory: [],
        viewParams: {},
        isTransitioning: false,
        mainContentEl: null
    };
}

// Dynamically import a view module
const loadView = async (viewName) => {
    try {
        const viewModule = await import(`../features/${viewName}/index.js`);
        
        if (!viewModule || !viewModule.default) {
            throw new Error(`View module ${viewName} does not export a default function`);
        }
        
        return viewModule;
    } catch (error) {
        console.error(`Error loading view ${viewName}:`, error);
        return null;
    }
};

export function initViewManager() {
    // Prevent double initialization
    if (window.tibr.viewManager.initialized) {
        console.log("View Manager already initialized");
        return true;
    }

    // Get main content element
    const mainContentEl = document.getElementById("main-content");
    if (!mainContentEl) {
        console.error("Main content element not found, initialization failed");
        return false;
    }

    // Store reference to main content element
    window.tibr.viewManager.mainContentEl = mainContentEl;

    // Apply necessary styling
    Object.assign(mainContentEl.style, {
        width: "100%",
        height: "100%",
        overflow: "auto"
    });

    window.tibr.viewManager.initialized = true;
    console.log("View Manager initialized successfully");
    return true;
}

export async function switchView(viewName, params = {}) {
    if (!window.tibr.viewManager.initialized) {
        console.error("View Manager not initialized");
        return false;
    }

    if (window.tibr.viewManager.isTransitioning) {
        console.warn("View transition already in progress");
        return false;
    }

    window.tibr.viewManager.isTransitioning = true;

    try {
        // Clean up current view if it exists
        if (window.tibr.viewManager.currentView?.cleanup) {
            window.tibr.viewManager.currentView.cleanup();
        }

        // Load the new view module
        const viewModule = await loadView(viewName);
        if (!viewModule) {
            throw new Error(`Failed to load view: ${viewName}`);
        }

        // Clear main content
        window.tibr.viewManager.mainContentEl.innerHTML = "";

        // Initialize new view
        const view = viewModule.default(window.tibr.viewManager.mainContentEl, params);
        
        // Update view manager state
        window.tibr.viewManager.previousView = window.tibr.viewManager.currentView;
        window.tibr.viewManager.currentView = view;
        window.tibr.viewManager.viewParams = params;
        window.tibr.viewManager.viewHistory.push(viewName);

        return true;
    } catch (error) {
        console.error("Error switching view:", error);
        return false;
    } finally {
        window.tibr.viewManager.isTransitioning = false;
    }
}

export function getCurrentView() {
    return window.tibr.viewManager.currentView;
}

export function getViewHistory() {
    return [...window.tibr.viewManager.viewHistory];
}

