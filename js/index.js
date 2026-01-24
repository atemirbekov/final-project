const BASE_URL = "https://webfinalapi.mobydev.kz";

async function fetchAndRenderNews() {
  try {
    const response = await fetch(`${BASE_URL}/news`);
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

    const newsArray = await response.json();
    document.querySelector(".news-grid").innerHTML = newsArray
      .map(
        (news) => `
    <article class="news-card">
      <div class="news-card__image">
        <img
        src="${BASE_URL}${news.thumbnail.startsWith("/") ? "" : "/"}${
          news.thumbnail ||
          "https://tengrinews.kz/userdata/news/2024/news_551682/thumb_b/photo_490428.jpeg.webp"
        }"
          alt="${news.title}"
          width="200"
          height="200"
        />
      </div>

      <div class="news-card__content">
        <a class="news-card__link" href="./news.html?id=${news.id}">
          <h2 class="news-card__title">${news.title}</h2>

          <p class="news-card__attributes">${new Date(
            news.createdAt
          ).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })} г. • ${news.category.name || "Неизвестная категория"}</p>
        </a>

        <div class="news-card__parent">
          <div class="news-card__author">
            <div class="user">
              <div class="user__avatar">
                <img
                  src="https://i.pravatar.cc/150?u=admin@admin.com"
                  alt="Аватар"
                  width="32"
                  height="32"
                />
              </div>
              <p class="user__name">${
                news.author.name || "Неизвестный автор"
              }</p> 
            </div>
          </div>

          <div class="news-card__actions">
            <a
              href="./edit.html?id=${news.id}"
              class="button button--blue button--small"
              >Редактировать
            </a>
            <button
              type="button"
              class="button button--red button--small"
              onclick="deleteNews(${news.id})"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </article>
        `
      )
      .join("");
    setupActionButtons();
  } catch (error) {
    console.error("Ошибка при получении новостей: ", error);
  }
}

function setupActionButtons() {
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
    .querySelectorAll(".news-card__actions a.button--blue")
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        if (!authToken) {
          event.preventDefault();
          alert("Авторизуйтесь для редактирования.");
        }
      });
    });

  document
    .querySelectorAll(".news-card__actions button.button--red")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (!authToken) return alert("Авторизуйтесь для удаления.");
        // deleteNews(button.getAttribute("onclick").match(/\d+/)[0]);
      });
    });
}

function displayCreateButton() {
  if (localStorage.getItem("authToken")) {
    const createButton = document.createElement("button");
    createButton.className = "button button--green";
    createButton.innerHTML = '<img src="./img/add.svg" alt="plus icon" />';
    createButton.onclick = () => (window.location.href = "./create.html");
    document.querySelector(".news-grid").before(createButton);
  }
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderNews();
  displayCreateButton();
});
