<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_retailers_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/retailers.json';
$original = file_get_contents($dataPath);
$logoDir = __DIR__ . '/../../public/images/retail';

$testLogoSource = sys_get_temp_dir() . '/admin_retailers_test_logo_src.png';
$im = imagecreatetruecolor(100, 60);
imagefill($im, 0, 0, imagecolorallocate($im, 10, 120, 200));
imagepng($im, $testLogoSource);
imagedestroy($im);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Liste sayfasi mevcut marketleri gosteriyor ===" . PHP_EOL;
[$status, $body] = req('http://localhost:8899/admin-panel/retailers.php', $cookieFile);
check('Sayfa 200 donuyor', $status === 200);
check('Mevcut BIM kaydi listede', str_contains($body, 'BİM'));

echo PHP_EOL . "=== 2. Yeni market ekleme (Turkce/emoji karakterlerle, gercek gorsel yuklenerek) ===" . PHP_EOL;
$name = 'Test Marketi 🛒';
[$status2, $body2] = req('http://localhost:8899/admin-panel/retailers.php', $cookieFile, [
    'form_action' => 'add_retailer',
    'name' => $name,
    'logo' => new CURLFile($testLogoSource, 'image/png', 'test-logo.png'),
], true);
check('Ekleme basarili (302)', $status2 === 302);

$saved = json_decode(file_get_contents($dataPath), true);
check('Market gercek retailers.json\'a eklendi', count($saved) === 9);
$new = $saved[8];
check('Turkce/emoji isim bozulmadan kaydedildi', ($new['name'] ?? '') === $name);
check('id otomatik uretildi', ($new['id'] ?? '') === 'test-marketi');
check('Logo yolu retail/ altinda', str_starts_with($new['logo'] ?? '', 'retail/test-marketi-logo.'));
$logoFile = __DIR__ . '/../../public/images/' . $new['logo'];
check('Logo dosyasi gercekten diskte olusturuldu', is_file($logoFile));

echo PHP_EOL . "=== 3. Ayni isimle ikinci ekleme -> -2 ile benzersiz id ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/retailers.php', $cookieFile, [
    'form_action' => 'add_retailer',
    'name' => $name,
    'logo' => new CURLFile($testLogoSource, 'image/png', 'test-logo2.png'),
], true);
$saved3 = json_decode(file_get_contents($dataPath), true);
check('Ucuncu kayit eklendi, toplam 10', count($saved3) === 10);
check('Ikinci ayni-isimli kayit -2 id aldi', ($saved3[9]['id'] ?? '') === 'test-marketi-2');

echo PHP_EOL . "=== 4. Siralama (yukari tasima) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/retailers.php', $cookieFile, [
    'form_action' => 'move_retailer', 'id' => 'test-marketi-2', 'direction' => 'up',
]);
$saved4 = json_decode(file_get_contents($dataPath), true);
check('test-marketi-2 yukari tasindi (artik 9. sirada, index 8)', ($saved4[8]['id'] ?? '') === 'test-marketi-2');

echo PHP_EOL . "=== 5. Silme (kayit + logo dosyasi) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/retailers.php', $cookieFile, [
    'form_action' => 'delete_retailer', 'id' => 'test-marketi',
]);
req('http://localhost:8899/admin-panel/retailers.php', $cookieFile, [
    'form_action' => 'delete_retailer', 'id' => 'test-marketi-2',
]);
$saved5 = json_decode(file_get_contents($dataPath), true);
check('Iki test kaydi da silindi, orijinal 8 kaldi', count($saved5) === 8);
check('Test logo dosyasi diskten silindi', !is_file($logoFile));
check('Gercek BIM logosu etkilenmedi', is_file($logoDir . '/bim-logo.webp'));

echo PHP_EOL . "=== 6. Temizlik: dosya tam olarak eski haline dondu mu ===" . PHP_EOL;
$finalContent = file_get_contents($dataPath);
check('retailers.json byte-byte teste baslamadan onceki haliyle ayni', $finalContent === $original);
if ($finalContent !== $original) {
    echo "UYARI: temizlik tam olmadi, orijinal veri elle geri yukleniyor!" . PHP_EOL;
    file_put_contents($dataPath, $original);
}
@unlink($testLogoSource);

echo PHP_EOL . "=== SONUC: $pass gecti, $fail basarisiz ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
