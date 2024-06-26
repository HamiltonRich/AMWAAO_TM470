document.addEventListener("DOMContentLoaded", function () {
    // Array of users with UPNs and passwords
    const users = [
        { upn: "rich@hamiltonsales.com", password: "rich" },
        { upn: "poppy@hamiltonsales.com", password: "poppy" },
        { upn: "henry@hamiltonsales.com", password: "henry2024sales!" },
        { upn: "roger@hamiltonsales.com", password: "roger2024sales!" },
        { upn: "james.parnell@hamiltonsales.com", password: "james2024sales!" },
        { upn: "mauricio.howlett@hamiltonsales.com", password: "mauricio2024sales!" },
        { upn: "elnora.gonzalez@hamiltonsales.com", password: "elnora2024sales!" },
        { upn: "carl.cash@hamiltonsales.com", password: "carl2024sales!" },
        { upn: "ann.krug@hamiltonsales.com", password: "ann2024sales!" },
        { upn: "denice.garhart@hamiltonsales.com", password: "denise2024sales!" },
        { upn: "rachel.warren@hamiltonsales.com", password: "rachel2024sales!" },
        { upn: "mary.edwards@hamiltonsales.com", password: "mary2024sales!" },
        { upn: "karyn.edwards@hamiltonsales.com", password: "karyn2024sales!" },
        { upn: "paul.courtney@hamiltonsales.com", password: "paul2024sales!" },
        { upn: "patricia.smith@hamiltonsales.com", password: "patricia2024sales!" },
        { upn: "robert.rodriguez@hamiltonsales.com", password: "robert2024sales!" },
        { upn: "lucille.srey@hamiltonsales.com", password: "lucille2024sales!" },
        { upn: "scott.villalobos@hamiltonsales.com", password: "scott2024sales!" },
        { upn: "gary.boyers@hamiltonsales.com", password: "gary2024sales!" },
        { upn: "melissa.mills@hamiltonsales.com", password: "melissa2024sales!" },
        { upn: "admin", password: "admin" }
    ];

    // Event listener for the login form
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get username and password input values
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Check if the provided credentials are valid
        const user = users.find(user => user.upn === username && user.password === password);
        if (user) {
            // Redirect to homepage.html
            window.location.href = "HTML/homepage.html";
        } else {
            // If credentials are invalid, display an error message
            alert("Invalid username or password");
        }
    });

    // Event listener for the contact link
    const contactLink = document.getElementById("contact");
    contactLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        // Redirect to the contact page
        window.location.href = "HTML/login_contact.html";
    });
});
