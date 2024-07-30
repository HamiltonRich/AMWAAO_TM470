document.addEventListener("DOMContentLoaded", function () {
    // Tooltip functionality
    const infoIcon = document.querySelector(".info-icon");
    const tooltip = document.querySelector(".tooltip");

    infoIcon.addEventListener("mouseenter", () => {
        // Show tooltip to get accurate bounding box
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";

        const tooltipRect = tooltip.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Reset any previous styling
        tooltip.style.left = "50%";
        tooltip.style.right = "auto";
        tooltip.style.transform = "translateX(-50%)";
        tooltip.style.top = "125%"; // Position below the icon
        tooltip.style.bottom = "auto";

        // Adjust if the tooltip goes beyond the right edge
        if (tooltipRect.right > windowWidth) {
            tooltip.style.left = "auto";
            tooltip.style.right = "0";
            tooltip.style.transform = "translateX(-10%)";
        }

        // Adjust if the tooltip goes beyond the left edge
        if (tooltipRect.left < 0) {
            tooltip.style.left = "10px";
            tooltip.style.right = "auto";
            tooltip.style.transform = "none";
        }

        // Adjust if the tooltip goes beyond the bottom edge
        if (tooltipRect.bottom > windowHeight) {
            tooltip.style.top = "auto";
            tooltip.style.bottom = "125%"; // Position above the icon
        }

        // Hide tooltip again to wait for hover
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    });

    infoIcon.addEventListener("mouseleave", () => {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    });

    // Mapping of data-target values to their corresponding HTML pages
    const navLinks = {
        home: "assetList.html",
        "requisition-form": "eForm.html",
      
        "staff-list": "web_app.html",
        "new-starter": "new_user.html",
        delete_user: "delete_user.html",
        "Connection-test": "connection_test.html",
        contact: "contact.html",
        about: "about.html", // Added the about page
        logout: "../index.html"
    };

    // Display logged-in user's info
    const userInfo = document.getElementById("loggedIn");
    const userDetails = document.getElementById("userDetails");
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!userInfo) {
        console.error("Element with id 'loggedIn' not found.");
        return;
    }

    if (!userDetails) {
        console.error("Element with id 'userDetails' not found.");
        return;
    }

    if (!loggedInUser) {
        console.error("No loggedInUser found in sessionStorage.");
        return;
    }

    if (!loggedInUser.upn) {
        console.error("loggedInUser does not have a 'upn' property.");
        return;
    }

    try {
        const initials = loggedInUser.upn.split("@")[0].match(/\b\w/g).join(""); // Get initials
        userInfo.textContent = initials;
        console.log("User initials set to:", initials);
    } catch (error) {
        console.error("Error while setting user initials:", error);
    }

    // Fetch data from Airtable
    function fetchAPIData() {
        const apiKey = "pathlZBPR0j4BULEk.6690b0d15be652f21f7097302c4ec4cdbd3f765dd68e8f14a734b7f687c5c87f";
        const baseId = "appFgKdBEAupaPDJ5";
        const tableName = "tbl1MpLdQKzdhzXqe";
        const maxRecords = 500;
        let offset = "";

        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
            alert("User not logged in!");
            return;
        }

        const userRegion = loggedInUser.region;
        let filterFormula = "";
        if (userRegion !== "all") {
            filterFormula = `&filterByFormula=${encodeURIComponent(`{REGION}='${userRegion}'`)}`;
        }

        const fetchData = () => {
            const url = `https://api.airtable.com/v0/${baseId}/${tableName}?maxRecords=${maxRecords}&offset=${offset}${filterFormula}`;

            fetch(url, {
                headers: {
                    Authorization: `Bearer ${apiKey}`
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((errorData) => {
                            throw new Error(`Error fetching API data: ${JSON.stringify(errorData)}`);
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.records) {
                        const usersData = data.records.map((record) => record.fields);
                        displayUsers(usersData);
                    }

                    if (data.offset) {
                        offset = data.offset;
                        fetchData(); // Fetch next page recursively
                    }
                })
                .catch((error) => console.error(error.message));
        };

        fetchData();
    }

    function displayUsers(users) {
        // Here you would display users if needed, or handle them as per your application's requirements
        console.log(users);
    }

    fetchAPIData();

    // Add event listeners to each nav-link
    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior
            const target = this.getAttribute("data-target");
            if (navLinks[target]) {
                window.location.href = navLinks[target];
            } else {
                console.error(`No URL found for target: ${target}`);
            }
        });
    });
});
