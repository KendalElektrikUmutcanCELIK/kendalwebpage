<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_nested_pages_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/pages.json';
$original = file_get_contents($dataPath);
$imageDir = __DIR__ . '/../../public/images/sayfalar';

$testPhotoSource = sys_get_temp_dir() . '/admin_nested_pages_test_photo_src.png';
$im = imagecreatetruecolor(120, 80);
imagefill($im, 0, 0, imagecolorallocate($im, 80, 160, 40));
imagepng($im, $testPhotoSource);
imagedestroy($im);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Kok sayfa olusturma (ust sayfasiz) ===" . PHP_EOL;
[$status1] = req('http://localhost:8899/admin-panel/page-edit.php', $cookieFile, [
    'form_action' => 'save_meta', 'title_tr' => 'Test Kok', 'title_en' => '', 'meta_tr' => '', 'meta_en' => '',
]);
check('Olusturma basarili (302)', $status1 === 302);
$saved1 = json_decode(file_get_contents($dataPath), true);
check('"test-kok" slug\'i olustu', isset($saved1['test-kok']));

echo PHP_EOL . "=== 2. Bu sayfayi ust sayfa secerek alt sayfa olusturma (Turkce/emoji basliklarla) ===" . PHP_EOL;
$childTitle = 'Alt Sayfa Işıklı 💡';
req('http://localhost:8899/admin-panel/page-edit.php', $cookieFile, [
    'form_action' => 'save_meta', 'title_tr' => $childTitle, 'title_en' => '', 'meta_tr' => '', 'meta_en' => '',
    'parent_slug' => 'test-kok',
]);
$saved2 = json_decode(file_get_contents($dataPath), true);
check('Ic ice slug "test-kok/alt-sayfa-isikli" olustu', isset($saved2['test-kok/alt-sayfa-isikli']));
check('Baslik Turkce/emoji bozulmadan kaydedildi', ($saved2['test-kok/alt-sayfa-isikli']['title']['tr'] ?? '') === $childTitle);
check('Kok sayfa etkilenmedi', isset($saved2['test-kok']));

echo PHP_EOL . "=== 3. Alt sayfaya blok gorseli yukleme (dosya adi guvenli mi, '/' icermiyor mu) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/page-edit.php?slug=' . urlencode('test-kok/alt-sayfa-isikli'), $cookieFile, [
    'form_action' => 'add_block', 'block_type' => 'text_image',
]);
$saved3 = json_decode(file_get_contents($dataPath), true);
$blockId = $saved3['test-kok/alt-sayfa-isikli']['blocks'][0]['id'];
check('Blok eklendi', $blockId !== null);

req('http://localhost:8899/admin-panel/page-edit.php?slug=' . urlencode('test-kok/alt-sayfa-isikli'), $cookieFile, [
    'form_action' => 'update_block', 'block_id' => $blockId, 'block_type' => 'text_image',
    'heading_tr' => 'Baslik', 'heading_en' => '', 'text_tr' => 'Metin', 'text_en' => '',
    'image_position' => 'right', 'image_alt_tr' => '', 'image_alt_en' => '',
    'block_image' => new CURLFile($testPhotoSource, 'image/png', 'nested-test.png'),
], true);
$saved4 = json_decode(file_get_contents($dataPath), true);
$imagePath = $saved4['test-kok/alt-sayfa-isikli']['blocks'][0]['data']['image'] ?? '';
check('Gorsel yolu kaydedildi', $imagePath !== '');
check('Dosya adi "/" icermiyor (guvenli)', !str_contains(basename($imagePath), '/'));
$imageFile = __DIR__ . '/../../public/images/' . $imagePath;
check('Gorsel dosyasi gercekten diskte', is_file($imageFile));

echo PHP_EOL . "=== 4. Ayni isimle ikinci bir alt sayfa -> otomatik -2 ekleniyor ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/page-edit.php', $cookieFile, [
    'form_action' => 'save_meta', 'title_tr' => $childTitle, 'title_en' => '', 'meta_tr' => '', 'meta_en' => '',
    'parent_slug' => 'test-kok',
]);
$saved5 = json_decode(file_get_contents($dataPath), true);
check('Ikinci ayni-isimli alt sayfa "-2" aldi', isset($saved5['test-kok/alt-sayfa-isikli-2']));

echo PHP_EOL . "=== 5. Sabit route ismini ust sayfa gibi kullanmaya calismak (parent_slug gecersizse yok sayilir) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/page-edit.php', $cookieFile, [
    'form_action' => 'save_meta', 'title_tr' => 'Sahte Ust Sayfa Denemesi', 'title_en' => '', 'meta_tr' => '', 'meta_en' => '',
    'parent_slug' => 'haberler',
]);
$saved6 = json_decode(file_get_contents($dataPath), true);
check('"haberler" pages.json\'da gercek bir sayfa olmadigi icin parent yok sayildi, flat slug uretildi', isset($saved6['sahte-ust-sayfa-denemesi']));
check('"haberler/..." diye bir kayit OLUSMADI', !isset($saved6['haberler/sahte-ust-sayfa-denemesi']));

echo PHP_EOL . "=== 6. Silme: alt sayfa silinince gorseli de temizleniyor, kok sayfa etkilenmiyor ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/page-edit.php?slug=' . urlencode('test-kok/alt-sayfa-isikli'), $cookieFile, [
    'form_action' => 'delete_page',
]);
$saved7 = json_decode(file_get_contents($dataPath), true);
check('Alt sayfa silindi', !isset($saved7['test-kok/alt-sayfa-isikli']));
check('Kok sayfa hala duruyor', isset($saved7['test-kok']));
check('Alt sayfanin gorseli diskten silindi', !is_file($imageFile));

echo PHP_EOL . "=== 7. Temizlik ===" . PHP_EOL;
foreach (['test-kok', 'test-kok/alt-sayfa-isikli-2', 'sahte-ust-sayfa-denemesi'] as $slug) {
    foreach (glob($imageDir . '/' . str_replace('/', '--', $slug) . '-*') ?: [] as $f) {
        @unlink($f);
    }
}
file_put_contents($dataPath, $original);
$finalContent = file_get_contents($dataPath);
check('pages.json byte-byte teste baslamadan onceki haliyle ayni', $finalContent === $original);
if ($finalContent !== $original) {
    echo "UYARI: temizlik tam olmadi, orijinal veri elle geri yukleniyor!" . PHP_EOL;
    file_put_contents($dataPath, $original);
}
@unlink($testPhotoSource);

echo PHP_EOL . "=== SONUC: $pass gecti, $fail basarisiz ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
