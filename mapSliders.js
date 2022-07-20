let details = document.createElement("details")
let summary = document.createElement("summary")
details.style.marginTop = "10px"
summary.innerHTML = "Voting Proportion Sliders"
details.appendChild(summary)
document.getElementById("mainDiv").appendChild(details)

let sliderParent

function initializeSliders() {
    const states = getAllStates()
    console.log("making " + states.length + " sliders")
    for(let i = 0; i < states.length; i++) {
        const li = document.createElement("li")
        li.style.marginBottom = "10px"
        const value = document.createElement("span")
        const label = document.createElement("span")
        const slider = document.createElement("input")
        
        label.innerHTML = states[i].id
        label.style.marginRight = "3px"

        slider.type = "range"
        slider.min = "0"
        slider.max = "100"
        slider.value = "50"
        slider.id = states[i].id + "_slider"
        slider.oninput = function() {
            value.innerHTML = `${slider.value}% (${states[i].classList[0]})`
            calculateVotes()
        }
        value.innerHTML = `${slider.value}% (${states[i].classList[0]})`

        li.appendChild(label)
        li.appendChild(slider)
        li.appendChild(value)
        
        sliderParent.appendChild(li)
    }
}

function resetSliders() {
    if(sliderParent)
        sliderParent.remove()
    sliderParent = document.createElement("ul")
    sliderParent.style.listStyle = "none"
    sliderParent.style.marginLeft = "0px"
    sliderParent.style.paddingLeft = "5px"
    details.appendChild(sliderParent)
    initializeSliders()
}

resetSliders()