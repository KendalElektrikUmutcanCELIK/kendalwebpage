<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_projects_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/projects.json';
$original = file_get_contents($dataPath);
$imageDir = __DIR__ . '/../../public/images/references/turkiye';

$testPhotoSource = sys_get_temp_dir() . '/admin_projects_test_photo_src.png';
$im = imagecreatetruecolor(200, 150);
imagefill($im, 0, 0, imagecolorallocate($im, 200, 40, 40));
imagepng($im, $testPhotoSource);
imagedestroy($im);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Liste sayfasi mevcut projeleri gosteriyor ===" . PHP_EOL;
[$status, $body] = req('http://localhost:8899/admin-panel/projects.php', $cookieFile);
check('Sayfa 200 donuyor', $status === 200);
check('Mevcut Volkswagen kaydi listede', str_contains($body, 'Volkswagen'));
check('43 proje kayitli mesaji dogru', str_contains($body, '43 proje kayitli') || str_contains($body, '43 proje kayıtlı'));

echo PHP_EOL . "=== 2. Yeni proje ekleme (Turkce/emoji karakterlerle, gercek gorsel yuklenerek) ===" . PHP_EOL;
$name = 'Test Projesi Işıklı ✨';
$location = 'Şişli – İstanbul';
[$status2] = req('http://localhost:8899/admin-panel/projects.php', $cookieFile, [
    'form_action' => 'add_project',
    'name' => $name,
    'location' => $location,
    'photo' => new CURLFile($testPhotoSource, 'image/png', 'test-photo.png'),
], true);
check('Ekleme basarili (302)', $status2 === 302);

$saved = json_decode(file_get_contents($dataPath), true);
check('Proje gercek projects.json\'a eklendi', count($saved) === 44);
$new = $saved[43];
check('Turkce/emoji isim bozulmadan kaydedildi', ($new['name'] ?? '') === $name);
check('id otomatik ref-44 olarak uretildi', ($new['id'] ?? '') === 'ref-44');
check('image alani id ile eslesiyor', ($new['image'] ?? '') === 'references/turkiye/ref-44.webp');
$imageFile = __DIR__ . '/../../public/images/' . $new['image'];
check('Gorsel dosyasi gercekten diskte olusturuldu', is_file($imageFile));

echo PHP_EOL . "=== 3. Ikinci ekleme -> id devam ediyor (ref-45) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/projects.php', $cookieFile, [
    'form_action' => 'add_project',
    'name' => 'Test Projesi 2',
    'location' => 'Ankara',
    'photo' => new CURLFile($testPhotoSource, 'image/png', 'test-photo2.png'),
], true);
$saved3 = json_decode(file_get_contents($dataPath), true);
check('Dorduncu kayit eklendi, toplam 45', count($saved3) === 45);
check('Ikinci test kaydi ref-45 aldi', ($saved3[44]['id'] ?? '') === 'ref-45');

echo PHP_EOL . "=== 4. Siralama (yukari tasima) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/projects.php', $cookieFile, [
    'form_action' => 'move_project', 'id' => 'ref-45', 'direction' => 'up',
]);
$saved4 = json_decode(file_get_contents($dataPath), true);
check('ref-45 yukari tasindi (artik index 43)', ($saved4[43]['id'] ?? '') === 'ref-45');

echo PHP_EOL . "=== 5. Silme (kayit + gorsel dosyasi) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/projects.php', $cookieFile, [
    'form_action' => 'delete_project', 'id' => 'ref-44',
]);
req('http://localhost:8899/admin-panel/projects.php', $cookieFile, [
    'form_action' => 'delete_project', 'id' => 'ref-45',
]);
$saved5 = json_decode(file_get_contents($dataPath), true);
check('Iki test kaydi da silindi, orijinal 43 kaldi', count($saved5) === 43);
check('Test gorseli diskten silindi', !is_file($imageFile));
check('Gercek ref-01 gorseli etkilenmedi', is_file($imageDir . '/ref-01.webp'));

echo PHP_EOL . "=== 6. Temizlik: dosya tam olarak eski haline dondu mu ===" . PHP_EOL;
$finalContent = file_get_contents($dataPath);
check('projects.json byte-byte teste baslamadan onceki haliyle ayni', $finalContent === $original);
if ($finalContent !== $original) {
    echo "UYARI: temizlik tam olmadi, orijinal veri elle geri yukleniyor!" . PHP_EOL;
    file_put_contents($dataPath, $original);
}
@unlink($testPhotoSource);

echo PHP_EOL . "=== SONUC: $pass gecti, $fail basarisiz ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
