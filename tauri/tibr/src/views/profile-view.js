import Container from "../components/container.js"
import H4 from "../components/h4.js"
import HR from "../components/hr.js"
import Icon from "../components/icon.js"
import Nav from "../components/nav.js"
import ProfileForm from "../components/profile-form.js"

// @func render
const render = async () => {
    let mainContent = tibr.getElement("mainContent")

    let viewContainer = Container({
        id: "profileView",
        classes: ["container-fluid"],
        style: {
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
        },
    })

    mainContent.append(viewContainer)

    await initialize()

    viewContainer.append(renderHeader())

    viewContainer.append(renderProfileForm())

    await animate()
}

// @func initialize
const initialize = async () => {
}

// @func animate
const animate = async () => {
}

// @func renderHeader
const renderHeader = () => {
    let header = Container({
        id: "profileHeader",
        style: {
            display: "flex",
            gap: "10px",
            marginTop: "5px",
        }
    })

    header.append(Nav({}))
    header.append(renderSaveIcon())

    return header
}

// @func renderProfileForm
const renderProfileForm = () => {
    let profileFormContainer = Container({
        id: "profileFormContainer",
        style: {
        }
    })

    let profileForm = ProfileForm({
        id: "profileForm",
        onSubmit: () => {
            
        }
    })

    profileFormContainer.append(profileForm)

    return profileFormContainer
}

// @func renderSaveIcon
const renderSaveIcon = () => {
    return Icon({
        id: "saveIcon",
        classes: ["ri-save-line"],
        style: { fontSize: "36px" },
        onClick: async (e) => {
            
        }
    })
}

// @func onMessage
const onMessage = async (message) => {
}

// @func onDestroy
const onDestroy = () => {
}

export { render, onMessage, onDestroy }
