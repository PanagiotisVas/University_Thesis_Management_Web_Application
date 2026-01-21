<?php
// Check if a form is submitted
    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");

    
    $error_message = "";
   
    $username = $_POST['username'];
    $password = $_POST['password'];
    

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

      

    $sql = "SELECT `status` FROM user WHERE email = ? AND password = ?";

    // Prepare the statement
    $stmt = $conn->prepare($sql);

    // Bind the PHP variables to the prepared statement
    $stmt->bind_param("ss", $username, $password); 

    // Execute the query
    $stmt->execute();

    // Get the result
    $result = $stmt->get_result();
    
    // Check if results are returned
    if ($result->num_rows > 0) 
    {

        $_SESSION['username'] = $username;


        $user = $result->fetch_assoc();
        if ($user['status'] === "STUDENT") 
        {
            echo json_encode(['type' => "s"]);
        }
        
        elseif ($user['status'] === "PROFESSOR") 
        {
            echo json_encode(['type' => "p"]);
        }
        
        elseif ($user['status'] === "ADMINISTRATION") 
        {
            echo json_encode(['type' => "a"]);    
        }     
    }
    
    else 
    {
        // No user found
        echo json_encode(['type' => "false"]);
    }

   
    
    $stmt->close();
    $conn->close();
?>
