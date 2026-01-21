<?php
    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");

    $prof_username = $_POST['prof_username'];
    $st_username =$_POST['st_username'];
   
    $servername = "localhost:3306/MySQL/Thesis_Application_Project";
    $dbusername = "root";
    $dbpassword = "root";
    $database = "thesis";

    $conn = new mysqli($servername, $dbusername, $dbpassword, $database);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT id FROM thesis WHERE student = ?";

    // Prepare the statement
    $stmt = $conn->prepare($sql);

    // Bind the PHP variables to the prepared statement
    $stmt->bind_param("s", $st_username); 

    // Execute the query
    $stmt->execute();

    // Get the result
    $result = $stmt->get_result();

    $row = $result-> fetch_assoc();

    $id = $row['id'];

    $sql2 = "INSERT into supervising_member_request (`student`,`professor`,`thesis`,`status`) VALUES (?,?,?,'PENDING')";

    $stmt2 = $conn->prepare($sql2);

    $stmt2->bind_param("ssi", $st_username, $prof_username,$id); 

    if($stmt2->execute())
    {
        $flag =true;
        echo json_encode($flag);
    }

    $stmt->close();
    $stmt2->close();
    $conn->close();

?>