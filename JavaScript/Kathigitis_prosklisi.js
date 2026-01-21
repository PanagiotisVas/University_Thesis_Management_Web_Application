document.addEventListener('DOMContentLoaded', function () { 
    const button2 = document.querySelector("#Button2");
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector("#details");

    // Add event listener to Button 2
    if (button2) {
        button2.addEventListener("click", function () {
            const contentElement = document.querySelector("#content");
            let username = localStorage.getItem("username");

            if (contentElement) {
                let formData = new FormData();
                formData.append("username", username);

                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_prosklisi.php", {
                    method: "POST",
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        let output = data.map((item) => `
                            <li class="thesis-item">
                                <span class="clickable" data-item='${JSON.stringify(item)}'>
                                    ${item.subject}
                                </span>
                                <span class="thesis-id">ID: ${item.thesis}</span>
                            </li>
                        `).join("");

                        contentElement.innerHTML = `<ul>${output}</ul>`;

                        // Attach event listeners to the clickable elements
                        document.querySelectorAll(".clickable").forEach(element => {
                            element.addEventListener("click", function (e) {
                                const itemData = JSON.parse(e.target.dataset.item);

                                // Add overlay content along with accept/decline buttons
                                overlayContent.innerHTML = `
                                <p><strong>ID:</strong> ${itemData.thesis}</p>
                                <p><strong>Subject:</strong> ${itemData.subject}</p>
                                <p><strong>Description:</strong> ${itemData.description}</p>
                                <p><strong>Student:</strong> ${itemData.student}</p>
                                <div class="overlay-btn-container">
                                    <button id="accept-btn" class="action-btn">Accept</button>
                                    <button id="decline-btn" class="action-btn">Decline</button>
                                </div>
                                `;

                                overlay.style.display = "flex";

                                // Add event listener for the Accept button
                                document.getElementById("accept-btn").addEventListener("click", function () {
                                    let newData = new FormData();
                                    newData.append("username", username);
                                    newData.append("thesis", itemData.thesis);
                                    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_apodoxi.php", {
                                        method: "POST",
                                        body: newData,
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.success) {
                                                alert(`Thesis accepted successfully.`);
                                                overlay.style.display = "none";
                                                document.querySelector("#Button2").click();
                                            } else {
                                                alert(`Failed to accept the thesis: ${data.error}`);
                                            }
                                        })
                                        .catch(error => {
                                            console.error("Error updating status:", error);
                                            alert("An error occurred while updating the status. Please try again later.");
                                        });
                                });

                                        
                                // Add event listener for the Decline button
                                document.getElementById("decline-btn").addEventListener("click", function () {
                                    let newData = new FormData();
                                    newData.append("username", username);
                                    newData.append("thesis", itemData.thesis);
                                    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_aporipsi.php", {
                                        method: "POST",
                                        body: newData,
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.success) {
                                                alert(`Thesis rejected successfully.`);
                                                overlay.style.display = "none";
                                                document.querySelector("#Button2").click();
                                            } else {
                                                alert(`Failed to reject the thesis: ${data.error}`);
                                            }
                                        })
                                        .catch(error => {
                                            console.error("Error updating status:", error);
                                             alert("An error occurred while updating the status. Please try again later.");
                                        });
                                });
                                    
                            });
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                        contentElement.innerHTML = "Error loading data. Please try again later.";
                    });
            }

            // Close the overlay if clicked outside of the overlay content
            overlay.addEventListener("click", function (e) {
                if (e.target === overlay) {
                    overlay.style.display = "none";
                }
            });

            // Close overlay on click of close button
            document.querySelector(".close-btn").addEventListener("click", function () {
                overlay.style.display = "none";
            });
        });
    }

});