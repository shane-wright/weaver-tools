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
