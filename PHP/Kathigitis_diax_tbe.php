<?php

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");



    $thesis = $_POST['thesis'];

    $servername = "localhost:3306";
    $dbusername = "root";
    $dbpassword = "root";
    $database = "thesis";

    // Create connection
    $conn = new mysqli($servername, $dbusername, $dbpassword, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    $sql = "SELECT thesis_grade.thesis, manuscript_name, member2, member3, exam_date, exam_time, way_of_exam, room_or_zoomlink, announcement_text, announcement_date, announcement_status,
        supervisor_quality_grade, supervisor_time_grade, supervisor_text_grade, supervisor_presentation_grade, member_2_quality_grade, member_2_time_grade, member_2_text_grade, member_2_presentation_grade, 
        member_3_quality_grade, member_3_time_grade, member_3_text_grade, member_3_presentation_grade, grading_status
        FROM  thesis_grade INNER JOIN thesis_announcement ON thesis_grade.thesis = thesis_announcement.thesis
        INNER JOIN thesis_examination ON thesis_grade.thesis = thesis_examination.thesis 
        WHERE thesis_grade.thesis = ?
    ";

    // Prepare the statement
    $stmt = $conn->prepare($sql);

    $stmt->bind_param("i", $thesis);

    $stmt->execute();

    $result = $stmt->get_result();

    $data = [];

    if ($result->num_rows > 0) {
    // Fetch all rows and add them to the data array
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Return the entire array as JSON
        echo json_encode($data);
    } 
    else {
    // If no rows are returned, return an empty array
    echo json_encode([]);
    }
?>