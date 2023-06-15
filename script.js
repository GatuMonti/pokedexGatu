const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const pokemonName = document.getElementById('pokemonName');
const pokemonImage = document.getElementById('pokemonImage');
const pokemonType = document.getElementById('pokemonType');
const pokemonHeight = document.getElementById('pokemonHeight');
const pokemonWeight = document.getElementById('pokemonWeight');
const pokemonAbilities = document.getElementById('pokemonAbilities');
const pokemonWeaknesses = document.getElementById('pokemonWeaknesses');
const pokemonEvolutions = document.getElementById('pokemonEvolutions');
const pokemonLocation = document.getElementById('pokemonLocation');

let currentPokemonIndex = 1;

searchButton.addEventListener('click', searchPokemon);
prevButton.addEventListener('click', goToPreviousPokemon);
nextButton.addEventListener('click', goToNextPokemon);

function searchPokemon() {
  const searchTerm = searchInput.value.toLowerCase();

  fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
    .then(response => response.json())
    .then(data => {
      displayPokemonData(data);
    })
    .catch(error => {
      console.log(error);
      alert('Pokémon not found!');
    });
}

function goToPreviousPokemon() {
  if (currentPokemonIndex > 1) {
    currentPokemonIndex--;
    fetchPokemonData(currentPokemonIndex);
  }
}

function goToNextPokemon() {
  currentPokemonIndex++;
  fetchPokemonData(currentPokemonIndex);
}

function fetchPokemonData(index) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
    .then(response => response.json())
    .then(data => {
      displayPokemonData(data);
    })
    .catch(error => {
      console.log(error);
      alert('Failed to fetch Pokémon data!');
    });
}

function displayPokemonData(data) {
  pokemonName.textContent = capitalizeFirstLetter(data.name);
  pokemonImage.src = data.sprites.front_default;
  pokemonType.textContent = capitalizeFirstLetter(data.types.map(type => type.type.name).join(', '));
  pokemonHeight.textContent = `${data.height / 10} m`;
  pokemonWeight.textContent = `${data.weight / 10} kg`;
  pokemonAbilities.textContent = capitalizeFirstLetter(data.abilities.map(ability => ability.ability.name).join(', '));
  pokemonWeaknesses.textContent = capitalizeFirstLetter(getWeaknesses(data.types));
  pokemonEvolutions.innerHTML = '';
  getNumber(data.id);
  getPokemonSpecies(data.species.url)
    .then(speciesData => {
      getPokemonEvolutionChain(speciesData.evolution_chain.url)
        .then(evolutionChainData => {
          const evolutions = getEvolutions(evolutionChainData.chain);
          evolutions.forEach(evolution => {
            const li = document.createElement('li');
            li.textContent = capitalizeFirstLetter(evolution);
            pokemonEvolutions.appendChild(li);
          });
        });
    });
  pokemonLocation.textContent = capitalizeFirstLetter(data.name) + ' REGION';
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getWeaknesses(types) {
  const weaknesses = {
    normal: ['fighting'],
    fighting: ['flying', 'psychic', 'fairy'],
    flying: ['rock', 'electric', 'ice'],
    poison: ['ground', 'psychic'],
    ground: ['water', 'grass', 'ice'],
    rock: ['fighting', 'ground', 'steel', 'water', 'grass'],
    bug: ['flying', 'rock', 'fire'],
    ghost: ['ghost', 'dark'],
    steel: ['fighting', 'ground', 'fire'],
    fire: ['ground', 'rock', 'water'],
    water: ['grass', 'electric'],
    grass: ['flying', 'poison', 'bug', 'fire', 'ice'],
    electric: ['ground'],
    psychic: ['bug', 'ghost', 'dark'],
    ice: ['fighting', 'rock', 'steel', 'fire'],
    dragon: ['ice', 'dragon', 'fairy'],
    dark: ['fighting', 'bug', 'fairy'],
    fairy: ['poison', 'steel'],
  };

  let weaknessesArray = [];
  types.forEach(type => {
    weaknessesArray = weaknessesArray.concat(weaknesses[type.type.name]);
  });

  return [...new Set(weaknessesArray)].join(', ');
}

function getPokemonSpecies(url) {
  return fetch(url).then(response => response.json());
}

function getPokemonEvolutionChain(url) {
  return fetch(url).then(response => response.json());
}
function getNumber(num){
    const numero = document.querySelector("#pokemonNumber");
    numero.innerText = num
}
function getEvolutions(chain) {
  const evolutions = [];
  let currentChain = chain;
  while (currentChain && currentChain.species) {
    evolutions.push(currentChain.species.name);
    currentChain = currentChain.evolves_to[0];
  }
  return evolutions;
}

// Fetch initial Pokémon data
fetchPokemonData(currentPokemonIndex);
