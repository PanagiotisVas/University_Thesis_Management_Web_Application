
<?php

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");

    $username = $_POST['username'];
    $examDate = $_POST['examDate'];
    $examTime = $_POST['examTime'];
    $examType = $_POST['examType'];
    $roomSelection = $_POST['roomSelection'];

    $servername = "localhost:3306/MySQL/Thesis_Application_Project";
    $dbusername = "root";
    $dbpassword = "root";
    $database = "thesis";

    // Create connection
    $conn = new mysqli($servername, $dbusername, $dbpassword, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "UPDATE thesis_examination SET  exam_date = ?, way_of_exam = ?, room_or_zoomlink = ?, exam_time = ? WHERE thesis = (SELECT id FROM thesis WHERE student = ?)";

    $stmt = $conn-> prepare($sql);

    $stmt -> bind_param("sssss",$examDate,$examType,$roomSelection,$examTime,$username);

    if($stmt -> execute())
    {
        $flag = true;
        echo json_encode($flag);
    }

    else
    {
        echo json_encode([]);
    }




?>
