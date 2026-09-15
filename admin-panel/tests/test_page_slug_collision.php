<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_slug_collision_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/pages.json';
$original = file_get_contents($dataPath);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Sabit route ismiyle cakisan baslik -> otomatik ek alir ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/page-edit.php', $cookieFile, [
    'form_action' => 'save_meta', 'title_tr' => 'Haberler', 'title_en' => '', 'meta_tr' => '', 'meta_en' => '',
]);
$saved1 = json_decode(file_get_contents($dataPath), true);
check('"haberler" slug\'i rezerve edilmis, kullanilmadi', !isset($saved1['haberler']));
check('Bunun yerine "haberler-2" uretildi', isset($saved1['haberler-2']));

echo PHP_EOL . "=== 2. Gercek bir urun slug'iyla cakisan baslik -> otomatik ek alir ===" . PHP_EOL;
$productSlug = 'ges230-20w-torch-led-ampul-beyaz';
$slugMapPath = __DIR__ . '/../../src/data/slug-map.json';
$slugMap = json_decode(file_get_contents($slugMapPath), true);
check('Test icin kullanilan urun slug\'i gercekten var (on kosul)', isset($slugMap[$productSlug]));

req('http://localhost:8899/admin-panel/page-edit.php', $cookieFile, [
    'form_action' => 'save_meta', 'title_tr' => 'ges230 20w torch led ampul beyaz', 'title_en' => '', 'meta_tr' => '', 'meta_en' => '',
]);
$saved2 = json_decode(file_get_contents($dataPath), true);
check('Urun slug\'iyla ayni isim kullanilmadi', !isset($saved2[$productSlug]));
check('Bunun yerine "-2" ekli slug uretildi', isset($saved2[$productSlug . '-2']));

echo PHP_EOL . "=== 3. Normal, cakismayan bir baslik hala duzgun calisiyor (regresyon) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/page-edit.php', $cookieFile, [
    'form_action' => 'save_meta', 'title_tr' => 'Tamamen Ozgun Test Sayfasi', 'title_en' => '', 'meta_tr' => '', 'meta_en' => '',
]);
$saved3 = json_decode(file_get_contents($dataPath), true);
check('Cakismayan baslik duz slug aldi', isset($saved3['tamamen-ozgun-test-sayfasi']));

echo PHP_EOL . "=== 4. Temizlik ===" . PHP_EOL;
foreach (['haberler-2', $productSlug . '-2', 'tamamen-ozgun-test-sayfasi'] as $slug) {
    if (isset($saved3[$slug])) {
        foreach (glob(__DIR__ . '/../../public/images/sayfalar/' . $slug . '-*') ?: [] as $f) {
            @unlink($f);
        }
    }
}
file_put_contents($dataPath, $original);
$finalContent = file_get_contents($dataPath);
check('pages.json byte-byte teste baslamadan onceki haliyle ayni', $finalContent === $original);

echo PHP_EOL . "=== SONUC: $pass gecti, $fail basarisiz ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
