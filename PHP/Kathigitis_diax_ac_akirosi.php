<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Get POST data
$thesisId = $_POST['thesis'];
$assemblyNumber = $_POST['assembly_number'];
$assemblyYear = $_POST['assembly_year'];

// Database credentials
$servername = "localhost:3306";
$dbusername = "root";
$dbpassword = "root";
$database = "thesis";

// Create connection
$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]));
}

// Check if 2 years have passed since assignment
$sql1 = "SELECT start_date FROM thesis WHERE id = ?";
$stmt1 = $conn->prepare($sql1);
$stmt1->bind_param("i", $thesisId);
$stmt1->execute();
$result = $stmt1->get_result();
$row = $result->fetch_assoc();

if ($row) {
    $assignmentDate = new DateTime($row['start_date']); 
    $currentDate = new DateTime();

    $interval = $currentDate->diff($assignmentDate);
    if ($interval->y < 2) {
        die(json_encode(["error" => "Cannot cancel assignment. Less than 2 years since the assignment date."]));
    }
}

// Assignment cancelation
$sql2 = "UPDATE thesis SET status = 'CANCELLED' WHERE id = ?";
$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("i", $thesisId);

// Insert in cancelation table
$sql3 = "INSERT INTO thesis_cancelation VALUES (?, CURRENT_DATE(), 'BY SUPERVISOR', ?, ?)";
$stmt3 = $conn->prepare($sql3);
$stmt3->bind_param("iii", $thesisId, $assemblyNumber, $assemblyYear);

if ($stmt2->execute()&&$stmt3->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Failed to cancel assignment."]);
}

$stmt1->close();
$stmt2->close();
$stmt3->close();
$conn->close();
?>
