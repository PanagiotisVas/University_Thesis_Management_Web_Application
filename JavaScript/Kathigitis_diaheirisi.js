document.addEventListener('DOMContentLoaded', function () {
    const button1 = document.querySelector("#Button1");
    const button2 = document.querySelector("#Button2");
    const button3 = document.querySelector("#Button3");
    const button4 = document.querySelector("#Button4");
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector("#details");

    // Function to remove dynamic buttons
    const removeButtons = () => {
        const dynamicButtons = document.querySelectorAll(".dynamic-button");
        dynamicButtons.forEach(button => button.remove());
    };

    // Event Listener for Button4 (to fetch thesis data)
    if (button4) {
        button4.addEventListener("click", function () {
            const contentElement = document.querySelector("#content");
            const username = localStorage.getItem("username");

            if (contentElement && username) {
                removeButtons();
                let formData = new FormData();
                formData.append("username", username);

                // Create Export CSV Button
                const buttonA = document.createElement("button");
                buttonA.textContent = "Export CSV";
                buttonA.className = "dynamic-button";
                buttonA.addEventListener("click", function () {

                        fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_export.php", {
                            method: "POST",
                            body: formData,
                        })
                            .then(response => response.json())
                            .then(exportData => {
                                const csvData = [];
                                const headers = Object.keys(exportData[0]);
                                csvData.push(headers.join(",")); // Add headers to CSV

                                exportData.forEach(row => {
                                    const values = headers.map(header => `"${row[header] ?? ""}"`);
                                    csvData.push(values.join(","));
                                });

                                const csvContent = "data:text/csv;charset=utf-8," + csvData.join("\n");
                                const encodedUri = encodeURI(csvContent);
                                const link = document.createElement("a");
                                link.setAttribute("href", encodedUri);
                                link.setAttribute("download", "thesis.csv");
                                document.body.appendChild(link); // Required for Firefox
                                link.click();
                                document.body.removeChild(link);
                            })
                            .catch(error => {
                                console.error("Error fetching data:", error);
                                alert("Error exporting data. Please try again.");
                            });
                });

                // Create Export JSON Button
                const buttonB = document.createElement("button");
                buttonB.textContent = "Export JSON";
                buttonB.className = "dynamic-button";
                buttonB.addEventListener("click", function () {
                    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_export.php", {
                        method: "POST",
                        body: formData,
                    })
                        .then(response => response.json())
                        .then(exportData => {
                            if (!Array.isArray(exportData) || exportData.length === 0) {
                                alert("No data available for export.");
                                return;
                            }

                            // Convert data to JSON string
                            const jsonContent = JSON.stringify(exportData, null, 2); // Pretty-print with 2 spaces
                            const blob = new Blob([jsonContent], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.setAttribute("href", url);
                            link.setAttribute("download", "thesis.json");
                            document.body.appendChild(link); // Required for Firefox
                            link.click();
                            document.body.removeChild(link);
                        })
                        .catch(error => {
                            console.error("Error fetching data:", error);
                            alert("Error exporting data. Please try again.");
                        });
                });


                // Add buttons to the container
                buttonContainer.appendChild(buttonA);
                buttonContainer.appendChild(buttonB);

                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diaheirisi.php", {
                    method: "POST",
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        
                        // Filter the data based on role
                        const supervisors = data.filter(item => item.role === "supervisor");
                        const members = data.filter(item => item.role === "member2" || item.role === "member3");
                
                        // Create lists for each group
                        let supervisorList = supervisors.map(item => `
                            <li class="thesis-item">
                                <span class="clickable" data-item='${JSON.stringify(item)}'>
                                    ${item.subject}
                                </span>
                                <span class="thesis-status"><strong>${item.status}</strong></span>
                            </li>
                        `).join("");
                
                        let memberList = members.map(item => `
                            <li class="thesis-item">
                                <span class="clickable" data-item='${JSON.stringify(item)}'>
                                    ${item.subject}
                                </span>
                                <span class="thesis-status"><strong> ${item.status}</strong></span>
                            </li>
                        `).join("");
                
                        // Add the lists to the DOM
                        contentElement.innerHTML = `
                            <div>
                                <h2>As Supervisor:</h2>
                                <ul>${supervisorList}</ul>
                            </div>
                            <div>
                                <h2>As Member:</h2>
                                <ul>${memberList}</ul>
                            </div>
                        `;               

                        // Add event listeners to each clickable element
                        document.querySelectorAll(".clickable").forEach((span) => {
                            span.addEventListener("click", function (e) {
                                const itemData = JSON.parse(e.target.dataset.item);

                                switch (itemData.status) {

                                    

                                    case "TO BE ASSIGNED":
                                        // Fetch additional data about the invited members
                                        let tbaData = new FormData();
                                        tbaData.append("thesis", itemData.id);

                                        fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_aitiseis.php", {
                                            method: "POST",
                                            body: tbaData,
                                        })
                                            .then((response) => response.json())
                                            .then((membersData) => {
                                                let membersList = membersData.map(member => `
                                                    <li>
                                                        Name: ${member.professor}<br>
                                                        Status: ${member.status}<br>
                                                        Response Date: ${member.answer_date || "Pending"}<br>
                                                    </li>
                                                `).join("");

                                                overlayContent.innerHTML = `
                                                    <h2>Thesis: ${itemData.subject}</h2>
                                                    <p><strong>Student:</strong> ${itemData.student}</p>
                                                    <p><strong>Status:</strong> ${itemData.status}</p>
                                                    <h4>Invited Members:</h4>
                                                    <ul>${membersList}</ul>
                                                    <button id="cancel-assignment">Cancel Assignment</button>
                                                `;
                                                overlay.style.display = "flex";

                                                // Handle assignment cancellation
                                                document.querySelector("#cancel-assignment").addEventListener("click", function () {


                                                    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_tba_akirosi.php", {
                                                        method: "POST",
                                                        body: tbaData,
                                                    })
                                                        .then((response) => response.json())
                                                        .then((result) => {
                                                            if (result.success) {
                                                                alert("Assignment canceled successfully.");
                                                                overlay.style.display = "none";
                                                            } else {
                                                                alert("Failed to cancel assignment.");
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            console.error("Error canceling assignment:", error);
                                                        });
                                                });
                                            })
                                            .catch((error) => {
                                                console.error("Error fetching invited members:", error);
                                            });
                                        break;

                                        case "ACTIVE":
                                            overlayContent.innerHTML = `
                                                <h2>Active Thesis</h2>
                                                <p><strong>ID:</strong> ${itemData.id}</p>
                                                <p><strong>Subject:</strong> ${itemData.subject}</p>
                                                <p><strong>Student:</strong> ${itemData.student}</p>
                                                ${itemData.role === "supervisor" ? `
                                                    <button id="to-be-examined">Mark as To Be Examined</button>
                                                    <h4>Cancel Assignment</h4>
                                                    <form id="cancel-assignment-form">
                                                        <label for="assembly-number">Assembly Number:</label>
                                                        <input type="text" id="assembly-number" required><br>
                                                        <label for="assembly-year">Assembly Year:</label>
                                                        <input type="number" id="assembly-year" min="2000" required><br>
                                                        <button type="submit">Cancel Assignment</button>
                                                    </form>
                                                ` : ""}
                                                <textarea id="note-text" maxlength="300" placeholder="Write your note here..."></textarea>
                                                <button id="save-note">Save Note</button>
                                                <h4>Your Notes:</h4>
                                                <ul id="notes-list"></ul>
                                            `;
                                            overlay.style.display = "flex";
                                        
                                            // Load existing notes from the database
                                            let activeData = new FormData();
                                            activeData.append("thesis", itemData.id);
                                            activeData.append("username", username);
                                        
                                            fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_notes.php", {
                                                method: "POST",
                                                body: activeData,
                                            })
                                                .then((response) => response.json())
                                                .then((notes) => {
                                                    const notesList = document.querySelector("#notes-list");
                                                    notesList.innerHTML = notes.map(note => `
                                                        <li>${note.note_text}</li>
                                                    `).join("");
                                                });
                                        
                                            // Save new note
                                            document.querySelector("#save-note").addEventListener("click", () => {
                                                const noteText = document.querySelector("#note-text").value.trim();
                                                if (noteText.length === 0) {
                                                    alert("Note cannot be empty.");
                                                    return;
                                                }
                                        
                                                let noteData = new FormData();
                                                noteData.append("thesis", itemData.id);
                                                noteData.append("note", noteText);
                                                noteData.append("username", username);
                                        
                                                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_neo_note.php", {
                                                    method: "POST",
                                                    body: noteData,
                                                })
                                                    .then((response) => response.json())
                                                    .then((result) => {
                                                        if (result.success) {
                                                            alert("Note saved successfully.");
                                                            document.querySelector("#note-text").value = "";
                                                            return fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_notes.php", {
                                                                method: "POST",
                                                                body: activeData,
                                                            })
                                                                .then((response) => response.json())
                                                                .then((notes) => {
                                                                    const notesList = document.querySelector("#notes-list");
                                                                    notesList.innerHTML = notes.map(note => `
                                                                        <li>${note.note_text}</li>
                                                                    `).join("");
                                                                });
                                                        } else {
                                                            alert("Failed to save note.");
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        console.error("Error saving note:", error);
                                                    });
                                            });

                                            // Handle Examination Update
                                            document.getElementById("to-be-examined").addEventListener("click", function () {
                                    
                                                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_ac_tbe.php", {
                                                    method: "POST",
                                                    body: activeData,
                                                })
                                                .then(response => response.json())
                                                .then(result => {
                                                    if (result.success) {
                                                        alert("Thesis status updated to 'TO BE EXAMINED'.");
                                                        overlay.style.display = "none";
                                                        document.querySelector("#Button4").click();
                                                    } else {
                                                        alert("Failed to update thesis status.");
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error("Error updating thesis status:", error);
                                                });
                                            });
                                        
                                            // Handle assignment cancellation
                                            document.querySelector("#cancel-assignment-form").addEventListener("submit", function (e) {
                                                e.preventDefault();
                                                
                                                let assemblyNumber = document.querySelector("#assembly-number").value.trim();
                                                let assemblyYear = document.querySelector("#assembly-year").value.trim();
                                        
                                                if (!assemblyNumber || !assemblyYear) {
                                                    alert("Please fill in all fields.");
                                                    return;
                                                }
                                        
                                                let acCancelData = new FormData();
                                                acCancelData.append("thesis", itemData.id);
                                                acCancelData.append("assembly_number", assemblyNumber);
                                                acCancelData.append("assembly_year", assemblyYear);
                                        
                                                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_ac_akirosi.php", {
                                                    method: "POST",
                                                    body: acCancelData,
                                                })
                                                    .then((response) => response.json())
                                                    .then((result) => {
                                                        if (result.success) {
                                                            alert("Assignment canceled successfully. Reason: 'Canceled by Supervisor'");
                                                            overlay.style.display = "none";
                                                        } else {
                                                            alert("Failed to cancel assignment.");
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        console.error("Error canceling assignment:", error);
                                                    });
                                            });
                                            break;

                                    case "TO BE EXAMINED":
                                        let tbeData = new FormData();
                                        tbeData.append("thesis", itemData.id);

                                        fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_tbe.php", {
                                            method: "POST",
                                            body: tbeData,
                                        })
                                        .then((response) => response.json())
                                        .then((gradeData) => {

                                            if (gradeData[0].grading_status === "CLOSED") {
                                                if (gradeData[0].announcement_status === "NOT ANNOUNCED") {
                                                    announcementContent = `
                                                        <textarea id="announcement-text" placeholder="Enter announcement text" style="width: 80%; height: 90px;"></textarea>
                                                        <button id="announce-presentation">Announce Presentation</button>
                                                    `;
                                                } else if (gradeData[0].announcement_status === "ANNOUNCED") {
                                                    announcementContent = `
                                                        <p><strong>Announcement:</strong> ${gradeData[0].announcement_text}</p>
                                                    `;
                                                }

                                                overlayContent.innerHTML = `
                                                    <p><strong>ID:</strong> ${itemData.id}</p>
                                                    <p><strong>Subject:</strong> ${itemData.subject}</p>
                                                    <p><strong>Student:</strong> ${itemData.student}</p>
                                                    ${itemData.role === "supervisor" ? `
                                                        <p><strong>Member 2:</strong> ${gradeData[0].member2}</p>
                                                        <p><strong>Member 3:</strong> ${gradeData[0].member3}</p>
                                                    ` : ""}
                                                    ${itemData.role === "member2" ? `
                                                        <p><strong>Supervisor:</strong> ${itemData.supervisor}</p>
                                                        <p><strong>Member 3:</strong> ${gradeData[0].member3}</p>
                                                    ` : ""}
                                                    ${itemData.role === "member3" ? `
                                                        <p><strong>Supervisor:</strong> ${itemData.supervisor}</p>
                                                        <p><strong>Member 2:</strong> ${gradeData[0].member2}</p>
                                                    ` : ""}
                                                    <p><strong>Examination Date:</strong> ${gradeData[0].exam_date || "Pending"}</p>
                                                    <p><strong>Examination Time:</strong> ${gradeData[0].exam_time || "Pending"}</p>
                                                    <p><strong>Room or Zoom Link:</strong> ${gradeData[0].room_or_zoomlink || "Pending"}</p>
                                                    ${itemData.role === "supervisor" ? `
                                                        ${announcementContent}
                                                        ${gradeData[0].room_or_zoomlink !== null ? `
                                                            <button id="open_grading">Open Grades</button>
                                                        ` : ""}
                                                    ` : ""}
                                                `;

                                                overlay.style.display = "flex";

                                                // Event listener for Open Grades
                                                document.getElementById("open_grading").addEventListener("click", function () {

                                                    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_bathmologia.php", {
                                                        method: "POST",
                                                        body: tbeData,
                                                    })
                                                    .then((response) => response.json())
                                                    .then((result) => {
                                                        if (result.success) {
                                                            alert("Grading status set to OPEN. You can now grade the thesis.");
                                                            overlay.style.display = "none";
                                                        } else {
                                                            alert("Failed to update grading status.");
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        console.error("Error updating grading status:", error);
                                                    });
                                                });

                                                // Event listener for Announcement
                                                document.getElementById("announce-presentation").addEventListener("click", function () {
                                                    const announcementText = document.querySelector("#announcement-text").value.trim();
                                                    if (announcementText.length === 0) {
                                                        alert("Announcement cannot be empty.");
                                                        return;
                                                    }
                                                    let announcementData = new FormData();
                                                    announcementData.append("thesis", itemData.id);
                                                    announcementData.append("announcement", announcementText);

                                                    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_anakoinosi.php", {
                                                        method: "POST",
                                                        body: announcementData,
                                                    })
                                                    .then((response) => response.json())
                                                    .then((result) => {
                                                        if (result.success) {
                                                            alert("Announcement made.");
                                                            overlay.style.display = "none";
                                                        } else {
                                                            alert("Failed to make announcement.");
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        console.error("Error making announcement:", error);
                                                    });
                                                });

                                            } else if (gradeData[0].grading_status === "OPEN"){
                                                const gradeForm = `
                                                    <form id="grade-form">
                                                        <label for="quality-grade">Quality Grade:</label>
                                                        <input type="number" id="quality-grade" name="quality-grade" min="0" max="100" required>
                                                        <label for="time-grade">Time Grade:</label>
                                                        <input type="number" id="time-grade" name="time-grade" min="0" max="100" required>
                                                        <label for="text-grade">Text Grade:</label>
                                                        <input type="number" id="text-grade" name="text-grade" min="0" max="100" required>
                                                        <label for="presentation-grade">Presentation Grade:</label>
                                                        <input type="number" id="presentation-grade" name="presentation-grade" min="0" max="100" required>
                                                        <button type="submit">Submit Grades</button>
                                                    </form>
                                                `;
                                                if (!gradeData[0].supervisor_quality_grade) {
                                                    supervisorContent = gradeForm;
                                                } else if (gradeData[0].supervisor_quality_grade) {
                                                    supervisorContent = `
                                                        <h4>Your Grades: </h4>
                                                        <p><strong>Quality:</strong> ${gradeData[0].supervisor_quality_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Time:</strong> ${gradeData[0].supervisor_time_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Text:</strong> ${gradeData[0].supervisor_text_grade || "Pending"} 
                                                        &nbsp;&nbsp;&nbsp;<strong>Presentation:</strong> ${gradeData[0].supervisor_presentation_grade || "Pending"}</p>
                                                    `;
                                                }
                                                if (!gradeData[0].member_2_quality_grade) {
                                                    member2Content = gradeForm;
                                                } else if (gradeData[0].member_2_quality_grade) {
                                                    member2Content = `
                                                        <h4>Your Grades: </h4>
                                                        <p><strong>Quality:</strong> ${gradeData[0].member_2_quality_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Time:</strong> ${gradeData[0].member_2_time_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Text:</strong> ${gradeData[0].member_2_text_grade || "Pending"} 
                                                        &nbsp;&nbsp;&nbsp;<strong>Presentation:</strong> ${gradeData[0].member_2_presentation_grade || "Pending"}</p>
                                                    `;
                                                }
                                                if (!gradeData[0].member_3_quality_grade) {
                                                    member3Content = gradeForm;
                                                } else if (gradeData[0].member_3_quality_grade) {
                                                    member3Content = `
                                                        <h4>Your Grades: </h4>
                                                        <p><strong>Quality:</strong> ${gradeData[0].member_3_quality_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Time:</strong> ${gradeData[0].member_3_time_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Text:</strong> ${gradeData[0].member_3_text_grade || "Pending"} 
                                                        &nbsp;&nbsp;&nbsp;<strong>Presentation:</strong> ${gradeData[0].member_3_presentation_grade || "Pending"}</p>
                                                    `;
                                                }
                                                overlayContent.innerHTML = `
                                                    <p><strong>ID:</strong> ${itemData.id}</p>
                                                    <p><strong>Subject:</strong> ${itemData.subject}</p>
                                                    <p><strong>Student:</strong> ${itemData.student}</p>
                                                    <p><strong>Thesis File:</strong> <a href="http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_arxeio.php?id=${itemData.id}" target="_blank"> ${itemData.thesis_file_name} </a></p>
                                                    ${itemData.thesis_link !== null ? `
                                                    <p><strong>Extra Link:</strong> ${itemData.thesis_link}</p>
                                                    ` : ""}
                                                    ${itemData.role === "supervisor" ? `
                                                        ${supervisorContent}
                                                        <h4>Member 2 Grades: </h4>
                                                        <p><strong>Quality:</strong> ${gradeData[0].member_2_quality_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Time:</strong> ${gradeData[0].member_2_time_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Text:</strong> ${gradeData[0].member_2_text_grade || "Pending"} 
                                                        &nbsp;&nbsp;&nbsp;<strong>Presentation:</strong> ${gradeData[0].member_2_presentation_grade || "Pending"}</p>
                                                        <h4>Member 3 Grades: </h4>
                                                        <p><strong>Quality:</strong> ${gradeData[0].member_3_quality_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Time:</strong> ${gradeData[0].member_3_time_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Text:</strong> ${gradeData[0].member_3_text_grade || "Pending"} 
                                                        &nbsp;&nbsp;&nbsp;<strong>Presentation:</strong> ${gradeData[0].member_3_presentation_grade || "Pending"}</p>
                                                    ` : ""}
                                                    ${itemData.role === "member2" ? `
                                                        ${member2Content}
                                                        <h4>Supervisor Grades: </h4>
                                                        <p><strong>Quality:</strong> ${gradeData[0].supervisor_quality_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Time:</strong> ${gradeData[0].supervisor_time_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Text:</strong> ${gradeData[0].supervisor_text_grade || "Pending"} 
                                                        &nbsp;&nbsp;&nbsp;<strong>Presentation:</strong> ${gradeData[0].supervisor_presentation_grade || "Pending"}</p>
                                                        <h4>Member 3 Grades: </h4>
                                                        <p><strong>Quality:</strong> ${gradeData[0].member_3_quality_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Time:</strong> ${gradeData[0].member_3_time_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Text:</strong> ${gradeData[0].member_3_text_grade || "Pending"} 
                                                        &nbsp;&nbsp;&nbsp;<strong>Presentation:</strong> ${gradeData[0].member_3_presentation_grade || "Pending"}</p>
                                                    ` : ""}
                                                    ${itemData.role === "member3" ? `
                                                        ${member3Content}
                                                        <h4>Supervisor Grades: </h4>
                                                        <p><strong>Quality:</strong> ${gradeData[0].supervisor_quality_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Time:</strong> ${gradeData[0].supervisor_time_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Text:</strong> ${gradeData[0].supervisor_text_grade || "Pending"} 
                                                        &nbsp;&nbsp;&nbsp;<strong>Presentation:</strong> ${gradeData[0].supervisor_presentation_grade || "Pending"}</p>
                                                        <h4>Member 2 Grades: </h4>
                                                        <p><strong>Quality:</strong> ${gradeData[0].member_2_quality_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Time:</strong> ${gradeData[0].member_2_time_grade || "Pending"}&nbsp;&nbsp;&nbsp; <strong>Text:</strong> ${gradeData[0].member_2_text_grade || "Pending"} 
                                                        &nbsp;&nbsp;&nbsp;  <strong>Presentation:</strong> ${gradeData[0].member_2_presentation_grade || "Pending"}</p>
                                                    ` : ""}
                                                `;
                                                overlay.style.display = "flex";

                                                // Add event listener for form submission
                                                document.querySelector("#grade-form").addEventListener("submit", function (e) {
                                                        const form = e.target;
                                                        const qualityGrade = form.querySelector("#quality-grade").value;
                                                        const timeGrade = form.querySelector("#time-grade").value;
                                                        const textGrade = form.querySelector("#text-grade").value;
                                                        const presentationGrade = form.querySelector("#presentation-grade").value;

                                                        // Validate grades (e.g., ensure they are within the range 0-10)
                                                        if (qualityGrade < 0 || qualityGrade > 10 || timeGrade < 0 || timeGrade > 10 || textGrade < 0 || textGrade > 10 || presentationGrade < 0 || presentationGrade > 10) {
                                                            alert("Grades must be between 0 and 10.");
                                                            return;
                                                        }

                                                        // Prepare data to send to the server
                                                        const gradesData = new FormData();
                                                        gradesData.append("thesis", itemData.id);
                                                        gradesData.append("role", itemData.role);
                                                        gradesData.append("quality-grade", qualityGrade);
                                                        gradesData.append("time-grade", timeGrade);
                                                        gradesData.append("text-grade", textGrade);
                                                        gradesData.append("presentation-grade", presentationGrade);

                                                        // Send data to the server
                                                        fetch(`http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_neos_bathmos.php`, {
                                                            method: "POST",
                                                            body: gradesData,
                                                        })
                                                        .then((response) => response.json())
                                                        .then((result) => {
                                                            if (result.success) {
                                                                alert("Grades submitted successfully!");
                                                                overlay.style.display = "none";
                                                            } else {
                                                                alert("Failed to submit grades.");
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            console.error("Error submitting grades:", error);
                                                        });
                                                });
                                            }
                                        })
                                        .catch((error) => {
                                            console.error("Error checking thesis grade status:", error);
                                        });
                                    break;

                                    case "CANCELLED":

                                        let cancData = new FormData();
                                        cancData.append("thesis", itemData.id);

                                        fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_diax_canceled.php", {
                                            method: "POST",
                                            body: cancData,
                                        })
                                        .then((response) => response.json())
                                        .then((canceledData) => {

                                            overlayContent.innerHTML = `
                                                <p><strong>ID:</strong> ${itemData.id}</p>
                                                <p><strong>Subject:</strong> ${itemData.subject}</p>
                                                <p><strong>Student:</strong> ${itemData.student}</p>
                                                ${itemData.role !== "supervisor" ? `
                                                    <p><strong>Supervisor:</strong> ${itemData.supervisor}</p>
                                                ` : ""}
                                                <p><strong>Reason For Cancelation:</strong> ${canceledData[0].reason_for_cancelation}</p>
                                                <p><strong>Date Of Cancelation:</strong> ${canceledData[0].cancelation_date}</p>
                                                <p><strong>General Assembly:</strong> ${canceledData[0].general_assembly_number}</p>
                                            `;

                                            overlay.style.display = "flex";

                                        });

                                    break;

                                    default:
                                        alert(`Unknown status for Thesis ${itemData.id}.`);
                                }
                            });
                        });
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
        button2.addEventListener("click", removeChartButtons);
        button2.addEventListener("click", resetCharts);
    }
    if (button2) {
        button3.addEventListener("click", removeChartButtons);
        button3.addEventListener("click", resetCharts);
    }
    if (button3) {
        button4.addEventListener("click", removeChartButtons);
        button4.addEventListener("click", resetCharts);

    }
});