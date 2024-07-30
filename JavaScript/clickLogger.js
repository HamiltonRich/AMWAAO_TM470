document.addEventListener("DOMContentLoaded", function () {
    function logClick(event) {
        const element = event.target;
        const tagName = element.tagName;
        const classes = element.className;
        const id = element.id;
        const pageUrl = window.location.href;
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const elementText = element.textContent || element.innerText;
        const userAgent = navigator.userAgent;
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
        const username = loggedInUser ? loggedInUser.upn : "unknown";

        const clickData = { 
            tagName, classes, id, pageUrl, mouseX, mouseY, elementText, userAgent, username 
        };
        console.log("Click data:", clickData); // Log click data for debugging
        sendToAirtable(clickData);
    }

    function sendToAirtable(data) {
        const apiKey = 'pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f';
        const baseId = 'appFgKdBEAupaPDJ5';
        const tableName = 'clickLogger';

        fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    Element: data.tagName,
                    Classes: data.classes,
                    ID: data.id,
                    PageURL: data.pageUrl,
                    MouseX: data.mouseX,
                    MouseY: data.mouseY,
                    ElementText: data.elementText,
                    UserAgent: data.userAgent,
                    Username: data.username
                }
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(`Airtable error: ${JSON.stringify(error)}`);
                });
            }
            return response.json();
        })
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
    }

    document.body.addEventListener("click", logClick);
});
