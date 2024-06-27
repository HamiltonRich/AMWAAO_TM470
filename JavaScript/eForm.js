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
    function toggleMenu() {
        const sideNav = document.getElementById("sideNav");
        sideNav.classList.toggle("open");
    }
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
                requiredByDate: document.getElementById("requiredByDate").value
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
                "Smartphone Asset ID": formData.smartphoneAssetId
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