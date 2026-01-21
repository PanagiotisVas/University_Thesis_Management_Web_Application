<?php
// Database connection
$servername = "localhost:3306";
$dbusername = "root";
$dbpassword = "root";
$database = "thesis";
$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the file ID or name (use ID for better security)
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$sql = "SELECT thesis_file, thesis_file_name FROM thesis WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($fileData, $fileName);
    $stmt->fetch();

    // Set headers for PDF display
    header("Content-Type: application/pdf");
    header("Content-Disposition: inline; filename=\"$fileName\"");
    echo $fileData;
} else {
    echo "File not found.";
}

$stmt->close();
$conn->close();
?>