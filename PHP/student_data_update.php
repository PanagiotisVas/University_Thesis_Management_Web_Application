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
    $column = $_POST['column'];
    $value = $_POST['value'];

    if ($column === "street") {
        
        list($street_name, $street_number) = explode(" ", $value, 2);   
        
        $sql = "UPDATE student SET street = ?, street_number = ? WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $street_name, $street_number, $username);

    }
    
    else
    {
        $sql = "UPDATE student SET $column = ? WHERE email = ?";

        $stmt = $conn->prepare($sql);

        $stmt->bind_param("ss",$value,$username);
    }
    

    if($stmt->execute())
    {
        $flag=true;
        echo json_encode($flag);
    }
            
    $stmt->close();

?>