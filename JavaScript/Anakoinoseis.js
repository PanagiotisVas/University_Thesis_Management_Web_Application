
document.addEventListener("DOMContentLoaded", function () {
    function fetchTheses(startDate = null, endDate = null) {
        fetch("/Project-Web/Web%20Application%20Project/PHP/Anakoinoseis.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ start_date: startDate, end_date: endDate })
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
                document.querySelector("#content").innerText = "Error: " + data.error;
                return;
            }

            if (data.length === 0) {
                document.querySelector("#content").innerText = "No theses found to be examined.";
                return;
            }

            const output = data.map((item) => `
                <li>
                    <a href="#" class="clickable" data-id="${item.id}"> 
                        <span>Presentation of the Thesis titled "${item.subject}"</span>
                        <span> Exam Date: ${item.exam_date}</span>
                    </a>
                    <div class="details-container" style="display: none;"></div>
                </li>
            `).join("");

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

                    fetch("/Project-Web/Web%20Application%20Project/PHP/Anakoinosi_leptomeries.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ id: id, context: "kedriki" })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) {
                                console.error(data.error);
                                detailsContainer.innerText = "Error: " + data.error;
                                return;
                            }
                            detailsContainer.innerHTML = `
                                <p>Presentation Anouncement: ${data.announcement_text}</p>
                                <p>Exam Date: ${data.exam_date ? data.exam_date : "Not Scheduled"}</p>
                                <div class="detail-row">
                                    <span>Way of Exam: ${data.way_of_exam ? data.way_of_exam : "Not Defined"}</span>
                                    <span>Room/Link: ${data.room_or_zoomlink ? data.room_or_zoomlink : "Not Available"}</span>
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
            document.querySelector("#content").innerText = "Error loading data. Please try again later.";
        });
    }

    // Fetch all theses initially (without filters)
    fetchTheses();

    // Handle Search Button Click
    document.querySelector("#filter-button").addEventListener("click", function () {
        const startDate = document.querySelector("#start-date").value;
        const endDate = document.querySelector("#end-date").value;
        
        console.log("Start Date:", startDate); // Debugging
        console.log("End Date:", endDate); // Debugging

        fetchTheses(startDate, endDate);
    });


    document.querySelector("#export-json").addEventListener("click", function () {
        const startDate = document.querySelector("#start-date").value;
        const endDate = document.querySelector("#end-date").value;

        fetch("/Project-Web/Web%20Application%20Project/PHP/Anakoinoseis.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ format: "json", start_date: startDate, end_date: endDate })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch export data.");
            }
            return response.json();
        })
        .then(exportData => {
            if (!Array.isArray(exportData) || exportData.length === 0) {
                alert("No data available for export.");
                return;
            }
    
            // Convert data to JSON string
            const jsonContent = JSON.stringify(exportData, null, 2); // Pretty-print with 2 spaces
            const blob = new Blob([jsonContent], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            // Create and trigger download
            const link = document.createElement("a");
            link.href = url;
            link.download = "thesis.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            // Cleanup URL object
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Error exporting data. Please try again.");
        });
    });

    document.querySelector("#export-xml").addEventListener("click", function () {
        const startDate = document.querySelector("#start-date").value;
        const endDate = document.querySelector("#end-date").value;

        fetch("/Project-Web/Web%20Application%20Project/PHP/Anakoinoseis.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ format: "xml", start_date: startDate, end_date: endDate}) // Request XML format
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch export data.");
            }
            return response.text(); // Get raw XML as text
        })
        .then(xmlContent => {
            if (!xmlContent.includes("<theses>")) {
                alert("No data available for export.");
                return;
            }
    
            const blob = new Blob([xmlContent], { type: "application/xml" });
            const url = URL.createObjectURL(blob);
            
            // Create and trigger download
            const link = document.createElement("a");
            link.href = url;
            link.download = "thesis.xml";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error("Error exporting XML:", error);
            alert("Error exporting data. Please try again.");
        });
    });
    
});
