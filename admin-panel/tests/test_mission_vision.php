<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_mv_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/missionVision.json';
$original = file_get_contents($dataPath);
$originalData = json_decode($original, true);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Sayfa mevcut icerigi gosteriyor ===" . PHP_EOL;
[$status, $body] = req('http://localhost:8899/admin-panel/mission-vision.php', $cookieFile);
check('Sayfa 200 donuyor', $status === 200);
check('Mevcut misyon basligi formda', str_contains($body, htmlspecialchars($originalData['tr']['mission']['title'], ENT_QUOTES, 'UTF-8')));

echo PHP_EOL . "=== 2. Turkce/emoji icerikle kaydetme ===" . PHP_EOL;
$newMissionTitle = 'Test Misyonu 🎯';
$newMissionContent = 'Işıklı test içeriği, çok özel karakterler: ğüşiöç.';
[$status2] = req('http://localhost:8899/admin-panel/mission-vision.php', $cookieFile, [
    'tr_mission_title' => $newMissionTitle,
    'tr_mission_content' => $newMissionContent,
    'en_mission_title' => 'Test Mission',
    'en_mission_content' => 'Test content',
    'tr_vision_title' => $originalData['tr']['vision']['title'],
    'tr_vision_content' => $originalData['tr']['vision']['content'],
    'en_vision_title' => $originalData['en']['vision']['title'],
    'en_vision_content' => $originalData['en']['vision']['content'],
]);
check('Kaydetme basarili (302)', $status2 === 302);

$saved = json_decode(file_get_contents($dataPath), true);
check('Turkce/emoji misyon basligi bozulmadan kaydedildi', $saved['tr']['mission']['title'] === $newMissionTitle);
check('Turkce ozel karakterli icerik bozulmadan kaydedildi', $saved['tr']['mission']['content'] === $newMissionContent);
check('Vizyon degismedi', $saved['tr']['vision']['title'] === $originalData['tr']['vision']['title']);

echo PHP_EOL . "=== 3. Bos Turkce baslik reddediliyor ===" . PHP_EOL;
[, $body3] = req('http://localhost:8899/admin-panel/mission-vision.php', $cookieFile, [
    'tr_mission_title' => '', 'tr_mission_content' => 'x',
    'en_mission_title' => '', 'en_mission_content' => '',
    'tr_vision_title' => $originalData['tr']['vision']['title'], 'tr_vision_content' => '',
    'en_vision_title' => '', 'en_vision_content' => '',
]);
check('Bos baslik reddediliyor', str_contains($body3, 'error-banner'));

echo PHP_EOL . "=== 4. Temizlik: dosya tam olarak eski haline dondu mu ===" . PHP_EOL;
file_put_contents($dataPath, $original);
$finalContent = file_get_contents($dataPath);
check('missionVision.json byte-byte teste baslamadan onceki haliyle ayni', $finalContent === $original);

echo PHP_EOL . "=== SONUC: $pass gecti, $fail basarisiz ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
