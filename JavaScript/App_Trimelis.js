
let app_check_flag = localStorage.getItem("app_check_flag");
let username = localStorage.getItem("username");
function loadProfessorsData() {
    let formData = new FormData();
    formData.append("username", username);

    fetch("../PHP/Emfanisi_Kath.php", {
        method: "POST",
        body: formData,
    })
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
        let table1 = `
            <div class=container>
                <div class=table>
                    <h2>All Professors</h2>
                    <ul class=allProfessors>
                        <li class=tableHeader>
                            <div class=col1>Name</div>
                            <div class=col2>Email</div>
                        </li>           
        `;
        // Loop through the data and build <li> items for each piece of data
        data.forEach((item) => {
            table1 +=`
                <li class=tableRow>
                    <div class=col1> ${item.name} ${item.surname}</div>
                    <div class=col2> ${item.email}</div>
                </li>
            `;
        });

        table1 +=`
                </ul>
            </div>
        </div>
        `; 

        let table2 =  `
            <div class=container> 
                <div class=table2> 
                    <h2>Selected Professors</h2>
                    <ul class=selectedProfessors>
                        <li class=tableHeader>
                            <div class=col1>Name</div>
                            <div class=col2>Email</div>
                        </li>           
                    </ul>
                </div>
            </div>`;

        let output = table1 + table2;
        output += `<div class=container>
                        <button id=applyButton>Apply</button>
                    </div>`;

        document.querySelector(".main-screen").innerHTML = output;

        if (app_check_flag === true)
        {
            document.querySelector(".main-screen").innerHTML += `<h3>Application was a success! Please wait for the professors to accept your request!<h3>`;
        }

        let emails = []; // Stores selected professors' emails

        document.querySelectorAll(".allProfessors .tableRow").forEach(row => {
            row.addEventListener("click", function () {
                let clonedRow = row.cloneNode(true);
                clonedRow.classList.add("tableRow");
                emails.push(row.querySelector(".col2").innerText);

                document.querySelector(".selectedProfessors").appendChild(clonedRow);
                row.remove();
            });
        });

        let dynamicButton = document.querySelector("#applyButton");

        dynamicButton.addEventListener("click", () => {
            let successCount = 0;
            let count = emails.length;
            let newData = new FormData();
            newData.append("st_username", username);
            
            emails.forEach(email => {
                newData.append("prof_username", email);

                fetch("../PHP/Eisag_SupVisor.php", {
                    method: "POST",
                    body: newData,
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data == true) {
                        successCount++;
                        if (successCount == count) {
                            app_check_flag = true;
                            localStorage.setItem("app_check_flag", app_check_flag);
                            output +=  `<div class=container>
                                            <h3>Application was a success! Please wait for the professors to accept your request!<h3>
                                        </div>`;
                            document.querySelector(".main-screen").innerHTML = output;
                        }
                    }
                });
            });
        

        });
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });
}


document.querySelector("#Button2").addEventListener("click", loadProfessorsData);
