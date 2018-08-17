import  './styles/style.scss';

import './controllers/pokemon'
import { PokemonController } from './controllers/pokemon';

let offset = 0;
const limit = 20;
let listMode = true;
document.addEventListener("DOMContentLoaded",function(){

    //here code
    
    if(localStorage.getItem('pokemonListData')){
      PokemonController.renderPokemonGrid()
    }else{
      PokemonController.getPokemonList();
    }

    document.getElementById('app').addEventListener('click',function(evt){
      if(evt.target.className.indexOf('show-evolution-chain') > -1 ){
        listMode = false;
        let id = evt.target.getAttribute('data-id');
        let btn = document.getElementById('evolutionBtn-'+id);
        btn.classList.add('is-loading')
        PokemonController.getSelectedPokemon(id);
      }
    })

    var scrollElement = document.querySelector('#app');

function inifniteScroll() {
  offset+=limit;
  PokemonController.getPokemonList(offset,limit);
}

// Detect when scrolled to bottom.
scrollElement.addEventListener('scroll', function() {
  if (listMode){
    let data = JSON.parse(localStorage.getItem('pokemonListData'))
    if(scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight-5) {
      if(data.next){
        PokemonController.getPokemonList(data.next)        
      }
    }else if(scrollElement.scrollTop == 0){
      if(data.previous){
        PokemonController.getPokemonList(data.prev)
      }
    }
  }
});


document.querySelector('#back').addEventListener('click',function(){
  window.location.reload();
})
});