export default function loadOverviewContent() {
    const content = document.getElementById('content');

    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Grammateia_Overview.php", {
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
                content.innerText = "No theses found to be examined.";
                return;
            }

            const output = data.map((item) => { 
                // Determine the appropriate class based on status 
                let statusClass = ""; 
                if (item.status === 'ACTIVE') {
                    statusClass = "status-active";
                } else if (item.status === 'TO BE EXAMINED') {
                    statusClass = "status-to-be-examined";
                }  else if (item.status === 'CANCELED') {
                    statusClass = "status-canceled";
                }
                return ` 
                    <li> 
                        <a href="thesis-details" class="clickable" data-id="${item.id}"> 
                            <span id="subject">Subject: ${item.subject}</span> 
                            <span id="status">Status: <span class="${statusClass}">${item.status}</span></span> 
                        </a> 
                        <div class="details-container" style="display: none;"></div> 
                    </li> 
                `; 
            }).join("");

            document.querySelector("#content").innerHTML = `<ul>${output}</ul>`;

            document.querySelectorAll(".clickable").forEach(element => {
                element.addEventListener("click", function (event) {
                    event.preventDefault();
                    const id = this.getAttribute("data-id");
                    const detailsContainer = this.parentElement.querySelector(".details-container");

                    // Close all open detail areas
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

                    fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Anakoinosi_leptomeries.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ id: id, context: "gramm_overview" })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) {
                                console.error(data.error);
                                detailsContainer.innerText = "Error: " + data.error;
                                return;
                            }
                            detailsContainer.innerHTML = `
                               <div class="detail-content">
                                    <div class="detail-header">
                                        <div class="members-container">
                                            <p><strong>Student:</strong> ${data.student}</p>
                                            <p><strong>Supervisor:</strong> ${data.supervisor}</p>
                                            <p><strong>Committee Member 2:</strong> ${data.member2 ? data.member2 : "Not Assigned"}</p>
                                            <p><strong>Committee Member 3:</strong> ${data.member3 ? data.member3 : "Not Assigned"}</p>
                                        </div>
                                    </div>
                                    <p><strong>ID:</strong> ${data.id}</p>
                                    <p><strong>Description:</strong> ${data.description}</p>
                                    <p><strong>Start Date:</strong> ${data.start_date ? data.start_date : "Not Available"}</p>
                                </div>
                                <!-- Add other details here -->
                            `;
                            detailsContainer.style.display = "block";
                        })
                        .catch(error => {
                            console.error("Error fetching details:", error);
                            detailsContainer.innerText = "Error loading details. Please try again later.";
                        });
                });
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            content.innerText = "Error loading data. Please try again later.";
        });
}
