chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./textColorTool.js", "./findAndReplaceTool.js", "./clearVisitedLinks.js", "./infoboxShortcuts.js"]
        })
            .then(() => {
                console.log("INJECTED TOOLING SCRIPTS.");
            })
            .catch(err => console.log("ERROR INJECTING TOOLING SCRIPTS: ", err))
    }
})

const colors = ['red', 'blue', 'pink', 'yellow', 'green', 'black']

chrome.contextMenus.create({
    id: `text-color`,
    title: `Change selected text color to...`,
    contexts: ['page', 'selection', 'selection', 'link']
})

chrome.contextMenus.create({
    id: `find-and-replace`,
    title: `Find and replace`,
    contexts: ['page', 'selection', 'selection', 'link']
})

chrome.contextMenus.create({
    id: `clear-visited-links`,
    title: `Clear visited links`,
    contexts: ['page', 'selection', 'selection', 'link']
})

chrome.contextMenus.create({
    id: `infobox-shortcuts`,
    title: `Infobox shortcuts...`,
    contexts: ['page', 'selection', 'selection', 'link']
})

chrome.contextMenus.create({
    id: `add-column-to-table`,
    parentId: `infobox-shortcuts`,
    title: `Add a column to table`,
    contexts: ['page', 'selection', 'selection', 'link']
})

chrome.contextMenus.create({
    id: `remove-column-from-table`,
    parentId: `infobox-shortcuts`,
    title: `Remove a column from table`,
    contexts: ['page', 'selection', 'selection', 'link']
})

for(let i = 0; i < colors.length; i++) {
    chrome.contextMenus.create({
        id: `text-color-${i}`,
        parentId: 'text-color',
        title: colors[i],
        contexts: ['page', 'selection', 'selection', 'link']
    })
}

function contextClick(info, tab) {
    const { menuItemId } = info

    if (menuItemId.includes("text-color-")) {
        const color = colors[parseInt(menuItemId.split("text-color-")[1])];
        chrome.tabs.sendMessage(tab.id, {"message":"textColorClicked", "color":color}, function (response) {})
    }
    else if (menuItemId == "find-and-replace") {
        chrome.tabs.sendMessage(tab.id, {"message":"findAndReplace"}, function (response) {})
    }
    else if (menuItemId == "clear-visited-links") {
        chrome.tabs.sendMessage(tab.id, {"message":"clearVisitedLinks"}, function (response) {})
    }
    else if (menuItemId == "add-column-to-table") {
        chrome.tabs.sendMessage(tab.id, {"message":"addColumnToTable"}, function (response) {})
    }
    else if (menuItemId == "remove-column-from-table") {
        chrome.tabs.sendMessage(tab.id, {"message":"removeColumnfromTable"}, function (response) {})
    }
}

chrome.contextMenus.onClicked.addListener(contextClick)