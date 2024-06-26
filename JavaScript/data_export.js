document.addEventListener("DOMContentLoaded", function () {
    const userList = document.getElementById("userList");
    const searchInput = document.getElementById("searchInput");
    const selectAllButton = document.getElementById("selectAllButton");
    let usersData = [];
    let allSelected = false; // Add this line

    // Event listener for the logout button
    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener("click", function () {
        // Redirect to the login page
        window.location.href = "login.html";
    });

    // Event listener for the contact link
    const contactLink = document.getElementById("contact");
    contactLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        // Redirect to the contact page
        window.location.href = "contact.html";
    });

    // Event listener for the home link
    const homeLink = document.getElementById("homeLink");
    homeLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        // Redirect to the homepage
        window.location.href = "homepage.html";
    });

    // Function to fetch and parse CSV data
    function fetchCSVData() {
        fetch("users.csv")
            .then((response) => response.text())
            .then((data) => {
                usersData = parseCSV(data);
                displayUsers(usersData); // Display users after fetching data
            })
            .catch((error) => console.error("Error fetching CSV:", error));
    }

    // Function to parse CSV data
    function parseCSV(data) {
        const rows = data.trim().split("\n");
        const users = [];

        // Start iteration from index 1 to skip the first row (header)
        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(",");
            const user = {
                name: columns[0].trim(),
                area: columns[1].trim(),
                smartphone_asset_id: columns[2].trim(),
                smartphone_model: columns[3].trim(),
                laptop_asset_id: columns[4].trim(),
                laptop_model: columns[5].trim()
                // Add more properties as needed based on your CSV structure
            };
            users.push(user);
        }

        return users;
    }

    // Function to display users
    function displayUsers(users) {
        userList.innerHTML = "";

        const searchTerm = searchInput.value.toLowerCase().trim();

        // Show user list only if there's a search term
        if (searchTerm) {
            const filteredUsers = users.filter(
                (user) =>
                    user.name.toLowerCase().startsWith(searchTerm) ||
                    user.area.toLowerCase().startsWith(searchTerm)
            );

            filteredUsers.forEach((user) => {
                const li = document.createElement("li");
                li.classList.add("user-item");
                li.innerHTML = `
                    <span class="user-name">${user.name}</span>
                    <span class="tick-icon" style="display: none;">✔</span>
                `;

                li.addEventListener("click", () => {
                    li.classList.toggle("selected");
                    const tickIcon = li.querySelector(".tick-icon");
                    if (li.classList.contains("selected")) {
                        tickIcon.style.display = "inline";
                    } else {
                        tickIcon.style.display = "none";
                    }
                    checkAllSelected(); // Check if all items are selected
                });

                userList.appendChild(li);
            });
        }
    }

    // Event listener for search input
    searchInput.addEventListener("input", function () {
        displayUsers(usersData);
    });

    // Event listener for "Select All" button
    selectAllButton.addEventListener("click", function () {
        const listItems = userList.querySelectorAll(".user-item");

        // Check if any item is selected
        let anyItemSelected = false;
        listItems.forEach((li) => {
            if (li.classList.contains("selected")) {
                anyItemSelected = true;
            }
        });

        // If any item is selected, then deselect all
        if (anyItemSelected) {
            listItems.forEach((li) => {
                li.classList.remove("selected");
                const tickIcon = li.querySelector(".tick-icon");
                tickIcon.style.display = "none";
            });
            allSelected = false;
            selectAllButton.textContent = "Select All"; // Change button text
        } else {
            // Otherwise, select all items
            listItems.forEach((li) => {
                li.classList.add("selected");
                const tickIcon = li.querySelector(".tick-icon");
                tickIcon.style.display = "inline";
            });
            allSelected = true;
            selectAllButton.textContent = "Deselect All"; // Change button text
        }
    });

    // Function to check if all items are selected
    // Function to check if all items are selected
    function checkAllSelected() {
        const listItems = userList.querySelectorAll(".user-item");
        let allItemsSelected = true;
        let anyItemSelected = false;

        listItems.forEach((li) => {
            if (!li.classList.contains("selected")) {
                allItemsSelected = false;
            } else {
                anyItemSelected = true;
            }
        });

        if (allItemsSelected) {
            allSelected = true;
            selectAllButton.textContent = "Deselect All"; // Change button text
        } else if (anyItemSelected) {
            allSelected = false;
            selectAllButton.textContent = "Deselect All"; // Change button text
        } else {
            allSelected = false;
            selectAllButton.textContent = "Select All"; // Change button text
        }
    }

    // Fetch CSV data when the page loads
    fetchCSVData();
});