/**
* Container Component
* @param {Object} options - Configuration options for the container
* @param {string} [options.id] - ID for the container
* @param {string[]} [options.classes] - CSS classes for the container
* @param {Object} [options.style] - Inline styles for the container
* @returns {HTMLDivElement} The configured container element
*/
// @func Container
export default function Container(options) {
    const container = document.createElement("div")

    // Assign the id if provided.
    if(options.id) {
        container.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            container.classList.add(className)
        }
    }

    if(options.style) {
        Object.assign(container.style, options.style)
    }

    return container
}
