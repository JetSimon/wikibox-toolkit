let target = null

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.message === 'textColorClicked') {
        console.log("trying to change to", request.color)

        const selection = document.getSelection()
        const selectedText = selection.toString()

        if(selectedText == '')
        {
            console.log(target)
            target.style.color = request.color
            target.style.borderColor = request.color
            return
        } 

        if(selection.anchorNode.parentElement.innerText.trim() == selectedText.trim() && selection.anchorNode.parentElement.style.color != 'black')
        {
            selection.anchorNode.parentElement.style.color = request.color
            return
        }

        let newInnerHtml = selection.anchorNode.parentElement.innerHTML.replace(selectedText, `<span style="color:${request.color}">${selectedText}</span>`)
        selection.anchorNode.parentElement.innerHTML = newInnerHtml;
        sendResponse({ message: 'text color changed' })
    }

    sendResponse({ message: 'no item clicked' })
});

document.addEventListener("contextmenu", function(event){
    target = event.target;
}, true);