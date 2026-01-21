document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("#LoginForm").addEventListener("submit", function(event) {
        event.preventDefault();  // Prevent default form submission
        
        localStorage.clear();

        let username = document.querySelector("#username").value;
        let password = document.querySelector("#password").value;


        // Prepare data to send
        let data = new FormData();
        data.append("username", username);
        data.append("password", password);
        
        // Send AJAX request
        fetch("../PHP/login.php", {
            method: "POST",
            body: data
        })

        .then(response => response.json())  // Parse the JSON response from the PHP script
        .then(data => {
            // Display success or failure message
            if (data.type === "s") {
                document.querySelector("#loginStatus").innerHTML = "Login successful!";
                window.location.href = "Foititis_kentriki.html"; 
            }  
            if (data.type === "p") {
                document.querySelector("#loginStatus").innerHTML = "Login successful!";
                window.location.href = "Kathigitis_kentriki.html"; 
            }  
            if (data.type === "a") {
                document.querySelector("#loginStatus").innerHTML = "Login successful!";
                window.location.href = "Grammateia_kentriki.html"; 
            }  
            
            if (data.type === "false") {
                document.querySelector("#loginStatus").innerHTML = "Wrong username or password!";
            }  
            
            
        })
        .catch(error => {
            console.error("Error:", error);
            document.querySelector("#loginStatus").innerHTML = "An error occurred.";
        });
    });
});
