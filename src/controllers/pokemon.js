import {
    Pokemon
} from '../models/pokemon'
import { 
    getAllPokemon,
    getPokemon,
    getEvolutionChain
} from '../api'

let chain = {};

/**
 * Get paginated list of pokemon
 * limit = 20;
 * @param {*} url 
 */
function getPokemonList(url) {
    showLoader();
    getAllPokemon(url).then((response) => {
        localStorage.setItem('pokemonListData', JSON.stringify(response))
        renderPokemonGrid(response);
    }).catch((err) => {
        console.error(err)
    })
}

/**
 *Show loader when pokemon list is being called
 */
function showLoader(){
    let loader = document.getElementById('loader')
    loader.classList.remove('hidden')
}

/**
 *Hide loader on successful completing of API call
 */
function hideLoader(){
    let loader = document.getElementById('loader')
    loader.classList.add('hidden')
}

/**
 * get information of selected Pokemon
 * @param {*} id 
 */
function getSelectedPokemon(id) {
    // document.getElementById('app').innerHTML = 'Loading'
    id = Number.parseInt(id);
    getPokemon(id).then((response) => {
        getEvolutionChain(response.evolution_chain.url).then(response => {
            const pokemonEvolutionData = setEvolutionChainData(response);
            let pokemonArray = {}
            pokemonArray.results = Object.values(pokemonEvolutionData)            
            renderPokemonGrid(pokemonArray,'evolutionCHain',true);
        })
    })
}

/**
 * generic function to render the grid
 * @param {*} gridData 
 * @param {*} localStorageKey 
 * @param {*} repaintGrid 
 */
function renderPokemonGrid(gridData,localStorageKey,repaintGrid=false) {
    document.getElementById('app').innerHTML = ''
    localStorageKey = localStorageKey ? localStorageKey : 'pokemonListData'
    gridData = gridData ? gridData : JSON.parse(localStorage.getItem(localStorageKey))
    let html = '';
    for (const item of gridData.results) {
        let poke = new Pokemon(item);
        html += poke.getRenderTemplate()
    }
    hideLoader();
    const parent = `<div class="container is-fluid">
                            <div class="columns is-multiline">
                                ${html}
                            </div>    
                        </div>`;
    document.getElementById('app').innerHTML += parent;
}

/**
 * get the pokemon species in the evolution chain 
 * @param {*} evolutionChain 
 */
function generateEvolutionDiagram(evolutionChain) {
    var len = evolutionChain.evolves_to.length;
    if (len === 0) {
        chain[evolutionChain.species.name] = evolutionChain.species;
    } else if (evolutionChain.species.name in chain) {
        return
    } else {
        for (var i = 0; i < len; i++) {
            chain[evolutionChain.species.name] = evolutionChain.species;
            var pokemonEvolution = evolutionChain.evolves_to[i]
            generateEvolutionDiagram(pokemonEvolution)
        }
    }
}

/**
 * Generate evolution chain
 * @param {*} response 
 */
function setEvolutionChainData(response){
    chain = {};
    generateEvolutionDiagram(response.chain);
    return chain;
}

/**
 * Export only those functions which need to be made public
 */
export const PokemonController = {
    getPokemonList: getPokemonList,
    renderPokemonGrid: renderPokemonGrid,
    getSelectedPokemon: getSelectedPokemon,
    setEvolutionChain: setEvolutionChainData,
}