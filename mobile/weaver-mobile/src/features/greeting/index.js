const { invoke } = window.__TAURI__.core;

// Initialize component state in tibr global object
if (!window.tibr) {
    window.tibr = {};
}

if (!window.tibr.greeting) {
    window.tibr.greeting = {
        inputValue: "",
        message: "",
        container: null,
        eventListeners: new Set()
    };
}

const GreetingComponent = {
    init: (contentEl, params = {}) => {
        // Store reference to container
        window.tibr.greeting.container = contentEl;
        
        // Reset state
        window.tibr.greeting.inputValue = "";
        window.tibr.greeting.message = "";
        
        // Initial render
        GreetingComponent.render();
        
        return GreetingComponent;
    },

    render: () => {
        const container = window.tibr.greeting.container;
        if (!container) return;

        // Clear container
        container.innerHTML = "";

        // Create header
        const header = document.createElement("h1");
        header.id = "greeting-header";
        header.textContent = "Welcome to Tauri";
        Object.assign(header.style, {
            fontSize: "2rem",
            marginBottom: "2rem",
            color: "var(--pico-color)",
            textAlign: "center"
        });
        container.appendChild(header);

        // Create logo container
        const logoContainer = document.createElement("div");
        logoContainer.id = "greeting-logos";
        Object.assign(logoContainer.style, {
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginBottom: "2rem"
        });

        // Create and style Tauri logo
        const tauriLink = document.createElement("a");
        tauriLink.id = "greeting-tauri-link";
        tauriLink.href = "https://tauri.app";
        tauriLink.target = "_blank";

        const tauriLogo = document.createElement("img");
        tauriLogo.id = "greeting-tauri-logo";
        tauriLogo.src = "/assets/tauri.svg";
        tauriLogo.alt = "Tauri logo";
        Object.assign(tauriLogo.style, {
            height: "6rem",
            transition: "transform 0.3s ease"
        });
        tauriLink.appendChild(tauriLogo);
        logoContainer.appendChild(tauriLink);

        // Create and style JavaScript logo
        const jsLink = document.createElement("a");
        jsLink.id = "greeting-js-link";
        jsLink.href = "https://developer.mozilla.org/en-US/docs/Web/JavaScript";
        jsLink.target = "_blank";

        const jsLogo = document.createElement("img");
        jsLogo.id = "greeting-js-logo";
        jsLogo.src = "/assets/javascript.svg";
        jsLogo.alt = "JavaScript logo";
        Object.assign(jsLogo.style, {
            height: "6rem",
            transition: "transform 0.3s ease"
        });
        jsLink.appendChild(jsLogo);
        logoContainer.appendChild(jsLink);

        container.appendChild(logoContainer);

        // Create description
        const description = document.createElement("p");
        description.id = "greeting-description";
        description.textContent = "Click on the Tauri logo to learn more about the framework";
        Object.assign(description.style, {
            textAlign: "center",
            marginBottom: "2rem",
            color: "var(--pico-muted-color)"
        });
        container.appendChild(description);

        // Create form
        const form = document.createElement("form");
        form.id = "greeting-form";
        Object.assign(form.style, {
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "1rem"
        });

        // Create input
        const input = document.createElement("input");
        input.id = "greeting-input";
        input.placeholder = "Enter a name...";
        input.value = window.tibr.greeting.inputValue;
        Object.assign(input.style, {
            padding: "0.5rem 1rem",
            border: "1px solid var(--pico-muted-border-color)",
            borderRadius: "4px",
            backgroundColor: "var(--pico-background-color)",
            color: "var(--pico-color)"
        });
        form.appendChild(input);

        // Create button
        const button = document.createElement("button");
        button.id = "greeting-submit";
        button.type = "submit";
        button.textContent = "Greet";
        Object.assign(button.style, {
            padding: "0.5rem 1rem",
            backgroundColor: "var(--pico-primary)",
            color: "var(--pico-primary-inverse)",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
        });
        form.appendChild(button);

        container.appendChild(form);

        // Create message display
        const messageEl = document.createElement("p");
        messageEl.id = "greeting-message";
        messageEl.textContent = window.tibr.greeting.message;
        Object.assign(messageEl.style, {
            textAlign: "center",
            marginTop: "1rem",
            color: "var(--pico-color)"
        });
        container.appendChild(messageEl);

        // Add event listeners
        GreetingComponent.setupEventListeners();
    },

    setupEventListeners: () => {
        // Clean up existing listeners
        GreetingComponent.cleanup();

        const handleSubmit = async (e) => {
            e.preventDefault();
            const input = document.getElementById("greeting-input");
            window.tibr.greeting.inputValue = input.value;
            
            try {
                const result = await invoke("greet", { name: input.value });
                window.tibr.greeting.message = result;
                document.getElementById("greeting-message").textContent = result;
            } catch (error) {
                console.error("Error in greeting:", error);
                window.tibr.greeting.message = "Error processing greeting";
                document.getElementById("greeting-message").textContent = "Error processing greeting";
            }
        };

        const form = document.getElementById("greeting-form");
        form.addEventListener("submit", handleSubmit);
        window.tibr.greeting.eventListeners.add({ element: form, type: "submit", handler: handleSubmit });

        // Add hover effects for logos
        const logos = ["greeting-tauri-logo", "greeting-js-logo"];
        logos.forEach(logoId => {
            const logo = document.getElementById(logoId);
            const handleMouseEnter = () => {
                logo.style.transform = "scale(1.1)";
            };
            const handleMouseLeave = () => {
                logo.style.transform = "scale(1)";
            };
            
            logo.addEventListener("mouseenter", handleMouseEnter);
            logo.addEventListener("mouseleave", handleMouseLeave);
            
            window.tibr.greeting.eventListeners.add(
                { element: logo, type: "mouseenter", handler: handleMouseEnter },
                { element: logo, type: "mouseleave", handler: handleMouseLeave }
            );
        });
    },

    cleanup: () => {
        // Remove all registered event listeners
        window.tibr.greeting.eventListeners.forEach(({ element, type, handler }) => {
            element?.removeEventListener(type, handler);
        });
        window.tibr.greeting.eventListeners.clear();
    }
};

// Export default function for view-manager compatibility
export default function(contentEl, params = {}) {
    return GreetingComponent.init(contentEl, params);
}

