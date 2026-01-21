export default function loadOverviewContent() {
    const content = document.getElementById('content');

    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Gramm_Settings.php", {
        method: "POST",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch data from the server");
            }
            return response.json();
        })
        .then((data) => {
            if (data.error) {
                console.error(data.error);
                content.innerText = "Error: " + data.error;
                return;
            }

            if (data.length === 0) {
                content.innerText = "No theses found.";
                return;
            }

            // Group theses by status
            const groupedData = {
                "ACTIVE": [],
                "TO BE EXAMINED": { ready: [], pending: [] },
                "COMPLETED": [],
                "CANCELLED": [],
            };

            data.forEach(item => {
                if (item.status === "TO BE EXAMINED") {
                    if (item.ready_for_completion == 1) {
                        groupedData["TO BE EXAMINED"].ready.push(item);
                    } else {
                        groupedData["TO BE EXAMINED"].pending.push(item);
                    }
                } else if (groupedData[item.status]) {
                    groupedData[item.status].push(item);
                }
            });

            // Generate HTML for each group
            const generateGroupHTML = (groupTitle, items) => {
                if (items.length === 0) return '';
                const output = items.map(item => {
                    let statusClass = "";
                    if (item.status === 'ACTIVE') statusClass = "status-active";
                    else if (item.status === 'TO BE EXAMINED') statusClass = "status-to-be-examined";
                    else if (item.status === 'COMPLETED') statusClass = "status-completed";
                    else if (item.status === 'CANCELLED') statusClass = "status-cancelled";

                    return `
                        <li>
                            <a href="#" class="clickable" data-id="${item.id}" data-status="${item.status}">
                                <span class="subject">Subject: ${item.subject}</span>
                                <span class="status">Status: <span class="${statusClass}">${item.status}</span></span>
                            </a>
                            <div class="details-container" style="display: none;"></div>
                        </li>
                    `;
                }).join("");

                return `
                    <h3>${groupTitle}</h3>
                    <ul>${output}</ul>
                `;
            };

            // Combine all groups into final HTML
            document.querySelector("#content").innerHTML = `
                ${generateGroupHTML("Active Theses", groupedData["ACTIVE"])}
                <h3>Theses to be Examined</h3>
                ${generateGroupHTML("Ready for Completion", groupedData["TO BE EXAMINED"].ready)}
                ${generateGroupHTML("Pending Completion", groupedData["TO BE EXAMINED"].pending)}
                ${generateGroupHTML("Completed Theses", groupedData["COMPLETED"])}
                ${generateGroupHTML("Cancelled Theses", groupedData["CANCELLED"])}
            `;

            // Attach event listeners
            document.querySelectorAll(".clickable").forEach(element => {
                element.addEventListener("click", function (event) {
                    event.preventDefault();
                    const id = this.getAttribute("data-id");
                    const status = this.getAttribute("data-status");
                    const detailsContainer = this.parentElement.querySelector(".details-container");

                    // Close all open details
                    document.querySelectorAll(".details-container").forEach(container => {
                        if (container !== detailsContainer) {
                            container.style.display = "none";
                            container.innerHTML = "";
                        }
                    });

                    if (detailsContainer.style.display === "block") {
                        detailsContainer.style.display = "none";
                        detailsContainer.innerHTML = "";
                        return;
                    }

                    // Fetch details
                    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Anakoinosi_leptomeries.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, context: "settings" })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) {
                                detailsContainer.innerText = "Error: " + data.error;
                                return;
                            }

                            let detailsHTML = `<div class="details-content">`;

                            if (status === "ACTIVE") {
                                const hasAssemblyNumber = !!data.confirmation_gen_assembly;
                                detailsHTML += `
                                    <p class="details-id">ID: ${data.id}</p>
                                    <p class="details-description">Description: ${data.description}</p>
                                    <div class="assembly-number-display">
                                        <span class="label-text">Confirmation Assembly Number: </span>
                                        <span class="assembly-number-value">${hasAssemblyNumber ? data.confirmation_gen_assembly : '<em>Not uploaded</em>'}</span>
                                    </div>
                                    ${!hasAssemblyNumber ? `
                                    <div class="upload-section">
                                        <label for="assemblyNumber-${id}" class="label-text"> Confirmation Assembly Number:</label>
                                        <input type="number" id="assemblyNumber-${id}" class="input-field" placeholder="Enter Assembly Number">
                                        <button class="upload-assembly btn-primary" data-id="${id}">Upload Assembly Number</button>
                                    </div>
                                    ` : ''}
                                    <div class="cancel-section">
                                        <label for="assemblyNum-${id}" class="label-text">Cancellation Assembly Number:</label>
                                        <input type="number" id="assemblyNum-${id}" class="input-field" placeholder="Enter Assembly Number" value="" ${!hasAssemblyNumber ? 'disabled' : ''}>
                                        <label for="assemblyYear-${id}" class="label-text">Assembly Year:</label>
                                        <input type="number" id="assemblyYear-${id}" class="input-field" placeholder="Enter Assembly Year" ${!hasAssemblyNumber ? 'disabled' : ''}>
                                        <button id="cancel-thesis-btn-${id}" class="cancel-thesis btn-danger" data-id="${id}" ${!hasAssemblyNumber ? 'disabled' : ''}>Cancel Thesis</button>
                                    </div>
                                `;
                            } else if (status === "TO BE EXAMINED") {
                                // Check if requirements are incomplete
                                const isIncomplete = !data.library_link || 
                                    !data.supervisor_quality_grade || !data.supervisor_time_grade || 
                                    !data.supervisor_text_grade || !data.supervisor_presentation_grade || 
                                    !data.member_2_quality_grade || !data.member_2_time_grade || 
                                    !data.member_2_text_grade || !data.member_2_presentation_grade || 
                                    !data.member_3_quality_grade || !data.member_3_time_grade || 
                                    !data.member_3_text_grade || !data.member_3_presentation_grade;

                                detailsHTML += `
                                    <p class="details-id">ID: ${data.id}</p>
                                    <p class="details-description">Description: ${data.description}</p>
                                    <button class="mark-completed btn-success" data-id="${id}"
                                            ${isIncomplete ? "disabled" : ""}>
                                        Mark as Completed
                                    </button>
                                    ${isIncomplete ? `<p class="note">⚠️ Requirements not met yet.</p>` : ""}
                                `;
                            } else if (status === "COMPLETED") {
                                detailsHTML += `
                                    <p class="details-id">ID: ${data.id}</p>
                                    <p class="details-description">Description: ${data.description}</p>
                                    <p class="details-link">Library Link: <a href="${data.library_link}" target="_blank">${data.library_link}</a></p>
                                    <p class="details-enddate">End Date: ${data.end_date}</p>
                                `;
                            } else if (status === "CANCELLED") {
                                detailsHTML += `
                                    <p class="details-id">ID: ${data.id}</p>
                                    <p class="details-cancel-date">Cancellation Date: ${data.cancelation_date}</p>
                                    <div class="details-cancel_assembly_num">
                                        <span>General Assembly Number: ${data.general_assembly_number}</span>
                                        <span>General Assembly Year: ${data.general_assembly_year }</span>
                                    </div>    
                                    <p class="details-reason">Reason: ${data.reason_for_cancelation}</p>
                                `;
                            }

                            detailsHTML += `</div>`;
                            detailsContainer.innerHTML = detailsHTML;
                            detailsContainer.style.display = "block";
                        })
                        .catch(error => {
                            detailsContainer.innerText = "Error loading details.";
                        });
                });
            });
        })
        .catch(error => {
            content.innerText = "Error loading data.";
        });
}

// Event Delegation for All Buttons
document.addEventListener("click", function (event) {
    const target = event.target;
    const id = target.getAttribute("data-id");

    if (target.classList.contains("upload-assembly")) {
        const assemblyNumber = document.getElementById(`assemblyNumber-${id}`).value;
        fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/UploadAssembly.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, assemblyNumber })
        }).then(response => response.json())
          .then(data => {
            if (data.succes){
                alert("Assembly uploaded!");
                loadOverviewContent();
                } else {
                    alert("Error uploading assembly");
                }
            });
    }

    if (target.classList.contains("cancel-thesis")) {
        const assemblyNum = document.getElementById(`assemblyNum-${id}`).value;
        const assemblyYear = document.getElementById(`assemblyYear-${id}`).value;

        fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/CancelThesis.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, assemblyNum, assemblyYear })
        }).then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert("Thesis canceled!");
                  loadOverviewContent();
              } else {
                  alert("Error canceling thesis");
              }
          });
    }

    if (target.classList.contains("mark-completed")) {
        fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/MarkCompleted.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        }).then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert("Thesis marked as completed!");
                  loadOverviewContent();
              } else {
                  alert("Error marking thesis as completed");
              }
          });
    }
});
