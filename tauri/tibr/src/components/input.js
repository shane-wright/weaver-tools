/**
* Input Component
* Creates an input element with the given options.
* @param {Object} options - Configuration options for the input.
* @param {string} options.id - The id of the input.
* @param {string[]} options.classes - The CSS classes for the input.
* @param {Object} options.style - Inline styles for the input.
* @param {string} options.value - The value of the input.
* @param {Function} options.onChange - Change event handler for the input.
* @returns {HTMLElement} The created input element.
*/

// @func Input
export default function Input(options) {
    const input = document.createElement("input")

    // Assign the id if provided.
    if(options.id) {
        input.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            input.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(input.style, options.style)
    }

    // Set the value if provided.
    if(options.value) {
        input.value = options.value
    }

    // Set the type if provided.
    if(options.type) {
        input.type = options.type
    }

    // Attach a change event handler if provided.
    if(options.onChange) {
        input.addEventListener("change", options.onChange)
    }

    return input
}

