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
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT professor, thesis, supervising_member_request.status, answer_date, 
        `subject`, `description`, desc_file_name, supervisor, thesis.student, `start_date`, end_date, confirmation_gen_assembly, thesis_file_name, thesis_link, library_link, thesis.status
        FROM supervising_member_request INNER JOIN thesis ON supervising_member_request.thesis = thesis.id WHERE professor = ? AND supervising_member_request.status = 'PENDING'
     ";

    // Prepare the statement
    $stmt = $conn->prepare($sql);

    $stmt->bind_param("s", $username);

    $stmt->execute();

    // Fetch results
    $result = $stmt->get_result();
    $data = [];

    if ($result->num_rows > 0) {
        // Fetch all rows and add them to the data array
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    // Return the data as JSON
    echo json_encode($data);

    // Close the statement and connection
    $stmt->close();
    $conn->close();
?>
