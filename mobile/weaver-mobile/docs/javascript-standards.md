# JavaScript Coding Standards

## Introduction

This document outlines the JavaScript coding standards for our web development projects. Adherence to these standards ensures consistency, maintainability, and clarity across our codebase. All developers working on this project are expected to follow these guidelines.

## Language Specification

### ES2024 JavaScript

- Use the ES2024 (ECMAScript 2024) standard for all JavaScript code.
- Take advantage of modern JavaScript features like optional chaining, nullish coalescing, and logical assignment operators.
- Functional programming only

Example:
```javascript
// Preferred: Using modern features
const userDisplayName = user?.name ?? "Anonymous";

// Avoid older patterns like:
// const userDisplayName = user && user.name ? user.name : "Anonymous";
```

## DOM Interaction

### Direct DOM Manipulation

- Use direct DOM manipulation methods rather than libraries or frameworks.
- Utilize native DOM methods like `document.getElementById()`, `document.createElement()`, etc.

Example:
```javascript
// Preferred: Direct DOM manipulation
const container = document.getElementById("main-container");
const newElement = document.createElement("div");
newElement.id = "user-profile";
newElement.textContent = "User Profile";
container.appendChild(newElement);

// Avoid using third-party libraries for DOM manipulation
```

### Element Identification

- **All** HTML elements must have a unique ID attribute.
- IDs should be descriptive, using kebab-case for naming convention.
- This ensures reliable selection of elements in the DOM.

Example:
```javascript
// HTML
// <div id="user-profile-container">...</div>

// JavaScript
const profileContainer = document.getElementById("user-profile-container");
```

## Syntax and Formatting

### Arrow Function Syntax

- Use arrow functions for all function declarations unless there's a specific reason to use traditional function syntax.
- Arrow functions provide more concise syntax and lexical `this` binding.

Example:
```javascript
// Preferred: Arrow function
const calculateTotal = (items) => {
    let sum = 0;
    items.forEach(item => {
        sum += item.price;
    })
    return sum;
}

// Avoid traditional function syntax
// function calculateTotal(items) {
//     let sum = 0;
//     items.forEach(function(item) {
//         sum += item.price;
//     });
//     return sum;
// }
```

### Indentation

- Use 4 spaces for indentation for all code types (JavaScript, HTML, etc.).
- Maintain consistent indentation throughout the project.

Example:
```javascript
// Correct indentation (4 spaces)
const processUser = (userData) => {
    if (userData) {
        const formattedUser = {
            id: userData.id,
            displayName: userData.name ?? "Anonymous"
        }
        return formattedUser;
    }
    return null;
}
```

### No CSS Usage

- Do not use CSS for styling elements.
- Use JavaScript to apply styles directly to elements.
- Limited pico.css classes are allowed
- Use pico.css colors

Example:
```javascript
// Preferred: JavaScript styles
const button = document.getElementById("submit-button");
button.style.backgroundColor = "var(--pico-background-color)";
button.style.color = "var(--pico-color)";
button.style.padding = "10px 20px";
button.style.borderRadius = "5px";
button.style.border = "none";

// Avoid using CSS classes or stylesheets
```

### JavaScript Styling

- Apply styles directly using JavaScript's style property.
- Use camelCase for style property names.
- Group related styles together for readability.

Example:
```javascript
const setupCardElement = (cardElement) => {
    // Appearance
    cardElement.style.backgroundColor = "var(--pico-background-color)";
    cardElement.style.borderRadius = "8px";
    cardElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    
    // Layout
    cardElement.style.padding = "16px";
    cardElement.style.margin = "8px 0";
    cardElement.style.display = "flex";
    cardElement.style.flexDirection = "column";
    
    // Typography
    cardElement.style.fontFamily = "Arial, sans-serif";
    cardElement.style.fontSize = "14px";
}
```

## Component Lifecycle

### The init, render, cleanup Pattern

- Components should follow a consistent lifecycle pattern using three main methods: `init`, `render`, and `cleanup`.
- This pattern ensures proper initialization, rendering, and resource management for components.

#### init Method

- The view manager will call the component's init method
- The `init` method initializes the component's state in the window.tibr global object and sets up any necessary resources.
- It should accept optional parameters that can override default values.
- After initialization, the view manager will the `render` method to display the component.
- It should return the component instance for method chaining.

