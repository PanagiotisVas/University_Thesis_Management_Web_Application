<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

$servername = "localhost:3306/MySQL/Thesis_Application_Project";
$dbusername = "root";
$dbpassword = "root";
$database = "thesis";

// Create connection
$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$sql = "SELECT * FROM thesis WHERE status IN ('ACTIVE', 'TO BE EXAMINED')";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => "Error executing query"]);
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conn->close();
?>