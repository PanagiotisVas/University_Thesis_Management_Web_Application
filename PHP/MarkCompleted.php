<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost:3306/MySQL/Thesis_Application_Project";
    $dbusername = "root";
    $dbpassword = "root";
    $database = "thesis";

$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['id'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$id = $conn->real_escape_string($input['id']);

// Check if all grades are uploaded
$sqlGrades = "SELECT * FROM thesis_grade WHERE thesis = '$id'";
$resultGrades = $conn->query($sqlGrades);

if ($resultGrades && $row = $resultGrades->fetch_assoc()) {
    foreach ($row as $column => $value) {
        if (is_null($value) && $column !== "document_link" && $column !== "thesis") {
            echo json_encode(["error" => "All grades must be uploaded before marking as completed"]);
            $conn->close();
            exit;
        }
    }
}

// Check if library_link is uploaded
$sqlLibrary = "SELECT library_link FROM thesis WHERE id = '$id'";
$resultLibrary = $conn->query($sqlLibrary);

if ($resultLibrary && $row = $resultLibrary->fetch_assoc()) {
    if (empty($row['library_link'])) {
        echo json_encode(["error" => "Library link must be uploaded before marking as completed"]);
        $conn->close();
        exit;
    }
}

// Update thesis status to COMPLETED
$sqlUpdate = "UPDATE thesis SET status = 'COMPLETED', end_date = CURDATE() WHERE id = '$id'";

if ($conn->query($sqlUpdate) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Failed to update thesis status"]);
}

$conn->close();
?>
