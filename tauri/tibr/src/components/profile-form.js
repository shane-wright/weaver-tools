/**
* ProfileForm Component
* @param {Object} options - Configuration options for the profile form
* @param {string} [options.id] - ID for the profile form
* @param {string[]} [options.classes] - CSS classes for the profile form
* @param {Object} [options.style] - Inline styles for the profile form
* @returns {HTMLFormElement} The configured profile form element
*/

import ModelSelector from "./model-selector.js"

// @func ProfileForm
export default function ProfileForm(options) {
    const profileForm = document.createElement("form")

    // Assign the id if provided.
    if(options.id) {
        profileForm.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
        profileForm.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(profileForm.style, options.style)
    }

    const modelField = document.createElement("label")
    modelField.htmlFor = "model"
    modelField.textContent = "Model:"
    profileForm.append(modelField)
    profileForm.append(renderModelSelector())



    const viewField = document.createElement("label")
    viewField.htmlFor = "view"
    viewField.textContent = "View:"
    profileForm.appendChild(viewField)

    const viewSelect = document.createElement("select")
    viewSelect.id = "view"; 
    // Populate the dropdown with options from ollama views list. 
    let views = [ // Example: Populate the dropdown 
        { value: "view1", label: "View 1" },
        { value: "view2", label: "View 2" },
        { value: "view3", label: "View 3" }
    ]

    views.forEach((option) => {
      let optionElement = document.createElement("option")
      optionElement.value = option.value
      optionElement.text = option.label
      viewSelect.appendChild(optionElement)
    })

    profileForm.appendChild(viewSelect)


    const submitButton = document.createElement('button')
    submitButton.id = 'profileSubmitButton'
    submitButton.type = 'submit'
    submitButton.textContent = 'Submit'
    
    profileForm.appendChild(submitButton)

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault()
        // Add submit logic here
    })

    return profileForm
}

// @func renderModelSelector
const renderModelSelector = () => {
    return ModelSelector({
        id: "modelSelector",
        onChange: (e) => {
            console.log(e.target.value)
        }
    })
}
