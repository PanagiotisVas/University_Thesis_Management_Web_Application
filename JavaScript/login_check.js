function checkLoginStatus() {
    fetch('../PHP/login_check.php')
    .then(response => response.json())
    .then(data => {
        if (data['type'] === "error") {
            window.location.href = "../HTML/Login.html";
        }
    });

    let now = Date.now();
    let lastUnload = parseInt(localStorage.getItem('unload_timestamp'), 10);

    if (lastUnload && (now - lastUnload > 1000)) {
        fetch('../PHP/logout.php')
        .then(response => response.json())
        .then(data => {
            if (data['type'] === "logout") {
                localStorage.clear();
                window.location.href = "../HTML/Login.html";
            }
        });
    }
}

window.addEventListener('beforeunload', function() {
    localStorage.setItem('unload_timestamp', Date.now());
});

// Call the function
checkLoginStatus();
