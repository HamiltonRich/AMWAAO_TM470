//index.js
document.addEventListener("DOMContentLoaded", function () {
    // Array of users with UPNs and passwords
    const users = [
        { upn: "rich@hamiltonsales.com", password: "rich" },
        { upn: "poppy@hamiltonsales.com", password: "poppy" },
        { upn: "henry@hamiltonsales.com", password: "henry2024sales!" },
        { upn: "roger@hamiltonsales.com", password: "roger2024sales!" },
        { upn: "james.parnell@hamiltonsales.com", password: "james2024sales!" },
        { upn: "mauricio.howlett@hamiltonsales.com", password: "mauricio2024sales!" },
        { upn: "elnora.gonzalez@hamiltonsales.com", password: "elnora2024sales!" },
        { upn: "carl.cash@hamiltonsales.com", password: "carl2024sales!" },
        { upn: "ann.krug@hamiltonsales.com", password: "ann2024sales!" },
        { upn: "denice.garhart@hamiltonsales.com", password: "denise2024sales!" },
        { upn: "rachel.warren@hamiltonsales.com", password: "rachel2024sales!" },
        { upn: "mary.edwards@hamiltonsales.com", password: "mary2024sales!" },
        { upn: "karyn.edwards@hamiltonsales.com", password: "karyn2024sales!" },
        { upn: "paul.courtney@hamiltonsales.com", password: "paul2024sales!" },
        { upn: "patricia.smith@hamiltonsales.com", password: "patricia2024sales!" },
        { upn: "robert.rodriguez@hamiltonsales.com", password: "robert2024sales!" },
        { upn: "lucille.srey@hamiltonsales.com", password: "lucille2024sales!" },
        { upn: "scott.villalobos@hamiltonsales.com", password: "scott2024sales!" },
        { upn: "gary.boyers@hamiltonsales.com", password: "gary2024sales!" },
        { upn: "melissa.mills@hamiltonsales.com", password: "melissa2024sales!" },
        { upn: "admin", password: "admin" }
    ];

    // Event listener for the login form
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get username and password input values
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Check if the provided credentials are valid
        const user = users.find(user => user.upn === username && user.password === password);
        if (user) {
            // Redirect to homepage.html
            window.location.href = "HTML/homepage.html";
        } else {
            // If credentials are invalid, display an error message
            alert("Invalid username or password");
        }
    });

    // Event listener for the contact link
    const contactLink = document.getElementById("contact");
    contactLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        // Redirect to the contact page
        window.location.href = "HTML/login_contact.html";
    });
});

//web_app.js

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
        console.error(
            "One or more required elements are missing from the HTML."
        );
        return;
    }

    // Mapping of links to their corresponding HTML pages
    const navLinks = {
        "Home": "homepage.html",
        "Data Export": "data_export.html",
        "Requistion Form": "eForm.html",
        "New Employee": "new_user.html",
        "Connection Test": "connection_test.html",
        Contact: "contact.html",
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

    // Function to fetch data from Airtable
    function fetchAPIData() {
        console.log("Fetching data from Airtable API...");
        const apiKey =
            "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
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
                        throw new Error(
                            `HTTP error! Status: ${response.status}`
                        );
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Data fetched successfully:", data);
                    usersData.push(
                        ...data.records.map((record) => record.fields)
                    );

                    // Check if there are more records to fetch
                    if (data.offset) {
                        offset = data.offset;
                        fetchData(); // Fetch next page recursively
                    } else {
                        console.log("All data fetched:", usersData);
                        displayUsers(usersData); // Display all users once all data is fetched
                    }
                })
                .catch((error) =>
                    console.error("Error fetching API data:", error)
                );
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
                    (user.Name &&
                        user.Name.toLowerCase().startsWith(searchTerm)) ||
                    (user.Area &&
                        user.Area.toLowerCase().startsWith(searchTerm))
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
        const userTableBody = document
            .getElementById("userTable")
            .querySelector("tbody");
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

