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
    $link=$_POST["link"];
    $username=$_POST["username"];
    $location=$_POST["location"];

    if($location == 1)
    {
        $stmt = $conn->prepare(" UPDATE`thesis` SET thesis_link = ? WHERE student=?");
        $stmt->bind_param("ss", $link,$username);

        if($stmt->execute())
        {
            $flag=true;
            echo json_encode($flag);
        }
    }
    
    elseif($location == 2)
    {
        $stmt = $conn->prepare(" UPDATE `thesis` SET library_link = ? WHERE student=?");
        $stmt->bind_param("ss", $link,$username);

        if($stmt->execute())
        {
            $flag=true;
            echo json_encode($flag);
        }
    }
            
    $stmt->close();
    $conn->close();