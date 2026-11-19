const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let users = [];

function renderUsers(list) {

    usersList.textContent = "";

    if (list.length === 0) {
        statusText.textContent = "No users match your filter.";
        return;
    }

    list.forEach(user => {

        const li = document.createElement("li");

        const name = document.createElement("h3");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.textContent = `Email: ${user.email}`;

        const city = document.createElement("p");
        city.textContent = `City: ${user.address.city}`;

        const company = document.createElement("p");
        company.textContent = `Company: ${user.company.name}`;

        li.appendChild(name);
        li.appendChild(email);
        li.appendChild(city);
        li.appendChild(company);

        usersList.appendChild(li);
    });
}

async function loadUsers() {

    loadButton.disabled = true;
    statusText.textContent = "Loading users...";

    try {

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
            throw new Error("Failed to load users.");
        }

        users = await response.json();

        renderUsers(users);

        statusText.textContent =
            `${users.length} users loaded successfully.`;

    } catch (error) {

        statusText.textContent =
            `Error: ${error.message}`;

    } finally {

        loadButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {

    const searchTerm =
        filterInput.value.toLowerCase();

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm)
    );

    renderUsers(filteredUsers);

    if (filteredUsers.length > 0) {
        statusText.textContent =
            `${filteredUsers.length} user(s) found.`;
    }
});