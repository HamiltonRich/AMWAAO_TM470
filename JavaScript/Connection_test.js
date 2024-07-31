document.addEventListener('DOMContentLoaded', function() {
    // Test connection to Airtable
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

    // Export Asset Register as CSV
    document.getElementById('exportAssetRegisterBtn').addEventListener('click', function() {
        console.log('Export Asset Register button clicked');
        const token = 'pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f';
        const baseId = 'appFgKdBEAupaPDJ5';
        const tableName = 'tbl1MpLdQKzdhzXqe'; // Asset Register Table ID

        exportTableToCSV(token, baseId, tableName, 'AssetRegister.csv', 'Area');
    });

    // Export Application Logs as CSV
    document.getElementById('exportAppLogsBtn').addEventListener('click', function() {
        console.log('Export Application Logs button clicked');
        const token = 'pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f';
        const baseId = 'appFgKdBEAupaPDJ5';
        const tableName = 'tblX1O3CZUbbpQBZF'; // Application Logs Table ID

        exportTableToCSV(token, baseId, tableName, 'ApplicationLogs.csv', 'Time');
    });

    async function exportTableToCSV(token, baseId, tableName, filename, sortField) {
        console.log('Exporting table to CSV:', tableName);
        let records = [];
        let offset = '';
        let url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

        try {
            while (true) {
                let fetchUrl = offset ? `${url}?offset=${offset}` : url;
                let response = await fetch(fetchUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                let data = await response.json();
                records = records.concat(data.records);

                if (!data.offset) {
                    break;
                }

                offset = data.offset;
            }

            console.log('Data fetched:', records);
            const sortedRecords = records.sort((a, b) => {
                if (a.fields[sortField] < b.fields[sortField]) return -1;
                if (a.fields[sortField] > b.fields[sortField]) return 1;
                return 0;
            });
            const csvData = convertToCSV(sortedRecords);
            downloadCSV(csvData, filename);
        } catch (error) {
            console.error('Fetch error:', error);
            showModal('Error: ' + error.message + '. Please contact IT.');
        }
    }

    function convertToCSV(records) {
        if (!records || records.length === 0) {
            console.error('No records to convert');
            return '';
        }

        const headers = Object.keys(records[0].fields);
        const csvRows = [headers.join(',')];

        records.forEach(record => {
            const values = headers.map(header => {
                const escaped = ('' + record.fields[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        });

        console.log('CSV data:', csvRows);
        return csvRows.join('\n');
    }

    function downloadCSV(csvData, filename) {
        console.log('Downloading CSV:', filename);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

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
