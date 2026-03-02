const yearElement = document.querySelector(".year");

if (yearElement) {
  const currentYear = new Date().getFullYear();
  yearElement.textContent = currentYear;
}
