import { TYPE_MAP } from "../core/constants.js";
import { fetchPokemon } from "../services/api.js";

const search = {
  inputSearch: document.querySelector("#pokemon-search"),
  container: document.querySelector(".list__cards"),
  noResultImg: "./assets/img/pokemon/pokemon_ops.jpg",
};

let allPokemonCache = [];
let pokemonDetailsCache = new Map();
let debounceTimeout = null;

const getPokemonDetails = async (pokemon) => {
  if (pokemonDetailsCache.has(pokemon.name)) {
    return pokemonDetailsCache.get(pokemon.name);
  }

  const details = await fetch(pokemon.url).then((res) => res.json());

  pokemonDetailsCache.set(pokemon.name, details);

  return details;
};

const getPokemonType = (type) => {
  return TYPE_MAP[type] || type || "Desconhecido";
};

const renderSearchResults = async (query) => {
  if (!search.container) return;

  if (!search.inputSearch.value) {
    if (allPokemonCache.length === 0) {
      const data = await fetchPokemon(1000, 0);
      allPokemonCache = data.results;
    }

    const fragment = document.createDocumentFragment();

    for (const p of allPokemonCache.slice(0, 18)) {
      const details = await getPokemonDetails(p);

      const div = document.createElement("div");
      div.className = "list__card--info";

      const span = document.createElement("span");
      const type = document.createElement("h3");
      type.textContent = getPokemonType(details.types[0]?.type.name);

      const number = document.createElement("h3");
      number.textContent = `#${details.id}`;
      span.append(type, number);

      const img = document.createElement("img");
      img.src = details.sprites.other["official-artwork"].front_default;
      img.alt = details.name;
      img.width = 143;
      img.height = 143;
      img.loading = "lazy";

      const name = document.createElement("h1");
      name.className = "list__cards--name";
      name.textContent =
        details.name.charAt(0).toUpperCase() + details.name.slice(1);

      div.append(span, img, name);
      fragment.appendChild(div);
    }

    search.container.innerHTML = "";
    search.container.appendChild(fragment);
    return;
  }

  if (query.length < 3) {
    return;
  }

  search.container.innerHTML = "";

  try {
    if (allPokemonCache.length === 0) {
      const data = await fetchPokemon(1000, 0);
      allPokemonCache = data.results;
    }

    const filtered = allPokemonCache.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (filtered.length === 0) {
      const img = document.createElement("img");
      img.src = search.noResultImg;
      img.alt = "Nenhum resultado encontrado";
      img.style.width = "320px";
      img.style.display = "block";
      img.style.margin = "2rem auto";
      search.container.appendChild(img);
      return;
    }

    const fragment = document.createDocumentFragment();

    const details = await Promise.all(
      filtered.map((pokemon) => getPokemonDetails(pokemon)),
    );

    details.forEach((pokemon) => {
      const div = document.createElement("div");
      div.className = "list__card--info";

      const span = document.createElement("span");
      const type = document.createElement("h3");
      type.textContent = getPokemonType(pokemon.types[0]?.type.name);

      const number = document.createElement("h3");
      number.textContent = `#${pokemon.id}`;
      span.append(type, number);

      const img = document.createElement("img");
      img.src = pokemon.sprites.other["official-artwork"].front_default;
      img.alt = pokemon.name;
      img.width = 143;
      img.height = 143;
      img.loading = "lazy";

      const name = document.createElement("h1");
      name.className = "list__cards--name";
      name.textContent =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

      div.append(span, img, name);
      fragment.appendChild(div);
    });

    search.container.appendChild(fragment);
  } catch (error) {
    console.error("Erro na pesquisa:", error);
  }
};

search.inputSearch.addEventListener("input", (e) => {
  const query = e.target.value.trim();

  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    renderSearchResults(query);
  }, 300);
});
