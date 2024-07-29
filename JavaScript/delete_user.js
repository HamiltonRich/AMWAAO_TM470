document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    emailjs.init("ycueR4Ao9IVKWtJVr"); // Replace with your EmailJS user ID

    // Select the Name input field
    const nameInput = document.getElementById("Name");

    // Select the UPN input field
    const upnInput = document.getElementById("email");

    // Function to capitalize first letter of each part of the name
    function capitalizeName(name) {
        return name.replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });
    }

    // Function to generate UPN from Name
    function generateUPN(name) {
        const domain = "@hamiltonsales.com";
        const upn = name.replace(/\s+/g, ".").toLowerCase() + domain;
        return upn;
    }

    // Event listener for changes in the Name field
    nameInput.addEventListener("blur", function () {
        const nameValue = this.value.trim(); // Get the trimmed value of Name input
        const capitalizedValue = capitalizeName(nameValue);
        this.value = capitalizedValue; // Set the capitalized value back to the input

        // Generate UPN based on Name value
        const generatedUPN = generateUPN(capitalizedValue);

        // Update the UPN input field
        upnInput.value = generatedUPN;
    });

    // Initialize Airtable API
    const airtableApiKey = "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
    const baseId = "appFgKdBEAupaPDJ5";
    const tableName = "tbl1MpLdQKzdhzXqe";
    const assetsTableName = "tblAssetsTableName"; // Replace with your actual assets table name

    async function fetchUserDetails(email) {
        const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula={UPN}='${email}'`;
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

    async function updateAssetStatus(assetId, assetType) {
        const filterFormula = `filterByFormula=${encodeURIComponent(`{Asset ID}="${assetId}"`)}`;
        const url = `https://api.airtable.com/v0/${baseId}/${assetsTableName}?${filterFormula}`;
        console.log(`Updating asset status from: ${url}`);

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${airtableApiKey}`
                }
            });

            if (response.status === 403) {
                throw new Error("Access denied: Check your API key and permissions.");
            }

            const data = await response.json();
            if (data.records.length === 0) {
                throw new Error(`${assetType} with ID ${assetId} not found`);
            }

            const assetRecordId = data.records[0].id;

            const updateUrl = `https://api.airtable.com/v0/${baseId}/${assetsTableName}/${assetRecordId}`;
            const updateResponse = await fetch(updateUrl, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${airtableApiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fields: {
                        Status: "spare"
                    }
                })
            });

            if (!updateResponse.ok) {
                throw new Error(`Failed to update ${assetType} status to spare`);
            }
            console.log(`${assetType} status updated to spare`);
        } catch (error) {
            console.error(error);
        }
    }

    function openDetailsModal(user) {
        console.log("Opening details modal for user:", user);
        const userTableBody = document.getElementById("userTable").querySelector("tbody");
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

    function openConfirmationModal(userName) {
        console.log("Opening confirmation modal for user:", userName);
        document.getElementById("confirmationMessage").textContent = `${userName} deleted.`;
        document.getElementById("confirmationModal").style.display = "block";
    }

    document.getElementById("contactForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("Form submitted");
        const email = document.getElementById("email").value;
        console.log(`Form values - Email: ${email}`);
        if (email) {
            const user = await fetchUserDetails(email);
            if (user) {
                openDetailsModal(user);
                document.getElementById("modalSubmitButton").setAttribute("data-record-id", user.id);
                document.getElementById("modalSubmitButton").setAttribute("data-user-name", user.fields.Name);
                document.getElementById("modalSubmitButton").setAttribute("data-laptop-asset-id", user.fields["Laptop Asset ID"]);
                document.getElementById("modalSubmitButton").setAttribute("data-smartphone-asset-id", user.fields["Smartphone Asset ID"]);
            } else {
                console.log("User not found in Airtable.");
                alert("User not found in Airtable.");
            }
        }
    });

    document.querySelectorAll(".close").forEach((closeButton) => {
        closeButton.addEventListener("click", () => {
            console.log("Closing modal");
            document.getElementById("userModal").style.display = "none";
            document.getElementById("confirmationModal").style.display = "none";
        });
    });

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

    const modalSubmitButton = document.getElementById("modalSubmitButton");

    if (modalSubmitButton) {
        modalSubmitButton.addEventListener("click", async () => {
            const recordId = modalSubmitButton.getAttribute("data-record-id");
            const userName = modalSubmitButton.getAttribute("data-user-name");
            const laptopAssetId = modalSubmitButton.getAttribute("data-laptop-asset-id");
            const smartphoneAssetId = modalSubmitButton.getAttribute("data-smartphone-asset-id");
            
            console.log(`Confirm button clicked - Record ID: ${recordId}, User Name: ${userName}, Laptop Asset ID: ${laptopAssetId}, Smartphone Asset ID: ${smartphoneAssetId}`);
            
            if (recordId) {
                try {
                    if (laptopAssetId) {
                        await updateAssetStatus(laptopAssetId, "Laptop");
                    }
                    if (smartphoneAssetId) {
                        await updateAssetStatus(smartphoneAssetId, "Smartphone");
                    }
                    await deleteUser(recordId);
                    document.getElementById("userModal").style.display = "none";
                    openConfirmationModal(userName);
                } catch (error) {
                    console.error("Failed to delete user:", error);
                }
            }
        });
    } else {
        console.error("modalSubmitButton not found in the DOM.");
    }

    document.getElementById("homeButton").addEventListener("click", () => {
        console.log("Redirecting to homepage");
        window.location.href = "assetList.html"; // Replace with your homepage URL
    });
});
