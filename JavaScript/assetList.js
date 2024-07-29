document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
    const baseId = "appFgKdBEAupaPDJ5";
    const tableName = "tbl1MpLdQKzdhzXqe";
    let usersData = [];
    let chart;

    async function fetchAPIData() {
        const maxRecords = 100; // Airtable limits maxRecords to 100 per request
        let offset = "";

        while (true) {
            const url = `https://api.airtable.com/v0/${baseId}/${tableName}?pageSize=${maxRecords}&offset=${offset}`;
            try {
                const response = await fetch(url, {
                    headers: { Authorization: `Bearer ${apiKey}` }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched data:", data); // Debugging line to check fetched data
                usersData.push(...data.records.map(record => record.fields));
                if (!data.offset) {
                    break;
                }
                offset = data.offset;
            } catch (error) {
                console.error("Error fetching API data:", error);
                return;
            }
        }
        console.log("Complete data:", usersData); // Debugging line to check complete data
        renderChart(usersData);
    }

    function renderChart(users) {
        if (!users.length) {
            console.error("No user data to render chart");
            return;
        }

        // Destroy previous chart instance if it exists
        if (chart) {
            chart.destroy();
        }

        // Group data by model and status for laptops and smartphones
        const laptopModels = {};
        const smartphoneModels = {};

        users.forEach(user => {
            if (user["Laptop Model"]) {
                const model = user["Laptop Model"];
                const status = user["Laptop Status"];
                if (!laptopModels[model]) {
                    laptopModels[model] = { assigned: 0, spare: 0, broken: 0 };
                }
                if (status === "Assigned") {
                    laptopModels[model].assigned += 1;
                } else if (status === "Spare") {
                    laptopModels[model].spare += 1;
                } else if (status === "Broken") {
                    laptopModels[model].broken += 1;
                }
            }
            if (user["Smartphone Model"]) {
                const model = user["Smartphone Model"];
                const status = user["Smartphone Status"];
                if (!smartphoneModels[model]) {
                    smartphoneModels[model] = { assigned: 0, spare: 0, broken: 0 };
                }
                if (status === "Assigned") {
                    smartphoneModels[model].assigned += 1;
                } else if (status === "Spare") {
                    smartphoneModels[model].spare += 1;
                } else if (status === "Broken") {
                    smartphoneModels[model].broken += 1;
                }
            }
        });

        console.log("Laptop Models:", laptopModels);
        console.log("Smartphone Models:", smartphoneModels);

        // Prepare data for Chart.js
        const laptopLabels = Object.keys(laptopModels);
        const laptopAssignedData = laptopLabels.map(model => laptopModels[model].assigned);
        const laptopSpareData = laptopLabels.map(model => laptopModels[model].spare);
        const laptopBrokenData = laptopLabels.map(model => laptopModels[model].broken);

        const smartphoneLabels = Object.keys(smartphoneModels);
        const smartphoneAssignedData = smartphoneLabels.map(model => smartphoneModels[model].assigned);
        const smartphoneSpareData = smartphoneLabels.map(model => smartphoneModels[model].spare);
        const smartphoneBrokenData = smartphoneLabels.map(model => smartphoneModels[model].broken);

        const ctx = document.getElementById('assetChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [...laptopLabels, ...smartphoneLabels],
                datasets: [
                    {
                        label: 'Operational Laptops',
                        data: [...laptopAssignedData, ...Array(smartphoneLabels.length).fill(0)],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        barThickness: 65, // Set explicit bar thickness
                    },
                    {
                        label: 'Spare Laptops',
                        data: [...laptopSpareData, ...Array(smartphoneLabels.length).fill(0)],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        barThickness: 65, // Set explicit bar thickness
                    },
                    {
                        label: 'Broken Laptops',
                        data: [...laptopBrokenData, ...Array(smartphoneLabels.length).fill(0)],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        barThickness: 65, // Set explicit bar thickness
                    },
                    {
                        label: 'Operational Phones',
                        data: [...Array(laptopLabels.length).fill(0), ...smartphoneAssignedData],
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 1,
                        barThickness: 65, // Set explicit bar thickness
                    },
                    {
                        label: 'Spare Phones',
                        data: [...Array(laptopLabels.length).fill(0), ...smartphoneSpareData],
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                        barThickness: 65, // Set explicit bar thickness
                    },
                    {
                        label: 'Broken Phones',
                        data: [...Array(laptopLabels.length).fill(0), ...smartphoneBrokenData],
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1,
                        barThickness: 65, // Set explicit bar thickness
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true, // Ensure bars are stacked
                        offset: true, // Offset the bars
                        categoryPercentage: 0.5, // Control the width of categories
                        barPercentage: 0.7, // Control the width of bars within categories
                        grid: {
                            offset: true // Offset the grid lines
                        }
                    },
                    y: { 
                        beginAtZero: true,
                        stacked: true, // Ensure y-axis stacking is enabled
                        ticks: {
                            stepSize: 10 // Ensure step size is 10
                        }
                    }
                }
            }
        });
    }

    function convertToCSV(data) {
        if (data.length === 0) return '';
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

    fetchAPIData();
});
