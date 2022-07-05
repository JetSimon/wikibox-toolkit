const statePaths = document.getElementsByClassName("state")[0].children

const demColorPicker = document.getElementById("dem")
const repColorPicker = document.getElementById("rep")

function componentToHex(c) {
    var hex = parseInt(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function strToRgb(s)
{
    return s.substring(4, s.length-1)
         .replace(/ /g, '')
         .split(',');
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
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

async function load()
{
    const svgToLoad = document.getElementById("loadFile")

    if(svgToLoad == null) return

    svgText = await svgToLoad.files[0].text()

    let svg = document.getElementById("bg")
    svg.outerHTML = svgText
    svg.id = "bg"

    const anyDem = document.getElementsByClassName("dem")[0]
    const anyRep = document.getElementsByClassName("rep")[0]

    const demColor = strToRgb(anyDem.style.fill)
    const repColor = strToRgb(anyRep.style.fill)

    console.log(demColor, repColor)
    
    if(anyDem) demColorPicker.value = rgbToHex(demColor[0], demColor[1], demColor[2])
    if(anyRep) repColorPicker.value = rgbToHex(repColor[0], repColor[1], repColor[2])
}

const saveButton = document.getElementById("saveButton")
saveButton.addEventListener("click", download)

const loadButton = document.getElementById("loadButton")
loadButton.addEventListener("click", load)

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

    demVotes.innerText = `${demPop} (${(demRatio * 100).toFixed(2)}%) - ${demElectors} Electoral Votes`
    repVotes.innerText = `${repPop} (${(repRatio * 100).toFixed(2)}%) - ${repElectors} Electoral Votes`
}