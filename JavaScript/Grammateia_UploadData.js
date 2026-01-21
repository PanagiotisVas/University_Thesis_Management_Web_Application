export default function loadUploadDataContent() {
    const content = document.getElementById('content');

    content.innerHTML = `
        <div id="upload-container">
            <h2>Upload a JSON File with User Data</h2>
            <input type="file" id="file-upload" accept=".json" />
            <button id="upload-button">Upload</button>
            <div id="upload-status"></div>
        </div>
    `;

    const uploadButton = document.getElementById('upload-button');
    const fileInput = document.getElementById('file-upload');
    const uploadStatus = document.getElementById('upload-status');

    uploadButton.addEventListener('click', async () => {
        if (fileInput.files.length === 0) {
            uploadStatus.innerHTML = `<p style="color: red;">Please select a file.</p>`;
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("jsonFile", file);

        try {
            const response = await fetch("http://localhost/Project-Web/Web%20Application%20Project/PHP/Gramm_UploadData.php", {
                method: "POST",
                body: formData
            });

            const result = await response.text();
            uploadStatus.innerHTML = `<p style="color: green;">${result}</p>`;
        } catch (error) {
            uploadStatus.innerHTML = `<p style="color: red;">Error uploading file.</p>`;
            console.error("Error:", error);
        }
    });
}
