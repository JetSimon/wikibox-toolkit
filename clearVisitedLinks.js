chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'clearVisitedLinks') {
        const visitedLinks = document.querySelectorAll("a")
        for(let i = 0; i < visitedLinks.length; i++) {
            let link = visitedLinks[i]
            link.style.color = "#0645ad";
        }
    }
});
