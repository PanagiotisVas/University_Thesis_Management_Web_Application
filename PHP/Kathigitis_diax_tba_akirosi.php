<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Get POST data
$thesis = $_POST['thesis'];

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

// 1. First SQL query: Set `student` to NULL for the specified thesis
$sql1 = "UPDATE thesis SET student = NULL WHERE id = ?";
$stmt1 = $conn->prepare($sql1);
if (!$stmt1) {
    die(json_encode(["success" => false, "error" => "Failed to prepare statement 1: " . $conn->error]));
}
$stmt1->bind_param("i", $thesis);

// 2. Second SQL query: Update `status` in the thesis table
$sql2 = "UPDATE thesis_examination SET member2 = NULL, member3 = NULL WHERE thesis = ?";
$stmt2 = $conn->prepare($sql2);
if (!$stmt2) {
    die(json_encode(["success" => false, "error" => "Failed to prepare statement 2: " . $conn->error]));
}
$stmt2->bind_param("i", $thesis);

// 3. Third SQL query: Update `professor` in the thesis table
$sql3 = "DELETE FROM supervising_member_request WHERE thesis = ?";
$stmt3 = $conn->prepare($sql3);
if (!$stmt3) {
    die(json_encode(["success" => false, "error" => "Failed to prepare statement 3: " . $conn->error]));
}
$stmt3->bind_param("i", $thesis);

// Execute all queries
if ($stmt1->execute() && $stmt2->execute() && $stmt3->execute()) {
    echo json_encode(["success" => true, "message" => "All queries executed successfully."]);
} else {
    echo json_encode(["success" => false, "error" => "Error executing queries."]);
}

// Close statements and connection
$stmt1->close();
$stmt2->close();
$stmt3->close();
$conn->close();
?>
