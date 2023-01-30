const demColorPicker = document.getElementById("dem")
const repColorPicker = document.getElementById("rep")
const indColorPicker = document.getElementById("ind")

let selectedText = null

let selectingMove = false
let selectedMoveText = null

let svg = document.getElementById("bg")
let pt = svg.createSVGPoint();

let foundAnyInd = false;

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
  

function initializeStates()
{
    const statePaths = getAllStates()
    for(let i = 0; i < statePaths.length; i++) {
        let state = statePaths[i]
        state.addEventListener("click", setColor)
    }
}

function initialize()
{
    initializeStates()
    initializeText()
}

initialize()


document.addEventListener("click", clickBody)

demColorPicker.addEventListener("change", updateAllOfType)
repColorPicker.addEventListener("change", updateAllOfType)
indColorPicker.addEventListener("change", updateAllOfType)

function setColor() {
    resetSelectedText()
   
    if(this.classList.length == 0) this.classList.add("dem")

    const dem = this.classList.contains("dem")
    const rep = this.classList.contains("rep")
    const ind = this.classList.contains("ind")

    if(dem) {
        this.classList.replace("dem", "rep")
        this.style.fill = repColorPicker.value
    } else if(rep) {
        if(foundAnyInd)
        {
            this.classList.replace("rep", "ind")
            this.style.fill = indColorPicker.value
        }
        else
        {
            this.classList.replace("rep", "dem")
            this.style.fill = demColorPicker.value
        }
    }
    else if(foundAnyInd && ind) {
        this.classList.replace("ind", "dem")
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

function initializeText()
{
    const textElements = document.querySelectorAll("text")
    selectedText = null

    for(let i = 0; i < textElements.length; i++) {
        let text = textElements[i]
        text.style.userSelect = 'none'
        text.addEventListener("click", () => {

            if(selectedText == text || selectingMove) return
            selectedMoveText = null
            resetSelectedText()
            selectedText = text
            text.innerHTML += '|'
            text.style.fill = 'green'
        })

        text.addEventListener("mousedown", (event) => {
            if(selectingMove)
            {
                console.log("moving" + text)
                selectedMoveText = text
            }
        })
    }
}

document.addEventListener("mousemove", (event) => {
    if(selectedMoveText == null || !selectingMove) {
        selectedMoveText = null
        return
    }

    pt.x = event.clientX;
    pt.y = event.clientY;
    var cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());

    selectedMoveText.setAttribute('x', cursorpt.x)
    selectedMoveText.setAttribute('y', cursorpt.y)
})

document.addEventListener("mouseup", (event) => {
    selectedMoveText = null
})

function getAllStates() {
    let states = []
    
    const stateGroups = document.getElementsByClassName("state")
    for(let j = 0; j < stateGroups.length; j++) {
        const statePaths = stateGroups[j].children
        for(let i = 0; i < statePaths.length; i++) {
            states.push(statePaths[i])
        }
    }

    return states
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Alt") {
        selectingMove = true
    }
});

document.addEventListener("keyup", function(event) {

    if (event.key === "Alt") {
        selectingMove = false
    }

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

    if(svgToLoad.files.length == 0) return

    svgText = await svgToLoad.files[0].text()

    if(svgText == null) return

    svg.outerHTML = svgText
    document.querySelector("svg").id = "bg"
    svg = document.getElementById("bg")
    svg.classList.add("shadow")
    svg.classList.add("outlined")
    pt = svg.createSVGPoint();

    const anyDem = document.getElementsByClassName("dem")[0]
    const anyRep = document.getElementsByClassName("rep")[0]
    const anyInd = document.getElementsByClassName("ind")[0]

    if(anyDem && anyRep) {
        const demColor = strToRgb(anyDem.style.fill)
        const repColor = strToRgb(anyRep.style.fill)
        
        demColorPicker.value = rgbToHex(demColor[0], demColor[1], demColor[2])
        repColorPicker.value = rgbToHex(repColor[0], repColor[1], repColor[2])
    }

    const demSquare = document.getElementById("Dem")
    const repSquare = document.getElementById("Rep")
    const indSquare = document.getElementById("Ind")

    if(demSquare && repSquare) {
        demSquare.classList.add("dem")
        repSquare.classList.add("rep")
        if(indSquare) {
            indSquare.classList.add("ind")
        }

        setPartyBasedOnColor(demSquare.getAttribute("fill"), repSquare.getAttribute("fill"), indSquare?.getAttribute("fill"))
    }

    initialize()
    resetSliders()
    calculateVotes()

    foundAnyInd = indSquare != null
}

function setPartyBasedOnColor(demColor, repColor, indColor = null) {
    const statePaths = getAllStates()
    for(let i = 0; i < statePaths.length; i++) {
        let state = statePaths[i]
        const rawStateColor = strToRgb(getComputedStyle(state).fill)
        const stateColor = rgbToHex(rawStateColor[0], rawStateColor[1], rawStateColor[2]).toUpperCase()
        if(state.classList.contains("dem") || state.classList.contains("rep")) continue
        if(stateColor == demColor) state.classList.add("dem")
        else if(stateColor == repColor) state.classList.add("rep")
        else if(indColor != null && stateColor == indColor) state.classList.add("ind")
    }
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
    let demPopFactor = 0
    let repPopFactor = 0

    const textElements = document.querySelectorAll("text")
    for(let i = 0; i < textElements.length; i++)
    {
        let text = textElements[i]
        let associatedState = document.getElementById(text.id.split('n')[0])

        if(associatedState == null)
        {
            continue
        }

        let textNumber = parseInt(text.innerHTML.replace(associatedState.id, '').trim())

        if(textNumber == null)
        {
            continue
        }

        if(text.id.endsWith('n') && associatedState && textNumber) {
            let weight = 1
            let weightSlider = document.getElementById(associatedState.id + "_slider")
            if(weightSlider)
            {
                weight = weightSlider.value / 100
            }
            if(associatedState.classList.contains("dem"))
            {
                demElectors += textNumber 
                demPopFactor += textNumber * weight
                repPopFactor += textNumber * (1 - weight)
            }
            else if(associatedState.classList.contains("rep"))
            {
                repElectors += textNumber
                repPopFactor += textNumber * weight
                demPopFactor += textNumber * (1 - weight)
            }
        }else{
            console.log("could not tally for text with id " + text.id + " associatedState " + associatedState.id + " and number " + text.innerText)
        }
    } 

    let totalElectors = demElectors + repElectors
    if(totalElectors == 0) totalElectors = 1

    let totalPopFactor = demPopFactor + repPopFactor
    if(totalPopFactor == 0) totalPopFactor = 1

    const demRatio = demPopFactor / totalPopFactor
    const repRatio = repPopFactor / totalPopFactor

    const demPop = Math.round(demRatio * parseInt(totalPop.value))
    const repPop = Math.round(repRatio * parseInt(totalPop.value))

    demVotes.innerText = `${demPop} (${(demRatio * 100).toFixed(2)}%) - ${demElectors} Electoral Votes`
    repVotes.innerText = `${repPop} (${(repRatio * 100).toFixed(2)}%) - ${repElectors} Electoral Votes`
}