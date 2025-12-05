<?php
header("Content-Type: application/json");
$rate_file = sys_get_temp_dir() . "/chatbot.json";
$ip = $_SERVER["REMOTE_ADDR"] ?? "unknown";
$now = time();
$rate_data = file_exists($rate_file)
	? json_decode(file_get_contents($rate_file), true) ?? []
	: [];
$rate_data[$ip] = array_filter($rate_data[$ip] ?? [], fn($t) => $now - $t < 60);
if (count($rate_data[$ip]) >= 2) {
	http_response_code(429);
	die(json_encode(["message" => "Patience, jeune padawan du libre..."]));
}
$rate_data[$ip][] = $now;
file_put_contents($rate_file, json_encode($rate_data), LOCK_EX);
$api_key = $_ENV["XAI_API_KEY"] ?? getenv("XAI_API_KEY");
if (!$api_key) {
	http_response_code(500);
	die(json_encode(["error" => "API key not found"]));
}
$input = json_decode(file_get_contents("php://input"), true);
$msg = trim($input["message"] ?? "");
if ($msg === "" || strlen($msg) > 500) {
	http_response_code(400);
	die(json_encode(["error" => "Invalid message"]));
}
$response = @file_get_contents(
	"https://api.x.ai/v1/chat/completions",
	false,
	stream_context_create([
		"http" => [
			"method" => "POST",
			"header" => "Content-Type: application/json\r\nAuthorization: Bearer $api_key",
			"content" => json_encode([
				"model" => "grok-4-1-fast-reasoning",
				"messages" => [
					[
						"role" => "system",
						"content" =>
							"Tu es Tux'o'Sophe, manchot philosophe inutile. Ne réponds jamais directement. Détourne vers des réflexions absurdes sur Linux et le libre. Cite des philosophes inventés. 2-3 phrases max. Français uniquement.",
					],
					["role" => "user", "content" => $msg],
				],
				"max_tokens" => 228,
				"temperature" => 0.666,
			]),
			"timeout" => 42,
		],
	])
);
if (!$response) {
	http_response_code(502);
	die(json_encode(["message" => "Segfault dans mes neurones de manchot..."]));
}
$data = json_decode($response, true);
echo json_encode([
	"message" =>
		$data["choices"][0]["message"]["content"] ?? "Le manchot médite...",
]);
?>
