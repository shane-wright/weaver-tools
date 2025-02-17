/**
* TextArea Component
* @param {Object} options - Configuration options for the textarea element
* @param {string} [options.id] - ID for the textarea element
* @param {string[]} [options.classes] - CSS classes for the textarea element
* @param {Object} [options.style] - Inline styles for the textarea element
* @returns {HTMLHeadingElement} The configured textarea element
*/
// @func TextArea
export default function TextArea(options) {
    const textArea = document.createElement("textarea")

    // Assign the id if provided.
    if(options.id) {
        textArea.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            textArea.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(textArea.style, options.style)
    }

    return textArea
}
