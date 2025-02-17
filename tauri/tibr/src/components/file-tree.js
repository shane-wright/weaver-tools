/**
 * FileTree Component
 * Renders a directory tree view with selectable entries.
 * @param {Object} options - Configuration options for the file tree.
 * @param {Array} options.files - List of files and directories to display.
 * @returns {HTMLElement} The created file tree element.
 */

import Container from "./container.js"
import Input from "./input.js"

// @func FileTree
export default function FileTree(options) {
    let tree = Container({
        id: options.id,
        style: {
            overflowY: "auto",
        }
    })

    // Assign the id if provided.
    if (options.id) {
        tree.id = options.id
    }

    // Add the specified classes if provided.
    if (options.classes) {
        for (let className of options.classes) {
            tree.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if (options.style) {
        Object.assign(tree.style, options.style)
    }

    // Set the label text if provided.
    if (options.label) {
        button.textContent = options.label
    }

    let treeApp = {
        id: options.id,
        refreshTree: (files) => { refreshTree(tree, files) },
        getSelected: () => { return getSelected() },
    }

    tree.app = treeApp

    return tree
}

// @func refreshTree
function refreshTree(tree, files) {
    if (tree) {
        tree.innerHTML = ""

        if (files && files.length > 0) {
            renderFileTree(files)
        }
    }
}

// @func getSelected
function getSelected() {
    const selected = []
    const folders = document.querySelectorAll("[id$='-title']")

    folders.forEach(folder => {
        const checkboxes = folder.parentElement.app.checkboxes
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                let projectPath = checkbox.app.getProjectPath()
                let fileName = checkbox.app.getFileName()

                selected.push(`${tibr.data.code.projectPath}/${projectPath}${fileName}`)
            }
        })
    })

    return selected
}

// @func setSelected
function setSelected() {
    const selected = {}
    const folders = document.querySelectorAll("[id$='-title']")

    if(tibr.data.code.selectedFiles.length > 0) {
        for(let file of tibr.data.code.selectedFiles) {
            selected[file.name] = true
        }
    }

    folders.forEach(folder => {
        const checkboxes = folder.parentElement.app.checkboxes
        checkboxes.forEach(checkbox => {
            let checkboxFileName = checkbox.app.getFileName()
            if(selected[checkboxFileName]) {
                checkbox.checked = true
            }
        })
    })

    return selected
}

// @func renderFileTree
function renderFileTree(files) {
    let tree = {}

    files.sort()

    for(const file of files) {
        const [projectPath, fileName] = file.split('/').reduce((acc, part, index, arr) => {
            if (index === arr.length - 1) {
                acc[1] = part
            } else {
                acc[0] += `${part}/`
            }
            return acc
        }, ['', ''])

        const directoryCount = projectPath.split('/').filter(part => part.length > 0).length

        if(! tree[projectPath]) {
            tree[projectPath] = []
        }

        tree[projectPath].push(fileName)
    }

    for (const projectPath in tree) {
        let folder = Container({
            id: projectPath,
            style: {
                marginBottom: "20px",
            },
        })

        folder.app = {
            checkboxes: [],
        }


        let projectPathTitle = Container({
            id: `${projectPath}-title`,
        })

        let folderCheckbox = Input({
            id: `${projectPath}-checkbox`,
            type: "checkbox",
        })

        folderCheckbox.addEventListener('change', (event) => {
            folder.app.checkboxes.forEach(checkbox => {
                checkbox.checked = event.target.checked
            })
        })

        projectPathTitle.append(folderCheckbox)
        projectPathTitle.append(projectPath)

        folder.append(projectPathTitle)

        let fileNames = tree[projectPath]
        for(let i = 0; i < fileNames.length; i++) {
            let fileName = fileNames[i]

            let fileContainer = Container({
                id: `${fileName}-container`,
                style: {
                    marginLeft: "40px",
                    display: "flex",
                    alignItems: "center",
                }
            })

            let checkbox = Input({
                id: `${fileName}-checkbox`,
                type: "checkbox",
                classes: [ `${projectPath}-checkbox-item` ]
            })

            checkbox.app = {
                getProjectPath: () => { return projectPath }, 
                getFileName: () => { return fileName }, 
            }

            fileContainer.append(checkbox)
            folder.app.checkboxes.push(checkbox)

            let fileNameContainer = Container({
                id: fileName,
            })

            fileNameContainer.append(fileName)

            fileContainer.append(fileNameContainer)

            folder.append(fileContainer)
        }

        tibr.getElement("fileTree").append(folder)
        setSelected()
    }
}

