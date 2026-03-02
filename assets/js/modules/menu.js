const menu = {
  list: document.querySelector(".header__list"),
  search: document.querySelector(".search"),
  iconSearch: document.querySelector("#btn-search"),
  btnSearchClose: document.querySelector(".header__search--close"),
  btnSearch: document.querySelector(".search__btn"),
  btnOpen: document.querySelector("#btn-menu"),
  btnClose: document.querySelector(".header__menu--close"),
};

menu.btnOpen.addEventListener("click", () => menu.list.classList.add("active"));
menu.btnClose.addEventListener("click", () =>
  menu.list.classList.remove("active"),
);

menu.btnSearch.addEventListener("click", () =>
  menu.search.classList.remove("active"),
);

menu.iconSearch.addEventListener("click", () =>
  menu.search.classList.add("active"),
);
menu.btnSearchClose.addEventListener("click", () =>
  menu.search.classList.remove("active"),
);
