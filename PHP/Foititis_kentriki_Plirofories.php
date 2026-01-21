<?php

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");



    $username = $_POST['username'];

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

    $sql="SELECT u.email,u.name,u.surname, s.street,s.street_number,s.city,s.postcode,s.landline_telephone,s.mobile_telephone FROM user u JOIN student s WHERE u.email = s.email AND u.email = ? ";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("s", $username);

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
?>