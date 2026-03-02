import { TYPE_MAP } from "../core/constants.js";
import { fetchPokemon } from "../services/api.js";
import { renderPagination } from "./pagination.js";

const LIMIT = 18;
let currentPage = 1;
let totalPages = 1;

const card = document.querySelector(".list__cards");
const paginationContainer = document.querySelector(".pagination");

if (!card || !paginationContainer) {
  throw new Error("Elemento não encontrado no DOM");
}

const renderPage = async (page = 1) => {
  const offset = (page - 1) * LIMIT;

  const data = await fetchPokemon(LIMIT, offset);
  totalPages = Math.ceil(data.count / LIMIT);
  currentPage = page;

  const details = await Promise.all(
    data.results.map((pokemon) => fetch(pokemon.url).then((res) => res.json())),
  );

  const fragment = document.createDocumentFragment();
  card.innerHTML = "";

  details.forEach((pokemon) => {
    const container = document.createElement("div");
    container.className = "list__card--info";

    const span = document.createElement("span");

    const type = document.createElement("h3");
    type.textContent = TYPE_MAP[pokemon.types[0]?.type.name] ?? "Desconhecido";

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

    container.append(span, img, name);
    fragment.appendChild(container);
  });

  card.appendChild(fragment);

  renderPagination({
    container: paginationContainer,
    currentPage,
    totalPages,
    onChange: renderPage,
  });

  window.scrollTo({
    top: card.offsetTop - 230,
    behavior: "smooth",
  });
};

renderPage(1);
