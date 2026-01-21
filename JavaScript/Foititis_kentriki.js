function studentMain() {
    let output = '';
    let username = localStorage.getItem("username");

    // Create formData for both requests
    let formData1 = new FormData();
    formData1.append("username", username);

    let formData2 = new FormData();
    formData2.append("username", username);

    // Add a loading indicator
    document.querySelector(".main-screen").innerHTML = "<div class='content'><h2>Loading...</h2></div>";

    // Make both fetch requests in parallel
    Promise.all([
        fetch("../PHP/Foititis_kentriki.php", {
            method: "POST",
            body: formData1
        }).then(response => response.json()),

        fetch("../PHP/Foititis_kentriki_Plirofories.php", {
            method: "POST",
            body: formData2
        })
        .then(response => response.json())
    ])
    .then(([data1, data2]) => {
        
        let thesis = data1.thesis[0];
    
        output = `<div class="content"><h1>Thesis data</h1><ul>`;
        output += `<li>Subject: ${thesis.subject}</li>`;
        output += `<li>Description: ${thesis.description}</li>`;
        if(thesis.desc_file_name !== null)
        { 
            output += '<li>Description File: <a href="../PHP/Desc_File_download.php"></a></li>';
        }
        output += `<li>Status: ${thesis.status}</li>`;
        console.log(data1.professors_member2);
        if (data1.professors_member2[0] || data1.professors_member3[0])
        {
            output += `<li>Examination Committee: ${data1.professors_member2[0].email} ${data1.professors_member3[0].email} (${data1.professors_member2[0].name} ${data1.professors_member2[0].surname} , ${data1.professors_member3[0].name} ${data1.professors_member3[0].surname}) </li>`;
        }
        else 
        {
            output += `<li>Examination Committee: Not yet assigned</li>`;
        }

        output += `</ul></div>`;

        output += `<div class="content"><h1>Student Data</h1><ul>`;
        data2.forEach((item) => {
            output += `<li>Email: ${item.email}</li>`;
            output += `<li>Surname: ${item.surname}</li>`;
            output += `<li>Name: ${item.name}</li>`;
            output += `<li id="editable">Street: ${item.street} ${item.street_number}</li>`;
            output += `<li id="editable">City: ${item.city}</li>`;
            output += `<li id="editable">Postcode: ${item.postcode}</li>`;
            output += `<li id="editable">Landline Telephone: ${item.landline_telephone}</li>`;
            output += `<li id="editable">Mobile Telephone: ${item.mobile_telephone}</li>`;
        });
        output += `</ul></div>`;

        // Update the DOM with the fetched data
        document.querySelector(".main-screen").innerHTML = output;

        // Add the edit button after the content has loaded
        addEditButton();
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
        document.querySelector(".main-screen").innerHTML = "<div class='content'><h2>Error loading data. Please try again.</h2></div>";
    });

    function addEditButton() {
        document.querySelector(".main-screen").innerHTML += `<div class="content"><div class=editingButtons ><button id="editButton">Edit</button></div></div>`;
        document.querySelector('#editButton').addEventListener("click", makeEditable);
    }

    function addCancelButton() {
        document.querySelector(".main-screen").innerHTML += `<div class="content"><button id="cancelButton">Cancel</button></div>`;
        document.querySelector('#cancelButton').addEventListener("click", studentMain);
    }

    function makeEditable() {
        const editableElements = document.querySelectorAll("#editable");
        editableElements.forEach((element) => {
            const text = element.textContent;
            const [label, value] = text.split(":");
            element.innerHTML = `${label}: <input type="text" value="${value.trim()}" />`;
        });

        addCancelButton();
        const editButton = document.querySelector("#editButton");
        editButton.textContent = "Save";
        editButton.removeEventListener("click", makeEditable);
        editButton.addEventListener("click", saveChanges);
    }

    function saveChanges() {
        const username = localStorage.getItem("username");
        const editableElements = document.querySelectorAll("li#editable");

        const labelToColumn = {
            "Street": "street",
            "City": "city",
            "Postcode": "postcode",
            "Landline Telephone": "landline_telephone",
            "Mobile Telephone": "mobile_telephone"
        };

        editableElements.forEach((element) => {
            const input = element.querySelector("input");
            const text = element.textContent;
            const [label] = text.split(":");

            const column = labelToColumn[label];
            if (column && input) {
                const newValue = input.value;

                const formData = new FormData();
                formData.append("username", username);
                formData.append("column", column);
                formData.append("value", newValue);

                fetch("../PHP/student_data_update.php", {
                    method: "POST",
                    body: formData
                })
                .then((response) => response.json())
                .then((result) => {
                    if (result == true) {
                        studentMain(); // Reload the data after saving
                    }
                })
                .catch((error) => console.error("Error updating data:", error));
            }
        });
    }
}
studentMain();
document.querySelector("#Button1").addEventListener("click", studentMain);
