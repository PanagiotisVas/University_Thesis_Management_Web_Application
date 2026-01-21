
<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$username = $_POST['username'];

$servername = "localhost:3306";
$dbusername = "root";
$dbpassword = "root";
$database = "thesis";

// Create connection
$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

$data = [];

// First query: Fetch theses supervised by the user
$sql1 = "SELECT id, `subject` FROM thesis WHERE supervisor = ?";
$stmt1 = $conn->prepare($sql1);
if ($stmt1) {
    $stmt1->bind_param("s", $username);
    $stmt1->execute();
    $result1 = $stmt1->get_result();

    // Fetch results from the first query
    if ($result1->num_rows > 0) {
        while ($row = $result1->fetch_assoc()) {
            $data[] = $row;
        }
    }
    $stmt1->close();
} else {
    die(json_encode(["error" => "Failed to prepare the first query: " . $conn->error]));
}

// Second query: Fetch theses where the user is a member2 or member3 in the thesis_examination
$sql2 = "SELECT id, `subject` FROM thesis WHERE id IN (
    SELECT thesis FROM thesis_examination WHERE member2 = ? OR member3 = ?
)";
$stmt2 = $conn->prepare($sql2);
if ($stmt2) {
    $stmt2->bind_param("ss", $username, $username);
    $stmt2->execute();
    $result2 = $stmt2->get_result();

    // Fetch results from the second query
    if ($result2->num_rows > 0) {
        while ($row = $result2->fetch_assoc()) {
            $data[] = $row;
        }
    }
    $stmt2->close();
} else {
    die(json_encode(["error" => "Failed to prepare the second query: " . $conn->error]));
}

// Return the combined data as JSON
echo json_encode($data);

// Close the database connection
$conn->close();
?>
