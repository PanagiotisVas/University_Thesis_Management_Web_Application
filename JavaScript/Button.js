function activateButton1() {
    // Select Button1
    const button1 = document.querySelector('#Button1');

    // Add 'active' class to Button1
    button1.classList.add('active');

    // Select all sidebar buttons
    const buttons = document.querySelectorAll(".sidebar-button");

    // Add click event listeners to all sidebar buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            
            if(button.id === 'Button5') {
               
               return;
                
            }

            // Remove 'active' class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');

            
        });
    });
}

// Call the function to activate Button1
activateButton1();
