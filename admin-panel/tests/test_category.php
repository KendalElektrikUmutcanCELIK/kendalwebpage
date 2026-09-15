<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_cat_test_cookies.txt';
@unlink($cookieFile);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

$dataPath = __DIR__ . '/../../src/data/products.json';
$originalProducts = file_get_contents($dataPath);

echo "=== 0. Geçici test ürünü (DENEME) oluştur ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/product-edit.php', $cookieFile, [
    'model' => 'DENEME', 'name_tr' => 'DENEME Test Ürünü', 'name_en' => 'DENEME Test Product',
    'brand' => 'k2', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '1W',
]);

echo "=== Mevcut kategorilerden birine tasi (Spotlar) ===" . PHP_EOL;
[$status] = req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile, [
    'model' => 'DENEME', 'name_tr' => 'DENEME Test Ürünü', 'name_en' => 'DENEME Test Product',
    'brand' => 'k2', 'category_tr' => 'Spotlar', 'category_en' => 'Spots',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '1W',
]);
$saved = json_decode(file_get_contents($dataPath), true);
echo "Durum: $status" . PHP_EOL;
echo "Kaydedilen kategori (tr): " . json_encode($saved['DENEME']['category']['tr']) . PHP_EOL;
echo "Beklenen ['Spotlar'] ile ayni mi: " . var_export($saved['DENEME']['category']['tr'] === ['Spotlar'], true) . PHP_EOL;

echo PHP_EOL . "=== Hic var olmayan YENI bir kategori adi yaz ===" . PHP_EOL;
$yeniKategori = 'Akıllı Aydınlatma Sistemleri';
[$status2] = req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile, [
    'model' => 'DENEME', 'name_tr' => 'DENEME Test Ürünü', 'name_en' => 'DENEME Test Product',
    'brand' => 'k2', 'category_tr' => $yeniKategori, 'category_en' => 'Smart Lighting Systems',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '1W',
]);
$saved2 = json_decode(file_get_contents($dataPath), true);
echo "Durum: $status2" . PHP_EOL;
echo "Kaydedilen kategori (tr): " . json_encode($saved2['DENEME']['category']['tr'], JSON_UNESCAPED_UNICODE) . PHP_EOL;
echo "Yeni kategori dogru kaydedildi mi: " . var_export($saved2['DENEME']['category']['tr'] === [$yeniKategori], true) . PHP_EOL;

echo PHP_EOL . "=== Bu yeni kategori artik products.json'da baska urunlerin de secebilecegi bir kategori mi (gercek sitede kategori listesi urunlerden turetiliyor) ===" . PHP_EOL;
$allCategories = [];
foreach ($saved2 as $p) {
    foreach (($p['category']['tr'] ?? []) as $c) {
        $allCategories[$c] = true;
    }
}
echo "Yeni kategori genel listede var mi: " . var_export(isset($allCategories[$yeniKategori]), true) . PHP_EOL;

echo PHP_EOL . "=== Birden fazla kategori (virgulle) ===" . PHP_EOL;
[$status3] = req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile, [
    'model' => 'DENEME', 'name_tr' => 'DENEME Test Ürünü', 'name_en' => 'DENEME Test Product',
    'brand' => 'k2', 'category_tr' => 'Spotlar, LED Paneller, Yeni Kategori X',
    'category_en' => 'Spots, LED Panels, New Category X',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '1W',
]);
$saved3 = json_decode(file_get_contents($dataPath), true);
echo "Durum: $status3" . PHP_EOL;
echo "Kaydedilen kategoriler: " . json_encode($saved3['DENEME']['category']['tr'], JSON_UNESCAPED_UNICODE) . PHP_EOL;
echo "3 kategori de doğru mu: " . var_export(
    $saved3['DENEME']['category']['tr'] === ['Spotlar', 'LED Paneller', 'Yeni Kategori X'],
    true
) . PHP_EOL;

echo PHP_EOL . "=== Temizlik: DENEME'yi sil, gerçek veriyi eski hâline döndür ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile, ['form_action' => 'delete_product']);
$finalContent = file_get_contents($dataPath);
echo "Dosya teste başlamadan önceki hâliyle aynı mı: " . var_export($finalContent === $originalProducts, true) . PHP_EOL;
if ($finalContent !== $originalProducts) {
    echo "⚠️ UYARI: temizlik tam olmadı, orijinal veri elle geri yükleniyor!" . PHP_EOL;
    file_put_contents($dataPath, $originalProducts);
}
