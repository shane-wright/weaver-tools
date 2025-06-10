/**
* @function H4 - H4 Component
* @param {Object} options - Configuration options for the h4 element
* @param {string} [options.id] - ID for the h4 element
* @param {string[]} [options.classes] - CSS classes for the h4 element
* @param {Object} [options.style] - Inline styles for the h4 element
* @param {string} [options.label] - Label for the h4 element
* @returns {HTMLHeadingElement} The configured h4 element
*/
export default function H4(options) {
    const h4 = document.createElement("h4")

    // set id
    if(options.id) {
        h4.id = options.id
    }

    // set classes
    if(options.classes) {
        for(let className of options.classes) {
            h4.classList.add(className)
        }
    }

    // set style
    if(options.style) {
        Object.assign(h4.style, options.style)
    }

    // set label
    if(options.label) {
        h4.textContent = options.label
    }

    return h4
}