Example:
```javascript
const TaskList = {
    init: (params = {}) => {
        // Initialize component state in tibr global object
        if (!window.tibr) {
            window.tibr = {};
        }
        
        // Set component state with defaults that can be overridden
        window.tibr.taskList = {
            tasks: params.tasks ?? [],
            filter: params.filter ?? 'all',
            sortBy: params.sortBy ?? 'date',
            maxDisplay: params.maxDisplay ?? 10
        };
        
        // Set up necessary DOM event listeners
        const filterSelect = document.getElementById("task-filter-select");
        if (filterSelect) {
            filterSelect.addEventListener("change", (e) => {
                window.tibr.taskList.filter = e.target.value;
                TaskList.render();
            });
        }
        
        // Call render to display initial state
        TaskList.render();
        
        // Return component instance for method chaining
        return TaskList;
    }
};
```

#### render Method

- The `render` method is responsible for creating and updating the DOM based on the current state.
- It should clear and rebuild the component's DOM elements each time it's called.
- DOM elements should be styled using JavaScript as per our styling guidelines.

Example:
```javascript
const MyComponent = {
    // init method...
    
    render: () => {
        const container = document.getElementById("my-component-container")
        container.innerHTML = ""
        
        // Create DOM elements
        const header = document.createElement("header")
        header.id = "my-component-header"
        header.textContent = "My Component"
        
        // Style elements
        header.style.fontSize = "1.5rem"
        header.style.marginBottom = "1rem"
        
        // Add elements to container
        container.appendChild(header)
        
        // Render different views based on state
        if (window.tibr.myComponent.isLoading) {
            renderLoadingView(container)
        } else if (window.tibr.myComponent.data) {
            renderDataView(container)
        } else {
            renderEmptyView(container)
        }
    }
}
```

#### cleanup Method

- The `cleanup` method performs necessary cleanup when a component is no longer needed.
- It should remove event listeners, clear sensitive data, and free any resources.
- This method is typically called before switching to another view or component.

Example:
```javascript
const MyComponent = {
    // init and render methods...
    
    cleanup: () => {
        // Remove event listeners
        const button = document.getElementById("my-component-button")
        if (button) {
            button.removeEventListener("click", MyComponent.handleClick)
        }
        
        // Clear sensitive data
        if (window.tibr?.myComponent) {
            window.tibr.myComponent.sensitiveData = null
        }
        
        // Optional: remove component from DOM
        const container = document.getElementById("my-component-container")
        if (container) {
            container.innerHTML = ""
        }
    }
}
```

### Component Organization

- Structure components as objects with methods representing different functionalities.
- Use the component name as the namespace for all methods and properties.
- Export the component object as the default export from its module.

Example:
```javascript
const UserProfile = {
    init: (params = {}) => {
        // Initialization logic
        return UserProfile
    },
    
    render: () => {
        // Rendering logic
    },
    
    handleEdit: () => {
        // Edit functionality
    },
    
    handleSave: () => {
        // Save functionality
    },
    
    cleanup: () => {
        // Cleanup logic
    }
}

export default UserProfile
```

### Feature Folder Organization

- Organize related components and utilities into feature folders.
- Each feature should have an `index.js` file that exports the main component.
- Separate reusable sub-components into their own files within the feature folder.
- Structure feature folders based on functionality, not technical concerns.

Example feature folder structure:
```
features/
  login/
    index.js              // Main export and component definition
    floating-user-widget.js  // Sub-component used by login
  dashboard/
    index.js
    chart-component.js
    data-table.js
```

Example feature index.js export pattern:
```javascript
// Named export for the main component creation function
export const createLoginView = (contentEl, params = {}) => {
    // Store reference to main content element
    mainContentEl = contentEl;
    
    // Initialize component state
    if (!window.tibr) {
        window.tibr = {};
    }
    
    window.tibr.login = {
        email: "",
        password: "",
        errors: {},
        // Component state
        ...params
    };
    
    // Return the interface for view-manager
    return {
        render: renderLoginView,
        cleanup: cleanupLoginView
    };
};

// Additional component functions as named exports
export const renderLoginView = () => {
    // Rendering logic
};

export const cleanupLoginView = () => {
    // Cleanup logic
};

// Default export for compatibility with view-manager
export default function(contentEl, params = {}) {
    return createLoginView(contentEl, params);
}
```

## Manager Pattern

Managers are singleton services that handle application-wide concerns like view management, API communication, or state coordination. They provide a consistent interface for components to interact with application infrastructure.

### Singleton Manager Implementation

- Managers follow a singleton pattern for application-wide services.
- Initialize manager state in the global `window.tibr` object.
- Export individual functions rather than a manager instance.
- Use clear namespacing to avoid conflicts with other managers.

