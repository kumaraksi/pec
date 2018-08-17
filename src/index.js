import  './styles/style.scss';

import './controllers/pokemon'
import { PokemonController } from './controllers/pokemon';


const OFFSET = 0;
const LIMIT = 20;

/**
 * flag to distinguish between list mode and evolution mode 
 */
let listMode = true;

/**
 * listen to DOMCOntentLoaded event
 */
document.addEventListener("DOMContentLoaded",function(){
    //here code
    
    //try to fetch data from local storage if possible other wise make a new request
    if(localStorage.getItem('pokemonListData')){
      PokemonController.renderPokemonGrid()
    }else{
      PokemonController.getPokemonList();
    }

    // add click event on show evolution chain button
    document.getElementById('app').addEventListener('click',function(evt){
      if(evt.target.className.indexOf('show-evolution-chain') > -1 ){
        listMode = false;
        let id = evt.target.getAttribute('data-id');
        let btn = document.getElementById('evolutionBtn-'+id);
        btn.classList.add('is-loading')
        PokemonController.getSelectedPokemon(id);
      }
    })

  
  // element where you want to implement infinite scrolling
    var scrollElement = document.querySelector('#app');

// Detect when scrolled to bottom.
scrollElement.addEventListener('scroll', function() {
  if (listMode){
    let data = JSON.parse(localStorage.getItem('pokemonListData'))
    // if user is scrolling down call next url
    if(scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight-5) {
      if(data.next){
        PokemonController.getPokemonList(data.next)        
      }
    }else if(scrollElement.scrollTop == 0){     // if user is scrolling up call previous url
      if(data.previous){
        PokemonController.getPokemonList(data.prev)
      }
    }
  }
});

// hack to reload simulate back button scenario. reload window on back button click
document.querySelector('#back').addEventListener('click',function(){
  window.location.reload();
})
});