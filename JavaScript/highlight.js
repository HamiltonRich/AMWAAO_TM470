function toggleHighlight(element) {
    element.classList.toggle('highlighted');
    console.log(element.id + " highlighted: " + element.classList.contains('highlighted'));
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("Highlight script loaded");

    // Add event listeners only to laptop and smartphone fields
    document.getElementById("laptopGroup").addEventListener('click', function () {
        console.log("Laptop group clicked");
        toggleHighlight(this);
    });

    document.getElementById("smartphoneGroup").addEventListener('click', function () {
        console.log("Smartphone group clicked");
        toggleHighlight(this);
    });
});
