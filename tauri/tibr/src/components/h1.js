/**
* H1 Component
* @param {Object} options - Configuration options for the h1 element
* @param {string} [options.id] - ID for the h1 element
* @param {string[]} [options.classes] - CSS classes for the h1 element
* @param {Object} [options.style] - Inline styles for the h1 element
* @param {string} [options.label] - Label for the h1 element
* @returns {HTMLHeadingElement} The configured h1 element
*/
// @func H1
export default function H1(options) {
    const h1 = document.createElement("h1")

    // Assign the id if provided.
    if(options.id) {
        h1.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            h1.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(h1.style, options.style)
    }

    // set label
    if(options.label) {
        h1.textContent = options.label
    }

    return h1
}
