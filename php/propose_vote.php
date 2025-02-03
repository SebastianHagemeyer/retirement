<?php

// Allow frontend requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
$headers = array_change_key_case(getallheaders(), CASE_LOWER);
if (!isset($headers['x-api-key']) || $headers['x-api-key'] !== API_KEY) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized - Invalid API Key"]);
    exit();
}

// Read and decode JSON input
$data = json_decode(file_get_contents("php://input"), true);
$topic_title = $data['topic_title'] ?? null;
$options = $data['options'] ?? [];
$options[] = "Invalidate";



if (!$topic_title || empty($options) || !is_array($options)) {
    echo json_encode(["status" => "error", "message" => "Missing required fields or invalid options format"]);
    exit();
}

// Get database connection
$conn = getDBConnection();
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

// Insert the new topic
$stmt = $conn->prepare("INSERT INTO topics (title, status, created_at) VALUES (?, 'active', NOW())");
$stmt->bind_param("s", $topic_title);
if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "Failed to create topic"]);
    exit();
}

$topic_id = $stmt->insert_id; // Get the newly created topic ID
$stmt->close();

// Insert options for the topic
$stmt = $conn->prepare("INSERT INTO options (topic_id, option_text) VALUES (?, ?)");
foreach ($options as $option_text) {
    $stmt->bind_param("is", $topic_id, $option_text);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Failed to add options"]);
        exit();
    }
}
$stmt->close();
$conn->close();

// Success response
echo json_encode(["status" => "success", "message" => "Vote proposed successfully", "topic_id" => $topic_id]);

?>
