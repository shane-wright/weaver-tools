import Container from "../components/container.js"
import H4 from "../components/h4.js"
import HR from "../components/hr.js"
import Icon from "../components/icon.js"
import Nav from "../components/nav.js"

const render = async () => {
    let mainContent = tibr.getElement("mainContent")

    let viewContainer = Container({
        id: "labView",
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

const renderHeader = () => {
    let header = Container({
        id: "labHeader",
        style: {
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 40px",
            alignItems: "center",
        }
    })

    let title = H4({
        id: "labHeaderTitle",
        text: "Lab",
        style: {
            margin: 0
        },
        label: "TIBR",
    })

    header.append(title)
    header.append(renderHeaderWidgets())

    return header
}

const renderHeaderWidgets = () => {
    let headerWidgets= Container({
        id: "headerWidgets",
        style: {
            display: "flex",
            gap: "10px",
        }
    })

    headerWidgets.append(renderSideMenuIcon())

    return headerWidgets
}

// @func renderSideMenuIcon
const renderSideMenuIcon = () => {
    return Icon({
        id: "saveIcon",
        classes: ["ri-menu-line"],
        style: { 
            fontSize: "36px",
            cursor: "pointer",
        },
        onClick: async (e) => {
            console.log("Side Menu")
        },
    })
}

export { render }

