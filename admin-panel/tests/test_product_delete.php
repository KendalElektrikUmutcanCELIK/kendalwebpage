<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_product_delete_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/products.json';
$pngSource = __DIR__ . '/../../public/textures/earth-topology.png';
$originalProducts = file_get_contents($dataPath);
$originalCount = count(json_decode($originalProducts, true));

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 0. Silinecek geçici bir test ürünü oluştur (fotoğraflı) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/product-edit.php', $cookieFile, [
    'model' => 'SILTEST1', 'name_tr' => 'Silinecek Test Ürünü', 'name_en' => 'Deletable Test Product',
    'brand' => 'k2', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '1W',
    'photo' => new CURLFile($pngSource, 'image/png', 'test.png'),
], true);
$saved = json_decode(file_get_contents($dataPath), true);
check('Test ürünü gerçek products.json\'a eklendi', isset($saved['SILTEST1']));
check('Ürün sayısı 1 arttı', count($saved) === $originalCount + 1);
$imagePath = $saved['SILTEST1']['image'] ?? '';
$uploadedFile = __DIR__ . '/../../public/images/' . $imagePath;
check('Test ürününün fotoğrafı gerçek public/images/ altında oluştu', $imagePath !== '' && file_exists($uploadedFile));

echo PHP_EOL . "=== 1. Ürün silme ===" . PHP_EOL;
[$statusDel, , $redirectDel] = req('http://localhost:8899/admin-panel/product-edit.php?id=SILTEST1', $cookieFile, [
    'form_action' => 'delete_product',
]);
check('Silme sonrası yönlendirme (302)', $statusDel === 302);
check('Yönlendirme products.php?deleted=1 adresine', str_contains((string) $redirectDel, 'products.php?deleted=1'));

$savedAfter = json_decode(file_get_contents($dataPath), true);
check('Ürün products.json içinden kalıcı silindi', !isset($savedAfter['SILTEST1']));
check('Diğer gerçek ürünler etkilenmedi (ör. GES230 hâlâ duruyor)', isset($savedAfter['GES230']));
check('Fotoğraf dosyası da diskten silindi', !file_exists($uploadedFile));

[, $listBody] = req('http://localhost:8899/admin-panel/products.php?deleted=1', $cookieFile);
check('Ürün listesinde "silindi" bildirimi görünüyor', str_contains($listBody, 'Ürün silindi'));

echo PHP_EOL . "=== 2. Silinmiş ürünün düzenleme sayfası artık 404 veriyor ===" . PHP_EOL;
[$status404] = req('http://localhost:8899/admin-panel/product-edit.php?id=SILTEST1', $cookieFile);
check('Silinen ürüne erişim 404 döndürüyor', $status404 === 404);

echo PHP_EOL . "=== 3. Gerçek veri tam olarak eski hâline döndü mü ===" . PHP_EOL;
$finalContent = file_get_contents($dataPath);
check('Ürün sayısı orijinaline döndü (' . $originalCount . ')', count(json_decode($finalContent, true)) === $originalCount);
check('Dosya byte-byte teste başlamadan önceki hâliyle aynı', $finalContent === $originalProducts);

if ($finalContent !== $originalProducts) {
    echo "⚠️ UYARI: temizlik tam olmadı, orijinal veri elle geri yükleniyor!" . PHP_EOL;
    file_put_contents($dataPath, $originalProducts);
}

echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
