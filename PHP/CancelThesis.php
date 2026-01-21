<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost:3306";
$dbusername = "root";
$dbpassword = "root";
$database = "thesis";

$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['id']) || !isset($input['assemblyNum']) || !isset($input['assemblyYear'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$id = $conn->real_escape_string($input['id']);
$assemblyNum = $conn->real_escape_string($input['assemblyNum']);
$assemblyYear = $conn->real_escape_string($input['assemblyYear']);
$cancelationDate = date("Y-m-d"); // Automatically save current date
$reason = "AFTER STUDENT REQUEST";

// Insert into thesis_cancelation table
$sqlCancelation = "INSERT INTO thesis_cancelation (thesis, cancelation_date, reason_for_cancelation, general_assembly_number, general_assembly_year) 
                   VALUES ('$id', '$cancelationDate', '$reason', '$assemblyNum', '$assemblyYear')";

if ($conn->query($sqlCancelation) === TRUE) {
    // Update thesis status to CANCELLED
    $sqlUpdateThesis = "UPDATE thesis SET status = 'CANCELLED' WHERE id = '$id'";
    if ($conn->query($sqlUpdateThesis) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Failed to update thesis status"]);
    }
} else {
    echo json_encode(["error" => "Failed to insert cancellation details"]);
}

$conn->close();
?>
