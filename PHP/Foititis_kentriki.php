<?php

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");

    $username = $_SESSION['username'];


    // Database connection details
    $servername = "localhost:3306/MySQL/Thesis_Application_Project";
    $dbusername = "root";
    $dbpassword = "root";
    $database = "thesis";

    // Create connection
    $conn = new mysqli($servername, $dbusername, $dbpassword, $database);

    // Check connection
    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }

    // First SQL query: Fetch thesis details
    $sql1 = "SELECT t.subject, t.description, t.desc_file_name, t.status FROM thesis t WHERE t.student = ? GROUP BY t.subject, t.description, t.desc_file_name, t.status";

    $stmt1 = $conn->prepare($sql1);
    $stmt1->bind_param("s", $username);
    $stmt1->execute();
    $result1 = $stmt1->get_result();

    $thesisData = [];

    // Store results for first query
    while ($row1 = $result1->fetch_assoc()) {
        $thesisData[] = $row1;  // Use array_push or [] to add each row
    }

    // Second SQL query: Fetch professors for member2
    $sql2 = "SELECT u.email, u.name, u.surname FROM thesis_examination t LEFT JOIN user u ON t.member2 = u.email WHERE t.thesis IN (SELECT id FROM thesis WHERE student = ?)";

    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("s", $username);
    $stmt2->execute();
    $result2 = $stmt2->get_result();

    $professorsMember2 = [];

    // Store results for member2 professors
    while ($row2 = $result2->fetch_assoc()) {
        $professorsMember2[] = $row2;
    }

    // Third SQL query: Fetch professors for member3
    $sql3 = "SELECT u.email, u.name, u.surname FROM thesis_examination t LEFT JOIN user u ON t.member3 = u.email WHERE t.thesis IN (SELECT id FROM thesis WHERE student = ?)";

    $stmt3 = $conn->prepare($sql3);
    $stmt3->bind_param("s", $username);
    $stmt3->execute();
    $result3 = $stmt3->get_result();

    $professorsMember3 = [];

    // Store results for member3 professors
    while ($row3 = $result3->fetch_assoc()) {
        $professorsMember3[] = $row3;
    }


    // Return JSON response
    echo json_encode([
        "thesis" => $thesisData,
        "professors_member2" => $professorsMember2,
        "professors_member3" => $professorsMember3
    ]);

    // Close resources
    $stmt1->close();
    $stmt2->close();
    $stmt3->close();
    $conn->close();

?>
