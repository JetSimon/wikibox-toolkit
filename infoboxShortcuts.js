chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'addColumnToTable') {
        const infobox = document.getElementsByClassName("infobox-full-data")[0]
        const rows = infobox.children[0].children[0].children
        for (let i = 0; i < rows.length; i++) {

            let row = rows[i]
            
            let toDuplicate = row.children[row.children.length-1]
            duplicate = toDuplicate.cloneNode(true)

            if (toDuplicate.innerHTML.trim() == '')
            {
                let extraSpace = row.children[row.children.length-1]
                duplicate = row.children[row.children.length-2].cloneNode(true)
                row.removeChild(extraSpace)
                row.appendChild(duplicate)
                row.appendChild(extraSpace)
            }
            else
            {
                row.appendChild(duplicate)
            }

            sizeImagesBasedOnNumber(row.children, true)
        }
    }else if (request.message === 'removeColumnfromTable') {
        const infobox = document.getElementsByClassName("infobox-full-data")[0]
        const rows = infobox.children[0].children[0].children

        if (rows.length < 2) return

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            console.log(row.children)
            let toRemove = row.children[row.children.length-1]
            row.removeChild(toRemove)
            if (toRemove.innerHTML.trim() == "")
            {
                row.removeChild(row.children[row.children.length-1])
            }
       
            sizeImagesBasedOnNumber(row.children, false)
        }
    }
});

function sizeImagesBasedOnNumber(children, adding)
{
    for (let i = 0; i < children.length; i++) {
        let child = children[i]
        if(child == null || child.childCount < 1 || child.nodeName != "TD") continue
        let a = child.children[0]
        if(a == null || a.childCount < 1 || a.nodeName != "A") continue
        let img = a.children[0]
        if(img == null || img.nodeName != "IMG") continue
        
        const multiplier = adding ?  1.0 / 1.2 : 1.2
        img.width *= multiplier
        img.height *= multiplier
    }
}