//login_contact.js

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    // Initialize EmailJS once the document is loaded
    emailjs.init("j99DxQx5GimFzJyu-"); // Replace with your EmailJS user ID

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // Collect form data
            const formData = new FormData(contactForm);
            const templateParams = {};
            for (const [key, value] of formData.entries()) {
                templateParams[key] = value;
            }

            // Send email
            emailjs
                .send("service_6atfsc6", "template_fykqqfs", templateParams)
                .then(
                    function (response) {
                        console.log("SUCCESS!", response.status, response.text);
                        alert("Email sent successfully!");
                        contactForm.reset();
                    },
                    function (error) {
                        console.log("FAILED...", error);
                        alert("An error occurred while sending the email.");
                    }
                );
        });
    }
});

//homepage.js

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

//eform.js

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    const airtableApiKey =
        "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
    const airtableBaseId = "appFgKdBEAupaPDJ5";
    const airtableTableName = "tbl1MpLdQKzdhzXqe";

    document.getElementById("Name").addEventListener("blur", async function () {
        const name = this.value;

        if (name) {
            try {
                const userRecords = await searchUserByName(name);

                if (userRecords.length === 0) {
                    alert("No matching user found in Airtable.");
                    return;
                }

                const userData = userRecords[0].fields;

                document.getElementById("email").value = userData.UPN || "";
                document.getElementById("area").value = userData.Area || "";
                document.getElementById("jobTitle").value =
                    userData["Job Title"] || "";
                document.getElementById("manager").value =
                    userData.Manager || "";
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert("Failed to fetch user data. Please try again later.");
            }
        }
    });

    document
        .getElementById("contactForm")
        .addEventListener("submit", async function (event) {
            event.preventDefault();

            const formData = {
                Name: document.getElementById("Name").value,
                email: document.getElementById("email").value,
                area: document.getElementById("area").value,
                jobTitle: document.getElementById("jobTitle").value,
                laptopModel: "",
                laptopAssetId: "",
                smartphoneModel: "",
                smartphoneAssetId: "",
                requestingManager: document.getElementById("manager").value,
                requiredByDate: document.getElementById("requiredByDate").value,
             
            };

            switch (formData.jobTitle) {
                case "CEO (Chief Executive Officer)":
                case "COO (Chief Operating Officer)":
                case "CFO (Chief Financial Officer)":
                case "CTO (Chief Technology Officer)":
                    formData.laptopModel = "Macbook Pro";
                    formData.laptopAssetId = generateRandomId("LAP");
                    formData.smartphoneModel = "iPhone 15";
                    formData.smartphoneAssetId = generateRandomId("SMPH");
                    break;
                case "Managing Director - North":
                case "Managing Director - South":
                case "Managing Director - East":
                case "Managing Director - West":
                case "Managing Director - Southwest":
                case "Managing Director - Northeast":
                case "Managing Director - Southeast":
                case "Managing Director - Northwest":
                    formData.laptopModel = "Dell XPS";
                    formData.laptopAssetId = generateRandomId("LAP");
                    formData.smartphoneModel = "Samsung S24";
                    formData.smartphoneAssetId = generateRandomId("SMPH");
                    break;
                case "Area Manager - North":
                case "Area Manager - South":
                case "Area Manager - East":
                case "Area Manager - West":
                case "Area Manager - Southwest":
                case "Area Manager - Northeast":
                case "Area Manager - Southeast":
                case "Area Manager - Northwest":
                    formData.laptopModel = "Lenovo P15";
                    formData.laptopAssetId = generateRandomId("LAP");
                    formData.smartphoneModel = "Samsung S24";
                    formData.smartphoneAssetId = generateRandomId("SMPH");
                    break;
                case "Sales Associate":
                    formData.laptopModel = "Dell 5520";
                    formData.laptopAssetId = generateRandomId("LAP");
                    formData.smartphoneModel = "Samsung A05";
                    formData.smartphoneAssetId = generateRandomId("SMPH");
                    break;
                default:
                    alert("Invalid job title selected.");
                    return;
            }

            try {
                const userRecords = await searchUserByName(formData.Name);

                if (userRecords.length === 0) {
                    alert("No matching user found in Airtable.");
                    return;
                }

                const recordId = userRecords[0].id;
                openNewEmployeeModal(formData);

                document
                    .getElementById("modalSubmitButton")
                    .addEventListener("click", async function () {
                        try {
                            await updateUser(recordId, formData);
                            const modal =
                                document.getElementById("newEmployeeModal");
                            modal.style.display = "none";
                            openRequestSentModal();
                            sendEmail(formData);
                        } catch (error) {
                            console.error("Error updating user:", error);
                            alert(
                                "Failed to update user. Please try again later."
                            );
                        }
                    });
            } catch (error) {
                console.error("Error searching for user:", error);
                alert("Failed to search for user. Please try again later.");
            }
        });

    document
        .getElementById("goToHomepageButton")
        .addEventListener("click", function () {
            window.location.href = "homepage.html";
        });

    async function searchUserByName(name) {
        const url = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?filterByFormula=Name="${name}"`;
        const headers = {
            Authorization: `Bearer ${airtableApiKey}`
        };

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Failed to search user in Airtable: ${JSON.stringify(errorData)}`
                );
            }

            const data = await response.json();
            console.log("User search result:", data);
            return data.records;
        } catch (error) {
            console.error("Error searching user:", error);
            throw error;
        }
    }

    async function updateUser(recordId, formData) {
        const url = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}/${recordId}`;
        const headers = {
            Authorization: `Bearer ${airtableApiKey}`,
            "Content-Type": "application/json"
        };
        const body = JSON.stringify({
            fields: {
                "Laptop Model": formData.laptopModel,
                "Laptop Asset ID": formData.laptopAssetId,
                "Smartphone Model": formData.smartphoneModel,
                "Smartphone Asset ID": formData.smartphoneAssetId,
               
              
            }
        });

        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: headers,
                body: body
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Failed to update user in Airtable: ${JSON.stringify(errorData)}`
                );
            }

            const data = await response.json();
            console.log("User updated successfully:", data);
            return data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    function sendEmail(formData) {
        emailjs.init("ycueR4Ao9IVKWtJVr");

        const serviceId = "service_euf2b88";
        const templateId = "template_u2vx44l";

        const emailData = {
        name: formData.Name,
        email: formData.email,
        area: formData.area,
        jobTitle: formData.jobTitle,
        manager: formData.requestingManager,
        requiredByDate: formData.requiredByDate,
        laptop_model: formData.laptopModel,
        laptop_asset_id: formData.laptopAssetId,
        smartphone_model: formData.smartphoneModel,
        smartphone_asset_id: formData.smartphoneAssetId,
        notes: formData.reason
    };  

        emailjs.send(serviceId, templateId, emailData).then(
            function (response) {
                console.log("Email sent successfully!", response);
                alert("Asset details updated and email sent successfully!");
            },
            function (error) {
                console.error("Failed to send email:", error);
                alert("Failed to send email. Please try again later.");
            }
        );
    }

    function generateRandomId(prefix) {
        const randomNumbers = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${randomNumbers}`;
    }

    function openNewEmployeeModal(formData) {
        document.getElementById("modalName").value = formData.Name;
        document.getElementById("modalEmail").value = formData.email;
        document.getElementById("modalArea").value = formData.area;
        document.getElementById("modalJobTitle").value = formData.jobTitle;
        document.getElementById("modalLaptopModel").value =
            formData.laptopModel;
        document.getElementById("modalLaptopAssetId").value =
            formData.laptopAssetId;
        document.getElementById("modalSmartphoneModel").value =
            formData.smartphoneModel;
        document.getElementById("modalSmartphoneAssetId").value =
            formData.smartphoneAssetId;

        const modal = document.getElementById("newEmployeeModal");
        modal.style.display = "block";
    }

    function openRequestSentModal() {
        const modal = document.getElementById("requestSentModal");
        modal.style.display = "block";
    }
});

//delete_user.js

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    emailjs.init("ycueR4Ao9IVKWtJVr"); // Replace with your EmailJS user ID

    // Select the Name input field
    const nameInput = document.getElementById("Name");

    // Select the UPN input field
    const upnInput = document.getElementById("email");

    // Event listener for changes in the Name field
    nameInput.addEventListener("input", function () {
        const nameValue = this.value.trim(); // Get the trimmed value of Name input

        // Generate UPN based on Name value
        const generatedUPN = generateUPN(nameValue);

        // Update the UPN input field
        upnInput.value = generatedUPN;
    });

    // Function to generate UPN from Name
    function generateUPN(name) {
        // Replace spaces with dots and append domain suffix
        const domain = "@hamiltonsales.com";
        const upn = name.replace(/\s+/g, ".").toLowerCase() + domain;
        return upn;
    }

    // Initialize Airtable API
    const airtableApiKey =
        "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
    const baseId = "appFgKdBEAupaPDJ5";
    const tableName = "tbl1MpLdQKzdhzXqe";

    async function fetchUserDetails(name, email) {
        const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=AND({Name}='${name}', {UPN}='${email}')`;
        console.log(`Fetching user details from: ${url}`);
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${airtableApiKey}`
            }
        });
        const data = await response.json();
        console.log("User details fetched:", data);
        return data.records.length > 0 ? data.records[0] : null;
    }

    async function deleteUser(recordId) {
        const url = `https://api.airtable.com/v0/${baseId}/${tableName}/${recordId}`;
        console.log(`Deleting user from: ${url}`);
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${airtableApiKey}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to delete user from Airtable");
        }
        console.log("User deleted successfully");
    }

    // Function to open details modal with asset information
    function openDetailsModal(user) {
        console.log("Opening details modal for user:", user);
        const userTableBody = document
            .getElementById("userTable")
            .querySelector("tbody");
        userTableBody.innerHTML = `
            <tr><td>Name:</td><td>${user.fields.Name}</td></tr>
            <tr><td>UPN:</td><td>${user.fields.UPN}</td></tr>
            <tr><td>Area:</td><td>${user.fields.Area}</td></tr>
            <tr><td>Manager:</td><td>${user.fields.Manager}</td></tr>
            <tr><td>Job Title:</td><td>${user.fields["Job Title"]}</td></tr>
            <tr><td>Smartphone Asset ID:</td><td>${user.fields["Smartphone Asset ID"]}</td></tr>
            <tr><td>Smartphone Model:</td><td>${user.fields["Smartphone Model"]}</td></tr>
            <tr><td>Laptop Asset ID:</td><td>${user.fields["Laptop Asset ID"]}</td></tr>
            <tr><td>Laptop Model:</td><td>${user.fields["Laptop Model"]}</td></tr>
        `;
        document.getElementById("userModal").style.display = "block";
    }

    // Function to open confirmation modal
    function openConfirmationModal(userName) {
        console.log("Opening confirmation modal for user:", userName);
        document.getElementById("confirmationMessage").textContent =
            `${userName} deleted.`;
        document.getElementById("confirmationModal").style.display = "block";
    }

    // Event listener for form submission
    document
        .getElementById("contactForm")
        .addEventListener("submit", async function (event) {
            event.preventDefault();
            console.log("Form submitted");
            const name = document.getElementById("Name").value;
            const email = document.getElementById("email").value;
            console.log(`Form values - Name: ${name}, Email: ${email}`);
            if (name && email) {
                const user = await fetchUserDetails(name, email);
                if (user) {
                    openDetailsModal(user);
                    document
                        .getElementById("confirmButton")
                        .setAttribute("data-record-id", user.id);
                    document
                        .getElementById("confirmButton")
                        .setAttribute("data-user-name", user.fields.Name);
                } else {
                    alert("User not found in Airtable.");
                }
            }
        });

    // Close modals
    document.querySelectorAll(".close").forEach((closeButton) => {
        closeButton.addEventListener("click", () => {
            console.log("Closing modal");
            document.getElementById("userModal").style.display = "none";
            document.getElementById("confirmationModal").style.display = "none";
        });
    });

    // Close modals when clicking outside of them
    window.addEventListener("click", (event) => {
        if (event.target === document.getElementById("userModal")) {
            console.log("Closing user modal");
            document.getElementById("userModal").style.display = "none";
        }
        if (event.target === document.getElementById("confirmationModal")) {
            console.log("Closing confirmation modal");
            document.getElementById("confirmationModal").style.display = "none";
        }
    });

    // Event listener for confirm button in the first modal
    document
        .getElementById("confirmButton")
        .addEventListener("click", async () => {
            const recordId = document
                .getElementById("confirmButton")
                .getAttribute("data-record-id");
            const userName = document
                .getElementById("confirmButton")
                .getAttribute("data-user-name");
            console.log(
                `Confirm button clicked - Record ID: ${recordId}, User Name: ${userName}`
            );
            if (recordId) {
                try {
                    await deleteUser(recordId);
                    document.getElementById("userModal").style.display = "none";
                    openConfirmationModal(userName);
                } catch (error) {
                    alert("Failed to delete user: " + error.message);
                }
            }
        });

    // Event listener for homepage button in the confirmation modal
    document.getElementById("homeButton").addEventListener("click", () => {
        console.log("Redirecting to homepage");
        window.location.href = "homepage.html"; // Replace with your homepage URL
    });
});

