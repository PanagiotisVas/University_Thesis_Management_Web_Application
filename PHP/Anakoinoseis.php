
<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost:3306";
$dbusername = "root";
$dbpassword = "root";
$database = "thesis";

// Create connection
$conn = new mysqli($servername, $dbusername, $dbpassword, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Get JSON input from frontend
$data = json_decode(file_get_contents("php://input"), true);

$start_date = isset($data['start_date']) ? $data['start_date'] : null;
$end_date = isset($data['end_date']) ? $data['end_date'] : null;
$format = isset($data['format']) ? $data['format'] : 'json'; // Default format is JSON

$sql = "SELECT t.id, t.subject, te.exam_date 
        FROM thesis t 
        INNER JOIN thesis_announcement ta ON t.id = ta.thesis 
        INNER JOIN thesis_examination te ON t.id = te.thesis 
        WHERE ta.announcement_status = 'ANNOUNCED'";

if ($start_date && $end_date) {
    $sql .= " AND te.exam_date BETWEEN ? AND ?";
} elseif ($start_date) {
    $sql .= " AND te.exam_date >= ?";
} elseif ($end_date) {
    $sql .= " AND te.exam_date <= ?";
}

$stmt = $conn->prepare($sql);

if ($start_date && $end_date) {
    $stmt->bind_param("ss", $start_date, $end_date);
} elseif ($start_date) {
    $stmt->bind_param("s", $start_date);
} elseif ($end_date) {
    $stmt->bind_param("s", $end_date);
}

$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
    echo json_encode(["error" => "Error executing query"]);
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$stmt->close();
$conn->close();

// Check requested format (JSON or XML)
if ($format === "xml") {
    header("Content-Type: application/xml");
    echo arrayToXml($data);
} else {
    header("Content-Type: application/json");
    echo json_encode($data);
}

/**
 * Function to convert an array to XML format
 */
function arrayToXml($data) {
    $xml = new SimpleXMLElement('<theses/>');
    foreach ($data as $row) {
        $thesis = $xml->addChild('thesis');
        foreach ($row as $key => $value) {
            $thesis->addChild($key, htmlspecialchars($value));
        }
    }
    return $xml->asXML();
}
?>
