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

if (!isset($input['id']) || !isset($input['assemblyNumber'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$id = $conn->real_escape_string($input['id']);
$assemblyNumber = $conn->real_escape_string($input['assemblyNumber']);

$sql = "UPDATE thesis SET confirmation_gen_assembly = '$assemblyNumber' WHERE id = '$id'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Failed to update assembly number"]);
}

$conn->close();
?>
