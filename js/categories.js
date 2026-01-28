const BASE_URL = "https://webfinalapi.mobydev.kz";

async function fetchAndRenderCategories() {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

    const categoriesArray = await response.json();
    document.querySelector(".categories-list").innerHTML = categoriesArray
      .map(
        (categories) => `
        <div class="categories__item">
            <p class="categories__title">${
              categories.name || "Неизвестная категория"
            }</p>

            <div class="categories__actions">
            <a
                href="./edit-cats.html?id=${categories.id}"
                class="button button--blue button--small"
                >Редактировать
            </a>
            <button
                type="button"
                class="button button--red button--small"
                onclick="deleteCategories(${categories.id})"
            >
                Удалить
            </button>
            </div>
        </div>
        `,
      )
      .join("");
    setupActionButtonsCat();
  } catch (error) {
    console.error("Ошибка при получении категорий: ", error);
  }
}

function setupActionButtonsCat() {
  const authToken = localStorage.getItem("authToken");
  const headerAuth = document.querySelector(".header__auth");

  if (authToken) {
    document.querySelector(".header__auth").innerHTML = `
    <div class="user">
      <div class="user__avatar">
        <img
          src="https://i.pravatar.cc/150?u=admin@admin.com"
          alt="Аватар"
          width="32"
          height="32"
        />
      </div>
      <p class="user__name">Администратор</p>
    </div>`;
    headerAuth.innerHTML += `<button class="button button--red" onclick="logout()">Выйти</button>`;
  }

  document
    .querySelectorAll(".categories__actions a.button--blue")
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        if (!authToken) {
          event.preventDefault();
          alert("Авторизуйтесь для редактирования.");
        }
      });
    });

  document
    .querySelectorAll(".categories__actions button.button--red")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (!authToken) return alert("Авторизуйтесь для удаления.");
        // deleteCategories(button.getAttribute("onclick").match(/\d+/)[0]);
      });
    });
}

function displayCreateButtonCat() {
  if (localStorage.getItem("authToken")) {
    const createButton = document.createElement("button");
    createButton.className = "button button--green";
    createButton.innerHTML = '<img src="./img/add.svg" alt="plus icon" />';
    createButton.onclick = () => (window.location.href = "./create-cats.html");
    document.querySelector(".categories-list").before(createButton);
  }
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderCategories();
  displayCreateButtonCat();
});
