document.addEventListener("DOMContentLoaded", function () {
    const userList = document.getElementById("userList");
    const searchInput = document.getElementById("searchInput");
    const formContainer = document.getElementById("userInfo");
    const modal = document.getElementById("userModal");
    const modalContent = document.querySelector(".modal-content");
    const closeModal = document.querySelector(".close");
    let usersData = [];

    // Check if elements exist
    if (!userList || !searchInput || !formContainer) {
        console.error("One or more required elements are missing from the HTML.");
        return;
    }

    // Add event listeners to each nav link
    document.querySelectorAll(".main-nav ul li a").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent the default anchor click behavior
            const page = navLinks[link.textContent.trim()]; // Get the corresponding page
            if (page) {
                window.location.href = page; // Navigate to the corresponding page
            }
        });
    });

    // Function to fetch data from Airtable
    function fetchAPIData() {
        console.log("Fetching data from Airtable API...");
        const apiKey = "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
        const baseId = "appFgKdBEAupaPDJ5";
        const tableName = "tbl1MpLdQKzdhzXqe";
        const maxRecords = 500; // Adjust as per your needs
        let offset = ""; // Start with an empty offset

        const fetchData = () => {
            const url = `https://api.airtable.com/v0/${baseId}/${tableName}?maxRecords=${maxRecords}&offset=${offset}`;

            fetch(url, {
                headers: {
                    Authorization: `Bearer ${apiKey}`
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Data fetched successfully:", data);
                    usersData.push(...data.records.map((record) => record.fields));

                    // Check if there are more records to fetch
                    if (data.offset) {
                        offset = data.offset;
                        fetchData(); // Fetch next page recursively
                    } else {
                        console.log("All data fetched:", usersData);
                        displayUsers(usersData); // Display all users once all data is fetched
                    }
                })
                .catch((error) => console.error("Error fetching API data:", error));
        };

        fetchData(); // Start fetching data
    }

    // Function to display users
    function displayUsers(users) {
        userList.innerHTML = "";
        const searchTerm = searchInput.value.toLowerCase().trim();
        console.log("Search term:", searchTerm); // Debugging line to see search term

        // Filter users based on searchTerm
        if (searchTerm !== "") {
            const filteredUsers = users.filter(
                (user) =>
                    (user.Name && user.Name.toLowerCase().startsWith(searchTerm)) ||
                    (user.Area && user.Area.toLowerCase().startsWith(searchTerm))
            );

            console.log("Filtered users:", filteredUsers); // Debugging line to see filtered users

            // Display filtered users
            filteredUsers.forEach((user) => {
                const li = document.createElement("li");
                li.textContent = user.Name;
                li.addEventListener("click", () => {
                    li.classList.toggle("selected");
                    openDetailsModal(user);
                });
                userList.appendChild(li);
            });

            // If no users match the filter, clear the formContainer
            if (filteredUsers.length === 0) {
                formContainer.innerHTML = "";
            }
        } else {
            formContainer.innerHTML = ""; // Clear formContainer if searchTerm is empty
        }
    }
   
    // Function to open details modal with asset information
    function openDetailsModal(user) {
        const userTableBody = document.getElementById("userTable").querySelector("tbody");
        userTableBody.innerHTML = `
            <tr><td>Name:</td><td>${user.Name}</td></tr>
            <tr><td>UPN:</td><td>${user.UPN}</td></tr>
            <tr><td>Area:</td><td>${user.Area}</td></tr>
            <tr><td>Manager:</td><td>${user.Manager}</td></tr>
            <tr><td>Job Title:</td><td>${user["Job Title"]}</td></tr>
            <tr><td>Smartphone Asset ID:</td><td>${user["Smartphone Asset ID"]}</td></tr>
            <tr><td>Smartphone Model:</td><td>${user["Smartphone Model"]}</td></tr>
            <tr><td>Laptop Asset ID:</td><td>${user["Laptop Asset ID"]}</td></tr>
            <tr><td>Laptop Model:</td><td>${user["Laptop Model"]}</td></tr>
        `;
        modal.style.display = "block";
    }

    // Close modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Event listener for search input
    searchInput.addEventListener("input", () => displayUsers(usersData));

    // Fetch data on page load
    fetchAPIData();
});