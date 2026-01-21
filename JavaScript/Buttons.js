
function activateButton4() {
    // Select Button1
    const Button4 = document.querySelector('#Button4');

    // Add 'active' class to Button1
    Button4.classList.add('active');

    // Select all sidebar buttons
    const buttons = document.querySelectorAll(".sidebar-button");

    // Add click event listeners to all sidebar buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            
            // Remove 'active' class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');

            
        });
    });
}

// Call the function to activate Button1
activateButton4();
