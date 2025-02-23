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

// Validate input
if (!$public_key) {
    echo json_encode(["status" => "error", "message" => "Missing wallet address"]);
    exit();
}

// Get database connection
$conn = getDBConnection();
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// Update all locked entries for this wallet (set unlocked = 1)
$stmt = $conn->prepare("UPDATE locks SET unlocked = 1 WHERE public_key = ? AND unlocked = 0");
$stmt->bind_param("s", $public_key);
$stmt->execute();

// Check how many rows were updated
if ($stmt->affected_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Unlocked all entries for the given wallet"]);
} else {
    echo json_encode(["status" => "error", "message" => "No locked entries found for this wallet"]);
}

// Close connection
$stmt->close();
$conn->close();

?>
