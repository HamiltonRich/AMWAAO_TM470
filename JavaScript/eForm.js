document.addEventListener("DOMContentLoaded", function () {
    console.log("Submit form script loaded");

    const airtableApiKey = "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
    const airtableBaseId = "appFgKdBEAupaPDJ5";
    const airtableTableName = "tbl1MpLdQKzdhzXqe";

    document.getElementById("Name").addEventListener("blur", async function () {
        const name = this.value.trim();
        console.log("Name input blurred, value: " + name);

        if (name) {
            try {
                const userRecords = await searchUserByName(name);

                if (userRecords.length === 0) {
                    alert("No matching user found in Airtable.");
                    return;
                }

                const userData = userRecords[0].fields;
                console.log("User data fetched: ", userData);

                document.getElementById("email").value = userData.UPN || "";
                document.getElementById("area").value = userData.Area || "";
                document.getElementById("jobTitle").value = userData["Job Title"] || "";
                document.getElementById("manager").value = userData.Manager || "";
                document.getElementById("laptopAssetId").value = userData["Laptop Asset ID"] || "";
                document.getElementById("smartphoneAssetId").value = userData["Smartphone Asset ID"] || "";
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert("Failed to fetch user data. Please try again later.");
            }
        }
    });

    document.getElementById("contactForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("Form submission triggered");

        const formData = {
            Name: document.getElementById("Name").value,
            email: document.getElementById("email").value,
            area: document.getElementById("area").value,
            jobTitle: document.getElementById("jobTitle").value,
            manager: document.getElementById("manager").value,
            laptopAssetId: document.getElementById("laptopAssetId").value,
            smartphoneAssetId: document.getElementById("smartphoneAssetId").value,
            laptopStatus: document.getElementById('laptopGroup').classList.contains('highlighted') ? 'Broken' : null,
            smartphoneStatus: document.getElementById('smartphoneGroup').classList.contains('highlighted') ? 'Broken' : null
        };

        console.log("Form data: ", formData);

        try {
            const userRecords = await searchUserByName(formData.Name);

            if (userRecords.length === 0) {
                alert("No matching user found in Airtable.");
                return;
            }

            const recordId = userRecords[0].id;
            console.log("Updating user record with ID: " + recordId);
            await updateUser(recordId, formData);

            let replacementMessage = "";

            if (formData.laptopStatus === 'Broken') {
                const replacementLaptop = await replaceDevice('Laptop Asset ID', 'Laptop Status', formData.laptopAssetId, formData.Name);
                if (replacementLaptop) {
                    replacementMessage += `Laptop (${formData.laptopAssetId}) marked as broken. Replacement laptop (${replacementLaptop}) has been assigned.\n`;
                } else {
                    replacementMessage += `Laptop (${formData.laptopAssetId}) marked as broken. No replacement laptop found.\n`;
                }
            }

            if (formData.smartphoneStatus === 'Broken') {
                const replacementSmartphone = await replaceDevice('Smartphone Asset ID', 'Smartphone Status', formData.smartphoneAssetId, formData.Name);
                if (replacementSmartphone) {
                    replacementMessage += `Smartphone (${formData.smartphoneAssetId}) marked as broken. Replacement smartphone (${replacementSmartphone}) has been assigned.\n`;
                } else {
                    replacementMessage += `Smartphone (${formData.smartphoneAssetId}) marked as broken. No replacement smartphone found.\n`;
                }
            }

            openRequestSentModal(replacementMessage);
            sendEmail(formData);
        } catch (error) {
            console.error("Error searching or updating user:", error);
            alert("Failed to search or update user. Please try again later.");
        }
    });

    async function searchUserByName(name) {
        const lowerCaseName = name.toLowerCase();
        const url = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?filterByFormula=LOWER(Name)="${lowerCaseName}"`;
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
                throw new Error(`Failed to search user in Airtable: ${JSON.stringify(errorData)}`);
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

        const fieldsToUpdate = {
            "Laptop Asset ID": formData.laptopAssetId,
            "Smartphone Asset ID": formData.smartphoneAssetId,
        };

        if (formData.laptopStatus) {
            fieldsToUpdate["Laptop Status"] = formData.laptopStatus;
        }

        if (formData.smartphoneStatus) {
            fieldsToUpdate["Smartphone Status"] = formData.smartphoneStatus;
        }

        const body = JSON.stringify({
            fields: fieldsToUpdate
        });

        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: headers,
                body: body
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update user in Airtable: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log("User updated successfully:", data);
            return data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    async function findSpareDevice(assetIdField, statusField) {
        const url = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?filterByFormula=AND({${statusField}}="Spare")`;
        console.log("Finding spare device with URL: ", url);
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
                throw new Error(`Failed to search spare device in Airtable: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log("Spare device search result:", data);
            return data.records;
        } catch (error) {
            console.error("Error searching spare device:", error);
            throw error;
        }
    }

    async function assignSpareDevice(spareRecordId, assetIdField, assetId) {
        const url = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}/${spareRecordId}`;
        const headers = {
            Authorization: `Bearer ${airtableApiKey}`,
            "Content-Type": "application/json"
        };

        const fieldsToUpdate = {};
        if (assetIdField === "Laptop Asset ID") {
            fieldsToUpdate["Laptop Status"] = "Assigned";
            fieldsToUpdate["Laptop Asset ID"] = assetId;
        } else if (assetIdField === "Smartphone Asset ID") {
            fieldsToUpdate["Smartphone Status"] = "Assigned";
            fieldsToUpdate["Smartphone Asset ID"] = assetId;
        }

        const body = JSON.stringify({
            fields: fieldsToUpdate
        });

        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: headers,
                body: body
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to assign spare device in Airtable: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log("Spare device assigned successfully:", data);
            return data.fields[assetIdField]; // Return the asset ID of the spare device
        } catch (error) {
            console.error("Error assigning spare device:", error);
            throw error;
        }
    }

    async function replaceDevice(assetIdField, statusField, modelValue, userName) {
        try {
            const spareDevices = await findSpareDevice(assetIdField, statusField);
            console.log("Spare devices found: ", spareDevices);

            if (spareDevices.length === 0) {
                console.log(`No spare device found for ${assetIdField}.`);
                return null;
            }

            const spareDevice = spareDevices[0];
            console.log("Spare device found: ", spareDevice);
            const replacementAssetId = await assignSpareDevice(spareDevice.id, assetIdField, spareDevice.fields[assetIdField]);
            return replacementAssetId;
        } catch (error) {
            console.error("Error replacing device:", error);
            alert("Failed to replace device. Please try again later.");
            return null;
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
            manager: formData.manager,
            laptop_asset_id: formData.laptopAssetId,
            smartphone_asset_id: formData.smartphoneAssetId,
            notes: formData.notes, // This will be included in the email but not sent to Airtable
        };

        emailjs.send(serviceId, templateId, emailData).then(
            function (response) {
                console.log("Email sent successfully!", response);
                alert("Request sent and email sent successfully!");
            },
            function (error) {
                console.error("Failed to send email:", error);
                alert("Failed to send email. Please try again later.");
            }
        );
    }

    function openRequestSentModal(message) {
        const modal = document.getElementById("requestSentModal");
        modal.querySelector('.modal-message').innerText = message;
        modal.style.display = "block";
        console.log("Request sent modal displayed with message: " + message);
    }

    document.getElementById("goToHomepageButton").addEventListener("click", function () {
        window.location.href = "assetList.html";
    });
});
