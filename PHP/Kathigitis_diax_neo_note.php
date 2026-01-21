
<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$thesis = $_POST['thesis'];
$professor = $_POST['username'];
$text = $_POST['note'];

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
$sql = "INSERT INTO professor_note(thesis, professor, note_text) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
}

// Bind parameters
$stmt->bind_param("iss", $thesis, $professor, $text);

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
