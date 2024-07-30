document.addEventListener("DOMContentLoaded", function () {
    const users = [
     const users = [
    { upn: "rich", password: "rich", role: "Senior Management", region: "all" },
    { upn: "carla.hamilton@hamiltonsales.com", password: "carla", role: "Senior Management", region: "all" },
    { upn: "poppy@hamiltonsales.com", password: "poppy", role: "Senior Management", region: "all" },
    { upn: "henry@hamiltonsales.com", password: "henry2024sales!", role: "Senior Management", region: "all" },
    { upn: "roger@hamiltonsales.com", password: "roger2024sales!", role: "Senior Management", region: "all" },
    { upn: "james.parnell@hamiltonsales.com", password: "james2024sales!", role: "Managing Director", region: "North" },
    { upn: "mauricio.howlett@hamiltonsales.com", password: "mauricio2024sales!", role: "Managing Director", region: "South" },
    { upn: "elnora.gonzalez@hamiltonsales.com", password: "elnora2024sales!", role: "Managing Director", region: "East" },
    { upn: "carl.cash@hamiltonsales.com", password: "carl2024sales!", role: "Managing Director", region: "West" },
    { upn: "ann.krug@hamiltonsales.com", password: "ann2024sales!", role: "Managing Director", region: "Southwest" },
    { upn: "denice.garhart@hamiltonsales.com", password: "denise2024sales!", role: "Managing Director", region: "Northeast" },
    { upn: "rachel.warren@hamiltonsales.com", password: "rachel2024sales!", role: "Managing Director", region: "Southeast" },
    { upn: "mary.edwards@hamiltonsales.com", password: "mary2024sales!", role: "Managing Director", region: "Northwest" },
    { upn: "karyn.edwards@hamiltonsales.com", password: "karyn2024sales!", role: "Area Manager", region: "North" },
    { upn: "paul.courtney@hamiltonsales.com", password: "paul2024sales!", role: "Area Manager", region: "South" },
    { upn: "patricia.smith@hamiltonsales.com", password: "patricia2024sales!", role: "Area Manager", region: "East" },
    { upn: "robert.rodriguez@hamiltonsales.com", password: "robert2024sales!", role: "Area Manager", region: "West" },
    { upn: "lucille.srey@hamiltonsales.com", password: "lucille2024sales!", role: "Area Manager", region: "Southwest" },
    { upn: "scott.villalobos@hamiltonsales.com", password: "scott2024sales!", role: "Area Manager", region: "Northeast" },
    { upn: "gary.boyers@hamiltonsales.com", password: "gary2024sales!", role: "Area Manager", region: "Southeast" },
    { upn: "melissa.mills@hamiltonsales.com", password: "melissa2024sales!", role: "Area Manager", region: "Northwest" },
    { upn: "admin", password: "admin", role: "admin", region: "all" },
    // New admin users
    { upn: "carlah", password: "carlah", role: "admin", region: "all" },
    { upn: "markh", password: "markh", role: "admin", region: "all" },
    { upn: "zacj", password: "zacj", role: "admin", region: "all" },
    { upn: "peterr", password: "peterr", role: "admin", region: "all" },
    { upn: "mandyr", password: "mandyr", role: "admin", region: "all" },
    { upn: "sherylr", password: "sherylr", role: "admin", region: "all" },
    { upn: "paulr", password: "paulr", role: "admin", region: "all" },
    { upn: "ianh", password: "ianh", role: "admin", region: "all" },
    { upn: "sueh", password: "sueh", role: "admin", region: "all" },
    { upn: "ellieh", password: "ellieh", role: "admin", region: "all" },
    { upn: "davet", password: "davet", role: "admin", region: "all" },
    { upn: "janeh", password: "janeh", role: "admin", region: "all" }
];


    // Login form submission handler
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const user = users.find((user) => user.upn === username && user.password === password);
            if (user) {
                sessionStorage.setItem("loggedInUser", JSON.stringify(user));

                window.location.href = "assetlist.html"; // Redirect to asset list page

              

            } else {
                alert("Invalid username or password");
            }
        });
    }
});
