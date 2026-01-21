document.addEventListener('DOMContentLoaded', function () {
    const button1 = document.querySelector("#Button1");
    const button2 = document.querySelector("#Button2");
    const button3 = document.querySelector("#Button3");
    const button4 = document.querySelector("#Button4");
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector("#details");

    const chartContainers = [
        document.getElementById("chartContainer1"),
        document.getElementById("chartContainer2"),
        document.getElementById("chartContainer3")
    ];

    // Function to remove dynamic buttons
    const removeChartButtons = () => {
        const dynamicButtons = document.querySelectorAll(".dynamic-button");
        dynamicButtons.forEach(button => button.remove());
    };

    // Initialize global chart variables
    window.thesisChart = null;
    window.gradeChart = null;
    window.timeChart = null;

    const resetCharts = () => {
        // Destroy existing charts if they exist
        if (window.thesisChart) {
            window.thesisChart.destroy();
        }
        if (window.gradeChart) {
            window.gradeChart.destroy();
        }
        if (window.timeChart) {
            window.timeChart.destroy();
        }

        chartContainers.forEach(container => {
            container.style.display = "none"; // Hide all charts
        });
    };

    // Add event listener to Button 1
    if (button1) {
        button1.addEventListener("click", function () {
            const contentElement = document.querySelector("#content");
            let username = localStorage.getItem("username");

            if (contentElement) {
                removeChartButtons();
                let formData = new FormData();
                formData.append("username", username);

                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_complete.php", {
                    method: "POST",
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        // Filter the data based on role
                        const supervisors = data.filter(item => item.role === "supervisor");
                        const members = data.filter(item => item.role === "member2"||item.role === "member2");

                        // Create Thesis Graph Button
                        const buttonA = document.createElement("button");
                        buttonA.textContent = "Thesis Chart";
                        buttonA.className = "dynamic-button";
                        buttonA.addEventListener("click", function(){
                            resetCharts();
                            chartContainers[0].style.display = "flex";

                            const totalSupervisorCount = supervisors.length;
                            const totalMemberCount = members.length;
                            const totalCount = data.length;

                            const ctx1 = document.getElementById('thesisChart').getContext('2d');
                            window.thesisChart = new Chart(ctx1, {
                                type: 'bar',
                                data: {
                                    labels: ['As Supervisor', 'As Member', 'Total'],
                                    datasets: [{
                                        label: 'Number of Completed Theses',
                                        data: [totalSupervisorCount, totalMemberCount, totalCount],
                                        backgroundColor: [
                                            'rgba(75, 192, 192, 0.2)',
                                            'rgba(54, 162, 235, 0.2)',
                                            'rgba(255, 99, 132, 0.2)',
                                        ],
                                        borderColor: [
                                            'rgba(75, 192, 192, 1)',
                                            'rgba(54, 162, 235, 1)',
                                            'rgba(255, 99, 132, 1)',
                                        ],
                                        borderWidth: 1
                                    }]
                                },
                                options: {
                                    scales: {
                                        y: {
                                            beginAtZero: true
                                        }
                                    }
                                }
                            });
                        });

                        // Create Grade Graph Button
                        const buttonB = document.createElement("button");
                        buttonB.textContent = "Grade Chart";
                        buttonB.className = "dynamic-button";
                        buttonB.addEventListener("click", function(){
                            resetCharts();
                            chartContainers[1].style.display = "flex";
                            
                            fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_comp_grades.php", {
                                method: "POST",
                                body: formData,
                            })
                                .then((response) => response.json())
                                .then((gradesData) => {
                                    console.log(gradesData);
                                    // Filter the data based on role
                                    const supervisorData = gradesData.filter(item => item.role === "supervisor");
                                    const memberData = gradesData.filter(item => item.role === "member");

                                    // Calculate grades
                                    const supervisorGrades = supervisorData.map(item => {
                                        const supervisorGrade = 0.6 * item.supervisor_quality_grade +
                                                            0.15 * item.supervisor_time_grade +
                                                            0.15 * item.supervisor_text_grade +
                                                            0.10 * item.supervisor_presentation_grade;
            
                                        const member2Grade = 0.6 * item.member_2_quality_grade +
                                                            0.15 * item.member_2_time_grade +
                                                            0.15 * item.member_2_text_grade +
                                                            0.10 * item.member_2_presentation_grade;
            
                                        const member3Grade = 0.6 * item.member_3_quality_grade +
                                                            0.15 * item.member_3_time_grade +
                                                            0.15 * item.member_3_text_grade +
                                                            0.10 * item.member_3_presentation_grade;
            
                                        return (supervisorGrade + member2Grade + member3Grade) / 3;
                                    });
            
                                    const memberGrades = memberData.map(item => {
                                        const supervisorGrade = 0.6 * item.supervisor_quality_grade +
                                                            0.15 * item.supervisor_time_grade +
                                                            0.15 * item.supervisor_text_grade +
                                                            0.10 * item.supervisor_presentation_grade;
            
                                        const member2Grade = 0.6 * item.member_2_quality_grade +
                                                            0.15 * item.member_2_time_grade +
                                                            0.15 * item.member_2_text_grade +
                                                            0.10 * item.member_2_presentation_grade;
            
                                        const member3Grade = 0.6 * item.member_3_quality_grade +
                                                            0.15 * item.member_3_time_grade +
                                                            0.15 * item.member_3_text_grade +
                                                            0.10 * item.member_3_presentation_grade;
            
                                        return (supervisorGrade + member2Grade + member3Grade) / 3;
                                    });
            
                                    const generalGrades = gradesData.map(item => {
                                        const supervisorGrade = 0.6 * item.supervisor_quality_grade +
                                                            0.15 * item.supervisor_time_grade +
                                                            0.15 * item.supervisor_text_grade +
                                                            0.10 * item.supervisor_presentation_grade;
            
                                        const member2Grade = 0.6 * item.member_2_quality_grade +
                                                            0.15 * item.member_2_time_grade +
                                                            0.15 * item.member_2_text_grade +
                                                            0.10 * item.member_2_presentation_grade;
            
                                        const member3Grade = 0.6 * item.member_3_quality_grade +
                                                            0.15 * item.member_3_time_grade +
                                                            0.15 * item.member_3_text_grade +
                                                            0.10 * item.member_3_presentation_grade;
            
                                        return (supervisorGrade + member2Grade + member3Grade) / 3;
                                    });

                                    // Calculate averages
                                    const avgSupervisorGrade = supervisorGrades.reduce((sum, grade) => sum + grade, 0) / supervisorGrades.length;
                                    const avgMemberGrade = memberGrades.reduce((sum, grade) => sum + grade, 0) / memberGrades.length;
                                    const avgGeneralGrade = generalGrades.reduce((sum, grade) => sum + grade, 0) / generalGrades.length;

                                    const ctx2 = document.getElementById('gradeChart').getContext('2d');
                                    window.gradeChart = new Chart(ctx2, {
                                        type: 'bar',
                                        data: {
                                            labels: ['As Supervisor', 'As Member', 'General'],
                                            datasets: [{
                                                label: 'Average Grade',
                                                data: [avgSupervisorGrade, avgMemberGrade, avgGeneralGrade],
                                                backgroundColor: [
                                                    'rgba(75, 192, 192, 0.2)',
                                                    'rgba(54, 162, 235, 0.2)',
                                                    'rgba(255, 99, 132, 0.2)',
                                                ],
                                                borderColor: [
                                                    'rgba(75, 192, 192, 1)',
                                                    'rgba(54, 162, 235, 1)',
                                                    'rgba(255, 99, 132, 1)',
                                                ],
                                                borderWidth: 1
                                            }]
                                        },
                                        options: {
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    max: 100 // Assuming grades are out of 100
                                                }
                                            }
                                        }
                                    });
                                });
                        });

                        // Create Time Graph Button
                        const buttonC = document.createElement("button");
                        buttonC.textContent = "Time Chart";
                        buttonC.className = "dynamic-button";
                        buttonC.addEventListener("click", function(){
                            resetCharts();
                            chartContainers[2].style.display = "flex";

                            // Calculate time needed
                            const supervisorTimes = supervisors.map(item => {
                                const startDate = new Date(item.start_date);
                                const endDate = new Date(item.end_date);
                                const timeDiff = endDate - startDate;
                                return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
                            });

                            const memberTimes = members.map(item => {
                                const startDate = new Date(item.start_date);
                                const endDate = new Date(item.end_date);
                                const timeDiff = endDate - startDate;
                                return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
                            });

                            const generalTimes = data.map(item => {
                                const startDate = new Date(item.start_date);
                                const endDate = new Date(item.end_date);
                                const timeDiff = endDate - startDate;
                                return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
                            });

                            const avgSupervisorTime = supervisorTimes.reduce((sum, days) => sum + days, 0) / supervisorTimes.length;
                            const avgMemberTime = memberTimes.reduce((sum, days) => sum + days, 0) / memberTimes.length;
                            const avgGeneralTime = generalTimes.reduce((sum, days) => sum + days, 0) / generalTimes.length;

                            const ctx3 = document.getElementById('timeChart').getContext('2d');
                            window.timeChart = new Chart(ctx3, {
                                type: 'bar',
                                data: {
                                    labels: ['As Supervisor', 'As Member', 'General'],
                                    datasets: [{
                                        label: 'Average Time Needed (Days)',
                                        data: [avgSupervisorTime, avgMemberTime, avgGeneralTime],
                                        backgroundColor: [
                                            'rgba(153, 102, 255, 0.2)',
                                            'rgba(255, 159, 64, 0.2)',
                                            'rgba(75, 192, 192, 0.2)',
                                        ],
                                        borderColor: [
                                            'rgba(153, 102, 255, 1)',
                                            'rgba(255, 159, 64, 1)',
                                            'rgba(75, 192, 192, 1)',
                                        ],
                                        borderWidth: 1
                                    }]
                                },
                                options: {
                                    scales: {
                                        y: {
                                            beginAtZero: true
                                        }
                                    }
                                }
                            });
                        });

                        // Create Export CSV Button
                        const buttonD = document.createElement("button");
                        buttonD.textContent = "Export CSV";
                        buttonD.className = "dynamic-button";
                        buttonD.addEventListener("click", function () {

                                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_comp_export.php", {
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
                        const buttonE = document.createElement("button");
                        buttonE.textContent = "Export JSON";
                        buttonE.className = "dynamic-button";
                        buttonE.addEventListener("click", function () {
                            fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_comp_export.php", {
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
                        buttonContainer.appendChild(buttonC);
                        buttonContainer.appendChild(buttonD);
                        buttonContainer.appendChild(buttonE);
                
                        // Create lists for each group
                        let supervisorList = supervisors.map(item =>`
                            <li class="thesis-item">
                                <span class="clickable" data-item='${JSON.stringify(item)}'> Thesis: ${item.subject}</span>
                                <span class="thesis-status">${item.status}</span>
                            </li>
                        `).join("");
                
                        let memberList = members.map(item => `
                            <li class="thesis-item">
                                <span class="clickable" data-item='${JSON.stringify(item)}'> Thesis: ${item.subject}</span>
                                <span class="thesis-status">${item.status}</span>
                            </li>
                        `).join("");
                
                        // Add the lists to the DOM
                        contentElement.innerHTML =` 
                            <div>
                                <h2>As Supervisor:</h2>
                                <ul>${supervisorList}</ul>
                            </div>
                            <div>
                                <h2>As Member:</h2>
                                <ul>${memberList}</ul>
                            </div>
                        `; 

                        // Attach event listeners to the clickable elements
                        document.querySelectorAll(".clickable").forEach(element => {
                            element.addEventListener("click", function (e) {
                                const itemData = JSON.parse(e.target.dataset.item);

                                let thesisData = new FormData();
                                thesisData.append("thesis", itemData.id);

                                fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Kathigitis_comp_thesis.php", {
                                    method: "POST",
                                    body: thesisData,
                                })
                                .then((response) => response.json())
                                    .then((returnData) => {
                                        const supervisorGrade = 0.6*returnData[0].supervisor_quality_grade + 0.15*returnData[0].supervisor_time_grade + 0.15*returnData[0].supervisor_text_grade + 0.10*returnData[0].supervisor_presentation_grade;
                                        const member2Grade = 0.6*returnData[0].member_2_quality_grade + 0.15*returnData[0].member_2_time_grade + 0.15*returnData[0].member_2_text_grade + 0.10*returnData[0].member_2_presentation_grade;
                                        const member3Grade = 0.6*returnData[0].member_3_quality_grade + 0.15*returnData[0].member_3_time_grade + 0.15*returnData[0].member_3_text_grade + 0.10*returnData[0].member_3_presentation_grade;
                                        const finalGrade = (supervisorGrade + member2Grade + member3Grade)/3;
                                        overlayContent.innerHTML =`
                                            <h2>Thesis: ${itemData.subject}</h2>
                                            <p><strong>Grade:</strong> ${finalGrade.toFixed(2)}</p>
                                            <p><strong>Start Date:</strong> ${itemData.start_date} <strong> &nbsp;&nbsp;&nbsp;||&nbsp;&nbsp;&nbsp; End Date:</strong> ${itemData.end_date}</p>
                                            <p><strong>Student:</strong> ${itemData.student}</p>
                                            <p><strong>Supervisor:</strong> ${itemData.supervisor}</p>
                                            <p><strong>Comitee:</strong> ${returnData[0].member2}, ${returnData[0].member3}</p>
                                            <p>
                                                <a href="${itemData.library_link}" target="_blank" rel="noopener noreferrer">
                                                    Nimertes Link
                                                </a>
                                            </p>
                                            <p>
                                                <a href="/Project-Web/Web%20Application%20Project/HTML/Kathigitis_Praktiko.html?thesisId=${itemData.id}" target="_blank" rel="noopener noreferrer">
                                                    Manuscript
                                                </a>
                                            </p>
                                        `;
                                        
                                        overlay.style.display = "flex";
                                    });
                            });
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                        contentElement.innerHTML = "Error loading data. Please try again later.";
                    });
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

    if (button2) {
        button2.addEventListener("click", removeChartButtons);
        button2.addEventListener("click", resetCharts);
    }
    if (button3) {
        button3.addEventListener("click", removeChartButtons);
        button3.addEventListener("click", resetCharts);
    }
    if (button4) {
        button4.addEventListener("click", removeChartButtons);
        button4.addEventListener("click", resetCharts);

    }

});