//data_export.js

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

//contact.js

document.addEventListener("DOMContentLoaded", function () {
    const userList = document.getElementById("userList");
    const searchInput = document.getElementById("searchInput");
    const formContainer = document.getElementById("userInfo");
    let usersData = [];
    let allUsersDisplayed = false; // Track if all users are displayed

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

    // Identify the contact form
    const contactForm = document.getElementById("contactForm");
    console.log("Contact form:", contactForm);

    // Check if the contact form is identified
    if (contactForm) {
        // Log a message indicating the form is identified
        console.log("Contact form identified.");

        // Add event listener for form submission
        contactForm.addEventListener("submit", function (event) {
            console.log("Form submitted");
            event.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get("name");
            const email = formData.get("email");
            const subject = formData.get("subject");
            const phone = formData.get("phone");
            const message = formData.get("message");

            const emailBody = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nPhone: ${phone}\n\nMessage:\n${message}`;
            const mailtoLink = `mailto:tm470assetmanagement@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

            console.log("Mailto link:", mailtoLink);
        });
    } else {
        // Log a message if the form is not identified
        console.log("Contact form not found.");
    }
});


//connection_test.js

document.addEventListener('DOMContentLoaded', function() {
    // Your script here
    document.getElementById('testConnectionBtn').addEventListener('click', function() {
        const token = 'pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f'; // Ensure this token is correct
        const baseId = 'appFgKdBEAupaPDJ5'; // Replace with your Airtable Base ID
        const tableName = 'tbl1MpLdQKzdhzXqe'; // Replace with your Airtable Table Name

        const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized: Check your token and permissions.');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            showModal('Database connected');
        })
        .catch(error => {
            showModal('Error: ' + error.message + '. Please contact IT.');
        });
    });
    
    function showModal(message) {
        var modal = document.getElementById("myModal");
        var closeModalElements = document.getElementsByClassName("close")[0];
        var closeModalButton = document.getElementsByClassName("btn-close")[0];
        var modalMessage = document.getElementById("modalMessage");

        modalMessage.textContent = message;
        modal.style.display = "block";

        closeModalElements.onclick = function() {
            modal.style.display = "none";
        };

        closeModalButton.onclick = function() {
            modal.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }
});

