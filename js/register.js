document
  .querySelector(".container")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector(".name-input").value;
    const email = document.querySelector(".email-input").value;
    const password = document.querySelector(".password-input").value;

    try {
      const response = await fetch("https://webfinalapi.mobydev.kz/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        window.location.href = "./login.html";
      } else {
        alert("Неверный адрес электронной почты / Пользователь существует.");
      }
    } catch (error) {
      console.error("Ошибка при регистрации", error);
    }
  });
