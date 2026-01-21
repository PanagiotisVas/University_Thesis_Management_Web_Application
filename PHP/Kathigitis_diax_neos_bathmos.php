<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$thesis = $_POST['thesis'];
$role = $_POST['role'];
$quality = $_POST["quality-grade"];
$time  = $_POST["time-grade"];
$text = $_POST["text-grade"];
$presentation = $_POST["presentation-grade"];

$servername = "localhost:3306";
$dbusername = "root";
$dbpassword = "root";
$database = "thesis";

// Create connection
$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

if ($role === "supervisor") {
    $sql = "UPDATE thesis_grade SET supervisor_quality_grade = ?, supervisor_time_grade = ?, supervisor_text_grade = ?, supervisor_presentation_grade = ? WHERE thesis = ?";
} elseif ($role === "member2") {
    $sql = "UPDATE thesis_grade SET member_2_quality_grade = ?, member_2_time_grade = ?, member_2_text_grade = ?, member_2_presentation_grade = ? WHERE thesis = ?";
} elseif ($role === "member3") {
    $sql = "UPDATE thesis_grade SET member_3_quality_grade = ?, member_3_time_grade = ?, member_3_text_grade = ?, member_3_presentation_grade = ? WHERE thesis = ?";
}


$stmt = $conn->prepare($sql);

if (!$stmt) {
    die(json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]));
}

// Bind parameters
$stmt->bind_param("iiiii", $quality, $time, $text, $presentation, $thesis);

// Execute the query
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Grade assigned successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to grade: " . $stmt->error]);
}
// Close the statements and connection
$stmt->close();
$conn->close();
?>