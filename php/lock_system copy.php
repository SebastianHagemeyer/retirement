<?php

// Allow requests from all origins (Change this for production security)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-API-KEY");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include secure configuration for database connection
require_once("/home/retimtrc/config.php");

// API Key Validation
$headers = array_change_key_case(getallheaders(), CASE_LOWER);
if (!isset($headers['x-api-key']) || $headers['x-api-key'] !== API_KEY) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized - Invalid API Key."
    ]);
    exit();
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
$public_key = $data['public_key'] ?? null;
$amount = $data['amount'] ?? null;
$txid = $data['txid'] ?? null;
$action = $data['action'] ?? null; // "lock" or "unlock"

// Validate input
if (!$public_key || !$amount || !$txid || !$action || !in_array($action, ['lock', 'unlock'])) {
    echo json_encode(["status" => "error", "message" => "Missing or invalid required fields"]);
    exit();
}

// Get database connection
$conn = getDBConnection();
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

$timestamp = 1;//time(); // Unix timestamp

// Insert log entry
$stmt = $conn->prepare("INSERT INTO lock_logs (public_key, amount, timestamp, action, transaction_signature) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sdiss", $public_key, $amount, $timestamp, $action, $txid);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Transaction logged successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error while inserting log"]);
}

$stmt->close();
$conn->close();

?>
