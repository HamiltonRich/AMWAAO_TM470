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