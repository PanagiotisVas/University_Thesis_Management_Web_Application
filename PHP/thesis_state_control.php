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

    $conn = new mysqli($servername, $dbusername, $dbpassword, $database);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT `status` FROM thesis WHERE student = ?";

    // Prepare the statement
    $stmt = $conn->prepare($sql);

    // Bind the PHP variables to the prepared statement
    $stmt->bind_param("s", $username); 

    // Execute the query
    $stmt->execute();

    // Get the result
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Fetch all rows and add them to the data array
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            
            // Return the entire array as JSON
            echo json_encode($data);
        } 

    $stmt->close();
    $conn->close();
?>
