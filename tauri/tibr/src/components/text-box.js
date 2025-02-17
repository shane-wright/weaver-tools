/**
* TextBox Component
* @param {Object} options - Configuration options for the input element
* @param {string} [options.id] - ID for the input element
* @param {string[]} [options.classes] - CSS classes for the input element
* @param {Object} [options.style] - Inline styles for the input element
* @returns {HTMLHeadingElement} The configured input element
*/
// @func TextBox
export default function TextBox(options) {
    const textBox = document.createElement("input")

    // Assign the id if provided.
    if(options.id) {
        textBox.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            textBox.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(textBox.style, options.style)
    }

    // set type
    if(options.type) {
        textBox.type = options.type
    }
    else {
        textBox.type = "text"
    }

    return textBox
}
