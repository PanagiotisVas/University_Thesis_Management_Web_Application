// JavaScript to load header and footer dynamically
document.addEventListener("DOMContentLoaded", () => {
    fetch("/Project-Web/Web%20Application%20Project/HTML/Header.html")
        .then(response => response.text())
        .then(data => {
            if (htmlFile === 'Foititis')
            {
                
                document.getElementById("header").innerHTML = data;
                let myLink=document.getElementById("logoLink");
                myLink.href="../HTML/Foititis_kentriki.html";

                document.getElementsByClassName("login")[0].innerHTML='Logout';
                document.querySelector(".login").addEventListener("click", function(){
                    fetch('../PHP/logout.php')
                    .then(response => response.json())
                    .then(data=>{
                
                        if (data['type'] === "logout")
                        {
                            localStorage.clear();
                            window.location.href = "/Project-Web/Web%20Application%20Project/HTML/Login.html";
                        }
                    
                    })
                });

            }
            else if (htmlFile === 'Kentriki')
            {
            
                document.getElementById("header").innerHTML = data;
                let myLink=document.getElementById("logoLink");
                myLink.href="../HTML/Kentriki.html";

            }
            else if (htmlFile === 'Kathigitis')
            {
                
                document.getElementById("header").innerHTML = data;
                let myLink=document.getElementById("logoLink");
                myLink.href="../HTML/Kathigitis_kentriki.html";

                document.getElementsByClassName("login")[0].innerHTML='Logout';
                document.querySelector(".login").addEventListener("click", function(){
                    fetch('../ PHP/logout.php')
                    .then(response => response.json())
                    .then(data=>{
                
                        if (data['type'] === "logout")
                        {
                            localStorage.clear();
                            window.location.href = "HTML/Login.html";
                        }
                    
                    })
                });
            }
            
            else if (htmlFile === 'Grammateia')
                {
                    
                    document.getElementById("header").innerHTML = data;
                    let myLink=document.getElementById("logoLink");
                    myLink.href="../HTML/Grammateia_kentriki.html";
    
                    document.getElementsByClassName("login")[0].innerHTML='Logout';
                    document.querySelector(".login").addEventListener("click", function(){
                        fetch('../PHP/logout.php')
                        .then(response => response.json())
                        .then(data=>{
                    
                            if (data['type'] === "logout")
                            {
                                localStorage.clear();
                                window.location.href = "../HTML/Login.html";
                            }
                        
                        })
                    });
                }

            
        });   
    });        