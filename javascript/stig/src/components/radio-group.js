/**
* @function RadioGroup - RadioGroup Component
* @param {Object} options - Configuration options for the fieldset element
* @param {string} [options.id] - ID for the fieldset element
* @param {string[]} [options.classes] - CSS classes for the fieldset element
* @param {Object} [options.style] - Inline styles for the fieldset element
* @param {string} [options.title] - Legend title for the fieldset element
* @param {Object[]} [options.items] - Items for the fieldset element
* @returns {HTMLHeadingElement} The configured fieldset element
*/
export default function RadioGroup(options) {
    const fieldset = document.createElement("fieldset")

    // Assign the id if provided.
    if(options.id) {
        fieldset.id = options.id
    }

    // Add the specified classes if provided.
    if (options.classes) {
        for (let className of options.classes) {
            fieldset.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if (options.style) {
        Object.assign(fieldset.style, options.style)
    }


    // Set Legend
    if (options.title) {
        const legend = document.createElement("legend")
        legend.textContent = options.title
        fieldset.appendChild(legend)
    }

    // Create Radio Buttons
    for (const item of options.items) {
        const label = document.createElement("label")
        const input = document.createElement("input")

        input.type = "radio"
        input.name = item.name
        input.value = item.value

        // Set checked attribute if it's the first item
        if (options.items.indexOf(item) === 0) {
            input.checked = true
        }

        label.appendChild(input)
        label.appendChild(document.createTextNode(item.label))
        fieldset.appendChild(label)
    }


    return fieldset
}
