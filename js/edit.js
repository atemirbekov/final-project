document.addEventListener("DOMContentLoaded", async () => {
  const authToken = localStorage.getItem("authToken");
  const headerAuth = document.querySelector(".header__auth");

  if (authToken) {
    headerAuth.innerHTML = `
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

  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get("id");

  if (newsId) {
    try {
      const response = await fetch(
        `https://webfinalapi.mobydev.kz/news/${newsId}`,
      );
      if (response.ok) {
        const newsData = await response.json();

        document.querySelector(".name-input").value = newsData.title;
        loadExtraCategories(newsData.category.id);
        document.querySelector(".cover-name").textContent = (
          newsData.thumbnail || "Выбранный файл"
        )
          .split("/")
          .pop();
        document.querySelector(".content-input").value = newsData.content;
      } else {
        alert("Ошибка при загрузке данных");
      }
    } catch (error) {
      console.error("Ошибка", error);
    }
  }

  document
    .querySelector(".news-container")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = document.querySelector(".name-input").value;
      const categoryId = document.querySelector(".category-input").value;
      const thumbnail = document.querySelector(".cover-input").files[0];
      const content = document.querySelector(".content-input").value;

      if (!title || !categoryId || !thumbnail || !content) {
        alert("Пожалуйста, заполните все поля");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("categoryId", categoryId);
      formData.append("thumbnail", thumbnail);
      formData.append("content", content);

      try {
        const response = await fetch(
          `https://webfinalapi.mobydev.kz/news/${newsId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            body: formData,
          },
        );

        if (response.ok) {
          alert("Новость успешно обновлена!");
          window.location.href = "./index.html";
        } else {
          const errorResponse = await response.json();
          alert(
            "Ошибка при обновлении!" +
              (errorResponse.message || "Проверьте данные."),
          );
        }
      } catch (error) {
        console.error("Ошибка", error);
      }
    });
});

const input = document.getElementById("file-input");
const name = document.querySelector(".cover-name");

input.addEventListener("change", () => {
  name.textContent = input.files.length
    ? input.files[0].name
    : "Не выбран файл";
});

async function loadExtraCategories(selectedId = null) {
  try {
    const response = await fetch("https://webfinalapi.mobydev.kz/categories");
    const categories = await response.json();

    const select = document.querySelector(".category-input");

    const existingIds = Array.from(select.options).map((opt) => opt.value);

    categories.forEach((cat) => {
      if (!existingIds.includes(String(cat.id))) {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
      }
    });

    if (selectedId) {
      select.value = String(selectedId);
    }
  } catch (error) {
    console.error("Ошибка загрузки категорий", error);
  }
}
