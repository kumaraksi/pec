export class Pokemon {
    
    constructor(poke = {}) {
        this.name = poke.name
        this.url = poke.url
        this.id = this.generateId(this.url)
    }
    
    generateId() {
        var splitUrl = this.url.split('/') //"https://pokeapi.co/api/v2/pokemon-species/1/"
        let len = splitUrl.length
        return splitUrl[len - 2]
    }
    
    getRenderTemplate() {
        return `<div class="column is-one-quarter">
                    <div class="card pokemon">
                        <div class="card-content">
                            <div class="content">
                                <a href="#" class="is-size-4 has-text-info">${this.name}</a>
                                <br>
                            </div>
                        </div>
                        <footer class="card-footer">
                            <div class="columns">
                                <div class="column">
                                    <button class="button is-success is-small is-outlined show-evolution-chain" data-id="${this.id}" id="evolutionBtn-${this.id}">Show Evolution Chain</button>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>`
    }

    
}