document.addEventListener("DOMContentLoaded", function () {
    const buttonContainer = document.querySelector('.button-container');
    const content = document.getElementById('content');
    const titleElement = document.querySelector("#title");

    // Map button data-content values to their respective titles
    const titles = {
        "Grammateia_Overview": "Theses Overview",
        "Grammateia_ThesisSettings": "Manage Thesis Settings",
        "Grammateia_UploadData": "Upload User Data",
    };

    function setActiveButton(button) {
        document.querySelectorAll('.sidebar-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    buttonContainer.addEventListener('click', function(event) {
        const button = event.target.closest('.sidebar-button');
        if (!button) return; // Click was outside a sidebar button

        setActiveButton(button);

        const contentType = button.getAttribute('data-content');
        updateTitle(contentType); // Update the title when a button is clicked
        loadContent(contentType);
    });

    function updateTitle(contentType) {
        const newTitle = titles[contentType] || "Default Title"; // Fallback to "Default Title" if no match
        titleElement.textContent = newTitle;
    }

    function loadContent(type) {
        import(`../JavaScript/${type}.js`)
            .then(module => {
                module.default();
            })
            .catch(error => {
                console.error(`Error loading content for ${type}:`, error);
                content.innerHTML = '<p>Error loading content. Please try again later.</p>';
            });
    }

    // Initialize with the default content specified in the HTML
    const defaultContent = document.body.getAttribute('data-default-content');
    const initialButton = document.querySelector(`.sidebar-button[data-content="${defaultContent}"]`);
    if (initialButton) {
        setActiveButton(initialButton);
        updateTitle(defaultContent); // Set the initial title based on the default content
    }
    loadContent(defaultContent);
});
