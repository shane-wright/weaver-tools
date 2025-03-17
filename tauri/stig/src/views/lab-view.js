import Card from "../components/card.js"
import Container from "../components/container.js"
import Icon from "../components/icon.js"
import H4 from "../components/h4.js"
import HR from "../components/hr.js"
import Nav from "../components/nav.js"
import RecentSelector from "../components/recent-selector.js"
import TextBox from "../components/text-box.js"
import Toast from "../components/toast.js"
import UnorderedList from "../components/unordered-list.js"
import ListItem from "../components/list-item.js"

import { exportPDF, getProjectInfo, readFile } from "../managers/data-manager.js"

// @function render
// @description Renders the Lab View layout and initializes component elements.
// @returns {Promise<void>}
const render = async () => {
    let mainContent = tibr.getElement("mainContent")

    let viewContainer = Container({
        id: "labView",
        classes: ["container-fluid"],
        style: {
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden"
        },
    })

    mainContent.append(viewContainer)

    await initialize()

    viewContainer.append(renderToast())
    viewContainer.append(renderHeader())
    viewContainer.append(renderSelectFolder())
    viewContainer.append(renderProjects())

    await animate()
}

// @function initialize
// @description Initializes the lab view state or event listeners.
// @returns {Promise<void>}
const initialize = async () => {
}

// @function animate
// @description Manages animations or transitions for the lab view elements.
// @returns {Promise<void>}
const animate = async () => {
    if(tibr.data.projects.projectPath) {
        tibr.getElement("folderInput").value = tibr.data.projects.projectPath
        getProjectInfo(tibr.data.projects.projectPath, onMessage)
    }

    tibr.getElement("recentSelector").app.refreshRecents("projects")
}

// @function renderToast
// @description Renders a toast notification component.
// @returns {Object} The Toast component instance.
const renderToast = () => {
    return Toast({
        id: "toast",
    })
}

// @function renderHeader
// @description Creates the header for the lab view.
// @returns {Object} The Header container instance.
const renderHeader = () => {
    let header = Container({
        id: "labHeader",
        style: {
            display: "flex",
            gap: "10px",
            marginTop: "5px",
        }
    })

    header.append(Nav({}))
    header.append(renderRecentSelector())

    header.append(renderRefreshIcon())
    header.append(renderExportIcon())

    return header
}

// @function renderProjects
// @description Renders the projects contained in the lab view.
// @returns {Object} The Container with project listings.
const renderProjects = () => {
    let projects= Container({
        id: "projects",
        style: {
            height: "100vh",
            overflowY: "scroll",
            marginTop: "5px",
        },
    })

    return projects
}

// @function renderCard
// @description Renders a card component for project display.
// @param {Object} cardOptions - Configuration options for the card including content and diagram.
// @returns {Object} The Card component instance.
const renderCard = (cardOptions) => {
    let card = Card({
        id: "projects",
        style: {
        },
        content: cardOptions.content,
        diagram: cardOptions.diagram,
    })

    return card
}

// @function renderRecentSelector
// @description Renders the model selector component.
// @param None
// @returns HTMLElement The model selector element
const renderRecentSelector = () => {
    return RecentSelector({
        id: "recentSelector",
        onChange: (e) => {
            console.log(e.target.value)

            let projectPath = e.target.value
            tibr.getElement("folderInput").value = projectPath
            tibr.getElement("refreshIcon").click()
        }   
    })  
}

// @function renderSelectFolder
// @description Renders a component for selecting directories in lab view.
// @returns {Object} The Container for folder selection components.
const renderSelectFolder = () => {
    let selectFolderContainer = Container({
        id: "selectFolderContainer",
        style: {
            display: "flex",
            flexDirection: "row",
            alignItems: "top",
            gap: "10px",
            height: "60px",
            marginTop: "10px",
            marginBottom: "10px",
        },
    })

    let folderInput = TextBox({
        id: "folderInput",
    })

    folderInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault()
            tibr.getElement("refreshIcon").click()
        }
    })

    selectFolderContainer.append(folderInput)

    return selectFolderContainer
}

