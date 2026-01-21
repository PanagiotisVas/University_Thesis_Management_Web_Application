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
$sql1 = "SELECT id, `subject`, `description`, supervisor, student, `start_date`, end_date, member2, member3, exam_date, 
    supervisor_quality_grade, supervisor_time_grade, supervisor_text_grade, supervisor_presentation_grade, member_2_quality_grade, member_2_time_grade, member_2_text_grade, member_2_presentation_grade, 
    member_3_quality_grade, member_3_time_grade, member_3_text_grade, member_3_presentation_grade
    FROM thesis INNER JOIN thesis_examination ON thesis.id = thesis_examination.thesis INNER JOIN thesis_grade ON thesis.id = thesis_grade.thesis 
    WHERE supervisor = ? AND thesis.status = 'COMPLETED'
";

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
$sql2 = "SELECT id, `subject`, `description`, supervisor, student, `start_date`, end_date, member2, member3, exam_date, 
    supervisor_quality_grade, supervisor_time_grade, supervisor_text_grade, supervisor_presentation_grade, member_2_quality_grade, member_2_time_grade, member_2_text_grade, member_2_presentation_grade, 
    member_3_quality_grade, member_3_time_grade, member_3_text_grade, member_3_presentation_grade
    FROM thesis INNER JOIN thesis_examination ON thesis.id = thesis_examination.thesis INNER JOIN thesis_grade ON thesis.id = thesis_grade.thesis
    WHERE id IN ( SELECT thesis FROM thesis_examination WHERE member2 = ? OR member3 = ?) AND thesis.status = 'COMPLETED'
";
$stmt2 = $conn->prepare($sql2);
if ($stmt2) {
    $stmt2->bind_param("ss", $username, $username);
    $stmt2->execute();
    $result2 = $stmt2->get_result();

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
