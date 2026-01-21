// Function to initialize the upload interface
let fileflag,linkflag = false;
function initializeState(flag) {

   
    let username = localStorage.getItem("username");
    
    let fileinput = null;

    // Reset the main screen's content
    let output = `<div class=FilePathContainer>
                    <h3>Thesis File</h3>
                    <div class=FilePathForm>
                        <input type="text" id="filepath" name="filepath" placeholder="Enter Thesis Filepath" required>
                        <button id="FileExplorerButton">File</button>
                        <button id="UploadButton">Upload</button>
                    </div>
                    </div>`;
    document.querySelector(".main-screen").innerHTML = output;

    document.querySelector(".main-screen").innerHTML +=  `<div class= NimertisLinkContainer>
                                                                <h3>Upload Nimertis Link</h3>
                                                                <input type="text" id="Nimertislink" placeholder="Enter Nimertis Link">
                                                                <button id="UploadNimertisButton">Upload</button>                                                                                                 
                                                            </div>`;
    

    if (flag == true)
    {
        if (linkflag == true)
        {
            console.log("Link uploaded succesfully");
            document.querySelector(".main-screen").innerHTML += `<h3>Link uploaded succesfully</h3>`;
            linkflag = false;
        }

        if(fileflag == true)
        {
            document.querySelector(".main-screen").innerHTML += `<h3>File uploaded succesfully</h3>`;
            fileflag = false;
        }
    }

    // Function to upload the file
    function runPHPscript(fileinput) {
        let formData = new FormData();
        let file = fileinput.files[0]
        formData.append("file", file);
        formData.append("username", username);
        fetch("../PHP/File_Upload.php", {
            method: "POST",
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            if (data == true) {
                document.querySelector(".main-screen").innerHTML += `<h3>File Uploaded Successfully</h3>`;
            }
            initializeState(fileflag); // Reset to initial state after upload
        });
    }

    // Function to handle file selection
    function fileupload() {
        fileflag = true; // Indicate a file has been selected
        fileinput = document.createElement("input");
        fileinput.type = "file";
        fileinput.accept = "application/pdf";
        fileinput.click();

        fileinput.addEventListener("change", function () {
            // Update the filepath input field after a file is selected
            document.querySelector("#filepath").value = fileinput.files[0].name;
        });
    }

    // Function to upload the link
    function linkupload(link, location) {
        linkflag = true;
        let formData = new FormData();
        formData.append("link", link);
        formData.append("username", username);
        formData.append("location", location);
        fetch("../PHP/Link_Upload.php", {
            method: "POST",
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            if (data == true) {
                document.querySelector(".main-screen").innerHTML += `<h3>Link Uploaded Successfully</h3>`;
            }
            initializeState(linkflag); // Reset to initial state after upload
        });
    }

    // Attach event listeners for file and link upload
    document.querySelector("#FileExplorerButton").onclick = function () {
        fileupload();
    };


    document.querySelector("#UploadNimertisButton").addEventListener("click", function() {
        let link = document.querySelector("#Nimertislink").value.trim();
        if (link !== "" && link.startsWith("https://nemertes.library.upatras.gr/")) {
            linkupload(link,2); 
        } else {
            alert("Please provide a valid nemertes library link.");
        }
    });

    document.querySelector("#UploadButton").addEventListener("click", function () {
        if (fileflag && fileinput) {
            runPHPscript(fileinput); // Handle file upload
        } else {
            let input = document.querySelector("#filepath").value.trim();
            if (input !== "") {
                linkupload(input,1); // Handle link upload
            } else {
                alert("Please provide a valid link or select a file.");
            }
        }
    });
    }



// Attach the initialization to the button click
document.querySelector("#Button3").addEventListener("click", initializeState);

