<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_limit_test_cookies.txt';
@unlink($cookieFile);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

$bigFile = sys_get_temp_dir() . '/big-test-file.jpg';
$fh = fopen($bigFile, 'wb');
fwrite($fh, str_repeat('A', 11 * 1024 * 1024));
fclose($fh);
echo 'Test dosyasi boyutu: ' . round(filesize($bigFile) / 1024 / 1024, 1) . ' MB' . PHP_EOL;

echo PHP_EOL . '=== Foto: 11MB dosya (limit 10MB) ===' . PHP_EOL;
[$status, $body] = req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile, [
    'model' => 'DENEME', 'name_tr' => 'DENEME Test Ürünü', 'name_en' => 'DENEME Test Product',
    'brand' => 'k2', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '1W',
    'photo' => new CURLFile($bigFile, 'image/jpeg', 'buyuk.jpg'),
], true);
echo "Durum: $status" . PHP_EOL;
if (preg_match('/error-banner">([^<]*)</', $body, $errm)) {
    echo "HATA (beklenen): " . $errm[1] . PHP_EOL;
} else {
    echo "UYARI: buyuk dosya reddedilmedi!" . PHP_EOL;
}

echo PHP_EOL . '=== Logo: 6MB dosya (limit 5MB) ===' . PHP_EOL;
$bigLogo = sys_get_temp_dir() . '/big-test-logo.png';
$fh = fopen($bigLogo, 'wb');
fwrite($fh, str_repeat('B', 6 * 1024 * 1024));
fclose($fh);
[$status2, $body2] = req('http://localhost:8899/admin-panel/brand-logo.php', $cookieFile, [
    'brand' => 'vanti', 'logo' => new CURLFile($bigLogo, 'image/png', 'buyuk-logo.png'),
], true);
echo "Durum: $status2" . PHP_EOL;
if (preg_match('/error-banner">([^<]*)</', $body2, $errm2)) {
    echo "HATA (beklenen): " . $errm2[1] . PHP_EOL;
} else {
    echo "UYARI: buyuk logo reddedilmedi!" . PHP_EOL;
}

echo PHP_EOL . '=== Kontrol: limit altindaki normal dosya hala calisiyor mu ===' . PHP_EOL;
$normalPhoto = __DIR__ . '/../../public/textures/earth-topology.png';
[$status3] = req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile, [
    'model' => 'DENEME', 'name_tr' => 'DENEME Test Ürünü', 'name_en' => 'DENEME Test Product',
    'brand' => 'k2', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '1W',
    'photo' => new CURLFile($normalPhoto, 'image/png', 'normal.png'),
], true);
echo "Normal boyutlu dosya durumu (302 beklenir): $status3" . PHP_EOL;

unlink($bigFile);
unlink($bigLogo);
@unlink(__DIR__ . '/../data/uploads/urunler/deneme.webp');
