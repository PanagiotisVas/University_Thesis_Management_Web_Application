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

$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$sql = "
    SELECT t.*, 
           CASE 
             WHEN t.status = 'TO BE EXAMINED' 
                  AND t.library_link IS NOT NULL 
                  AND tg.supervisor_quality_grade IS NOT NULL
                  AND tg.supervisor_time_grade IS NOT NULL
                  AND tg.supervisor_text_grade IS NOT NULL
                  AND tg.supervisor_presentation_grade IS NOT NULL
                  AND tg.member_2_quality_grade IS NOT NULL
                  AND tg.member_2_time_grade IS NOT NULL
                  AND tg.member_2_text_grade IS NOT NULL
                  AND tg.member_2_presentation_grade IS NOT NULL
                  AND tg.member_3_quality_grade IS NOT NULL
                  AND tg.member_3_time_grade IS NOT NULL
                  AND tg.member_3_text_grade IS NOT NULL
                  AND tg.member_3_presentation_grade IS NOT NULL
             THEN 1 ELSE 0
           END AS ready_for_completion
    FROM thesis t
    LEFT JOIN thesis_grade tg ON t.id = tg.thesis
    WHERE t.status IN ('ACTIVE', 'TO BE EXAMINED', 'COMPLETED', 'CANCELLED')
";

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
