<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$thesis = $_POST['thesis'];

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

// Prepare the SQL statement
$sql1 = "UPDATE thesis SET status = 'TO BE EXAMINED' WHERE  id = ?";
$stmt1 = $conn->prepare($sql1);

if (!$stmt1) {
    die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
}

// Bind parameters
$stmt1->bind_param("i", $thesis);

$sql2 = "INSERT INTO thesis_grade(thesis, grading_status) VALUES (?, 'CLOSED')";
$stmt2 = $conn->prepare($sql2);

if (!$stmt2) {
    die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
}

// Bind parameters
$stmt2->bind_param("i", $thesis);

$sql3 = "INSERT INTO thesis_announcement(thesis, announcement_status) VALUES (?, 'NOT ANNOUNCED')";
$stmt3 = $conn->prepare($sql3);

if (!$stmt3) {
    die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
}

// Bind parameters
$stmt3->bind_param("i", $thesis);

// Execute the query
if ($stmt1->execute() && $stmt2->execute() && $stmt3->execute()) {
    echo json_encode(["success" => true, "message" => "Entry successfully updated."]);
} else {
    echo json_encode(["success" => false, "error" => "Error executing query: " . $stmt->error]);
}

// Close the statement and connection
$stmt1->close();
$stmt2->close();
$stmt3->close();
$conn->close();
?>
