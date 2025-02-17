import Container from "../components/container.js"
import H4 from "../components/h4.js"
import HR from "../components/hr.js"
import Nav from "../components/nav.js"
import Card from "../components/card.js"

// @func render
const render = async () => {
    let mainContent = tibr.getElement("mainContent")

    let viewContainer = Container({
        id: "profileView",
        classes: ["container-fluid"],
        style: {
            marginTop: "5px",
            marginBottom: "40px",
        },
    })

    mainContent.append(viewContainer)

    await initialize()

    viewContainer.append(Nav({}))

    viewContainer.append(renderHeader())

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
        }
    })

    return header
}

// @func onMessage
const onMessage = async (message) => {
}

// @func onDestroy
const onDestroy = () => {
}

export { render, onMessage, onDestroy }
