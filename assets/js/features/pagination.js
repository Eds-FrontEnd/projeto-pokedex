export const renderPagination = ({
  container,
  currentPage,
  totalPages,
  onChange,
}) => {
  container.innerHTML = "";

  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);

  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = maxVisible;
  }

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - maxVisible + 1;
  }

  if (start < 1) start = 1;

  const mediaQuery = window.matchMedia("(min-width: 470px)");
  const showText = mediaQuery.matches;

  const prev = document.createElement("span");
  prev.dataset.action = "prev";
  prev.classList.toggle("disabled", currentPage === 1);
  prev.innerHTML = `
    <img src="/assets/img/icons/prev.svg" alt="voltar página">
    ${showText ? "Anterior" : ""}
  `;
  if (currentPage > 1) prev.onclick = () => onChange(currentPage - 1);
  container.appendChild(prev);

  for (let i = start; i <= end; i++) {
    const page = document.createElement("div");
    page.className = "pagination__count";
    page.textContent = i;
    if (i === currentPage) page.classList.add("active");
    page.onclick = () => onChange(i);
    container.appendChild(page);
  }

  const next = document.createElement("span");
  next.dataset.action = "next";
  next.classList.toggle("disabled", currentPage === totalPages);
  next.innerHTML = `
    ${showText ? "Próximo" : ""}
    <img src="/assets/img/icons/next.svg" alt="próxima página">
  `;

  if (currentPage < totalPages) next.onclick = () => onChange(currentPage + 1);
  container.appendChild(next);

  if (!mediaQuery._listenerAdded) {
    mediaQuery.addEventListener("change", () => {
      renderPagination({ container, currentPage, totalPages, onChange });
    });
    mediaQuery._listenerAdded = true;
  }
};
