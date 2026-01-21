function fetchUsername(){

    fetch('../PHP/Username_fetch.php')
    .then(response => response.json())
    .then(data => {

        let username= data['username'];
        console.log(username);
        localStorage.setItem("username", username);
        if (htmlFile === 'Foititis')
        {
            let script = document.createElement("script");
            script.src = "../JavaScript/thesis_state_control.js";
            document.body.appendChild(script);
        }
        
        else if(htmlFile === 'Kathigitis')
        {
            const button4 = document.querySelector("#Button4");
            let script = document.createElement("script");
            script.src = "../JavaScript/Kathigitis_diaheirisi.js";
            document.body.appendChild(script);
            document.querySelector("#Button4").click();

        }

    });
    

}

document.addEventListener('DOMContentLoaded', fetchUsername);
