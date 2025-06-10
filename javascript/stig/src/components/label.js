/**
* @function Label - Label Component
* @param {Object} options - Configuration options for the label
* @param {string} [options.id] - ID for the label
* @param {string[]} [options.classes] - CSS classes for the label
* @param {Object} [options.style] - Inline styles for the label
* @returns {HTMLDivElement} The configured label element
*/
export default function Label(options) {
    const label = document.createElement("div")

    // Assign the id if provided.
    if(options.id) {
        label.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            label.classList.add(className)
        }
    }

    if(options.style) {
        Object.assign(label.style, options.style)
    }

    // Set the label text if provided.
    if(options.label) {
        label.textContent = options.label
    }

    return label
}
