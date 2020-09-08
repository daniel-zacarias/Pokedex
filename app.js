const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`;
const getPokemonDescription = id => `https://pokeapi.co/api/v2/pokemon-species/${id}/`
const getMove = moveId => `https://pokeapi.co/api/v2/move/${moveId}/`

// document.querySelector('ul').addEventListener('click', e => {
//     console.log(e.target.value || e.target.offsetParent.value);
// })


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


const pokemonDesc = async id => {
    if (id != undefined) {
        const especiePokemon = await fetch(getPokemonDescription(id))
        const { flavor_text_entries } = await especiePokemon.json()
        let englishText = flavor_text_entries.filter((id) => id.language.name == 'en')
        return (englishText[englishText.length - 1].flavor_text);
    }
}


const infoPokemon = async idPokemon => {
    if (idPokemon != undefined) {
        const especiePokemon = await fetch(getPokemonUrl(idPokemon))
        return { id, name, types } = await especiePokemon.json()
        // return {id,name, types}
    }
}



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
    <li class="card ${elementTypes[0]}" value="${id}">
    <img class="card-image" onerror="this.src='https://pokeres.bastionbot.org/images/pokemon/${id}.png'"src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id}.png" alt="${name}">
    <h2 class="card-title">${id}. ${name}</h2>
    <p class="card-subtitle">${elementTypes.join(' | ')}</p>
    </li>`
            : `
    <li class="card ${elementTypes[0]}" value="${id}"style="background: linear-gradient(to left, var(--${elementTypes[1]}) 50%, var(--${elementTypes[0]}) 50%)">
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
        ul.addEventListener('click', async e => {
            let getIdPokemon = e.target.value || e.target.offsetParent.value
            const info = await infoPokemon(getIdPokemon);
            const desc = await pokemonDesc(getIdPokemon)
            modalHtml(desc, info);
        })
    }
    Promise.all(pokemonPromisses)
        .then(generateHTML)
        .then(insertPokemon)
    // .then( () => {setInterval(() => {
    //     let imagens = document.querySelectorAll("img") || []
    // imagens[imagens.length - 1].complete == true ? geracoes.disabled = false :  geracoes.disabled = true})
    // }, 15000); 
}


const modalHtml = (description, { id, name, types }) => {

    let modal = document.getElementsByClassName('modal-s')[0]
    modal.innerHTML = types.length < 2 ? `
    <div class="modal ${types[0].type.name}">
    <span class="btnClose" id='close'>X</span>
    <div class="card-pokemon card-modal">
    <h2>${id}. ${name}</h2>
    <img onerror="this.src='https://pokeres.bastionbot.org/images/pokemon/${id}.png'"src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id}.png" alt="${name}" class="modal-image"alt="">
    </div> <div class="div_desc card-modal">
    <h2>description</h2>
    <article>${description}</article>
    </div>
    </div>`:
    `<div class="modal " style="background: linear-gradient(to left, var(--${types[0].type.name}) 50%, var(--${types[1].type.name}) 50%)">
    <span class="btnClose" id='close'>X</span>
    <div class="card-pokemon card-modal">
    <h2>${id}. ${name}</h2>
    <img onerror="this.src='https://pokeres.bastionbot.org/images/pokemon/${id}.png'"src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id}.png" alt="${name}" class="modal-image"alt="">
    </div> <div class="div_desc card-modal">
    <h2>description</h2>
    <article>${description}</article>
    </div>
    </div>`
    // modal.classList.add(types[0].type.name)
    // modal.innerHTML = divProfile + divDesc
    modal.addEventListener("click", e => {
        if (e.target.id == 'fatherModal' || e.target.id == 'close') {
            modal.classList.remove('visible')
        }
    })


    modal.classList.add('visible')
}

fetchPokemon(generationPokemon[1]);