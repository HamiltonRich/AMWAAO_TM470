document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

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
        document.getElementById("modalName").innerText = formData.Name;
        document.getElementById("modalEmail").innerText = formData.email;
        document.getElementById("modalArea").innerText = formData.area;
        document.getElementById("modalJobTitle").innerText = formData.jobTitle;
        document.getElementById("modalLaptopModel").innerText = formData.laptopModel;
        document.getElementById("modalLaptopAssetId").innerText = formData.laptopAssetId;
        document.getElementById("modalSmartphoneModel").innerText = formData.smartphoneModel;
        document.getElementById("modalSmartphoneAssetId").innerText = formData.smartphoneAssetId;
        document.getElementById("modalManager").innerText = formData.requestingManager;
        document.getElementById("modalStartDate").innerText = formData.startDate; // Set the start date in the modal

        const modal = document.getElementById("newEmployeeModal");
        modal.style.display = "block";
    }

    // Function to create a new user in Airtable
    async function createUser(formData) {
        const airtableApiKey = "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
        const airtableBaseId = "appFgKdBEAupaPDJ5";
        const airtableTableName = "tbl1MpLdQKzdhzXqe";
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
                // Do not include start date in the Airtable request
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
                throw new Error(`Failed to create user in Airtable: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log("User created successfully:", data);
            return data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error; // Propagate the error to handle it in the UI
        }
    }

    // Function to fetch existing user emails
    async function fetchExistingEmails() {
        const airtableApiKey = "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
        const airtableBaseId = "appFgKdBEAupaPDJ5";
        const airtableTableName = "tbl1MpLdQKzdhzXqe";
        const url = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`;
        const headers = {
            Authorization: `Bearer ${airtableApiKey}`,
            "Content-Type": "application/json"
        };

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to fetch emails from Airtable: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const emails = data.records.map(record => record.fields.UPN);
            return emails;
        } catch (error) {
            console.error("Error fetching emails:", error);
            throw error; // Propagate the error to handle it in the UI
        }
    }

    // Function to generate a unique email address
    async function generateUniqueEmail(name) {
        const existingEmails = await fetchExistingEmails();
        const nameParts = name.trim().split(" ");
        const emailPrefix = nameParts.join(".").toLowerCase();
        let email = `${emailPrefix}@hamiltonsales.com`;
        let counter = 1;

        while (existingEmails.includes(email)) {
            email = `${emailPrefix}${counter}@hamiltonsales.com`;
            counter++;
        }

        return email;
    }

    // Event listener for form submission
    document.getElementById("contactForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        // Collect form data
        const formData = {
            Name: document.getElementById("Name").value,
            area: document.getElementById("area").value,
            jobTitle: document.getElementById("jobTitle").value,
            startDate: document.getElementById("startDate").value, // Capture the start date from the form
            laptopModel: "",
            laptopAssetId: "",
            smartphoneModel: "",
            smartphoneAssetId: "",
            email: "",
            requestingManager: ""
        };

        // Generate a unique email
        formData.email = await generateUniqueEmail(formData.Name);

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
        formData.requestingManager = getManager(formData.jobTitle, formData.area);

        // Open modal with form data
        openNewEmployeeModal(formData);
    });

    // Event listener for modal submission
    document.getElementById("modalSubmitButton").addEventListener("click", async function () {
        const formData = {
            Name: document.getElementById("modalName").innerText,
            email: document.getElementById("modalEmail").innerText,
            area: document.getElementById("modalArea").innerText,
            jobTitle: document.getElementById("modalJobTitle").innerText,
            laptopModel: document.getElementById("modalLaptopModel").innerText,
            laptopAssetId: document.getElementById("modalLaptopAssetId").innerText,
            smartphoneModel: document.getElementById("modalSmartphoneModel").innerText,
            smartphoneAssetId: document.getElementById("modalSmartphoneAssetId").innerText,
            requestingManager: document.getElementById("modalManager").innerText
            // Do not include start date in the data sent to Airtable
        };

        try {
            const user = await createUser(formData);
            alert(`User ${user.fields.Name} created successfully!`);

            // Close the modal after submission
            const modal = document.getElementById("newEmployeeModal");
            modal.style.display = "none";

            // Show confirmation modal
            const confirmationModal = document.getElementById("confirmationModal");
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
        window.location.href = "assetList.html"; // Replace with your homepage URL
    });
});
