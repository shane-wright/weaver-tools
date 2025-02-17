import Button from "../components/button.js"
import Container from "../components/container.js"
import FileTree from "../components/file-tree.js"
import HR from "../components/hr.js"
import Icon from "../components/icon.js"
import SelectFolder from "../components/select-folder.js"
import TextBox from "../components/text-box.js"
import Toast from "../components/toast.js"

import { getSourceCode, readFile } from "../managers/data-manager.js"

// @func render
const render = async () => {
    let mainContent = tibr.getElement("mainContent")

    let viewContainer = Container({
        id: "tibrCodeView",
        classes: ["container-fluid"],
        style: {
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden"
        }
    })

    viewContainer.app = {
        fileProcessCount: 0
    }

    mainContent.append(viewContainer)

    await initialize()

    viewContainer.append(renderToast())
    viewContainer.append(renderHeader())
    viewContainer.append(renderSelectFolder())
    viewContainer.append(renderFileTree())
    viewContainer.append(Button({
        id: "",
        label: "Attach",
        style: {
            marginBottom: "20px",
            marginLeft: "40px",
            marginRight: "40px",
        },
        onClick: () => {
            let fileTree = tibr.getElement("fileTree")
            let files = fileTree.app.getSelected()

            if(files && files.length > 0) {
                tibr.data.code.selectedFiles = []

                let tibrCodeView = tibr.getElement("tibrCodeView")
                tibrCodeView.app.fileProcessCount = files.length

                for(let file of files) {
                    readFile(file, onMessage)
                }
            }
            else {
                tibr.getElement("toast").app.show("No files selected.")
            }
        },
    }))

    await animate()
}

// @func initialize
const initialize = async () => {
    tibr.data.code.projectPath = "/Users/developer/workspace/vibe/tibr"
}

// @func animate
const animate = async () => {
    if(tibr.data.code.projectPath) {
        tibr.getElement("selectFolderInput").value = tibr.data.code.projectPath

        getSourceCode(tibr.data.code.projectPath, onMessage)
    }
}

// @func renderToast
const renderToast = () => {
    return Toast({
        id: "toast",
    })
}

// @func renderHeader
const renderHeader = () => {
    let header = Container({
        id: "header",
        style: {
            display: "flex",
            gap: "10px",
            marginTop: "5px",
        }
    })  

    header.append(renderBackIcon())

    return header
}

// @func renderBackIcon
const renderBackIcon = () => {
    return Icon({
        id: "backIcon",
        classes: ["ri-arrow-left-line"],
        style: { fontSize: "36px" },
        onClick: async () => {
            tibr.render("AiChatView")
        },
    })
}

// @func renderSelectFolder
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
            marginLeft: "40px",
            marginRight: "40px",
        }
    })

    let selectFolderInput = TextBox({
        id: "selectFolderInput",
    })

    selectFolderContainer.append(selectFolderInput)

    let selectFolderButton = Button({
        id: "selectFolderButton",
        label: "Get Files",
        style: {
            width: "200px",
        },
        onClick: async () => {
            let projectPath = tibr.getElement("selectFolderInput").value
            tibr.data.code.projectPath =  projectPath

            getSourceCode(tibr.data.code.projectPath, onMessage)
        },
    })

    selectFolderContainer.append(selectFolderButton)

    return selectFolderContainer
}

// @func renderFileTree
const renderFileTree = () => {
    return FileTree({
        id: "fileTree",
        files: tibr.data.code.files,
        style: {
            height: "100vh",
            marginTop: "20px",
            marginBottom: "20px",
            marginLeft: "40px",
            marginRight: "40px",
        },
    })
}

// @func onMessage
const onMessage = async (message) => {
    if(message.topic === "getSourceCodeResponse") {
        tibr.data.code.files = message.files
        tibr.getElement("fileTree").app.refreshTree(tibr.data.code.files)
    }

    if(message.topic === "readFileResponse") {
        let tibrCodeView = tibr.getElement("tibrCodeView")

        tibr.data.code.selectedFiles.push(message.data)

        tibrCodeView.app.fileProcessCount--

        if(tibrCodeView.app.fileProcessCount <= 0) {
            tibr.render("AiChatView")
        }
    }
}

// @func onDestroy
const onDestroy = () => {
}

export { render, onMessage, onDestroy }

