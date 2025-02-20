# TIBR: A Vanilla JavaScript Framework for Modern Web Development

TIBR (Trivially Inspired By Reduction) offers a lightweight, direct DOM manipulation approach to building web experiences. It prioritizes a minimalist codebase while maintaining flexibility and performance. This framework caters to developers seeking pure Javascript functionalities without relying on complex frameworks like React.

## Architecture Highlights:

**Pure JavaScript**: TIBR leverages the inherent power of ES2024 JavaScript, offering control over DOM manipulation through traditional methods, directly in the browser.

**Direct DOM Manipulation**: No reliance on heavyweight frameworks or virtual DOMs; TIBR allows for efficient direct manipulation of web elements.

**Minimalist Styling**: The use of pico.css provides a foundation of pre-defined styles and themes, while google fonts and remix icons contribute to a clean user interface.

**Clean Codebase**: Following the "arrow function" standard, TIBR promotes concise and readable code.

**TIBR Global Context**: TIBR maintains a global context variable in window.tibr (alias tibr) that maintains application state across components, managers, and views.

Example:

```
> console.log(JSON.stringify(tibr, null, 4))
[Log] {
    "socket": null,
    "nav": {
        "views": {
            "DashboardView": {
                "modulePath": "../views/dashboard-view",
                "label": "Dashboard",
                "showInHeader": true
            },
            "AiChatView": {
                "modulePath": "../views/ai-chat-view",
                "label": "TIBR AI",
                "showInHeader": true
            },
            "LabView": {
                "modulePath": "../views/lab-view",
                "label": "Lab",
                "showInHeader": true
            },
            "TibrCodeView": {
                "modulePath": "../views/tibr-code-view",
                "label": "TIBR Code",
                "showInHeader": false
            },
            "ProfileView": {
                "modulePath": "../views/profile-view",
                "label": "Profile",
                "showInHeader": true
            }
        }
    },
    "data": {
        "ai": {
            "model": "gemma2:2b",
            "messages": [],
            "history": [
                {
                    "id": "19e4112d-d955-4e0d-b21c-92361e13c1d2",
                    "description": "BLAH",
                    "messages": [
                        {
                            "role": "user",
                            "content": "good evening"
                        },
                        {
                            "role": "assistant",
                            "content": "Good evening! How can I assist you today? If there's anything specific you need help with, feel free to ask me questions or share your concerns. I'll do my best to provide a helpful response. Thank you for entrusting me with your good evening!"
                        },
                        {
                            "role": "user",
                            "content": "Radio check, over"
                        },
                        {
                            "role": "assistant",
                            "content": "Over! Is there anything in particular that you would like me to check on the radio? If you're unsure of what needs to be checked or if you have any specific questions about the radio system, feel free to ask me the necessary information. I'll do my best to provide a helpful response over on the radio. Thank you for entrusting me with your good evening!"
                        }
                    ]
                }
            ],
            "availableModels": [
                {
                    "description": "qwen",
                    "name": "qwen:1.8b"
                },
                {
                    "description": "deepseek coder",
                    "name": "deepseek-coder:latest"
                },
                {
                    "description": "qwen2.5 coder",
                    "name": "qwen2.5-coder:3b"
                },
                {
                    "description": "tinyllama",
                    "name": "tinyllama:latest"
                },
                {
                    "description": "deepseek r1",
                    "name": "deepseek-r1:1.5b"
                },
                {
                    "description": "gemma2",
                    "name": "gemma2:2b"
                },
                {
                    "description": "granite3.1 dense",
                    "name": "granite3.1-dense:2b"
                }
            ],
            "chatHistoryId": null
        },
        "code": {
            "projectPath": "/Users/developer/workspace/vibe/tibr",
            "files": [
                "./.gitignore",
                "./README.md",
                "./src-tauri/src/lib.rs",
                ...
                "./src/components/audio.js",
                "./src/components/break.js",
                "./src/components/button.js",
                "./src/components/card.js",
                "./src/components/chat-dialog.js",
                ...
                "./src/css/main.css",
                "./src/css/pico-2.0.6/pico.min.css",
                "./src/fonts/remix/remixicon.ttf",
                "./src/fonts/roboto/Roboto-Regular.ttf",
                "./src/fonts/roboto/Roboto-Thin.ttf",
                "./src/fonts/roboto/Roboto-ThinItalic.ttf",
                "./src/images/favicon.ico",
                "./src/index.html",
                "./src/managers/ai-manager.js",
                "./src/managers/data-manager.js",
                "./src/managers/theme-manager.js",
                "./src/managers/tibr-manager.js",
                "./src/managers/view-manager.js",
                "./src/managers/view-modules.js",
                "./src/managers/ws-manager.js",
                "./src/tibr.js",
                "./src/views/ai-chat-view.js",
                "./src/views/dashboard-view.js",
                "./src/views/lab-view.js",
                "./src/views/profile-view.js",
                "./src/views/tibr-code-view.js"
            ],
            "selectedFiles": []
        },
        "profile": {}
    },
    "view": {
        "name": "AiChatView",
        "app": {}
    },
    "theme": {
        "colors": {
            "red": {
                "50": "#faeeeb",
                "100": "#f8dcd6",
                "150": "#f6cabf",
                "200": "#f5b7a8",
                "250": "#f5a390",
                "300": "#f38f79",
                "350": "#f17961",
                "400": "#f06048",
                "450": "#ee402e",
                "500": "#d93526",
                "550": "#c52f21",
                "600": "#af291d",
                "650": "#9b2318",
                "700": "#861d13",
                "750": "#72170f",
                "800": "#5c160d",
                "850": "#45150c",
                "900": "#30130a",
                "950": "#1c0d06"
            }
        }
    }
}
```

