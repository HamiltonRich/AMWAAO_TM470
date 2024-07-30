document.addEventListener("DOMContentLoaded", function () {
  
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
