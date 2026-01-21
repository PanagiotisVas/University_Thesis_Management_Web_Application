document.addEventListener('DOMContentLoaded', function () {
    const button5 = document.querySelector("#Button5");
    const contentElement = document.querySelector("#content");
    const buttonContainer = document.querySelector("#buttonContainer");
    const chartContainers = [
        document.querySelector("#chartContainer1"),
        document.querySelector("#chartContainer2"),
        document.querySelector("#chartContainer3"),
    ];

    if (button5) {
        button5.addEventListener("click", function () {
            let username = localStorage.getItem("username");

            if (contentElement && username) {
                let formData = new FormData();
                formData.append("username", username);

                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_kentriki.php", {
                    method: "POST",
                    body: formData,
                })
                .then((response) => response.json())
                .then((data) => {
                    let output = "<ul>";
                    
                    data.forEach((item) => {
                        output += `<li><strong>Email:</strong> ${item.email}</li>`;
                        output += `<li><strong>Topic:</strong> ${item.topic}</li>`;
                        output += `<li><strong>Department:</strong> ${item.department}</li>`;
                        output += `<li><strong>University:</strong> ${item.university}</li>`;
                        output += `<li><strong>Mobile:</strong> ${item.mobile_telephone}</li>`;
                        output += `<li><strong>Landline:</strong> ${item.landline_telephone}</li>`;
                    });
                    
                    output += "</ul>";
                    contentElement.innerHTML = output;

                    // Hide charts and buttonContainer (ONLY for Button5)
                    buttonContainer.style.display = "none";
                    chartContainers.forEach(chart => chart.style.display = "none");

                    // Ensure content is visible
                    contentElement.style.display = "block";
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    contentElement.innerHTML = "Error loading data. Please try again later.";
                });
            } else {
                console.warn("Username or content element is missing");
            }
        });
    }

    // Reset visibility when any other button (except Button5) is clicked
    document.querySelectorAll(".button-container button:not(#Button5)").forEach(button => {
        button.addEventListener("click", function () {
            buttonContainer.style.display = "block"; // Show buttonContainer
            chartContainers.forEach(chart => chart.style.display = "block"); // Show charts
        });
    });
});
