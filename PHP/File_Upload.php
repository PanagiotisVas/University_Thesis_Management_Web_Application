<?php

    session_start();
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
    
    $servername = "localhost:3306/MySQL/Thesis_Application_Project";
    $dbusername = "root";
    $dbpassword = "root";
    $database = "thesis";

    $conn = new mysqli($servername, $dbusername, $dbpassword, $database);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $username=$_POST["username"];

    
    $file = $_FILES["file"];
    $fileName = $file['name'];
    $fileData = file_get_contents($file['tmp_name']);
     
    
    $stmt2 = $conn->prepare("UPDATE `thesis` SET thesis_file = ? ,thesis_file_name= ? WHERE student=?");
    $stmt2->bind_param("bss", $null, $fileName, $username);
    $stmt2->send_long_data(0, $fileData);

    

    if($stmt2->execute())
    {
        $flag=true;
        echo json_encode($flag);
    }
    
    $stmt2->close();
    $conn->close();
        
    
?>