//adminuser

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    // Mapping of links to their corresponding HTML pages
    const navLinks = {
        Home: "homepage.html",
        "Data Export": "data_export.html",
        "Requistion Form": "eForm.html",
        "New Employee": "new_user.html",
        "Connection Test": "connection_test.html",
        Contact: "contact.html",
        "Log Out": "index.html",
        "Employee List": "web_app.html"
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

    // Initialize Airtable API details
    const airtableApiKey =
        "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
    const airtableBaseId = "appFgKdBEAupaPDJ5";
    const airtableTableName = "tbl1MpLdQKzdhzXqe";

    // Function to create a new user in Airtable
    async function createUser(formData) {
        const url = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`;
        const headers = {
            Authorization: `Bearer ${airtableApiKey}`,
            "Content-Type": "application/json"
        };
        const body = JSON.stringify({
            fields: {
                Name: formData.Name,
                Area: formData.area,
                "Job Title": formData.jobTitle,
                "Laptop Model": formData.laptopModel,
                "Laptop Asset ID": formData.laptopAssetId,
                "Smartphone Model": formData.smartphoneModel,
                "Smartphone Asset ID": formData.smartphoneAssetId,
                UPN: formData.email
            }
        });

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: body
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Failed to create user in Airtable: ${JSON.stringify(errorData)}`
                );
            }

            const data = await response.json();
            console.log("User created successfully:", data);
            return data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error; // Propagate the error to handle it in the UI
        }
    }

    // Function to send email using EmailJS
    // Function to send email using EmailJS
    function sendEmail(formData) {
        emailjs.init("ycueR4Ao9IVKWtJVr"); // Replace with your EmailJS user ID

        // Specify your EmailJS service ID and template ID here
        const serviceId = "service_euf2b88";
        const templateId = "template_of0t5h3";

        // Add the selectedDate to formData if it's available
        const emailData = {
            ...formData,
            selectedDate: formData.selectedDate // Assuming formData.selectedDate is set properly
        };

        emailjs.send(serviceId, templateId, emailData).then(
            function (response) {
                console.log("Email sent successfully!", response);
                alert("Asset details updated and email sent successfully!");
            },
            function (error) {
                console.error("Failed to send email:", error);
                alert("Failed to send email. Please try again later.");
            }
        );
    }

    // Function to generate asset ID
    function generateRandomId(prefix) {
        const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
        return `${prefix}-${randomNumbers}`;
    }

    // Function to determine the manager based on job title and area
    function getManager(jobTitle, area) {
        if (
            [
                "CEO (Chief Executive Officer)",
                "COO (Chief Operating Officer)",
                "CFO (Chief Financial Officer)",
                "CTO (Chief Technology Officer)"
            ].includes(jobTitle)
        ) {
            return "Richard Hamilton";
        } else if (
            [
                "Managing Director - North",
                "Managing Director - South",
                "Managing Director - East",
                "Managing Director - West",
                "Managing Director - Southwest",
                "Managing Director - Northeast",
                "Managing Director - Southeast",
                "Managing Director - Northwest"
            ].includes(jobTitle)
        ) {
            return "Poppy Hamilton";
        } else if (jobTitle === "Area Manager - North") {
            return "James Parnell";
        } else if (jobTitle === "Area Manager - South") {
            return "Mauricio Howlett";
        } else if (jobTitle === "Area Manager - East") {
            return "Elnora Gonzalez";
        } else if (jobTitle === "Area Manager - West") {
            return "Carl Cash";
        } else if (jobTitle === "Area Manager - Southwest") {
            return "Ann Krug";
        } else if (jobTitle === "Area Manager - Northeast") {
            return "Denice Garhart";
        } else if (jobTitle === "Area Manager - Southeast") {
            return "Rachel Warren";
        } else if (jobTitle === "Area Manager - Northwest") {
            return "Mary Edwards";
        } else if (jobTitle === "Sales Associate") {
            switch (area) {
                case "North":
                    return "Karyn Edwards";
                case "South":
                    return "Paul Courtney";
                case "East":
                    return "Patricia Smith";
                case "West":
                    return "Robert Rodriguez";
                case "Southwest":
                    return "Lucille Srey";
                case "Northeast":
                    return "Scott Villalobos";
                case "Southeast":
                    return "Gary Boyers";
                case "Northwest":
                    return "Melissa Mills";
                default:
                    return "";
            }
        }
        return "";
    }

    // Function to open the new employee modal
    function openNewEmployeeModal(formData) {
        document.getElementById("modalName").value = formData.Name;
        document.getElementById("modalEmail").value = formData.email;
        document.getElementById("modalArea").value = formData.area;
        document.getElementById("modalJobTitle").value = formData.jobTitle;
        document.getElementById("modalLaptopModel").value =
            formData.laptopModel;
        document.getElementById("modalLaptopAssetId").value =
            formData.laptopAssetId;
        document.getElementById("modalSmartphoneModel").value =
            formData.smartphoneModel;
        document.getElementById("modalSmartphoneAssetId").value =
            formData.smartphoneAssetId;
        document.getElementById("modalManager").value =
            formData.requestingManager;
        

        const modal = document.getElementById("newEmployeeModal");
        modal.style.display = "block";
    }

    // Event listener for form submission
    document
        .getElementById("contactForm")
        .addEventListener("submit", function (event) {
            event.preventDefault();

            // Collect form data
            const formData = {
                Name: document.getElementById("Name").value,

                area: document.getElementById("area").value,
                jobTitle: document.getElementById("jobTitle").value,
                laptopModel: "",
                laptopAssetId: "",
                smartphoneModel: "",
                smartphoneAssetId: "",
                email: "",
                requestingManager: ""
            };

            // Generate UPN
            const nameParts = formData.Name.trim().split(" ");
            const emailPrefix = nameParts.join(".").toLowerCase();
            formData.email = `${emailPrefix}@hamiltonsales.com`;

            // Set laptop and smartphone models and asset IDs based on job title
            switch (formData.jobTitle) {
                case "CEO (Chief Executive Officer)":
                case "COO (Chief Operating Officer)":
                case "CFO (Chief Financial Officer)":
                case "CTO (Chief Technology Officer)":
                    formData.laptopModel = "Macbook Pro";
                    formData.laptopAssetId = generateRandomId("LAP");
                    formData.smartphoneModel = "iPhone 15";
                    formData.smartphoneAssetId = generateRandomId("SMPH");
                    break;
                case "Managing Director - North":
                case "Managing Director - South":
                case "Managing Director - East":
                case "Managing Director - West":
                case "Managing Director - Southwest":
                case "Managing Director - Northeast":
                case "Managing Director - Southeast":
                case "Managing Director - Northwest":
                    formData.laptopModel = "Dell XPS";
                    formData.laptopAssetId = generateRandomId("LAP");
                    formData.smartphoneModel = "Samsung S24";
                    formData.smartphoneAssetId = generateRandomId("SMPH");
                    break;
                case "Area Manager - North":
                case "Area Manager - South":
                case "Area Manager - East":
                case "Area Manager - West":
                case "Area Manager - Southwest":
                case "Area Manager - Northeast":
                case "Area Manager - Southeast":
                case "Area Manager - Northwest":
                    formData.laptopModel = "Lenovo P15";
                    formData.laptopAssetId = generateRandomId("LAP");
                    formData.smartphoneModel = "Samsung S24";
                    formData.smartphoneAssetId = generateRandomId("SMPH");
                    break;
                case "Sales Associate":
                    formData.laptopModel = "Dell 5520";
                    formData.laptopAssetId = generateRandomId("LAP");
                    formData.smartphoneModel = "Samsung A05";
                    formData.smartphoneAssetId = generateRandomId("SMPH");
                    break;
                default:
                    alert("Invalid job title selected.");
                    return;
            }

            // Determine the requesting manager
            formData.requestingManager = getManager(
                formData.jobTitle,
                formData.area
            );

            // Open modal with form data
            openNewEmployeeModal(formData);

            // Add event listener for the date input
            const dateInput = document.getElementById("todaysDate");
            dateInput.addEventListener("input", function () {
                const selectedDate = dateInput.value;
                console.log("Selected Date:", selectedDate);

                // Store selectedDate in a variable accessible to your modal submission logic
                formData.selectedDate = selectedDate; // Assuming formData is accessible here
            });

            document
                .getElementById("todaysDate")
                .addEventListener("input", function () {
                    formData.selectedDate = this.value; // Update formData with selected date
                });

            // Send email with form data
            sendEmail(formData);
        });

    // Event listener for modal submission
    document
        .getElementById("modalSubmitButton")
        .addEventListener("click", async function () {
            const formData = {
                Name: document.getElementById("modalName").value,

                email: document.getElementById("modalEmail").value,
                area: document.getElementById("modalArea").value,
                jobTitle: document.getElementById("modalJobTitle").value,
                laptopModel: document.getElementById("modalLaptopModel").value,
                laptopAssetId:
                    document.getElementById("modalLaptopAssetId").value,
                smartphoneModel: document.getElementById("modalSmartphoneModel")
                    .value,
                smartphoneAssetId: document.getElementById(
                    "modalSmartphoneAssetId"
                ).value,
                requestingManager: document.getElementById("modalManager").value
            };

            try {
                const user = await createUser(formData);
                alert(`User ${user.fields.Name} created successfully!`);

                // Send email with form data
                sendEmail(formData);

                // Close the modal after submission
                const modal = document.getElementById("newEmployeeModal");
                modal.style.display = "none";

                // Show confirmation modal
                const confirmationModal =
                    document.getElementById("confirmationModal");
                confirmationModal.style.display = "block";

                // Optionally, reset the form after successful submission
                document.getElementById("contactForm").reset();
            } catch (error) {
                alert("Failed to create user. Please try again later.");
                console.error("Error creating user:", error);
            }
        });

    // Event listener for closing modals
    document.querySelectorAll(".close").forEach(function (closeBtn) {
        closeBtn.addEventListener("click", function () {
            const modals = document.querySelectorAll(".modal");
            modals.forEach(function (modal) {
                modal.style.display = "none";
            });
        });
    });

    // Event listener for homepage button in the confirmation modal
    document.getElementById("homeButton").addEventListener("click", () => {
        console.log("Redirecting to homepage");
        window.location.href = "homepage.html"; // Replace with your homepage URL
    });
});