document.addEventListener("DOMContentLoaded", () => {
    const apiKey =
        "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
    const baseId = "appFgKdBEAupaPDJ5";
    const tableId = "tbl1MpLdQKzdhzXqe";

    // Get the modal
    const modal = document.getElementById("myModal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
async function fetchAssets(assetType) {
    let filterFormula;
    let title;
    let modelFieldName;

    switch (assetType) {
        case "Operational Laptops":
            filterFormula = "AND({Laptop Status} = 'Assigned')";
            title = "Operational Laptops";
            modelFieldName = "Laptop Model";
            break;
        case "Operational Phones":
            filterFormula = "AND({Smartphone Status} = 'Assigned')";
            title = "Operational Phones";
            modelFieldName = "Smartphone Model";
            break;
        case "Spare Laptops":
            filterFormula = "AND({Laptop Status} = 'Spare')";
            title = "Spare Laptops";
            modelFieldName = "Laptop Model";
            break;
        case "Spare Phones":
            filterFormula = "AND({Smartphone Status} = 'Spare')";
            title = "Spare Phones";
            modelFieldName = "Smartphone Model";
            break;
        default:
            return;
    }

    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    try {
        console.log(`Fetching assets for: ${assetType}`);
        let offset = '';
        let modelCounts = {};

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
            records.forEach(record => {
                const model = record.fields[modelFieldName];
                if (model) {
                    modelCounts[model] = (modelCounts[model] || 0) + 1;
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
        modalBody.innerHTML = modalBodyContent || 'No assets found.';
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
});