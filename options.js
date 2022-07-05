const statePaths = document.getElementsByClassName("state")[0].children

const demColorPicker = document.getElementById("dem")
const repColorPicker = document.getElementById("rep")

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
  

for(let i = 0; i < statePaths.length; i++) {
    let state = statePaths[i]
    state.addEventListener("click", setColor)
}

document.addEventListener("click", clickBody)

demColorPicker.addEventListener("change", updateAllOfType)
repColorPicker.addEventListener("change", updateAllOfType)

function setColor() {
    resetSelectedText()
   
    if(this.classList.length == 0) this.classList.add("rep")

    const dem = this.classList.contains("dem")
    if(dem) {
        this.classList.replace("dem", "rep")
        this.style.fill = repColorPicker.value
    } else {
        this.classList.replace("rep", "dem")
        this.style.fill = demColorPicker.value
    }

    calculateVotes()
}

function updateAllOfType() {
    const ofType = document.getElementsByClassName(this.id)
    console.log(this.id)
    for(let i = 0; i < ofType.length; i++) {
        let element = ofType[i]
        if(element == this) return
        element.style.fill = this.value
    }
}

let selectedText = null
const textElements = document.querySelectorAll("text");

for(let i = 0; i < textElements.length; i++) {
    let text = textElements[i]
    text.addEventListener("click", () => {
        if(selectedText == text) return
        selectedText = text
        text.innerHTML += '|'
        text.style.fill = 'green'
    })
}

document.addEventListener("keyup", function(event) {
    if (event.key === "Return" || event.key === "Enter") {
        resetSelectedText()
        calculateVotes()
        return
    }

    if(event.key === "Backspace" || event.key === "Delete") {
        selectedText.innerHTML = selectedText.innerHTML.replace('|','')
        selectedText.innerHTML = selectedText.innerHTML.slice(0, -1)
        if(selectedText.innerHTML === '') selectedText.innerHTML = '_'
        return
    }

    if(selectedText && (event.key.length == 1 || event.key == "Space")) {
        if(selectedText.innerHTML === "_" || selectedText.innerHTML === "_|") selectedText.innerHTML = ''
        selectedText.innerHTML = selectedText.innerHTML.replace('|','')
        selectedText.innerHTML += event.key + '|';
    }
});

function resetSelectedText() {
    if(!selectedText) return
    selectedText.style.fill = 'black'
    selectedText.innerHTML = selectedText.innerHTML.replace('|','')
    selectedText = null
}

function clickBody(event) {
    if(event.target === document.body || event.target.id === 'bg')
        resetSelectedText()
}

function svgDataURL(svg) {
    var svgAsXML = (new XMLSerializer).serializeToString(svg);
    return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
}

function download() {
    var dl = document.createElement("a");
    document.body.appendChild(dl); // This line makes it work in Firefox.
    const dataURL = svgDataURL(document.getElementById("bg"))
    dl.setAttribute("href", dataURL);
    dl.setAttribute("download", "test.svg");
    dl.click();
}

const saveButton = document.getElementById("saveButton")
saveButton.addEventListener("click", download)

const calculateButton = document.getElementById("calculate")
calculateButton.addEventListener("click", calculateVotes)

const totalPop = document.getElementById("totalpop")
const demVotes = document.getElementById("demvotes")
const repVotes = document.getElementById("repvotes")

function calculateVotes() {
    let demElectors = 0
    let repElectors = 0

    const textElements = document.querySelectorAll("text")
    for(let i = 0; i < textElements.length; i++)
    {
        let text = textElements[i]
        let textNumber = parseInt(text.innerHTML.trim())
        let associatedState = document.getElementById(text.id.split('n')[0])
        if(text.id.endsWith('n') && associatedState && textNumber) {
            if(associatedState.classList.contains("dem"))
            {
                demElectors += textNumber
            }
            else if(associatedState.classList.contains("rep"))
            {
                repElectors += textNumber
            }
        }
    } 

    let totalElectors = demElectors + repElectors
    if(totalElectors == 0) totalElectors = 1

    const demRatio = demElectors / totalElectors
    const repRatio = repElectors / totalElectors

    const demPop = Math.round(demRatio * parseInt(totalPop.value))
    const repPop = Math.round(repRatio * parseInt(totalPop.value))

    demVotes.innerText = `${demPop} (${(demRatio * 100).toFixed(2)}%) - ${demElectors} Seats`
    repVotes.innerText = `${repPop} (${(repRatio * 100).toFixed(2)}%) - ${repElectors} Seats`
}