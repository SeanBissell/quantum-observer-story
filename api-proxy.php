<?php
/**
 * MiniMax API Proxy for HostGator
 * Keeps API key secure server-side
 */

// ===== CONFIGURATION =====
$MINIMAX_API_KEY = 'sk-cp-KSRWAbM2S710sls8ZxTWTkbkDj5_ayazeyWbQJR2pRBPJIn-XvslOkraEtCbHprcPAyUX7uP4DJmx3pw31EC2KPuX36gysUyix89jrmlTBrNUG4hNv8YZ2Q';
$MINIMAX_ENDPOINT = 'https://api.minimax.io/anthropic/v1/messages';

// ===== CORS HEADERS =====
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get request body
$requestBody = file_get_contents('php://input');

if (empty($requestBody)) {
    http_response_code(400);
    echo json_encode(['error' => 'Empty request body']);
    exit;
}

// Validate JSON
$requestData = json_decode($requestBody, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Prepare request to MiniMax
$ch = curl_init($MINIMAX_ENDPOINT);

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $requestBody,
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_HEADER => false,
    CURLOPT_WRITEFUNCTION => function($ch, $data) {
        echo $data;
        flush();
        return strlen($data);
    },
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $MINIMAX_API_KEY,
        'Content-Type: application/json',
        'Content-Length: ' . strlen($requestBody)
    ],
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_TIMEOUT => 60
]);

// Disable output buffering for streaming
if (ob_get_level()) ob_end_clean();
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no'); // Disable nginx buffering

// Execute request
$result = curl_exec($ch);

if ($result === false) {
    $error = curl_error($ch);
    curl_close($ch);
    http_response_code(500);
    echo json_encode(['error' => 'Proxy error: ' . $error]);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code($httpCode);
}

exit;
?>
