<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$thesis = $_POST['thesisId'];
$student = $_POST['studentEmail'];

$servername = "localhost:3306/MySQL/Thesis_Application_Project";
$dbusername = "root";
$dbpassword = "root";
$database = "thesis";

// Create connection
$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Prepare the SQL statement
$sql = "UPDATE thesis SET student = ? WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die(json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]));
}

// Bind parameters
$stmt->bind_param("si", $student, $thesis);

// Execute the query
if ($stmt->execute()) {
    echo json_encode(["status" => true, "message" => "Thesis assigned successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to assign thesis: " . $stmt->error]);
}

// Close the statements and connection
$stmt->close();
$conn->close();
?>