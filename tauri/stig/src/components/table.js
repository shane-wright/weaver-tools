/**
* @function Table - Table Component
* @param {Object} options - Configuration options for the table element
* @param {string} [options.id] - ID for the table element
* @param {string[]} [options.classes] - CSS classes for the table element
* @param {Object} [options.style] - Inline styles for the table element
* @param {string[]} [options.headers] - Headers for the table element
* @param {Object[]} [options.items] - Items for the table element
* @returns {HTMLHeadingElement} The configured table element
*/
export default function Table(options) {
    const table = document.createElement("table")

    // Assign the id if provided.
    if(options.id) {
        table.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            table.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(table.style, options.style)
    }

    // create header
    const tableHeader = document.createElement("thead")
    table.append(tableHeader)

    const headerRow = document.createElement("tr")
    tableHeader.append(headerRow)

    for(const headerItem of options.headers) {
        const headerElement = document.createElement("th")
        headerRow.append(headerElement)

        headerElement.innerHTML = headerItem
    }

    // create body
    const tableBody = document.createElement("tbody")
    table.append(tableBody)

    for(const item of options.items) {
        const row = document.createElement("tr")
        tableBody.append(row)

        for(const headerItem of options.headers) {
            const element = document.createElement("td")
            row.append(element)

            element.innerHTML = item[headerItem.toLowerCase()]
        }
    }

    return table
}
