/**
* @function Card - Card Component
* @param {Object} options - Configuration options for the card element
* @param {string} [options.id] - ID for the card element
* @param {string[]} [options.classes] - CSS classes for the card element
* @param {Object} [options.style] - Inline styles for the card element
* @param {Function} [options.onClick] - Click event handler for the card
* @param {string} [options.title] - Title for the card header
* @returns {HTMLElement} The configured card element
*/
export default function Card(options) {
    const card = document.createElement("article")

    // Assign the id if provided.
    if(options.id) {
        card.id = options.id
    }

    // Add the card class
    card.classList.add("card")

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            card.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(card.style, options.style)
    }

    // Set click event if provided.
    if(options.onClick) {
        card.style.cursor = "pointer"
        card.addEventListener("click", options.onClick)
    }

    // Set header title if provided
    if(options.title) {
        const header = document.createElement("header")
        header.innerHTML = options.title

        card.append(header)
    }

    // Add a content div and parse markdown content if provided.
    if(options.content) {
        const contentDiv = document.createElement("div")

        contentDiv.innerHTML = marked.parse(options.content, {
            breaks: true,
            gfm: true,
            sanitize: true
        })

        card.append(contentDiv)
    }

    // Render a Mermaid diagram if provided.
    if (options.diagram) {
        const mermaidDiv = document.createElement("div")
        mermaidDiv.classList.add("mermaid")
        mermaidDiv.style.textAlign = "center"
        mermaidDiv.innerHTML = options.diagram

        card.append(mermaidDiv)
    }

    return card
}