## Key Concepts:

**TIBR Components**: Components are self-contained blocks of JavaScript that handle specific functionalities or UI elements. These components can be easily reused and combined to build complex user interfaces.

**Event Handlin**g: Direct interaction with DOM events using standard methods, enabling dynamic web experiences without reliance on external libraries.

## Advantages:

**Simplicity & Spee**d: TIBR's minimal approach leads to faster loading times and improved performance for users, especially beneficial for projects where efficiency is crucial.

**Flexibility & Contro**l: Developers have complete control over the framework's structure and can customize their applications according to specific requirements.

**Cross-Platform Compatibilit**y: TIBR works seamlessly across various platforms (including desktop) due to its direct DOM manipulation approach.

## Usage Example:

### Example Component (Button)

```
/**
* Button Component
* Creates a button element with the given options.
* @param {Object} options - Configuration options for the button.
* @param {string} options.id - The id of the button.
* @param {string[]} options.classes - The CSS classes for the button.
* @param {Object} options.style - Inline styles for the button.
* @param {string} options.label - The text label of the button.
* @param {Function} options.onClick - Click event handler for the button.
* @returns {HTMLElement} The created button element.
*/

// @func Button
export default function Button(options) {
    const button = document.createElement("button")

    // Assign the id if provided.
    if(options.id) {
        button.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            button.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(button.style, options.style)
    }

    // Set the label text if provided.
    if(options.label) {
        button.textContent = options.label
    }

    // Attach a click event handler if provided.
    if(options.onClick) {
        button.addEventListener("click", options.onClick)
    }

    return button
}
```

## Example Usage

```
    let selectFolderButton = Button({
        id: "selectFolderButton",
        label: "Get Files",
        style: {
            width: "200px",
        },
        onClick: async () => {
            let projectPath = tibr.getElement("selectFolderInput").value
            tibr.data.code.projectPath =  projectPath

            getSourceCode(tibr.data.code.projectPath, onMessage)
        },
    })
```

## Understanding the Rust Backend:

Rust provides a bridge between the web frontend (TIBR) and your backend operations.

Rust's capabilities allow for robust data management, network communication, and complex logic, ensuring scalability and reliability of the application.

Future Enhancements:

**Built-in Components**: Development is underway to include pre-built components for common use cases like forms, menus, and interactive elements for a quicker development process.

**Theme & Styling Options**: TIBR will introduce modular styling options to further customize the look and feel of user interfaces based on individual project requirements.

## Example tauri rust function

```
use serde_json::json;
use tauri::State;
use tokio::sync::Mutex;
use rusqlite::{params, Connection, Result};
use reqwest;
use std::sync::Arc;

// @func read_file
#[tauri::command]
async fn read_file(file_path: String) -> Result<String, String> {
    use tokio::fs::File;
    use tokio::io::AsyncReadExt;

    let mut file = File::open(file_path).await.map_err(|e| e.to_string())?;
    let mut contents = String::new();
    file.read_to_string(&mut contents).await.map_err(|e| e.to_string())?;
    Ok(contents)
}

////////
// EXECUTE
////////

// @func run
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_conn = Arc::new(Mutex::new(Connection::open("chat.db").expect("Failed to open database")));

    tauri::Builder::default()
        .manage(db_conn)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![chat, get_local_models, initialize_db, create_chat_dialog, update_chat_dialog, get_chat_dialog, get_chat_history, create_profile, update_profile, get_profiles, get_source_code, read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

