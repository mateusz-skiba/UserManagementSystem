document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("users");
    const formAdd = document.getElementById("form-add");
    const formEdit = document.getElementById("form-edit");

    // Fetches and updates the users
    const loadUsers = () => {
        fetch("https://oex.mateusz.smarthost.pl/api/fetch_users.php")
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = data.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.age}</td>
                        <td>${user.login}</td>
                        <td class="buttons">
                            <button class="btn btn-edit" data-id="${user.id}">Edit</button>
                            <button class="btn btn-delete" data-id="${user.id}">
                                <img src="assets/img/delete-icon.svg" alt="Delete user">
                            </button>
                        </td>
                    </tr>`).join("");
            })
            .catch(error => console.error("Error loading users:", error));
    };

    loadUsers();

    // Handles edit and delete user
    tableBody.addEventListener("click", (event) => {
        const btn = event.target.closest("button");
        if (!btn) return;

        const userId = btn.dataset.id;
        const row = btn.closest("tr").querySelectorAll("td");

        if (btn.classList.contains("btn-edit")) {
            ["id", "nazwa", "email", "wiek", "login"].forEach((field, index) => {
                document.querySelector(`#form-edit input[name='${field}']`).value = row[index].textContent;
            });
            switchView("#content-list", "#content-edit");
        }

        if (btn.classList.contains("btn-delete")) {
            showPopup(() => {
                fetch(`https://oex.mateusz.smarthost.pl/api/delete_user.php?id=${userId}`, { method: "POST" })
                    .then(response => response.json())
                    .then(() => {
                        loadUsers();
                        closePopup();
                    })
                    .catch(error => console.error("Error deleting user:", error));
            });
        }
    });

    // Handles adding a user
    formAdd.addEventListener("submit", (event) => {
        event.preventDefault();
        handleFormSubmit(formAdd, "https://oex.mateusz.smarthost.pl/api/add_user.php", "User added", "#content-add");
    });

    // Handles editing a user
    formEdit.addEventListener("submit", (event) => {
        event.preventDefault();
        const userId = formEdit.querySelector("[name='id']").value;
        handleFormSubmit(formEdit, `https://oex.mateusz.smarthost.pl/api/update_user.php?id=${userId}`, "User updated", "#content-edit");
    });

    // Switches views
    function switchView(hideSelector, showSelector) {
        document.querySelectorAll(hideSelector).forEach(el => el.style.display = "none");
        fadeIn(document.querySelector(showSelector));
    }

    document.getElementById("btn-add").addEventListener("click", () => switchView("#content-list", "#content-add"));

    document.querySelectorAll(".back").forEach(btn => {
        btn.addEventListener("click", () => switchView("#content-add, #content-edit", "#content-list"));
    });

    // Handles forms
    function handleFormSubmit(form, url, successMessage, hideSelector) {
        fetch(url, { method: "POST", body: new FormData(form) })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    loadUsers();
                    form.reset();
                    switchView(hideSelector, "#content-list");
                } else {
                    alert(result.message);
                }
            })
            .catch(error => console.error("Error processing user action:", error));
    }

    // Shows the popup
    function showPopup(confirmCallback) {
        fadeIn(document.querySelector(".overlay"));
        fadeIn(document.querySelector(".popup"));
        document.querySelector("#popup-delete").onclick = confirmCallback;
    }

    // Closes the popup
    function closePopup() {
        fadeOut(document.querySelector(".popup"), true);
        fadeOut(document.querySelector(".overlay"), true);
    }

    document.querySelectorAll("#popup-back, .overlay").forEach(btn => {
        btn.addEventListener("click", closePopup);
    });

    // Fades out
    function fadeOut(element, hideAfter = false) {
        element.style.opacity = 1;
        const fade = setInterval(() => {
            if ((element.style.opacity -= 0.1) <= 0) {
                clearInterval(fade);
                if (hideAfter) element.style.display = "none";
            }
        }, 30);
    }

    // Fades in
    function fadeIn(element) {
        element.style.opacity = 0;
        element.style.display = "block";
        let opacity = 0;
        const fade = setInterval(() => {
            if ((opacity += 0.1) >= 1) {
                clearInterval(fade);
            }
            element.style.opacity = opacity;
        }, 30);
    }
});