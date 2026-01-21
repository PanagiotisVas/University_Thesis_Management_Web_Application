
<?php

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");



    $thesis = $_POST['thesis'];

    $servername = "localhost:3306";
    $dbusername = "root";
    $dbpassword = "root";
    $database = "thesis";
    // Create connection
    $conn = new mysqli($servername, $dbusername, $dbpassword, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    

    $sql = "SELECT * FROM supervising_member_request WHERE thesis = ?";

    // Prepare the statement
    $stmt = $conn->prepare($sql);

    $stmt->bind_param("i", $thesis);

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
    else {
    // If no rows are returned, return an empty array
    echo json_encode([]);
    }
?>
