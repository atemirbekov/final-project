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

document
  .querySelector(".button--blue")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const name = document.querySelector(".name-input").value;

    if (!name) {
      alert("Пожалуйста, заполните поле");
      return;
    }

    try {
      const response = await fetch("https://webfinalapi.mobydev.kz/category", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        alert("Категория успешно добавлена!");
        window.location.href = "./categories.html";
      } else {
        alert("Ошибка при добавлении категории!");
      }
    } catch (error) {
      console.error("Ошибка", error);
    }
  });
