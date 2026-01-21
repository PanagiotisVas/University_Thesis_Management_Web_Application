document.addEventListener('DOMContentLoaded', () => {
    
    let username = localStorage.getItem('username');
    console.log('Username:', username);
    document.getElementById('downloadPdf').addEventListener('click', () => {
        const element = document.getElementById('content');
        
        // Define the PDF options
        const options = {
            margin:       1,
            filename:     'manuscript.pdf',
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(element).set(options).toPdf().get('pdf').then(function (pdf) {
            // Convert the generated PDF to Blob
            const pdfBlob = pdf.output('blob');
            const formData = new FormData();
            formData.append('pdfFile', pdfBlob, 'manuscript.pdf');
            formData.append('username', username); // Example student username

            fetch('http://localhost/Project-Web/Web%20Application%20Project/PHP/manuscript_upload.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data == true) {
                    // Save the PDF locally after successful upload
                    pdf.save('manuscript.pdf');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }).catch(error => {
            console.error('Error generating PDF:', error);
        });
    });
});

