document.addEventListener('DOMContentLoaded', function () {
    const button1 = document.querySelector("#Button1");
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector("#details");

    // Function to remove the InsertButton if it exists
    const removeInsertButton = () => {
        const insertButton = document.querySelector("#InsertButton");
        if (insertButton) {
            insertButton.remove();
        }
    };

    // Add event listener to Button 1
    if (button1) {
        button1.addEventListener("click", function () {
            const contentElement = document.querySelector("#content");
            let username = localStorage.getItem("username");

            if (contentElement) {
                let formData = new FormData();
                formData.append("username", username);

                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diplomatiki.php", {
                    method: "POST",
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        let output = data.map((item) => `
                            <li>
                                <span class="clickable" data-id="${item.id}" data-subject="${item.subject}">
                                    Thesis ID: ${item.id}, Subject: ${item.subject}
                                </span>
                            </li>
                        `).join("");

                        contentElement.innerHTML = `<ul>${output}</ul>`;

                        // Attach event listeners to the clickable elements
                        document.querySelectorAll(".clickable").forEach(element => {
                            element.addEventListener("click", function () {
                                const id = this.getAttribute("data-id");
                                const subject = this.getAttribute("data-subject");

                                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Anakoinosi_leptomeries.php", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ id: id })
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.error) {
                                            console.error(data.error);
                                            overlayContent.innerText = "Error: " + data.error;
                                            return;
                                        }
                                        overlayContent.innerHTML = `
                                            <p>ID: ${data.id}</p>
                                            <p>Subject: ${data.subject}</p>
                                            <p>Description: ${data.description}</p>
                                            <p>Thesis File: <a href="http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_arxeio.php?id=${data.id}" target="_blank"> ${data.thesis_file_name} </a></p>
                                            <!-- Add other details here -->
                                        `;
                                        overlay.style.display = "flex";
                                    })
                                    .catch(error => {
                                        console.error("Error fetching details:", error);
                                        overlayContent.innerText = "Error loading details. Please try again later.";
                                    });
                            });
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                        contentElement.innerHTML = "Error loading data. Please try again later.";
                    });
            }

            // Close overlay on click of close button
            document.querySelector(".close-btn").addEventListener("click", function () {
                overlay.style.display = "none";
            });
        });
    }
});
