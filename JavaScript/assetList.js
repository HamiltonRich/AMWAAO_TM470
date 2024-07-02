document.addEventListener("DOMContentLoaded", () => {
    const apiKey =
        "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
    const baseId = "appFgKdBEAupaPDJ5";
    const tableId = "tbl1MpLdQKzdhzXqe";

    // Get the modal
    const modal = document.getElementById("myModal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const exportButton = document.getElementById("export-button");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    let fetchedData = [];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    };

    // Mapping of links to their corresponding HTML pages
    const navLinks = {
        Home: "homepage.html",
        "Asset Inventory": "assetList.html.html",
        "Requistion Form": "eForm.html",
        "New Employee": "new_user.html",
        "Delete User": "delete_user.html",
        "Connection Test": "connection_test.html",
        Contact: "contact.html",
        "Log Out": "index.html",
        "Staff List": "web_app.html"
        
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    function convertToCSV(data) {
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map((row) => Object.values(row).join(","));
        return `${headers}\n${rows.join("\n")}`;
    }

    function downloadCSV(csv, filename) {
        const csvFile = new Blob([csv], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    exportButton.addEventListener("click", () => {
        if (fetchedData.length > 0) {
            const csv = convertToCSV(fetchedData);
            const title = modalTitle.innerText.replace(/ /g, "_");
            downloadCSV(csv, `${title}_data.csv`);
        }
    });

    async function fetchAssets(assetType) {
        let filterFormula;
        let title;
        let modelFieldName;
        let idFieldName;
        let nameFieldName;

        switch (assetType) {
            case "Operational Laptops":
                filterFormula = "AND({Laptop Status} = 'Assigned')";
                title = "Operational Laptops";
                modelFieldName = "Laptop Model";
                idFieldName = "Laptop Asset ID";
                nameFieldName = "Name";
                break;
            case "Operational Phones":
                filterFormula = "AND({Smartphone Status} = 'Assigned')";
                title = "Operational Phones";
                modelFieldName = "Smartphone Model";
                idFieldName = "Smartphone Asset ID";
                nameFieldName = "Name";
                break;
            case "Spare Laptops":
                filterFormula = "AND({Laptop Status} = 'Spare')";
                title = "Spare Laptops";
                modelFieldName = "Laptop Model";
                idFieldName = "Laptop Asset ID";
                nameFieldName = "Name";
                break;
            case "Spare Phones":
                filterFormula = "AND({Smartphone Status} = 'Spare')";
                title = "Spare Phones";
                modelFieldName = "Smartphone Model";
                idFieldName = "Smartphone Asset ID";
                nameFieldName = "Name";
                break;
            default:
                return;
        }

        const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${encodeURIComponent(filterFormula)}`;

        try {
            console.log(`Fetching assets for: ${assetType}`);
            let offset = "";
            let modelCounts = {};
            fetchedData = [];

            do {
                // Make API request with pagination offset
                const response = await fetch(`${url}&offset=${offset}`, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Data fetched successfully:", data);
                const records = data.records;

                // Process records and count model occurrences
                records.forEach((record) => {
                    const model = record.fields[modelFieldName];
                    if (model) {
                        modelCounts[model] = (modelCounts[model] || 0) + 1;
                        fetchedData.push({
                            [nameFieldName]: record.fields[nameFieldName],
                            [modelFieldName]: model,
                            [idFieldName]: record.fields[idFieldName]
                        });
                    }
                });

                // Update offset for next page of records
                offset = data.offset;
            } while (offset);

            // Construct modal content with model breakdown
            let modalBodyContent = "";
            for (const [model, count] of Object.entries(modelCounts)) {
                modalBodyContent += `${count} ${model}<br>`;
            }

            console.log("Modal content:", modalBodyContent);

            // Update modal with content
            modalTitle.innerText = title;
            modalBody.innerHTML = modalBodyContent || "No assets found.";
            modal.style.display = "block";
        } catch (error) {
            console.error(`Error fetching assets for ${assetType}:`, error);
            modalTitle.innerText = "Error";
            modalBody.innerText = `Failed to fetch assets for ${assetType}. Please try again later.`;
            modal.style.display = "block";
        }
    }

    // Add event listeners to the tiles
    document.querySelectorAll(".tile").forEach((tile) => {
        tile.addEventListener("click", () => {
            const assetType = tile.dataset.type;
            fetchAssets(assetType);
        });
    });

    // Add event listeners to the sidebar links
    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const target = link.getAttribute("data-target");
            if (navLinks[target]) {
                window.location.href = navLinks[target];
            } else {
                console.error(`No URL found for target: ${target}`);
            }
        });
    });
});