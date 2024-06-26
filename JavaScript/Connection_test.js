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
