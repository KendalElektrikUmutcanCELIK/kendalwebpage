<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_certificates_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/certificates.json';
$original = file_get_contents($dataPath);

$testPhotoSource = sys_get_temp_dir() . '/admin_certificates_test_photo_src.png';
$im = imagecreatetruecolor(300, 200);
imagefill($im, 0, 0, imagecolorallocate($im, 240, 240, 240));
imagepng($im, $testPhotoSource);
imagedestroy($im);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Sayfa mevcut belgeleri gosteriyor (ISO sekmesi varsayilan) ===" . PHP_EOL;
[$status, $body] = req('http://localhost:8899/admin-panel/certificates.php', $cookieFile);
check('Sayfa 200 donuyor', $status === 200);
check('ISO belgelerinden biri listede', str_contains($body, 'emc-1.webp'));

echo PHP_EOL . "=== 2. TSE kategorisine yeni belge ekleme ===" . PHP_EOL;
[$status2] = req('http://localhost:8899/admin-panel/certificates.php', $cookieFile, [
    'form_action' => 'add_image',
    'category' => 'tse',
    'photo' => new CURLFile($testPhotoSource, 'image/png', 'test-cert.png'),
], true);
check('Ekleme basarili (302)', $status2 === 302);

$saved = json_decode(file_get_contents($dataPath), true);
check('ISO listesi degismedi (8 kayit)', count($saved['iso']) === 8);
check('TSE listesine 1 eklendi (3 kayit)', count($saved['tse']) === 3);
$newPath = $saved['tse'][2];
check('Yeni yol tse-belgeleri altinda', str_starts_with($newPath, 'certifications/tse-belgeleri/'));
$newFile = __DIR__ . '/../../public/images/' . $newPath;
check('Gorsel dosyasi gercekten diskte olusturuldu', is_file($newFile));

echo PHP_EOL . "=== 3. Marka Tescil kategorisine ikinci bir belge ekleme (izolasyon testi) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/certificates.php', $cookieFile, [
    'form_action' => 'add_image',
    'category' => 'marka-tescil',
    'photo' => new CURLFile($testPhotoSource, 'image/png', 'test-cert2.png'),
], true);
$saved3 = json_decode(file_get_contents($dataPath), true);
check('Marka Tescil listesine 1 eklendi (5 kayit)', count($saved3['marka-tescil']) === 5);
check('TSE listesi hala 3 kayit (etkilenmedi)', count($saved3['tse']) === 3);
$newPath2 = $saved3['marka-tescil'][4];

echo PHP_EOL . "=== 4. Siralama (TSE icinde yukari tasima) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/certificates.php', $cookieFile, [
    'form_action' => 'move_image', 'category' => 'tse', 'path' => $newPath, 'direction' => 'up',
]);
$saved4 = json_decode(file_get_contents($dataPath), true);
check('Yeni TSE belgesi yukari tasindi (artik index 1)', $saved4['tse'][1] === $newPath);

echo PHP_EOL . "=== 5. Silme (kayit + dosya) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/certificates.php', $cookieFile, [
    'form_action' => 'delete_image', 'category' => 'tse', 'path' => $newPath,
]);
req('http://localhost:8899/admin-panel/certificates.php', $cookieFile, [
    'form_action' => 'delete_image', 'category' => 'marka-tescil', 'path' => $newPath2,
]);
$saved5 = json_decode(file_get_contents($dataPath), true);
check('TSE 2 kayda dondu', count($saved5['tse']) === 2);
check('Marka Tescil 4 kayda dondu', count($saved5['marka-tescil']) === 4);
check('Yeni TSE dosyasi diskten silindi', !is_file($newFile));
check('Gercek tse-belgesi.webp etkilenmedi', is_file(__DIR__ . '/../../public/images/certifications/tse-belgeleri/tse-belgesi.webp'));

echo PHP_EOL . "=== 6. Temizlik: dosya tam olarak eski haline dondu mu ===" . PHP_EOL;
$finalContent = file_get_contents($dataPath);
check('certificates.json byte-byte teste baslamadan onceki haliyle ayni', $finalContent === $original);
if ($finalContent !== $original) {
    echo "UYARI: temizlik tam olmadi, orijinal veri elle geri yukleniyor!" . PHP_EOL;
    file_put_contents($dataPath, $original);
}
@unlink($testPhotoSource);

echo PHP_EOL . "=== SONUC: $pass gecti, $fail basarisiz ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
