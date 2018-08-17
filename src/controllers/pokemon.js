import {
    Pokemon
} from '../models/pokemon'
import { 
    getAllPokemon,
    getPokemon,
    getEvolutionChain
} from '../api'

let chain = {};

function getPokemonList(url) {
    showLoader();
    getAllPokemon(url).then((response) => {
        localStorage.setItem('pokemonListData', JSON.stringify(response))
        renderPokemonGrid(response);
    }).catch((err) => {
        console.error(err)
    })
}
function showLoader(){
    let loader = document.getElementById('loader')
    loader.classList.remove('hidden')
}
function hideLoader(){
    let loader = document.getElementById('loader')
    loader.classList.add('hidden')
}

// function getPokemonList(offset, limit) {
//     document.getElementById('app').innerHTML = 'Loading'
//     getAllPokemon(offset, limit).then((response) => {
//         localStorage.setItem('pokemonListData', JSON.stringify(response))
//         renderPokemonGrid(response);
//     }).catch((err) => {
//         console.error(err)
//     })
// }

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

function setEvolutionChainData(response){
    chain = {};
    generateEvolutionDiagram(response.chain);
    return chain;
}

export const PokemonController = {
    getPokemonList: getPokemonList,
    renderPokemonGrid: renderPokemonGrid,
    getSelectedPokemon: getSelectedPokemon,
    setEvolutionChain: setEvolutionChainData,
}