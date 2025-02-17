/**
* Pre Component
* @param {Object} options - Configuration options for the pre element
* @param {string} [options.id] - ID for the pre element
* @param {string[]} [options.classes] - CSS classes for the pre element
* @param {Object} [options.style] - Inline styles for the pre element
* @returns {HTMLHeadingElement} The configured pre element
*/
// @func Pre
export default function Pre(options) {
    const pre = document.createElement("pre")

    // Assign the id if provided.
    if(options.id) {
        pre.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            pre.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(pre.style, options.style)
    }

    return pre
}
