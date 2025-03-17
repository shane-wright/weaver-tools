/**
* @function ModelSelector - ModelSelector Component
* @param {Object} options - Configuration options for the select element
* @param {string} [options.id] - ID for the select element
* @param {string[]} [options.classes] - CSS classes for the select element
* @param {Object} [options.style] - Inline styles for the select element
* @returns {HTMLHeadingElement} The configured select element
*/
export default function ModelSelector(options) {
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

    refreshModels(select)

    if (options.onChange) {
        select.addEventListener('change', options.onChange)
    }

    let selectApp = {
        id: options.id,
        refreshModels: () => { refreshModels(select) },
        selectModel: (modelName) => { selectModel(select, modelName) },
    }

    select.app = selectApp

    return select
}

// @function refreshModels
function refreshModels(select) {
    if(select) {
        // Remove each option from the select element
        while (select.firstChild) {
            select.removeChild(select.firstChild)
        }

        if (tibr.data.ai.availableModels) {
            const models = tibr.data.ai.availableModels.map(model => ({
                value: model.name,
                label: model.description
            }))

            models.forEach(model => {
                const option = document.createElement('option')
                option.value = model.value
                option.textContent = model.label
                if(model.value === tibr.data.ai.model) {
                    option.selected = true
                }
                select.appendChild(option)
            })

            const option = document.createElement('option')
            option.value = "draft"
            option.textContent = "draft"
            if("draft" === tibr.data.ai.model) {
                option.selected = true
            }
            select.appendChild(option)
        }
    }
}

// @function selectModel
function selectModel(select, modelName) {
    const options = select.options
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === modelName) {
            select.selectedIndex = i
            break
        }
    }
}
