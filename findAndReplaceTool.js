chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'findAndReplace') {
        let toFind = prompt("Enter text to find", "")
        if(toFind == null) {
            sendResponse({ message: 'aborted' })
            return
        }
 
        let replacementText = prompt("Enter replacement text", "")
        if(replacementText == null) {
            sendResponse({ message: 'aborted' })
            return
        }

        document.body.innerHTML = document.body.innerHTML.replaceAll(toFind, replacementText)
        sendResponse({ message: 'success' })
    }
});
