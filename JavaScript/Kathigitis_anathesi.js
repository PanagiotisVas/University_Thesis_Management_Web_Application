document.addEventListener('DOMContentLoaded', function () {
    const button1 = document.querySelector("#Button1");
    const button2 = document.querySelector("#Button2");
    const button3 = document.querySelector("#Button3");
    const button4 = document.querySelector("#Button4");
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector("#details");

    // Function to remove the InsertButton if it exists
    const removeInsertButton = () => {
        const insertButton = document.querySelector("#InsertButton");
        if (insertButton) {
            insertButton.remove();
        }
    };

    // Event Listener for Button3 (to fetch thesis data)
    if (button3) {
        button3.addEventListener("click", function () {
            const contentElement = document.querySelector("#content");
            let username = localStorage.getItem("username");
            
            if (contentElement && username) {
                let formData = new FormData();
                formData.append("username", username);

                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_pros_anathesi.php", {
                    method: "POST",
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        let output = data.map((item) => `
                            <li class="thesis-item">
                                <span class="clickable" data-item='${JSON.stringify(item)}'>
                                    Subject: ${item.subject}
                                </span>
                                <span class="thesis-id"><strong>ID:</strong> ${item.id}</span>
                            </li>
                        `).join("");

                        contentElement.innerHTML = `<ul>${output}</ul>`;

                        // Add event listeners to each clickable element
                        document.querySelectorAll(".clickable").forEach((span) => {
                            span.addEventListener("click", function (e) {
                                const itemData = JSON.parse(e.target.dataset.item);

                                // Show the overlay and populate with thesis info
                                overlay.style.display = "flex";
                                overlayContent.innerHTML = `
                                    <p><strong>ID:</strong> ${itemData.id}</p>
                                    <p><strong>Subject:</strong> ${itemData.subject}</p>
                                    <p><strong>Find Student:</strong></p>
                                    <input type="number" id="studentInput" placeholder="Enter student number" />
                                    <button id="searchStudent">Search Student</button>
                                `;

                                document.querySelector("#searchStudent").addEventListener("click", function () {
                                    const studentNumber = document.querySelector("#studentInput").value;

                                    if (studentNumber) {
                                        let searchData = new FormData();
                                        searchData.append("studentNumber", studentNumber);

                                        fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_anazitisi_foititi.php", {
                                            method: "POST",
                                            body: searchData,
                                        })
                                            .then(response => response.json())
                                            .then(studentData => {
                                                overlay.style.display = "flex";
                                                overlayContent.innerHTML += `
                                                    <p><strong>Name:</strong> ${studentData[0].name}</p>
                                                    <p><strong>Surname:</strong> ${studentData[0].surname}</p>
                                                    <p><strong>Student ID:</strong> ${studentData[0].student_number}</p>
                                                    <button id="confirmAssignment">Confirm Assignment</button>
                                                `;

                                                // Add event listener to the Confirm Assignment button
                                                document.querySelector("#confirmAssignment").addEventListener("click", function () {
                                                    let assignmentData = new FormData();
                                                    assignmentData.append("thesisId", itemData.id);
                                                    assignmentData.append("studentEmail", studentData[0].email);

                                                    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_anathesi.php", {
                                                        method: "POST",
                                                        body: assignmentData,
                                                    })
                                                        .then(response => response.json())
                                                        .then(result => {
                                                            if (result.success) {
                                                                alert("Assignment confirmed successfully!");
                                                                overlay.style.display = "none";
                                                                document.querySelector("#Button3").click();
                                                            } else {
                                                                alert("Error: " + result.error);
                                                            }
                                                        })
                                                        .catch(error => {
                                                            console.error("Error confirming assignment:", error);
                                                            alert("Error confirming assignment. Please try again later.");
                                                        });
                                                });
                                            })
                                            .catch(error => {
                                                overlayContent.innerHTML += `<p class="error-message">An error occurred: ${error.message}</p>`;
                                            });
                                    } else {
                                        alert("Please enter a student number.");
                                    }
                                });
                            });
                        });

                        // Insert New Entry Button Logic
                        const buttonContainer = document.querySelector("#buttonContainer");
                        if (buttonContainer) {
                            // Remove any existing InsertButton
                            const insertButton = document.querySelector("#InsertButton");
                            if (insertButton) {
                                insertButton.remove();
                            }

                            // Create a new InsertButton
                            const newInsertButton = document.createElement("button1");
                            newInsertButton.id = "InsertButton";
                            newInsertButton.textContent = "Insert New Entry";
                            buttonContainer.appendChild(newInsertButton);

                            // Add event listener to the InsertButton
                            newInsertButton.addEventListener("click", function () {
                                overlayContent.innerHTML = `
                                    <h2>Insert New Entry</h2>
                                    <form id="insertForm">
                                        <label for="subject">Subject:</label>
                                        <input type="text" id="subject" name="subject" required>
                                        <label for="description">Description:</label>
                                        <textarea id="description" name="description" required></textarea>
                                        <br>
                                        <input type="text" id="filepath" name="filepath" placeholder="Enter Thesis Filepath">
                                        <button id="FileExplorerButton">File</button>
                                        <br>
                                        <button type="submit">Submit</button>
                                    </form>
                                `;
                                overlay.style.display = "flex";

                                let fileinput = null;

                                document.querySelector("#FileExplorerButton").onclick = function (e) {
                                    e.preventDefault();
                                    fileflag = true; // Indicate a file has been selected
                                    fileinput = document.createElement("input");
                                    fileinput.type = "file";
                                    fileinput.accept = "application/pdf"; // Only allow PDFs
                                    fileinput.click();
                                
                                    fileinput.addEventListener("change", function () {
                                        const file = fileinput.files[0];
                                
                                        if (file && file.type !== "application/pdf") {
                                            alert("Only PDF files are allowed!");
                                            fileinput.value = ""; // Reset the file input
                                            return;
                                        }
                                
                                        // Update the filepath input field after a valid file is selected
                                        document.querySelector("#filepath").value = file.name;
                                    });
                                };

                                // Handle form submission
                                document.querySelector("#insertForm").addEventListener("submit", function (e) {
                                    e.preventDefault();
                                    const subject = document.getElementById("subject").value;
                                    const description = document.getElementById("description").value;
                                    const supervisor = localStorage.getItem("username");
                                
                                    let insertData = new FormData();
                                    insertData.append("subject", subject);
                                    insertData.append("description", description);
                                    insertData.append("supervisor", supervisor);
                                
                                    // Check if a file is selected before appending
                                    if (fileinput && fileinput.files.length > 0) {
                                        insertData.append("file", fileinput.files[0]);
                                    }
                                
                                    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_insert.php", {
                                        method: "POST",
                                        body: insertData,
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.success) {
                                            alert("Entry inserted successfully!");
                                            overlay.style.display = "none";
                                            document.querySelector("#Button3").click();
                                        } else {
                                            alert("Error: " + data.error);
                                        }
                                    })
                                    .catch(error => {
                                        console.error("Error inserting entry:", error);
                                        alert("Error inserting entry. Please try again later.");
                                    });
                                });
                            });
                        }
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

    if (button1) {
        button1.addEventListener("click", removeInsertButton);
    }
    if (button2) {
        button2.addEventListener("click", removeInsertButton);
    }
    if (button4) {
        button4.addEventListener("click", removeInsertButton);
    }
});