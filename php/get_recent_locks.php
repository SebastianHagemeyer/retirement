<?php

// Allow frontend requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-API-KEY");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include secure database configuration
require_once("/home/retimtrc/config.php");

// API Key Validation
$headers = array_change_key_case(getallheaders(), CASE_LOWER); // Normalize headers to lowercase
if (!isset($headers['x-api-key']) || $headers['x-api-key'] !== API_KEY) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized - Invalid API Key. Received: " . ($headers['x-api-key'] ?? 'None')
    ]);
    exit();
}

// Get database connection
$conn = getDBConnection();
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// Query to fetch the 10 most recent locked entries
$query = "SELECT public_key, timelock, amount, txid, unlocked FROM locks ORDER BY timelock DESC LIMIT 10";
$result = $conn->query($query);

if ($result) {
    $locks = [];

    while ($row = $result->fetch_assoc()) {
        $locks[] = [
            "public_key" => $row["public_key"],
            "timelock" => (int) $row["timelock"],  // Ensure it's an integer
            "amount" => number_format((float) $row["amount"], 8, '.', ''), // Format to 8 decimals
            "txid" => $row["txid"],
            "unlocked" => (bool) $row["unlocked"] // Convert to boolean
        ];
    }

    echo json_encode([
        "status" => "success",
        "message" => "Retrieved last 10 locks successfully",
        "locks" => $locks
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Database query failed"]);
}

// Close connection
$conn->close();

?>