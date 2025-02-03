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
$wallet = $data['wallet'] ?? null;
$option_id = $data['option_id'] ?? null;

// Validate input
if (!$wallet || !$option_id) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit();
}

// Get database connection
$conn = getDBConnection();
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

// Check if the wallet has voted for this option
$stmt = $conn->prepare("SELECT id FROM votes WHERE wallet = ? AND option_id = ?");
$stmt->bind_param("si", $wallet, $option_id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "No vote found to retract"]);
    exit();
}

// Delete the vote from the database
$stmt = $conn->prepare("DELETE FROM votes WHERE wallet = ? AND option_id = ?");
$stmt->bind_param("si", $wallet, $option_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Vote retracted successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error while retracting vote"]);
}

// Close connections
$stmt->close();
$conn->close();

?>
