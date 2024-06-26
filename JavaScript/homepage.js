document.addEventListener("DOMContentLoaded", function () {
    const userList = document.getElementById("userList");
    const searchInput = document.getElementById("searchInput");
    const formContainer = document.getElementById("userInfo");
    let usersData = [];
    let allUsersDisplayed = false; // Track if all users are displayed

    // Mapping of links to their corresponding HTML pages
    const navLinks = {
        Home: "homepage.html",
        "Employee List": "web_app.html",
        "Data Export": "data_export.html",
        "Requistion Form": "eForm.html",
         "Create Admin": "adminUser.html",
        "New Starter": "new_user.html",
        "Connection Test": "connection_test.html",
        Contact: "contact.html",
         "Delete User": "delete_user.html",
        "Log Out": "index.html"
    };

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
});