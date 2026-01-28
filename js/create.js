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

loadExtraCategories();

document
  .querySelector(".button--blue")
  .addEventListener("click", async (event) => {
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
      const response = await fetch("https://webfinalapi.mobydev.kz/news", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (response.ok) {
        alert("Новость успешно добавлена!");
        window.location.href = "./index.html";
      } else {
        alert("Ошибка при добавлении новости!");
      }
    } catch (error) {
      console.error("Ошибка", error);
    }
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
      if (existingIds.includes(String(cat.id))) return;

      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;

      if (selectedId && cat.id === selectedId) {
        option.selected = true;
      }

      select.appendChild(option);
    });
  } catch (error) {
    console.error("Ошибка загрузки категорий", error);
  }
}
