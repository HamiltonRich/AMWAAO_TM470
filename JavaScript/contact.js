document.addEventListener("DOMContentLoaded", function () {
    const userList = document.getElementById("userList");
    const searchInput = document.getElementById("searchInput");
    const formContainer = document.getElementById("userInfo");
    let usersData = [];
    let allUsersDisplayed = false; // Track if all users are displayed

    // Event listener for the logout button
    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener("click", function () {
        // Redirect to the login page
        window.location.href = "login.html";
    });

    // Event listener for the contact link
    const contactLink = document.getElementById("contact");
    contactLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        // Redirect to the contact page
        window.location.href = "contact.html";
    });

    // Event listener for the home link
    const homeLink = document.getElementById("homeLink");
    homeLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        // Redirect to the homepage
        window.location.href = "homepage.html";
    });

    // Identify the contact form
    const contactForm = document.getElementById("contactForm");
    console.log("Contact form:", contactForm);

    // Check if the contact form is identified
    if (contactForm) {
        // Log a message indicating the form is identified
        console.log("Contact form identified.");

        // Add event listener for form submission
        contactForm.addEventListener("submit", function (event) {
            console.log("Form submitted");
            event.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get("name");
            const email = formData.get("email");
            const subject = formData.get("subject");
            const phone = formData.get("phone");
            const message = formData.get("message");

            const emailBody = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nPhone: ${phone}\n\nMessage:\n${message}`;
            const mailtoLink = `mailto:tm470assetmanagement@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

            console.log("Mailto link:", mailtoLink);
        });
    } else {
        // Log a message if the form is not identified
        console.log("Contact form not found.");
    }
});
