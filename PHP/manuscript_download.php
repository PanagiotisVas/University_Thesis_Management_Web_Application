<?php
    session_start();

    // Database connection details
    $servername = "localhost:3306/MySQL/Thesis_Application_Project";
    $dbusername = "root";
    $dbpassword = "root";
    $database = "thesis";

    // Connect to the database
    $conn = new mysqli($servername, $dbusername, $dbpassword, $database);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $thesis_id=1;

    // Query to retrieve the file data
    $sql = "SELECT manuscript, manuscript_name FROM thesis_examination WHERE thesis = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $thesis_id);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($fileData, $fileName);

    if ($stmt->fetch()) {
        // Send the file to the browser
        header("Content-Type: application/pdf");
        header("Content-Disposition: attachment; filename=" . $fileName);
        header("Content-Length: " . strlen($fileData));
        echo $fileData;
    } else {
        echo "No file found for the provided thesis ID.";
    }

    // Close the database connection
    $stmt->close();
    $conn->close();
?>
