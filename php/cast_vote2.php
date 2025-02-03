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
$vote_value = $data['vote_value'] ?? null;

// Validate input
if (!$wallet || !$option_id || !$vote_value) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit();
}

// Get database connection
$conn = getDBConnection();
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

// Check if the wallet already voted for this option
$stmt = $conn->prepare("SELECT vote_value FROM votes WHERE wallet = ? AND option_id = ?");
$stmt->bind_param("si", $wallet, $option_id);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($existing_vote_value);
$stmt->fetch();

if ($stmt->num_rows > 0) {
    // If the new vote power is greater than the existing vote power, update it
    if ($vote_value > $existing_vote_value) {
        $stmt = $conn->prepare("UPDATE votes SET vote_value = ? WHERE wallet = ? AND option_id = ?");
        $stmt->bind_param("isi", $vote_value, $wallet, $option_id);
        
        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Your vote has been updated from $existing_vote_value to $vote_value!"
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error while updating vote"]);
        }
    } else {
        // If vote power is the same or lower, notify but do not update
        echo json_encode([
            "status" => "warn",
            "message" => "You have already voted with $existing_vote_value power. Your vote remains unchanged."
        ]);
    }
} else {
    // Insert a new vote if none exists
    $stmt = $conn->prepare("INSERT INTO votes (wallet, option_id, vote_value) VALUES (?, ?, ?)");
    $stmt->bind_param("sii", $wallet, $option_id, $vote_value);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Vote submitted successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error while inserting vote"]);
    }
}

// Close connections
$stmt->close();
$conn->close();

?>
