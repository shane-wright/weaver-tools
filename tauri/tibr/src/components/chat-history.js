/**
* ChatHistory Component
* @param {Object} options - Configuration options for the select element
* @param {string} [options.id] - ID for the select element
* @param {string[]} [options.classes] - CSS classes for the select element
* @param {Object} [options.style] - Inline styles for the select element
* @returns {HTMLHeadingElement} The configured select element
*/
// @func ChatHistory
export default function ChatHistory(options) {
    const select = document.createElement('select')


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

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(select.style, options.style)
    }

    refreshHistory(select)

    if (options.onChange) {
        select.addEventListener('change', options.onChange)
    }

    let selectApp = {
        id: options.id,
        refreshHistory: () => { refreshHistory(select) },
        unselectHistory: () => { unselectHistory(select) },
    }

    select.app = selectApp

    return select
}

function refreshHistory(select) {
    if(select) {
        // Remove each option from the select element
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }

        const initialOption = document.createElement('option')
        initialOption.textContent = 'History'
        initialOption.disabled = true
        initialOption.selected = true

        select.appendChild(initialOption)

        if (tibr.data.ai.history) {
            tibr.data.ai.history.forEach(historyItem => {
                const option = document.createElement('option')
                option.value = historyItem.id
                option.textContent = historyItem.description
                select.appendChild(option)
            })
        }
    }
}

function unselectHistory(select) {
    if(select) {
        chatHistory.selectedIndex = 0
    }
}