Example:
```javascript
// Initialize manager state in the global window.tibr object
if (!window.tibr) {
    window.tibr = {};
}

if (!window.tibr.viewManager) {
    window.tibr.viewManager = {
        currentView: null,
        previousView: null,
        viewHistory: [],
        viewParams: {},
        isTransitioning: false
    };
}

// Export manager functions instead of a manager instance
export function initViewManager() {
    // Initialization logic
}

export function switchView(viewName, params = {}) {
    // View switching logic
}
```

### Manager Initialization and Lifecycle

- Use lazy initialization when possible to defer resource allocation.
- Managers should provide explicit init and cleanup functions.
- Initialize managers before they are needed, typically at application startup.
- Check if already initialized to prevent duplicate initialization.

Example:
```javascript
export function initViewManager() {
    // Already initialized, avoid double initialization
    if (window.tibr.viewManager.initialized) {
        return;
    }

    // Get required DOM elements
    const mainContentEl = document.querySelector("#main-content");
    
    if (!mainContentEl) {
        console.error("Main content element not found, initialization failed");
        return;
    }

    // Apply necessary styling
    Object.assign(mainContentEl.style, {
        width: "100%",
        height: "100%",
        overflow: "auto"
    });

    // Mark as initialized
    window.tibr.viewManager.initialized = true;
    console.log("View Manager initialized successfully");
}
```

### State Management in Managers

- Store manager state in a dedicated namespace within `window.tibr`.
- Provide accessor methods to control state modifications.
- Clearly document the manager's state model.
- Use state flags to track manager status (e.g., isConnected, isTransitioning).

Example:
```javascript
// State management within agentManager
if (!window.tibr.agentManager) {
    window.tibr.agentManager = {
        ws: null,
        url: 'ws://localhost:8080',
        reconnectAttempts: 0,
        maxReconnectAttempts: 5,
        reconnectDelay: 1000,
        isConnected: false
    }
}

// Function to safely update connection status
const updateStatus = (connected, message) => {
    window.tibr.agentManager.isConnected = connected;
    
    // Update UI indicators
    const statusIndicator = document.getElementById('ws-status-indicator');
    const statusText = document.getElementById('ws-status-text');
    
    if (statusIndicator && statusText) {
        statusIndicator.style.backgroundColor = connected ? '#4CAF50' : '#F44336';
        statusText.textContent = message;
    }
}
```

### Manager Event Handling

- Use event handlers for asynchronous operations.
- Implement error handling and retry mechanisms.
- Document the expected events and their handlers.
- Consider implementing exponential backoff for retries.

Example:
```javascript
// Setting up event handlers
const setupEventHandlers = () => {
    window.tibr.agentManager.ws.onopen = handleOpen;
    window.tibr.agentManager.ws.onclose = handleClose;
    window.tibr.agentManager.ws.onerror = handleError;
    window.tibr.agentManager.ws.onmessage = handleMessage;
}

// Example event handler with retry mechanism
const handleClose = () => {
    console.log('Disconnected from WebSocket server');
    window.tibr.agentManager.isConnected = false;
    updateStatus(false, 'Disconnected');
    
    // Implement reconnection with exponential backoff
    if (window.tibr.agentManager.reconnectAttempts < window.tibr.agentManager.maxReconnectAttempts) {
        const delay = window.tibr.agentManager.reconnectDelay * 
                      Math.pow(2, window.tibr.agentManager.reconnectAttempts);
        window.tibr.agentManager.reconnectAttempts++;
        
        console.log(`Attempting to reconnect in ${delay}ms...`);
        setTimeout(() => connect(), delay);
    } else {
        console.error('Max reconnection attempts reached');
    }
}
```

## Global State Management

### The TIBR Global Object

- Global state is managed through a dedicated global object `window.tibr`.
- This object serves as a centralized store for application state.
- Initialize the tibr object if it doesn't exist:

Example:
```javascript
// Initialize the global tibr object if it doesn't exist
if (!window.tibr) {
    window.tibr = {}
}
```

### Manager and Component State Isolation

- Manager state should be isolated in dedicated namespaces (e.g., `window.tibr.viewManager`).
- Components can create and manage their own attributes within the tibr global object.
- Components may access attributes created by other components when needed.
- Managers should never directly modify component-specific state.

Example:
```javascript
// Manager state isolation
if (!window.tibr.viewManager) {
    window.tibr.viewManager = {
        currentView: null,
        viewHistory: [],
        // Manager-specific state
    }
}

// Component state isolation
const initUserProfileState = () => {
    // Initialize component state if it doesn't exist
    if (!window.tibr.userProfile) {
        window.tibr.userProfile = {
            isEditing: false,
            userData: null,
            validationErrors: []
        }
    }
}
```