// @function renderRefreshIcon
// @description Creates an icon to trigger a folder refresh based on the value of folderInput
// @returns {Object} The Icon component for folder selection.
const renderRefreshIcon = () => {
    let refreshIconContainer = Container({
        id: "refreshIconContainer",
    })

    let refreshIcon = Icon({
        id: "refreshIcon",
        classes: ["ri-refresh-line"],
        style: { fontSize: "36px" },
        onClick: async () => {
            let projectPath = tibr.getElement("folderInput").value
            if(projectPath) {
                tibr.data.projects.projectPath = projectPath
                getProjectInfo(tibr.data.projects.projectPath, onMessage)
                tibr.getElement("recentSelector").app.refreshRecents("projects")
                tibr.getElement("recentSelector").app.selectRecent(projectPath)
            }
            else {
                tibr.getElement("toast").app.show("enter a project path")
            }
        },
    })

    refreshIconContainer.append(refreshIcon)

    return refreshIconContainer
}

// @function renderExportIcon
// @returns {Object} The Icon component for export
const renderExportIcon = () => {
    let exportIconContainer = Container({
        id: "exportIconContainer",
    })

    let exportIcon = Icon({
        id: "exportIcon",
        classes: ["ri-export-line"],
        style: { fontSize: "36px" },
        onClick: async () => {
            let projectPath = tibr.getElement("folderInput").value
            if(projectPath) {
                tibr.getElement("toast").app.show(`exporting ${projectPath}`)

                tibr.data.projects.projectPath = projectPath
                exportPDF(tibr.data.projects.projectPath, onMessage)
            }
            else {
                tibr.getElement("toast").app.show("enter a project path")
            }
        },
    })

    exportIconContainer.append(exportIcon)

    return exportIconContainer
}
// @function renderDirectoryList
// @returns {Object} The directoryList element
const renderDirectoryList = (directories) => {
    let directoryList = Container({
        id: "directoryList",
        style: {
            marginBottom: "10px",
        },
    })

    let parentDirectory = Container({
        id: "parentDirectory",
        style: {
            color: "cyan",
            border: "1px solid",
            borderRadius: "4px",
            borderColor: "#777777",
            margin: "2px",
            padding: "2px",
            paddingLeft: "10px",
        },
        onClick: (event) => {
            event.preventDefault()

            let folderInput = tibr.getElement("folderInput")
            let directory = folderInput.value

            let parts = directory.split("/")
            parts.pop()

            let parentDirectory = parts.join('/')

            folderInput.value = parentDirectory

            tibr.getElement("refreshIcon").click()
        },
    })

    parentDirectory.append("..")

    parentDirectory.addEventListener("mouseenter", () => {
        parentDirectory.style.borderColor = "#FFFFFF"
    });

    parentDirectory.addEventListener("mouseleave", () => {
        parentDirectory.style.borderColor = "#777777"
    })

    directoryList.append(parentDirectory)

    for(let directory of directories) {
        let directoryItem = Container({
            style: {
                color: "cyan",
                border: "1px solid",
                borderRadius: "4px",
                borderColor: "#777777",
                margin: "2px",
                padding: "2px",
                paddingLeft: "10px",
            },
            onClick: (event) => {
                event.preventDefault()

                let folderInput = tibr.getElement("folderInput")
                folderInput.value += `/${directory}`

                tibr.getElement("refreshIcon").click()
            },
        })

        directoryItem.addEventListener("mouseenter", () => {
            directoryItem.style.borderColor = "#FFFFFF"
        });

        directoryItem.addEventListener("mouseleave", () => {
            directoryItem.style.borderColor = "#777777"
        })

        directoryItem.append(directory)

        directoryList.append(directoryItem)
    }

    return directoryList
}

// @function onMessage
// @description Processes incoming messages and updates the view based on message topic.
// @param {Object} message - The message object with topic and content data.
const onMessage = async (message) => {
    if(message.topic === "readFileResponse") {
        let extension = tibr.getFileExtension(message.data.name)

        switch(extension) {
            case "md":
                tibr.getElement("projects").append(renderCard({ content: message.data.content }))
                break;
            case "mmd":
                tibr.getElement("projects").append(renderCard({ diagram: message.data.content }))
                mermaid.run()
                break;
        }
    }

    if(message.topic === "getProjectInfoResponse") {
        let projects = tibr.getElement("projects")
        projects.innerHTML = ""

        projects.append(renderDirectoryList(message.data.directories))

        for(let file of message.data.files) {
            await readFile(`${tibr.data.projects.projectPath}/${file}`, onMessage)
        }
    }

    if(message.topic === "exportPDFResponse") {
        tibr.getElement("toast").app.show(`${message.status} ${message.pdfPath}`, 4000)
    }
}

export { render }

