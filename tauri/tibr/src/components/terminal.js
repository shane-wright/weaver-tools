/**
* Terminal Component
* @param {Object} options - Configuration options for the textarea element
* @param {string} [options.id] - ID for the textarea element
* @param {string[]} [options.classes] - CSS classes for the textarea element
* @param {Object} [options.style] - Inline styles for the textarea element
* @returns {HTMLHeadingElement} The configured textarea element
*/
// @func Terminal
export default function Terminal(options) {
    const terminal = document.createElement("textarea")

    // Assign the id if provided.
    if(options.id) {
        terminal.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            terminal.classList.add(className)
        }
    }

    Object.assign(terminal.style, {
        fontFamily: "roboto-mono, monospace",
        backgroundColor: "#000",
        color: "#fff",
        border: "none",
        overflow: "auto",
        resize: "none",
    })

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(terminal.style, options.style)
    }

    return terminal
}
