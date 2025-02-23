
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY");
    header("Access-Control-Max-Age: 86400"); // Cache preflight for 24 hours
    http_response_code(200);
    exit();
}


// Include secure configuration
require_once("/home/retimtrc/config.php");

//$headers = getallheaders();
//echo json_encode(["headers_received" => $headers]);
//exit();




// Get database connection
$conn = getDBConnection();
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// Query to sum all locked amounts where unlocked = false
$query = "SELECT SUM(amount) AS total_locked FROM locks WHERE unlocked = FALSE";
$result = $conn->query($query);

if ($result) {
    $row = $result->fetch_assoc();
    $totalLocked = $row['total_locked'] ?? 0.00000000; // Default to zero if no locked funds

    echo json_encode([
        "status" => "success",
        "message" => "Total locked amount retrieved successfully",
        "total_locked" => number_format($totalLocked, 8, '.', '') // Format to 8 decimals
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Database query failed"]);
}

// Close connection
$conn->close();

?>
