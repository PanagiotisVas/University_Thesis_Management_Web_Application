<?php

session_start();

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

// Check if a file was uploaded
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["jsonFile"])) {
    $targetFile = "uploaded_data.json";
    move_uploaded_file($_FILES["jsonFile"]["tmp_name"], $targetFile);

    // Read JSON file
    $jsonData = file_get_contents($targetFile);
    $data = json_decode($jsonData, true);

    if ($data) {
        // Insert students
        foreach ($data['students'] as $student) {
            $email = $student['email'];
            $name = $student['name'];
            $surname = $student['surname'];
            $password = password_hash("defaultpassword", PASSWORD_BCRYPT);
            $status = "STUDENT";

            // Insert into users table
            $sqlUser = "INSERT INTO user (email, password, name, surname, status) 
                        VALUES ('$email', '$password', '$name', '$surname', '$status')
                        ON DUPLICATE KEY UPDATE name=VALUES(name), surname=VALUES(surname), status=VALUES(status)";
            $conn->query($sqlUser);

            // Insert into students table
            $sqlStudent = "INSERT INTO student (email, student_number, street, street_number, city, postcode, fathers_name, landline_telephone, mobile_telephone) 
                           VALUES ('$email', '{$student['student_number']}', '{$student['street']}', '{$student['number']}', '{$student['city']}', 
                                   '{$student['postcode']}', '{$student['father_name']}', '{$student['landline_telephone']}', '{$student['mobile_telephone']}')
                           ON DUPLICATE KEY UPDATE student_number=VALUES(student_number), city=VALUES(city)";
            $conn->query($sqlStudent);
        }

        // Insert professors
        foreach ($data['professors'] as $professor) {
            $email = $professor['email'];
            $name = $professor['name'];
            $surname = $professor['surname'];
            $password = password_hash("defaultpassword", PASSWORD_BCRYPT);
            $status = "PROFESSOR";

            // Insert into users table
            $sqlUser = "INSERT INTO user (email, password, name, surname, status) 
                        VALUES ('$email', '$password', '$name', '$surname', '$status')
                        ON DUPLICATE KEY UPDATE name=VALUES(name), surname=VALUES(surname), status=VALUES(status)";
            $conn->query($sqlUser);

            // Insert into professors table
            $sqlProfessor = "INSERT INTO professor (email, topic, landline_telephone, mobile_telephone, department, university) 
                             VALUES ('$email', '{$professor['topic']}', '{$professor['landline']}', '{$professor['mobile']}', 
                                     '{$professor['department']}', '{$professor['university']}')
                             ON DUPLICATE KEY UPDATE topic=VALUES(topic), department=VALUES(department)";
            $conn->query($sqlProfessor);
        }

        echo "Data inserted successfully!";
    } else {
        echo "Error decoding JSON.";
    }
} else {
    echo "No file uploaded.";
}

$conn->close();
?>