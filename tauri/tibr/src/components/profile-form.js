/**
* ProfileForm Component
* @param {Object} options - Configuration options for the profile form
* @param {string} [options.id] - ID for the profile form
* @param {string[]} [options.classes] - CSS classes for the profile form
* @param {Object} [options.style] - Inline styles for the profile form
* @returns {HTMLFormElement} The configured profile form element
*/

import Button from "./button.js"
import Container from "./container.js"
import Label from "./label.js"
import ModelSelector from "./model-selector.js"
import Toast from "./toast.js"
import ViewSelector from "./view-selector.js"

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


    profileForm.append(renderToast())

    profileForm.append(renderViewSelector())

    profileForm.append(renderModelSelector())

    profileForm.append(renderSaveButton())


    return profileForm
}

// @func renderToast
const renderToast = () => {
    return Toast({
        id: "profileFormToast",
    })
}

// @func renderModelSelector
const renderModelSelector = () => {
    let modelSelectorContainer = Container({
        id: "modelSelectorContainer",
        style: {
            display: "flex",
        },
    })

    modelSelectorContainer.append(Label({
        id: "modelSelectorLabel",
        label: "Model:",
        style: {
            width: "100px",
        },
    }))

    modelSelectorContainer.append(ModelSelector({
        id: "modelSelector",
        onChange: (e) => {
            
        }
    }))


    return modelSelectorContainer
}

// @func renderViewSelector
const renderViewSelector = () => {
    let viewSelectorContainer = Container({
        id: "viewSelectorContainer",
        style: {
            display: "flex",
        },
    })

    viewSelectorContainer.append(Label({
        id: "viewSelectorLabel",
        label: "View:",
        style: {
            width: "100px",
        },
    }))

    viewSelectorContainer.append(ViewSelector({
        id: "viewSelector",
        onChange: (e) => {
            
        }
    }))

    return viewSelectorContainer
}

// @func renderSaveButton
const renderSaveButton = () => {
    let saveButton = Button({
        id: "saveButton",
        label: "Save",
        style: {
            width: "100%",
        },
        onClick: (e) => {
            e.preventDefault()

            let modelSelector = tibr.getElement("modelSelector")
            let viewSelector = tibr.getElement("viewSelector")
            let toast = tibr.getElement("profileFormToast")

            let model = modelSelector.options[modelSelector.selectedIndex].value

            if(model) {
                tibr.data.profile.preferences.model = model
            }

            let view = viewSelector.options[viewSelector.selectedIndex].value
            if(view) {
                tibr.data.profile.preferences.view = view
            }


            // TODO: save model

            toast.app.show("Profile saved")
        }
    })

    return saveButton
}
