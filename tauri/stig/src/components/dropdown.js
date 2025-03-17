/**
* @function Dropdown - Dropdown Component
* @param {Object} options - Configuration options for the dropdown
* @param {string} [options.id] - ID for the dropdown
* @param {string[]} [options.classes] - CSS classes for the dropdown
* @param {Object} [options.style] - Inline styles for the dropdown
* @param {string} options.title - Title for the dropdown
* @param {Array} options.items - List of items for the dropdown
* @returns {HTMLDetailsElement} The configured dropdown element
*/
export default function Dropdown(options) {
    const dropdown = document.createElement("details")

    // Assign the id if provided.
    if(options.id) {
        dropdown.id = options.id
    }

    // Add the specified classes if provided.
    dropdown.classList.add("dropdown")
    if(options.classes) {
        for(let className of options.classes) {
            dropdown.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    Object.assign(dropdown.style, {
        minWidth: "200px",
    })
    if(options.style) {
        Object.assign(dropdown.style, options.style)
    }

    // Create summary
    const summary = document.createElement("summary")
    summary.append(options.title)

    dropdown.append(summary)

    // Create entries
    const itemContainer = document.createElement("ul")

    dropdown.append(itemContainer)

    for(const item of options.items) {
        const itemElement = document.createElement("li")

        itemContainer.append(itemElement)

        const label = document.createElement("label")
        itemElement.append(label)

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
    }

    return dropdown
}
