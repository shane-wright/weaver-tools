/**
* @function StigSelector - StigSelector Component
* @param {Object} options - Configuration options for the div element
* @param {string} [options.id] - ID for the div element
* @param {string[]} [options.classes] - CSS classes for the div element
* @param {Object} [options.style] - Inline styles for the div element
* @returns {HTMLHeadingElement} The configured div element
*/
import TextBox from "./text-box.js"

export default function StigSelector(options) {
    const selectContainer = document.createElement("div")

    Object.assign(selectContainer.style, {
        width: "100%",
        height: "100%",
        display: "flex",
        gap: "10px",
    })

    const searchInput = TextBox({
        id: "searchInput",
        placeholder: "V-222387",
        style: {
            minWidth: "200px",
        },
    })

    selectContainer.append(searchInput)

    const select = document.createElement("select")

    selectContainer.append(select)

    select.setAttribute("aria-label", "Select")
    select.setAttribute("required", true)

    // Assign the id if provided.
    if(options.id) {
        select.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            select.classList.add(className)
        }
    }

    Object.assign(select.style, {
        minWidth: "200px",
    })

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(select.style, options.style)
    }

    if(options.onChange) {
        select.addEventListener("change", (e) => { options.onChange(e) })
    }

    // Filter options based on search input
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toUpperCase()
        selectItem(select, searchTerm)
    })

    let selectApp = {
        id: options.id,
        addItems: (items) => { addItems(select, items) },
    }

    select.app = selectApp

    return selectContainer
}

// @function addItems
function addItems(select, items) {
    if(select) {
        // Remove each option from the select element
        while (select.firstChild) {
            select.removeChild(select.firstChild)
        }

        if (items) {
            const stigs = items.map(stig => ({
                value: stig.name,
                label: stig.name
            }))

            stigs.forEach(stig => {
                const option = document.createElement("option")
                option.value = stig.value
                option.textContent = stig.label

                select.appendChild(option)
            })
        }
    }
}

// @function selectItem
function selectItem(select, itemName) {
    const options = select.options
    for (let i = 0; i < options.length; i++) {
        let stigName = options[i].value.toUpperCase()
        if (stigName.startsWith(itemName)) {
            select.selectedIndex = i
            console.log(`displayStig ${stigName} selectItem (StigSelector Component)`)
            tibr.data.stig.name = stigName
            tibr.view.app.displayStig(stigName)
            break
        }
    }
}
