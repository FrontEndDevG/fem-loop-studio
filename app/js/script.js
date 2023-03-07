const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".navigation__list");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("active");
  menu.classList.toggle("active");
});
