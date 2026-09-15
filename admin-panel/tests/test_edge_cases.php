<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_edge_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/products.json';
$originalProducts = file_get_contents($dataPath);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 0. Geçici test ürünü (DENEME) oluştur ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/product-edit.php', $cookieFile, [
    'model' => 'DENEME', 'name_tr' => 'DENEME Test Ürünü', 'name_en' => 'DENEME Test Product',
    'brand' => 'k2', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '1W',
]);
check('DENEME oluşturuldu', isset(json_decode(file_get_contents($dataPath), true)['DENEME']));

echo PHP_EOL . "=== 1. XSS: isim alanına <script> etiketi ===" . PHP_EOL;
$xssPayload = '<script>alert("XSS")</script>DENEME';
[$status] = req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile, [
    'model' => 'DENEME', 'name_tr' => $xssPayload, 'name_en' => 'DENEME',
    'brand' => 'k2', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => '<img src=x onerror=alert(2)>', 'attr_tr_value[0]' => '1W',
]);
check('Kayıt kabul edildi (302)', $status === 302);

[, $editPage] = req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile);
check('Ham <script> etiketi HTML çıktısında YOK (kaçırılmış)', !str_contains($editPage, '<script>alert("XSS")</script>'));
check('Kaçırılmış hali (&lt;script&gt;) var', str_contains($editPage, '&lt;script&gt;'));
check('Attribute içindeki onerror ham haliyle yok', !str_contains($editPage, '<img src=x onerror=alert(2)>'));

[, $listPage] = req('http://localhost:8899/admin-panel/products.php?q=DENEME', $cookieFile);
check('Ürün listesinde de script kaçırılmış', !str_contains($listPage, '<script>alert("XSS")</script>'));

echo PHP_EOL . "=== 2. Çok uzun metin (10.000 karakter) ===" . PHP_EOL;
$longText = str_repeat('A', 10000);
[$status2] = req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile, [
    'model' => 'DENEME', 'name_tr' => $longText, 'name_en' => 'DENEME',
    'brand' => 'k2', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '1W',
]);
check('Çok uzun metin çökmeden kaydediliyor (302)', $status2 === 302);
$saved = json_decode(file_get_contents($dataPath), true);
check('Uzun metin tam olarak kaydedildi', strlen($saved['DENEME']['name']['tr'] ?? '') === 10000);

echo PHP_EOL . "=== 3. Sahte görsel dosyası (.jpg uzantılı ama aslında metin) ===" . PHP_EOL;
$fakeImage = tempnam(sys_get_temp_dir(), 'fake') . '.jpg';
file_put_contents($fakeImage, 'bu bir resim degil, sadece metin');
[$status3, $body3] = req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile, [
    'model' => 'DENEME', 'name_tr' => 'DENEME', 'name_en' => 'DENEME',
    'brand' => 'k2', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '1W',
    'photo' => new CURLFile($fakeImage, 'image/jpeg', 'sahte.jpg'),
], true);
check('Sahte görsel reddediliyor (200 + hata, çökme yok)', $status3 === 200 && str_contains($body3, 'error-banner'));
unlink($fakeImage);

echo PHP_EOL . "=== 4. SQL/path injection denemesi model alanında ===" . PHP_EOL;
$injectionPayload = "../../../etc/passwd";
[$status4] = req('http://localhost:8899/admin-panel/product-edit.php', $cookieFile, [
    'model' => $injectionPayload, 'name_tr' => 'Injection Test', 'name_en' => 'x',
    'brand' => 'k2', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '1W',
]);
$saved4 = json_decode(file_get_contents($dataPath), true);
$generatedId = null;
foreach ($saved4 as $id => $p) {
    if (($p['name']['tr'] ?? '') === 'Injection Test') { $generatedId = $id; break; }
}
check('Path traversal karakterleri ID üretiminde temizlendi', $generatedId !== null && !str_contains($generatedId, '/') && !str_contains($generatedId, '.'));
echo "  (Üretilen ID: " . ($generatedId ?? 'YOK') . ")" . PHP_EOL;
if ($generatedId) {
    req("http://localhost:8899/admin-panel/product-edit.php?id=$generatedId", $cookieFile, ['form_action' => 'delete_product']);
}

echo PHP_EOL . "=== 5. Emoji ve çok dilli Unicode girişi ===" . PHP_EOL;
$emojiName = 'DENEME 💡 LED Ampul ⚡ 太阳能 مصباح';
[$status5] = req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile, [
    'model' => 'DENEME', 'name_tr' => $emojiName, 'name_en' => 'DENEME',
    'brand' => 'k2', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => 'Renk 🎨', 'attr_tr_value[0]' => '✨ Beyaz',
]);
check('Emoji/çok dilli metinle kayıt başarılı (302)', $status5 === 302);
$saved5 = json_decode(file_get_contents($dataPath), true);
check('Emoji içeren isim tam/bozulmadan kaydedildi', ($saved5['DENEME']['name']['tr'] ?? '') === $emojiName);
check('Emoji içeren özellik değeri tam/bozulmadan kaydedildi', ($saved5['DENEME']['attributes']['tr'][0]['value'] ?? '') === '✨ Beyaz');
[, $editPage5] = req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile);
check('Emoji/Unicode düzenleme sayfasında doğru görüntüleniyor', str_contains($editPage5, $emojiName));

echo PHP_EOL . "=== 6. Temizlik: DENEME'yi sil, gerçek veriyi eski hâline döndür ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/product-edit.php?id=DENEME', $cookieFile, ['form_action' => 'delete_product']);
$finalContent = file_get_contents($dataPath);
check('Dosya byte-byte teste başlamadan önceki hâliyle aynı', $finalContent === $originalProducts);
if ($finalContent !== $originalProducts) {
    echo "⚠️ UYARI: temizlik tam olmadı, orijinal veri elle geri yükleniyor!" . PHP_EOL;
    file_put_contents($dataPath, $originalProducts);
}
@unlink(__DIR__ . '/../../public/images/urunler/deneme.webp');
@unlink(__DIR__ . '/../../public/images/urunler/deneme.jpg');

echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
