const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`;

const generationPokemon = {
    1: { start: 1, cont: 151 },
    2: { start: 152, cont: 100 },
    3: { start: 252, cont: 135 },
    4: { start: 387, cont: 107 },
    5: { start: 494, cont: 156 },
    6: { start: 650, cont: 72 },
    7: { start: 722, cont: 88 },
    8: { start: 810, cont: 83 },
}

//   document.querySelectorAll('img').forEach(eventsOnImages) 
  
//   function eventsOnImages(image,index){
//     console.log(image, index)
// }

// const changeGeneration=()=> {
//     fetchPokemon(generationPokemon[geracoes.value]);


// }


const fetchPokemon = ({ start, cont }) => {
    const generatePokemonPromisses = () => Array(cont || 1).fill().map((_, index) =>
        fetch(getPokemonUrl(index + start || 151)).then(response => response.json()))
        // background: linear-gradient(to left,var(--fire) 50%, var(--water)50%);

    document.querySelector('[data-js="pokedex"]').style = 'visibility: hidden !important'
    document.getElementById('roda').style = 'visibility: visible !important'
    const pokemonPromisses = generatePokemonPromisses(generationPokemon[1]);
    // const pokemonPromisses = []
    // for (let i = 1; i < ; i++) {
    //     pokemonPromisses.push(fetch(getPokemonUrl(i)).then(Response => Response.json()))
    // }
    const generateHTML = pokemons => pokemons.reduce((accumulator, { name, id, types }) => {
        const elementTypes = types.map(typeInfo => typeInfo.type.name)
        accumulator += elementTypes.length == 1 ? `
    <li class="card ${elementTypes[0]}" >
    <img class="card-image" onerror="this.src='https://pokeres.bastionbot.org/images/pokemon/${id}.png'"src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id}.png" alt="${name}">
    <h2 class="card-title">${id}. ${name}</h2>
    <p class="card-subtitle">${elementTypes.join(' | ')}</p>
    </li>`
    :`
    <li class="card ${elementTypes[0]}" style="background: linear-gradient(to left, var(--${elementTypes[1]}) 50%, var(--${elementTypes[0]}) 50%)">
    <img class="card-image " onerror="this.src='https://pokeres.bastionbot.org/images/pokemon/${id}.png'"src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id}.png" alt="${name}">
    <h2 class="card-title">${id}. ${name}</h2>
    <p class="card-subtitle">${elementTypes.join(' | ')}</p>
    </li>`

        return accumulator
    }, '')

    const insertPokemon = listPokemon => {
        const ul = document.querySelector('[data-js="pokedex"]');
        ul.innerHTML = listPokemon;
        ul.style = 'visibility: visible !important'
        document.getElementById('roda').style = 'visibility: hidden !important'
    }
    Promise.all(pokemonPromisses)
        .then(generateHTML)
        .then(insertPokemon)
    // .then( () => {setInterval(() => {
    //     let imagens = document.querySelectorAll("img") || []
    // imagens[imagens.length - 1].complete == true ? geracoes.disabled = false :  geracoes.disabled = true})
    // }, 15000); 
}




fetchPokemon(generationPokemon[1]);