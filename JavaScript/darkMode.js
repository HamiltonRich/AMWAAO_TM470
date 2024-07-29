document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed'); // Ensure the DOMContentLoaded event is fired

    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');

    if (darkModeToggle && darkModeIcon) {
        console.log('Elements found:', darkModeToggle, darkModeIcon);
        
        darkModeToggle.addEventListener('click', () => {
            console.log('Toggle button clicked'); // Check if click event is firing
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                darkModeIcon.classList.remove('fa-moon');
                darkModeIcon.classList.add('fa-sun');
            } else {
                darkModeIcon.classList.remove('fa-sun');
                darkModeIcon.classList.add('fa-moon');
            }
        });
    } else {
        console.log('Elements not found'); // If elements are not found, log an error
    }
});
