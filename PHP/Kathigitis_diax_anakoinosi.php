
<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$thesis = $_POST['thesis'];
$announcement = $_POST['announcement'];

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
$sql = "UPDATE thesis_announcement SET announcement_text = ?, announcement_date = CURRENT_DATE(), announcement_status = 'ANNOUNCED'  WHERE thesis = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
}

// Bind parameters
$stmt->bind_param("si", $announcement, $thesis);

// Execute the query
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Entry successfully inserted."]);
} else {
    echo json_encode(["success" => false, "error" => "Error executing query: " . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
