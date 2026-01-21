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

// Get the JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['id']) || !isset($input['context'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$id = $conn->real_escape_string($input['id']);
$context = $conn->real_escape_string($input['context']);

// Prepare queries based on the context and status
if ($context === "gramm_overview") {
    $sql = "SELECT 
                thesis.id, 
                thesis.subject, 
                thesis.description, 
                thesis.supervisor, 
                thesis.student, 
                thesis.start_date, 
                thesis_examination.member2, 
                thesis_examination.member3
            FROM thesis
            LEFT JOIN thesis_examination ON thesis.id = thesis_examination.thesis
            WHERE thesis.id = '$id'";
} elseif ($context === "kedriki") {
    $sql = "SELECT 
		        exam_date, 
		        way_of_exam, 
		        room_or_zoomlink, 
		        announcement_text 
	        FROM thesis_announcement 
   	        INNER JOIN thesis_examination ON thesis_announcement.thesis = thesis_examination.thesis 
	        WHERE thesis_announcement.thesis = '$id'";
} elseif ($context === "settings") {
    // Retrieve the status of the thesis
    $statusQuery = "SELECT status FROM thesis WHERE id = '$id'";
    $statusResult = $conn->query($statusQuery);

    if ($statusResult && $statusRow = $statusResult->fetch_assoc()) {
        $status = $statusRow['status'];

        if ($status === "ACTIVE") {
            // Query for ACTIVE theses
            $sql = "SELECT 
                        thesis.id, 
                        thesis.subject, 
                        thesis.description, 
                        thesis.supervisor, 
                        thesis.student, 
                        thesis.start_date, 
                        thesis.confirmation_gen_assembly, 
                        thesis_examination.manuscript_name 
                    FROM thesis
                    LEFT JOIN thesis_examination ON thesis.id = thesis_examination.thesis
                    WHERE thesis.id = '$id'";
        } elseif ($status === "TO BE EXAMINED") {
            // Query for TO BE EXAMINED theses
            $sql = "SELECT 
                        thesis.id, 
                        thesis.subject, 
                        thesis.description, 
                        thesis.library_link, 
                        thesis_grade.supervisor_quality_grade, 
                        thesis_grade.supervisor_time_grade, 
                        thesis_grade.supervisor_text_grade, 
                        thesis_grade.supervisor_presentation_grade, 
                        thesis_grade.member_2_quality_grade, 
                        thesis_grade.member_2_time_grade, 
                        thesis_grade.member_2_text_grade, 
                        thesis_grade.member_2_presentation_grade, 
                        thesis_grade.member_3_quality_grade, 
                        thesis_grade.member_3_time_grade, 
                        thesis_grade.member_3_text_grade, 
                        thesis_grade.member_3_presentation_grade 
                    FROM thesis
                    LEFT JOIN thesis_grade ON thesis.id = thesis_grade.thesis
                    WHERE thesis.id = '$id'";
        } elseif ($status === "COMPLETED") {
            // Query for COMPLETED theses
            $sql = "SELECT 
                        thesis.id, 
                        thesis.subject, 
                        thesis.description, 
                        thesis.library_link, 
                        thesis.end_date, 
                        thesis_examination.manuscript_name 
                    FROM thesis
                    LEFT JOIN thesis_examination ON thesis.id = thesis_examination.thesis
                    WHERE thesis.id = '$id'";
        } elseif ($status === "CANCELLED") {
            // Query for CANCELLED theses
            $sql = "SELECT 
                        thesis.id, 
                        thesis.subject, 
                        thesis.description, 
                        thesis_cancelation.cancelation_date, 
                        thesis_cancelation.reason_for_cancelation, 
                        thesis_cancelation.general_assembly_number, 
                        thesis_cancelation.general_assembly_year 
                    FROM thesis
                    LEFT JOIN thesis_cancelation ON thesis.id = thesis_cancelation.thesis
                    WHERE thesis.id = '$id'";
        } else {
            echo json_encode(["error" => "Invalid status"]);
            exit;
        }
    } else {
        echo json_encode(["error" => "Failed to retrieve thesis status"]);
        exit;
    }
} else {
    echo json_encode(["error" => "Invalid context"]);
    exit;
}

// Execute the query
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => "Error executing query"]);
    exit;
}

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["error" => "No details found for the provided ID"]);
}

$conn->close();
?>

