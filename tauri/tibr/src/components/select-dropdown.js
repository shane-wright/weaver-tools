/**
* SelectDropdown Component
* @param {Object} options - Configuration options for the div element
* @param {string} [options.id] - ID for the div element
* @param {string[]} [options.classes] - CSS classes for the div element
* @param {Object} [options.style] - Inline styles for the div element
* @returns {HTMLHeadingElement} The configured div element
*/

// @func SelectDropdown
export default function SelectDropdown(options) {
    const dropdownContainer = document.createElement("div")

    Object.assign(dropdownContainer.style, {
        width: "100%",
        height: "100%",
    })

    const selectTitle = document.createElement("div")

    dropdownContainer.append(selectTitle)

    if(options.title) {
        selectTitle.append(options.title)
    }

    const dropdown = document.createElement("select")

    dropdownContainer.append(dropdown)

    dropdown.setAttribute("aria-label", "Select")
    dropdown.setAttribute("required", true)

    // Assign the id if provided.
    if(options.id) {
        dropdown.id = options.id
    }

    // Add the specified classes if provided.
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

    for(const item of options.items) {
        const itemOption = document.createElement("option")

        dropdown.append(itemOption)

        itemOption.append(item.value)
    }

    if(options.onChange) {
        dropdown.addEventListener("change", () => { options.onChange() })
    }

    let dropdownApp = {
        id: options.id,
        onChange: () => { options.onChange() },
    }

    dropdown.app = dropdownApp
    if(options.onChange) {
    dropdown.addEventListener("change", () => { options.onChange() })
    }
    return dropdownContainer
}
