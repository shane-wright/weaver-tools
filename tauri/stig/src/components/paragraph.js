/**
* @function Paragraph - Paragraph Component
* @param {Object} options - Configuration options for the p element
* @param {string} [options.id] - ID for the p element
* @param {string[]} [options.classes] - CSS classes for the p element
* @param {Object} [options.style] - Inline styles for the p element
* @returns {HTMLHeadingElement} The configured p element
*/
export default function Paragraph(options) {
    const paragraph = document.createElement("p")

    // Assign the id if provided.
    if(options.id) {
        paragraph.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            paragraph.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(paragraph.style, options.style)
    }

    // set label
    if(options.label) {
        paragraph.textContent = options.label
    }

    return paragraph
}
