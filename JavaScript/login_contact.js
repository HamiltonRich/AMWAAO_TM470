document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    // Initialize EmailJS once the document is loaded
    emailjs.init("j99DxQx5GimFzJyu-"); // Replace with your EmailJS user ID

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // Collect form data
            const formData = new FormData(contactForm);
            const templateParams = {};
            for (const [key, value] of formData.entries()) {
                templateParams[key] = value;
            }

            // Send email
            emailjs
                .send("service_6atfsc6", "template_fykqqfs", templateParams)
                .then(
                    function (response) {
                        console.log("SUCCESS!", response.status, response.text);
                        alert("Email sent successfully!");
                        contactForm.reset();
                    },
                    function (error) {
                        console.log("FAILED...", error);
                        alert("An error occurred while sending the email.");
                    }
                );
        });
    }
});
