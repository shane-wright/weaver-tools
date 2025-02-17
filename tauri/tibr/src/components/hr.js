/**
* HR Component
* @param {Object} options - Configuration options for the hr element
* @param {string} [options.id] - ID for the hr element
* @param {string[]} [options.classes] - CSS classes for the hr element
* @param {Object} [options.style] - Inline styles for the hr element
* @returns {HTMLHeadingElement} The configured hr element
*/
export default function HR(options) {
    const hr = document.createElement("hr")

    // Assign the id if provided.
    if(options.id) {
        hr.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            hr.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(hr.style, options.style)
    }

    return hr
}
