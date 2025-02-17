import Container from "../components/container.js"
import H4 from "../components/h4.js"
import HR from "../components/hr.js"
import Nav from "../components/nav.js"
import Card from "../components/card.js"

// @func render
const render = async () => {
    let mainContent = tibr.getElement("mainContent")

    let viewContainer = Container({
        id: "dashboardView",
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
    viewContainer.append(renderItems())

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
        id: "dashboardHeader",
        style: {
            display: "flex",
            gap: "10px",
        }
    })

    return header
}

// @func renderItems
const renderItems = () => {
    const items = getItems()

    let itemContainer = Container({
        id: "itemContainer",
        style: {
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
        },
    })

    items.forEach(item => {
        let card = Card({
            id: item.id,
            title: item.title,
            content: item.content,
            onClick: item.onClick,
            style: {
                width: "100%",
            }
        })
        itemContainer.append(card)
    })

    return itemContainer
}

// @func getItems
const getItems = () => {
    const items = []
    let i = 0

    ////////
    // Views
    ////////
    items[i] = { id: uuidv4(), title: "<h2>Views</h2>" }
    items[i].content = `
- Dashboard
- <a href="#AiChatView">AI Chat</a>
- <a href="#TibrCodeView">TIBR Code</a>
- <a href="#LabView">Lab</a>
- <a href="#ProfileView">Profile</a>
    `
    i++

    ////////
    // SideNav
    ////////
    items[i] = { id: uuidv4(), title: "Task: SideNav" }
    items[i].content = `
## SideNav
- Implement side nav (40px)
    `
    i++

    ////////
    // Defects
    ////////
    items[i] = { id: uuidv4(), title: "Task: Defects" }
    items[i].content = `
## Defects
- for any rust calls, add a callback and supply onMessage
  - implement onMessage similar to original tibr
- implement onDestroy, ensuring to clean up event listeners, etc.
    `
    i++

    ////////
    // Tibr Code View
    ////////
    items[i] = { id: uuidv4(), title: "Task: Tibr Code View" }
    items[i].content = `
## Tibr Code View
- Modify to initially just show the fileTree
- Create a Container for viewContent
- When the user hits Send:
  - Hide/Remove chatForm
  - Show chatDialog
    `
    i++

    ////////
    // Profile View
    ////////
    items[i] = { id: uuidv4(), title: "Task: Profile View" }
    items[i].content = `
## Profile View
- Dedicated view to update profile
    `
    i++

    ////////
    // Improve view dropdown display
    ////////
    items[i] = { id: uuidv4(), title: "Task: Improve view dropdown display" }
    items[i].content = `
## Improve view dropdown display

Add an attribute to viewModules that has a description to be displayed in the view dropdown
    `
    i++

    ////////
    // History View
    ////////
    items[i] = { id: uuidv4(), title: "Task: History View" }
    items[i].content = `
## History View
- Dedicated view to history management
  - Search historyItems (maybe AI driven?)
  - Delete historyItem
  - Load single historyItem into AiChatView

    `
    i++

    return items
}

// @func onMessage
const onMessage = async (message) => {
}

// @func onDestroy
const onDestroy = () => {
}

export { render, onMessage, onDestroy }
