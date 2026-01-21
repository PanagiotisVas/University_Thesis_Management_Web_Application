
<?php

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");

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

    $username = $_POST['username'];

    $sql = "SELECT u.email, u.name, u.surname FROM user u INNER JOIN professor p ON u.email = p.email WHERE NOT EXISTS (SELECT 1 FROM thesis WHERE supervisor = u.email AND student = ?);";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("s", $username);

    $stmt->execute();

    $result = $stmt->get_result();

    $data=[];

    if ($result->num_rows > 0) {
        // Fetch all rows and add them to the data array
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
    
            echo json_encode($data);
        } 
        else {
        // If no rows are returned, return an empty array
        echo json_encode([]);
        }






?>
