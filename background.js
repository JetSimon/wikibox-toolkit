chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./textColorTool.js"]
        })
            .then(() => {
                console.log("INJECTED TOOLING SCRIPTS.");
            })
            .catch(err => console.log("ERROR INJECTING TOOLING SCRIPTS: ", err))
    }
})

const colors = ['red', 'blue', 'pink', 'yellow', 'green']

for(let i = 0; i < colors.length; i++) {
    chrome.contextMenus.create({
        id: `text-color-${i}`,
        title: `Change selected text color to ${colors[i]}`,
        contexts: ['page', 'selection', 'selection', 'link']
    })
}


function contextClick(info, tab) {
    const { menuItemId } = info

    if (menuItemId.includes("text-color-")) {
        const color = colors[parseInt(menuItemId.split("text-color-")[1])];
        chrome.tabs.sendMessage(tab.id, {"message":"textColorClicked", "color":color}, function (response) {})
    }
}

chrome.contextMenus.onClicked.addListener(contextClick)