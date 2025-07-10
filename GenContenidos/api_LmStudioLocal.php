<?php
header('Content-Type: application/json');

// Verifica que se haya enviado un prompt
if (!isset($_POST['prompt']) || empty(trim($_POST['prompt']))) {
    echo json_encode([
        'error' => true,
        'status' => 0,
        'message' => 'Falta el prompt'
    ]);
    exit;
}

$prompt = $_POST['prompt'];

// Construimos el cuerpo de la solicitud
$data = [
    "model" => "mistralai__mistral-7b-instruct-v0.2",  // Usa el ID que aparece en LM Studio
    "messages" => [
        ["role" => "user", "content" => $prompt]
    ],
    "temperature" => 0.7
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:1234/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    echo json_encode([
        'error' => true,
        'status' => 0,
        'message' => $err
    ]);
} else {
    $json = json_decode($response, true);
    $content = $json['choices'][0]['message']['content'] ?? 'Sin respuesta';
    echo json_encode([
        'error' => false,
        'status' => 1,
        'message' => $content
    ]);
}
