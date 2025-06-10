/**
* @function H2 - H2 Component
* @param {Object} options - Configuration options for the h2 element
* @param {string} [options.id] - ID for the h2 element
* @param {string[]} [options.classes] - CSS classes for the h2 element
* @param {Object} [options.style] - Inline styles for the h2 element
* @param {string} [options.label] - Label for the h2 element
* @returns {HTMLHeadingElement} The configured h2 element
*/
export default function H2(options) {
    const h2 = document.createElement("h2")

    // Assign the id if provided.
    if(options.id) {
        h2.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            h2.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(h2.style, options.style)
    }

    // Set the label if provided.
    if(options.label) {
        h2.textContent = options.label
    }

    return h2
}
