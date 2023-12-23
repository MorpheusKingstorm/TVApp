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
        for (const { show } of shows) {
            this.createShowCard(show)
        }
    }

    createShowCard = show => {
        const divCard = createDOMElement("div", "card")
        if (show["image"] && show["image"]["medium"]) {
            const img = createDOMElement("img", "card-img-top", undefined, show["image"]["medium"])
            divCard.appendChild(img)
        }

        const divCardBody = createDOMElement("div", "card-body")
        divCard.appendChild(divCardBody)

        const h5 = createDOMElement("h5", "card-title", show["name"])
        divCardBody.appendChild(h5)

        if (show["summary"]) {
            const p = createDOMElement("p", "card-text", removeHTMLTags(show["summary"]))
            divCardBody.appendChild(p)
        }

        const btn = createDOMElement("button", "btn btn-primary", "Show details")
        divCardBody.appendChild(btn)
        
        this.viewElems.showsWrapper.appendChild(divCard)
    }
}

document.addEventListener('DOMContentLoaded', new TvApp)