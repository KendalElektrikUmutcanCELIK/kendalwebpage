<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_about_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/aboutContent.json';
$original = file_get_contents($dataPath);
$originalData = json_decode($original, true);
$originalBeatCount = count($originalData['tr']['beats']);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Sayfa mevcut icerigi gosteriyor ===" . PHP_EOL;
[$status, $body] = req('http://localhost:8899/admin-panel/about.php', $cookieFile);
check('Sayfa 200 donuyor', $status === 200);
check('Mevcut basim listede', str_contains($body, htmlspecialchars($originalData['tr']['beats'][0]['title'], ENT_QUOTES, 'UTF-8')));

echo PHP_EOL . "=== 2. Ana metni Turkce/emoji ile guncelleme ===" . PHP_EOL;
$newTitle = 'Test Rozeti 💡';
[$status2] = req('http://localhost:8899/admin-panel/about.php', $cookieFile, [
    'form_action' => 'save_intro',
    'tr_title' => $newTitle,
    'tr_text1' => $originalData['tr']['text1'],
    'tr_text2' => $originalData['tr']['text2'],
    'en_title' => $originalData['en']['title'],
    'en_text1' => $originalData['en']['text1'],
    'en_text2' => $originalData['en']['text2'],
]);
check('Kaydetme basarili (302)', $status2 === 302);
$saved = json_decode(file_get_contents($dataPath), true);
check('Turkce/emoji baslik bozulmadan kaydedildi', $saved['tr']['title'] === $newTitle);
check('Beats etkilenmedi', count($saved['tr']['beats']) === $originalBeatCount);

echo PHP_EOL . "=== 3. Yeni beat ekleme ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/about.php', $cookieFile, ['form_action' => 'add_beat']);
$saved3 = json_decode(file_get_contents($dataPath), true);
check('TR beats +1', count($saved3['tr']['beats']) === $originalBeatCount + 1);
check('EN beats +1', count($saved3['en']['beats']) === $originalBeatCount + 1);
$newIdx = $originalBeatCount;

echo PHP_EOL . "=== 4. Yeni beati doldurma (Turkce ozel karakterlerle) ===" . PHP_EOL;
$beatTitle = 'Işıklı Test Maddesi ğüşiöç';
req('http://localhost:8899/admin-panel/about.php', $cookieFile, [
    'form_action' => 'update_beat',
    'index' => (string) $newIdx,
    'tr_beat_title' => $beatTitle,
    'tr_beat_text' => 'Test metni.',
    'en_beat_title' => 'Test Item',
    'en_beat_text' => 'Test text.',
]);
$saved4 = json_decode(file_get_contents($dataPath), true);
check('Yeni beat basligi bozulmadan kaydedildi', $saved4['tr']['beats'][$newIdx]['title'] === $beatTitle);

echo PHP_EOL . "=== 5. Beati yukari tasima ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/about.php', $cookieFile, [
    'form_action' => 'move_beat', 'index' => (string) $newIdx, 'direction' => 'up',
]);
$saved5 = json_decode(file_get_contents($dataPath), true);
check('Yeni beat yukari tasindi', $saved5['tr']['beats'][$newIdx - 1]['title'] === $beatTitle);

echo PHP_EOL . "=== 6. Beati silme ===" . PHP_EOL;
$deleteIdx = $newIdx - 1;
req('http://localhost:8899/admin-panel/about.php', $cookieFile, [
    'form_action' => 'delete_beat', 'index' => (string) $deleteIdx,
]);
$saved6 = json_decode(file_get_contents($dataPath), true);
check('Beat sayisi orijinaline dondu', count($saved6['tr']['beats']) === $originalBeatCount);
check('EN beat sayisi da orijinaline dondu', count($saved6['en']['beats']) === $originalBeatCount);

echo PHP_EOL . "=== 7. Temizlik: dosya tam olarak eski haline dondu mu ===" . PHP_EOL;
file_put_contents($dataPath, $original);
$finalContent = file_get_contents($dataPath);
check('aboutContent.json byte-byte teste baslamadan onceki haliyle ayni', $finalContent === $original);

echo PHP_EOL . "=== SONUC: $pass gecti, $fail basarisiz ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
