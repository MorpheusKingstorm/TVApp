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

        this.viewElems.searchButton.addEventListener('click', this.setCurrentNameFilter)
        document.addEventListener('keydown', this.setCurrentNameFilter)
    }

    setCurrentNameFilter = event => {
        if (event.target.dataset.showName) {
            this.selectedName = event.target.dataset.showName
        }
        else if (this.viewElems.searchInput.value && (event.key === "Enter" || event.type === "click")) {
            this.selectedName = this.viewElems.searchInput.value
        }
        
        this.fetchAndDisplayShows()
    }

    fetchAndDisplayShows = () => {
        getShowsByKey(this.selectedName).then(shows => this.renderCardsOnList(shows))
    }

    renderCardsOnList = shows => {
        Array.from(
            document.querySelectorAll("[data-show-id]")
        ).forEach(btn => btn.removeEventListener('click', this.openDetailsView))

        this.viewElems.showsWrapper.innerText = ""

        for (const { show } of shows) {
            const showCard = this.createShowCard(show, false)
            this.viewElems.showsWrapper.appendChild(showCard)
        }
    }

    openDetailsView = event => {
        const { showId } = event.target.dataset

        document.body.style.overflowY = 'hidden'

        document.addEventListener('keydown', this.closeDetailsView)
        
        getShowById(showId).then(show => {
            const showCard = this.createShowCard(show, true)
            this.viewElems.showPreview.appendChild(showCard)
            this.viewElems.showPreview.style.display = "block"
        })
    }

    closeDetailsView = event => {
        if(event.type === "click" || event.key === "Escape") {
            const { showId } = event.target.dataset
            const closeBtn = document.querySelector(`[id='showPreview'] [data-show-id='${showId}']`)
            
            closeBtn.removeEventListener('click', this.closeDetailsView)
            document.removeEventListener('keydown', this.closeDetailsView)

            document.body.style.overflowY = 'auto'
            this.viewElems.showPreview.innerText = ""
            this.viewElems.showPreview.style.display = "none"
        }
    }

    createShowCard = (show, isDetailed) => {
        const divCard = createDOMElement("div", "card")
        let img, p, btn
        const divCardBody = createDOMElement("div", "card-body")
        const divTextBody = createDOMElement("div", "card-text-body")
        const h5 = createDOMElement("h5", "card-title", show["name"])

        if (isDetailed) {
            btn = createDOMElement("button", "btn btn-danger", "Close details")
        }
        else {
            btn = createDOMElement("button", "btn btn-primary", "Show details")
        }

        if (show["image"]) {
            if(isDetailed) {
                img = createDOMElement("div", "card-preview-bg")
                img.style.backgroundImage = `url('${show["image"]["original"]}')`
            }
            else {
                img = createDOMElement("img", "card-img-top", undefined, show["image"]["medium"])
            }
        }
        else {
            if(isDetailed) {
                img = createDOMElement("div", "card-preview-bg")
                img.style.backgroundImage = `url('https://via.placeholder.com/210x295')`
            }
            else {
                img = createDOMElement("img", "card-img-top", undefined, "https://via.placeholder.com/210x295")
            }
        }

        if (show["summary"]) {
            if(isDetailed) {
                p = createDOMElement("p", "card-text", removeHTMLTags(show["summary"]).trim())
            }
            else {
                p = createDOMElement("p", "card-text", `${removeHTMLTags(show["summary"]).slice(0, 80).trim()}...`)
            }
        }
        else {
            p = createDOMElement("p", "card-text", "There is no summary for thar show yet.")
        }

        btn.dataset.showId = show.id

        if (isDetailed) {
            btn.addEventListener("click", this.closeDetailsView)
        }
        else {
            btn.addEventListener("click", this.openDetailsView)
        }

        divCard.appendChild(img)
        divCard.appendChild(divCardBody)
        divCardBody.appendChild(divTextBody)
        divTextBody.appendChild(h5)
        divTextBody.appendChild(p)
        divCardBody.appendChild(btn)
        
        return divCard
    }
}

document.addEventListener('DOMContentLoaded', new TvApp)
