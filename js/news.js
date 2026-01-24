function getNewsIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

const newsId = getNewsIdFromUrl();

const BASE_URL = "https://webfinalapi.mobydev.kz";

async function fetchAndRenderNewsById(newsId) {
  try {
    const response = await fetch(`${BASE_URL}/news/${newsId}`);
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

    const news = await response.json();

    document.querySelector(".news-title").textContent = news.title;
    document.querySelector(".author__name").textContent =
      news.author.name || "Неизвестный автор";
    document.querySelector(".news-date").textContent = `${new Date(
      news.createdAt
    ).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })} г.`;
    document.querySelector(".news-category").textContent =
      news.category.name || "Неизвестная категория";
    document.querySelector(".news-image").src = `${BASE_URL}${
      news.thumbnail.startsWith("/") ? "" : "/"
    }${
      news.thumbnail ||
      "https://tengrinews.kz/userdata/news/2024/news_551682/thumb_b/photo_490428.jpeg.webp"
    }`;
    document.querySelector(".news-content").textContent = news.content;
    document
      .querySelector(".news-actions a")
      .setAttribute("href", `./edit.html?id=${news.id}`);
    document
      .querySelector(".news-actions button")
      .setAttribute("onclick", `deleteNews(${news.id})`);
    setupActionButtonsNews();
  } catch (error) {
    console.error("Ошибка при получении новости: ", error);
  }
}

function setupActionButtonsNews() {
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
    .querySelector(".news-actions .news-edit")
    .addEventListener("click", (event) => {
      if (!authToken) {
        event.preventDefault();
        alert("Авторизуйтесь для редактирования.");
      }
    });

  document
    .querySelector(".news-actions .news-delete")
    .addEventListener("click", () => {
      if (!authToken) return alert("Авторизуйтесь для удаления.");
      // deleteNews(button.getAttribute("onclick").match(/\d+/)[0]);
    });
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  const newsId = getNewsIdFromUrl();
  if (newsId) {
    fetchAndRenderNewsById(newsId);
  } else {
    console.error("ID новости не найден в URL");
  }
});
