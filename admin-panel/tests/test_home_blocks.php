<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_home_blocks_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/homeBlocks.json';
$original = file_get_contents($dataPath);
$imageDir = __DIR__ . '/../../public/images/sayfalar';

$testPhotoSource = sys_get_temp_dir() . '/admin_home_blocks_test_photo_src.png';
$im = imagecreatetruecolor(100, 70);
imagefill($im, 0, 0, imagecolorallocate($im, 30, 30, 200));
imagepng($im, $testPhotoSource);
imagedestroy($im);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Genel bakis sayfasi 8 bolgeyi gosteriyor, hepsi 0 blok ===" . PHP_EOL;
[$status, $body] = req('http://localhost:8899/admin-panel/home-blocks.php', $cookieFile);
check('Sayfa 200 donuyor', $status === 200);
check('Hakkimizda-Markalarimiz bolgesi listede', str_contains($body, 'Hakkımızda ile Markalarımız Arasına'));

echo PHP_EOL . "=== 2. after-about bolgesine blok ekleme (Turkce/emoji basliklarla) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/home-blocks.php?slot=after-about', $cookieFile, [
    'form_action' => 'add_block', 'block_type' => 'heading_text',
]);
$saved = json_decode(file_get_contents($dataPath), true);
check('after-about icinde 1 blok var', count($saved['after-about']) === 1);
check('Diger bolgeler hala bos', count($saved['after-hero']) === 0 && count($saved['after-brands']) === 0);
$blockId = $saved['after-about'][0]['id'];

$headingTr = 'Işıklı Test Başlığı ğüşiöç 💡';
req('http://localhost:8899/admin-panel/home-blocks.php?slot=after-about', $cookieFile, [
    'form_action' => 'update_block', 'block_id' => $blockId, 'block_type' => 'heading_text',
    'heading_tr' => $headingTr, 'heading_en' => 'Test Heading', 'body_tr' => 'Test govde', 'body_en' => 'Test body',
]);
$saved2 = json_decode(file_get_contents($dataPath), true);
check('Turkce/emoji baslik bozulmadan kaydedildi', $saved2['after-about'][0]['data']['heading']['tr'] === $headingTr);

echo PHP_EOL . "=== 3. text_image blogu + gercek gorsel yukleme ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/home-blocks.php?slot=after-about', $cookieFile, [
    'form_action' => 'add_block', 'block_type' => 'text_image',
]);
$saved3 = json_decode(file_get_contents($dataPath), true);
$imgBlockId = $saved3['after-about'][1]['id'];

req('http://localhost:8899/admin-panel/home-blocks.php?slot=after-about', $cookieFile, [
    'form_action' => 'update_block', 'block_id' => $imgBlockId, 'block_type' => 'text_image',
    'heading_tr' => 'Baslik', 'heading_en' => '', 'text_tr' => 'Metin', 'text_en' => '',
    'image_position' => 'left', 'image_alt_tr' => '', 'image_alt_en' => '',
    'block_image' => new CURLFile($testPhotoSource, 'image/png', 'home-block-test.png'),
], true);
$saved4 = json_decode(file_get_contents($dataPath), true);
$imagePath = $saved4['after-about'][1]['data']['image'] ?? '';
check('Gorsel yolu kaydedildi', $imagePath !== '');
$imageFile = __DIR__ . '/../../public/images/' . $imagePath;
check('Gorsel dosyasi gercekten diskte', is_file($imageFile));
check('Dosya adi "home-after-about-" ile basliyor (izole)', strpos(basename($imagePath), 'home-after-about-') === 0);

echo PHP_EOL . "=== 4. Siralama (yukari tasima) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/home-blocks.php?slot=after-about', $cookieFile, [
    'form_action' => 'move_block', 'block_id' => $imgBlockId, 'direction' => 'up',
]);
$saved5 = json_decode(file_get_contents($dataPath), true);
check('Ikinci blok yukari tasindi (artik index 0)', $saved5['after-about'][0]['id'] === $imgBlockId);

echo PHP_EOL . "=== 5. Silme (biri silinince gorseli de temizleniyor, digeri etkilenmiyor) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/home-blocks.php?slot=after-about', $cookieFile, [
    'form_action' => 'delete_block', 'block_id' => $imgBlockId,
]);
$saved6 = json_decode(file_get_contents($dataPath), true);
check('after-about icinde 1 blok kaldi', count($saved6['after-about']) === 1);
check('Kalan blok metin bloguydu', $saved6['after-about'][0]['id'] === $blockId);

req('http://localhost:8899/admin-panel/home-blocks.php?slot=after-about', $cookieFile, [
    'form_action' => 'delete_block', 'block_id' => $blockId,
]);
$saved7 = json_decode(file_get_contents($dataPath), true);
check('after-about tamamen bosaldi', count($saved7['after-about']) === 0);

echo PHP_EOL . "=== 6. Temizlik ===" . PHP_EOL;
@unlink($imageFile);
file_put_contents($dataPath, $original);
$finalContent = file_get_contents($dataPath);
check('homeBlocks.json byte-byte teste baslamadan onceki haliyle ayni', $finalContent === $original);
if ($finalContent !== $original) {
    echo "UYARI: temizlik tam olmadi, orijinal veri elle geri yukleniyor!" . PHP_EOL;
    file_put_contents($dataPath, $original);
}
@unlink($testPhotoSource);

echo PHP_EOL . "=== SONUC: $pass gecti, $fail basarisiz ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