### Manager-Component Interaction

- Managers should provide functions for components to interact with them.
- Components should use these functions rather than directly modifying manager state.
- This abstraction provides a cleaner separation of concerns and better maintainability.

Example:
```javascript
// View manager providing functions for components
export function switchView(viewName, params = {}) {
    // Logic to switch views properly
    // Components should call this rather than modifying viewManager state directly
}

// Component using the manager's function
const handleLoginSubmit = () => {
    // Process login...
    if (loginSuccessful) {
        // Use the manager's function instead of directly modifying state
        switchView("dashboard");
    }
}
```

### Inter-Manager Communication

- Managers should coordinate through well-defined interfaces.
- Avoid direct dependencies between managers when possible.
- Use event-based communication for loosely coupled interactions.

Example:
```javascript
// Agent manager notifying about connection status
const handleConnectionChange = (connected) => {
    window.tibr.agentManager.isConnected = connected;
    
    // Notify other parts of the application about the status change
    if (window.tibr.events && typeof window.tibr.events.emit === "function") {
        window.tibr.events.emit("connection:change", { connected });
    }
}

// View manager responding to connection events
const initConnectionListeners = () => {
    if (window.tibr.events && typeof window.tibr.events.on === "function") {
        window.tibr.events.on("connection:change", (data) => {
            if (!data.connected) {
                showConnectionWarning();
            }
        });
    }
}
```

### Attribute Management

- Components are responsible for managing their own attributes in the tibr global object.
- Follow the pattern `window.tibr.[componentName]` for namespace organization.
- Initialize attributes before use to prevent errors.
- Provide methods for controlled access to component attributes when appropriate.

Example:
```javascript
// Dashboard component with controlled access to its state
const Dashboard = {
    init: () => {
        // Initialize dashboard state
        window.tibr.dashboard = {
            activePage: "overview",
            filters: {
                dateRange: "thisMonth",
                category: "all"
            },
            data: null
        }
        
        Dashboard.render()
    },
    
    setActivePage: (page) => {
        window.tibr.dashboard.activePage = page
        Dashboard.render()
    },
    
    updateFilters: (newFilters) => {
        window.tibr.dashboard.filters = {
            ...window.tibr.dashboard.filters,
            ...newFilters
        }
        Dashboard.fetchData()
    },
    
    fetchData: () => {
        // Logic to fetch data based on current filters
        // Then update window.tibr.dashboard.data
    },
    
    render: () => {
        // Render dashboard based on current state
        const container = document.getElementById("dashboard-container")
        // Rendering logic here...
    }
}
```

## Application Initialization

### Main Entry Point

- Initialize the application when the DOM is fully loaded.
- Set up global event listeners at the application level.
- Initialize required managers before initializing components.

Example:
```javascript
// Application initialization
const initializeApplication = async () => {
    const mainContentEl = document.querySelector("#main-content")
    
    if (!mainContentEl) {
        console.error("Main content element not found, application initialization failed")
        return
    }
    
    // Initialize required managers
    initViewManager()
    
    // Switch to initial view
    const viewLoadSuccess = await switchView("login")
    if (!viewLoadSuccess) {
        console.error("Failed to load initial login view")
    }
}

// Initialize the application when the DOM is loaded
window.addEventListener("DOMContentLoaded", initializeApplication)
```

### Dynamic Module Loading

- Use ES6 dynamic imports to load components on demand.
- Handle module loading errors gracefully.
- Implement fallback mechanisms for critical components.

Example:
```javascript
// Dynamically import a view module
const loadView = async (viewName) => {
    try {
        // Use dynamic import for code splitting
        const viewModule = await import(`../features/${viewName}/index.js`)
        
        if (!viewModule || !viewModule.default) {
            throw new Error(`View module ${viewName} does not export a default function`)
        }
        
        return viewModule
    } catch (error) {
        console.error(`Error loading view ${viewName}:`, error)
        // Implement fallback or error handling
        return null
    }
}
```

## Summary

These coding standards aim to ensure consistency and maintainability in our JavaScript codebase. By adhering to these guidelines, we create a unified development approach that enhances code quality and team collaboration. The standards emphasize:

- Native JavaScript without external libraries or bundlers
- Direct DOM manipulation
- Component lifecycle (init, render, cleanup)
- Manager pattern for application services
- Feature-based folder organization
- Global state management via window.tibr

All developers should follow these standards to maintain a cohesive codebase and ensure smooth collaboration across the project.
