<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$subject = $_POST['subject'];
$description = $_POST['description'];
$supervisor = $_POST['supervisor'];
$file = isset($_FILES["file"]) ? $_FILES["file"] : null;
$fileName = isset($_FILES["file"]) ? $file["name"] : null;

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

// Check if file is uploaded
$fileData = null;
if ($file && $file["error"] === UPLOAD_ERR_OK) {
    $fileTmpPath = $file["tmp_name"];
    $fileData = file_get_contents($fileTmpPath);
}

// Prepare the SQL statement
if ($fileData) {
    $sql = "INSERT INTO thesis(subject, description, thesis_file, thesis_file_name, supervisor, status) VALUES (?, ?, ?, ?, ?, 'TO BE ASSIGNED')";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
    }
    $stmt->bind_param("ssbss", $subject, $description, $null, $fileName, $supervisor);
    $stmt->send_long_data(2,$fileData);
} else {
    $sql = "INSERT INTO thesis(subject, description, supervisor, status) VALUES (?, ?, ?, 'TO BE ASSIGNED')";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
    }
    $stmt->bind_param("sss", $subject, $description, $supervisor);
}



// Execute the first query
if ($stmt->execute()) {
    // Get the last inserted ID
    $thesis_id = $conn->insert_id;

    // Insert into the second table (e.g., `thesis_metadata`)
    $sql2 = "INSERT INTO thesis_examination(thesis) VALUES (?)";
    $stmt2 = $conn->prepare($sql2);
    if (!$stmt2) {
        die(json_encode(["success" => false, "error" => "Failed to prepare second statement: " . $conn->error]));
    }
    $stmt2->bind_param("i", $thesis_id);

    // Execute the second query
    if ($stmt2->execute()) {
        echo json_encode(["success" => true, "message" => "Entry successfully inserted into both tables."]);
    } else {
        echo json_encode(["success" => false, "error" => "Error executing second query: " . $stmt2->error]);
    }

    // Close second statement
    $stmt2->close();
} else {
    echo json_encode(["success" => false, "error" => "Error executing query: " . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>