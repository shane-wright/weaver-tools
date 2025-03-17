/**
* @function SelectFolder - SelectFolder Component
* @description Creates a button element for folder selection with the given options.
* @param {Object} options - Configuration options for the button.
* @param {string} options.id - The id of the button.
* @param {string[]} options.classes - The CSS classes for the button.
* @param {Object} options.style - Inline styles for the button.
* @param {string} options.label - The text label of the button.
* @param {Function} options.onSelect - Event handler for folder selection.
* @returns {HTMLElement} The created button element.
*/

export default function SelectFolder(options) {
    const button = document.createElement("button")

    // Assign the id if provided.
    if (options.id) {
        button.id = options.id
    }

    // Add the specified classes if provided.
    if (options.classes) {
        for (let className of options.classes) {
            button.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if (options.style) {
        Object.assign(button.style, options.style)
    }

    // Set the label text if provided.
    if (options.label) {
        button.textContent = options.label
    }

    // Attach an event handler to open folder selection dialog.
    button.addEventListener("click", async () => {
        
    })

    return button
}

