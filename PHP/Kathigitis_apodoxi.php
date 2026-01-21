<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$professor = $_POST['username'];
$thesis = $_POST['thesis'];

$servername = "localhost:3306/MySQL/Thesis_Application_Project";
$dbusername = "root";
$dbpassword = "root";
$database = "thesis";

// Create connection
$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]));
}

// Prepare the SQL statement
$sql1 = "UPDATE supervising_member_request SET status = 'ACCEPTED', answer_date = CURRENT_DATE() WHERE professor = ? AND thesis = ?";
$stmt1 = $conn->prepare($sql1);

if (!$stmt1) {
    die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
}

// Bind parameters
$stmt1->bind_param("si", $professor, $thesis);

// Prepare the SQL statement to update the thesis_examination table
$sql2 = "UPDATE thesis_examination SET 
            member2 = CASE 
                WHEN member2 IS NULL THEN ? 
                ELSE member2
                END
            WHERE thesis = ?"; 

$stmt2 = $conn->prepare($sql2);

if (!$stmt2) {
    die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
}

// Bind parameters
$stmt2->bind_param("si", $professor, $thesis);

$sql21 = "UPDATE thesis_examination SET            
            member3 = CASE 
                WHEN member2 IS NOT NULL AND member3 IS NULL THEN ?
                ELSE NULL
                END
            WHERE thesis = ?"; 

$stmt21 = $conn->prepare($sql21);

if (!$stmt21) {
    die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
}

// Bind parameters
$stmt21->bind_param("si", $professor,  $thesis);


// Execute the first two queries
if ($stmt1->execute() && $stmt2->execute()) {
    
    // Check if both member2 and member3 are not null
    $sql3 = "SELECT member2, member3 FROM thesis_examination WHERE thesis = ?";
    $stmt3 = $conn->prepare($sql3);
    
    if (!$stmt3) {
        die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
    }
    
    $stmt3->bind_param("i", $thesis);
    $stmt3->execute();
    $stmt3->store_result();
    $stmt3->bind_result($member2, $member3);
    $stmt3->fetch();
    
    if ($member2 !== null && $member3 !== null) {
        // If both members are not null, update the thesis status to 'ACTIVE'
        $sql4 = "UPDATE thesis SET status = 'ACTIVE', start_date = CURRENT_DATE() WHERE id = ?";
        $stmt4 = $conn->prepare($sql4);
        
        if (!$stmt4) {
            die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
        }
        
        $stmt4->bind_param("i", $thesis);
        $stmt4->execute();

        $sql5 = "DELETE FROM supervising_member_request  WHERE thesis = ? AND status IN ('DECLINED', 'PENDING')";
        $stmt5 = $conn->prepare($sql5);
        
        if (!$stmt5) {
            die(json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]));
        }
        
        $stmt5->bind_param("i", $thesis);
        $stmt5->execute();

        $stmt4->close();
        $stmt5->close();
    }
    
    $stmt3->close();
    
    echo json_encode(["success" => true, "message" => "Entry successfully inserted and status updated."]);
} else {
    echo json_encode(["success" => false, "error" => "Error executing query: " . $stmt1->error]);
}

// Close the statements and connection
$stmt1->close();
$stmt2->close();
$stmt21->close();
$conn->close();
?>