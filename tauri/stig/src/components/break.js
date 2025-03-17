/**
* @function Break - Break Component
* @param {Object} options - Configuration options for the break element
* @param {string} [options.id] - ID for the break element
* @param {string[]} [options.classes] - CSS classes for the break element
* @param {Object} [options.style] - Inline styles for the break element
* @returns {HTMLBRElement} The configured break element
*/
export default function Break(options) {
    const breakElement = document.createElement("br")

    // Assign the id if provided.
    if(options.id) {
        breakElement.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            breakElement.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(breakElement.style, options.style)
    }

    return breakElement
}
