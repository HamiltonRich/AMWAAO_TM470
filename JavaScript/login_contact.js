document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
    
    const contactForm = document.getElementById("contactForm");
    const modal = document.getElementById("thankYouModal");
    const modalMessage = document.getElementById("modalMessage");
    const closeBtn = document.querySelector(".close");
    const continueBtn = document.getElementById("continueButton");

    // Initialize EmailJS once the document is loaded
    emailjs.init("j99DxQx5GimFzJyu-"); // Replace with your EmailJS user ID
    console.log("EmailJS initialized");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("Form submitted");

            // Collect form data
            const formData = new FormData(contactForm);
            const templateParams = {};
            for (const [key, value] of formData.entries()) {
                templateParams[key] = value;
            }
            console.log("Form data collected", templateParams);

            // Send email
            emailjs.send("service_6atfsc6", "template_fykqqfs", templateParams).then(
                function (response) {
                    console.log("SUCCESS!", response.status, response.text);
                    modalMessage.textContent = "Thank you for your message, one of the team aims to respond in 24 hours.";
                    modal.style.display = "block";
                    contactForm.reset();
                },
                function (error) {
                    console.log("FAILED...", error);
                    modalMessage.textContent = "An error occurred while sending your message. Please try again later.";
                    modal.style.display = "block";
                }
            );
        });
    }

    // Modal close handling
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Redirect to index.html on continue
    continueBtn.addEventListener("click", function () {
        window.location.href = "../index.html";
    });

    // Close modal if the user clicks anywhere outside of the modal
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});
