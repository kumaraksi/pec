const BASE_URL = 'https://pokeapi.co/api/v2/'
let METHOD = 'get'

function getAllPokemon(url = `${BASE_URL}pokemon-species/?offset=10&limit=16`) {
    return fetch(url)
        .then((response) => response.json())
}

function getPokemon(id=1) {
    let url = `${BASE_URL}pokemon-species/${id}/`
    return fetch(url)
        .then(function (response) {
            return response.json();
        })
}

function getEvolutionChain(url) {
    // let url = `url/`
    return fetch(url)
        .then((response) => {
            return response.json();
        })
}

export {
    getAllPokemon,
    getPokemon,
    getEvolutionChain
}