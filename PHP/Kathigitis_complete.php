<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$username = $_POST['username'];

$servername = "localhost:3306";
$dbusername = "root";
$dbpassword = "root";
$database = "thesis";

// Create connection
$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

$data = [];

// First query: Find All Thesis Where The User Is The Supervisor
$sql1 = "SELECT id, `subject`, `description`, desc_file_name, supervisor, student, `start_date`, end_date, confirmation_gen_assembly, thesis_file_name, thesis_link, library_link, `status`, 'supervisor' AS role 
FROM thesis WHERE supervisor = ? AND status = 'COMPLETED'";
$stmt1 = $conn->prepare($sql1);
if ($stmt1) {
    $stmt1->bind_param("s", $username);
    $stmt1->execute();
    $result1 = $stmt1->get_result();

    while ($row = $result1->fetch_assoc()) {
        $data[] = $row;
    }
    
} else {
    die(json_encode(["error" => "Failed to prepare the first query: " . $conn->error]));
}

// Next two queries: Find All Thesis Where The User Is A Member
$sql2 = "SELECT id, `subject`, `description`, desc_file_name, supervisor, student, `start_date`, end_date, confirmation_gen_assembly, thesis_file_name, thesis_link, library_link, `status`, 'member2' AS role 
    FROM thesis WHERE id IN ( SELECT thesis FROM thesis_examination WHERE member2 = ?
) AND status = 'COMPLETED'";
$stmt2 = $conn->prepare($sql2);
if ($stmt2) {
    $stmt2->bind_param("s", $username);
    $stmt2->execute();
    $result2 = $stmt2->get_result();

    while ($row = $result2->fetch_assoc()) {
        $data[] = $row;
    }
    
} else {
    die(json_encode(["error" => "Failed to prepare the second query: " . $conn->error]));
}

$sql3 = "SELECT id, `subject`, `description`, desc_file_name, supervisor, student, `start_date`, end_date, confirmation_gen_assembly, thesis_file_name, thesis_link, library_link, `status`, 'member3' AS role FROM thesis 
    WHERE id IN ( SELECT thesis FROM thesis_examination WHERE  member3 = ?
) AND status = 'COMPLETED'";

$stmt3 = $conn->prepare($sql3);

if ($stmt3) {
    $stmt3->bind_param("s", $username);
    $stmt3->execute();
    $result2 = $stmt3->get_result();

    while ($row = $result2->fetch_assoc()) {
        $data[] = $row;
    }
    
} else {
    die(json_encode(["error" => "Failed to prepare the second query: " . $conn->error]));
}

// Return Data As JSON
echo json_encode($data);

$conn->close();
?>
