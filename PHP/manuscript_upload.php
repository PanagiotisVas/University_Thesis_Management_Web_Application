<?php
    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");


    $username = $_POST['username'];
    $file = $_FILES['pdfFile'];

    $servername = "localhost:3306/MySQL/Thesis_Application_Project";
    $dbusername = "root";
    $dbpassword = "root";
    $database = "thesis";

    // Connect to the database
    $conn = new mysqli($servername, $dbusername, $dbpassword, $database);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Validate file type and size
    if ($file['type'] !== 'application/pdf') {
        die(json_encode(["error" => "Invalid file type. Only PDFs are allowed."]));
    }

    // Read file content
    $fileName = $file['name'];
    $fileData = file_get_contents($file['tmp_name']);

    // Get the thesis ID based on the student username
    $sql = "SELECT id FROM thesis WHERE student = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $id = $row['id'];

    if (!$id) {
        die(json_encode(["error" => "Thesis ID not found for the student."]));
    }

   
    $sql2 = "UPDATE thesis_examination SET manuscript = ?, manuscript_name = ? WHERE thesis = ?";    
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("bsi", $null, $fileName, $id);
    $stmt2->send_long_data(0, $fileData);

    if ($stmt2->execute()) {
        
        $flag=true;
        echo json_encode($flag);
    } else {
        $flag=false;
        echo json_encode($flag);
    }

    $stmt->close();
    $stmt2->close();
    $conn->close();
?>
