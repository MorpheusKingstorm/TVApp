import { getShowsByKey, getShowById } from "./requests.js"
import { mapListToDOMElements, createDOMElement, removeHTMLTags } from "./DOMInteractions.js"

class TvApp {
    constructor() {
        this.viewElems = {}
        this.showNameButtons = {}
        this.selectedName = "harry"
        this.initializeApp()
    }

    initializeApp = () => {
        this.connectHTMLElements()
        this.setupListeners()
        this.fetchAndDisplayShows()
    }

    connectHTMLElements = () => {
        const listOfIds = Array
            .from(document.querySelectorAll("[id]"))
            .map(elem => elem.id)

        const listOfShowNames = Array
            .from(document.querySelectorAll("[data-show-name]"))
            .map(elem => elem.dataset.showName)

        this.viewElems = mapListToDOMElements(listOfIds, "id")
        this.showNameButtons = mapListToDOMElements(listOfShowNames, "data-show-name")
    }

    setupListeners = () => {
        Object.keys(this.showNameButtons).forEach(showName => {
            this.showNameButtons[showName].addEventListener('click', this.setCurrentNameFilter)
        })
    }

    setCurrentNameFilter = event => {
        this.selectedName = event.target.dataset.showName
        this.fetchAndDisplayShows()
    }

    fetchAndDisplayShows = () => {
        getShowsByKey(this.selectedName).then(shows => this.renderCards(shows))
    }

    renderCards = shows => {
        this.viewElems.showsWrapper.innerText = ""

        for (const { show } of shows) {
            this.createShowCard(show)
        }
    }

    createShowCard = show => {
        const divCard = createDOMElement("div", "card")
        let img, p
        const divCardBody = createDOMElement("div", "card-body")
        const h5 = createDOMElement("h5", "card-title", show["name"])
        const btn = createDOMElement("button", "btn btn-primary", "Show details")

        if (show["image"]) {
            img = createDOMElement("img", "card-img-top", undefined, show["image"]["medium"])
        }
        else {
            img = createDOMElement("img", "card-img-top", undefined, "https://via.placeholder.com/210x295")
        }

        if (show["summary"]) {
            p = createDOMElement("p", "card-text", `${removeHTMLTags(show["summary"]).slice(0, 80).trim()}...`)
        }
        else {
            p = createDOMElement("p", "card-text", "There is no summary for thar show yet.")
        }

        divCard.appendChild(img)
        divCard.appendChild(divCardBody)
        divCardBody.appendChild(h5)
        divCardBody.appendChild(p)
        divCardBody.appendChild(btn)
        
        this.viewElems.showsWrapper.appendChild(divCard)
    }
}

document.addEventListener('DOMContentLoaded', new TvApp)