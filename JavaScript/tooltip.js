document.addEventListener("DOMContentLoaded", function () {
    const infoIcon = document.querySelector(".info-icon");
    const tooltip = document.querySelector(".tooltip");

    infoIcon.addEventListener("mouseenter", () => {
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
    });

    infoIcon.addEventListener("mouseleave", () => {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    });
});
