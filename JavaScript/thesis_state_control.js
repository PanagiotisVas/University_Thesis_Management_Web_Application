
const addScripts = (scripts) => {
    const scriptContainer = document.querySelector(".scripts");
    scriptContainer.innerHTML = ""; // Clear existing scripts
    scripts.forEach((src) => {
        const script = document.createElement("script");
        script.src = src;
        scriptContainer.appendChild(script);
    });
};

function updateSidebarButtons()  {
    let username = localStorage.getItem("username");

    // Fetch data and update DOM
    const formData = new FormData();
    formData.append("username", username);

    fetch("../PHP/thesis_state_control.php", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            const buttonContainer = document.querySelector(".button-container");
            const status = data.length > 0 ? data[0].status : null;

            // Button rendering logic based on status
            if (status === "TO BE ASSIGNED") {
                buttonContainer.innerHTML = `
                    <button class="sidebar-button" id="Button1">
                        <span class="button-icon"><i class="fa-solid fa-arrow-up-right-from-square" style="color: #541619;"></i></span>
                        Overview
                    </button>
                    <button class="sidebar-button" id="Button2">
                        <span class="button-icon"><i class="fa-solid fa-arrow-up-right-from-square" style="color: #541619;"></i></span>
                        Application
                    </button>`;
                addScripts([
                    "../JavaScript/Foititis_kentriki.js",
                    "../JavaScript/App_Trimelis.js",
                    "../JavaScript/Button.js",
                ]);
            } else if (status === "ACTIVE") {
                buttonContainer.innerHTML = `
                    <button class="sidebar-button" id="Button1">
                        <span class="button-icon"><i class="fa-solid fa-arrow-up-right-from-square" style="color: #541619;"></i></span>
                        Overview
                    </button>
                    <button class="sidebar-button" id="Button3">
                        <span class="button-icon"><i class="fa-solid fa-download" style="color: #541619;"></i></span>
                        File Upload
                    </button>
                    <button class="sidebar-button" id="Button4">
                        <span class="button-icon"><i class="fa-solid fa-arrow-up-right-from-square" style="color: #541619;"></i></span>
                        Exam Application
                    </button>`;
                addScripts([
                    "../JavaScript/Foititis_kentriki.js",
                    "../JavaScript/Eisagvgh_PDF_Thesis.js",
                    "../JavaScript/Exam_App.js",
                    "../JavaScript/Button.js",
                ]);
            } else if (status === "TO BE EXAMINED") {
                buttonContainer.innerHTML = `
                    <button class="sidebar-button" id="Button1">
                        <span class="button-icon"><i class="fa-solid fa-arrow-up-right-from-square" style="color: #541619;"></i></span>
                        Overview
                    </button>
                    <button class="sidebar-button" id="Button3">
                        <span class="button-icon"><i class="fa-solid fa-download" style="color: #541619;"></i></span>
                        File Upload
                    </button>
                    <button class="sidebar-button" id="Button4">
                        <span class="button-icon"><i class="fa-solid fa-arrow-up-right-from-square" style="color: #541619;"></i></span>
                        Exam Application
                    </button>
                    <button class="sidebar-button" id="Button5">
                        <span class="button-icon"><i class="fa-solid fa-file-alt" style="color: #541619;"></i></span>
                        Praktiko Ejetasis
                    </button>`;
                addScripts([
                    "../JavaScript/Foititis_kentriki.js",
                    "../JavaScript/Eisagvgh_PDF_Thesis.js",
                    "../JavaScript/Exam_App.js",
                    "../JavaScript/Praktiko_Ejetasis.js",
                    "../JavaScript/Button.js",
                    "../JavaScript/Transition_To_Praktiko.js"
                ]);
            } else if (status === "COMPLETED") {
                buttonContainer.innerHTML = `
                    <button class="sidebar-button" id="Button1">
                        <span class="button-icon"><i class="fa-solid fa-arrow-up-right-from-square" style="color: #541619;"></i></span>
                        Overview
                    </button>
                    <button class="sidebar-button" id="Button5">
                        <span class="button-icon"><i class="fa-solid fa-file-alt" style="color: #541619;"></i></span>
                        Praktiko Ejetasis
                    </button>`;


                
                addScripts([
                    "../JavaScript/Foititis_kentriki.js",
                    "../JavaScript/Praktiko_Ejetasis.js",
                    "../JavaScript/Button.js",
                    "../JavaScript/Transition_To_Praktiko.js"
                ]);
            }

            else if (status === "CANCELLED"){
                document.querySelector(".main-screen").innerHTML = `<h3>Your thesis has been cancelled. Please contact your professor for more information.</h3>`;
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
};

// Call the function
updateSidebarButtons();
