<?php
// Çalıştırma: bkz. admin-panel/README.md ("Yerel test"). DENEME fixture'ı üzerinde çalışır, gerçek ürünlere dokunmaz.

declare(strict_types=1);

require __DIR__ . '/_test_helpers.php';

$base = 'http://localhost:8899/admin-panel';
$cookieFile = sys_get_temp_dir() . '/admin_smoke_test_cookies.txt';
@unlink($cookieFile);

$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../data/products.json';

$products = json_decode(file_get_contents($dataPath), true);
if (!isset($products['DENEME'])) {
    $products['DENEME'] = [
        'id' => 'DENEME', 'model' => 'DENEME', 'image' => 'urunler/deneme.webp',
        'name' => ['tr' => 'DENEME Test Ürünü', 'en' => 'DENEME Test Product'],
        'attributes' => ['tr' => [['label' => 'Watt', 'value' => '1W']], 'en' => [['label' => 'Watt', 'value' => '1W']]],
        'category' => ['tr' => ['Test'], 'en' => ['Test']],
        'brand' => 'k2',
    ];
    file_put_contents($dataPath, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}

echo "=== 1. Giriş ===" . PHP_EOL;
[, $loginPage] = req("$base/login.php", $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
[$status] = req("$base/login.php", $cookieFile, ['csrf_token' => $m[1] ?? '', 'password' => 'degistir123']);
check('Doğru şifreyle giriş (302)', $status === 302);

[$status] = req("$base/dashboard.php", $cookieFile);
check('Girişten sonra panele erişim (200)', $status === 200);

echo "=== 2. Ürün listesi ===" . PHP_EOL;
[$status, $body] = req("$base/products.php", $cookieFile);
check('Ürün listesi yükleniyor (200)', $status === 200);
check('Ürün kartları görünüyor', str_contains($body, 'product-card'));

echo "=== 3. Ürün adı + teknik özellik değiştirme (DENEME üzerinde, Türkçe karakterlerle) ===" . PHP_EOL;
$turkishName = 'DENEME Test Ürünü (SMOKE TEST) — ışık rengi değişti';
[$status] = req("$base/product-edit.php?id=DENEME", $cookieFile, [
    'model' => 'DENEME', 'name_tr' => $turkishName, 'name_en' => 'DENEME Test Product',
    'brand' => 'k2', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label' => ['Watt', 'Renk'], 'attr_tr_value' => ['9W', 'Beyaz/Sarı'],
]);
check('Kayıt başarılı (302)', $status === 302);
$saved = json_decode(file_get_contents($dataPath), true);
check('Türkçe isim doğru kaydedildi', ($saved['DENEME']['name']['tr'] ?? '') === $turkishName);
check('Özellik değeri doğru kaydedildi', ($saved['DENEME']['attributes']['tr'][1]['value'] ?? '') === 'Beyaz/Sarı');

echo "=== 4. Fotoğraf yükleme + otomatik sıkıştırma (DENEME üzerinde, gerçek bir PNG ile) ===" . PHP_EOL;
$pngSource = __DIR__ . '/../../public/textures/earth-topology.png';
$origInfo = getimagesize($pngSource);
[$status] = req("$base/product-edit.php?id=DENEME", $cookieFile, [
    'model' => 'DENEME', 'name_tr' => $turkishName, 'name_en' => 'x', 'brand' => 'k2',
    'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '9W',
    'photo' => new CURLFile($pngSource, 'image/png', 'test-buyuk.png'),
], true);
check('Fotoğraflı kayıt başarılı (302)', $status === 302);
$uploadedPath = __DIR__ . '/../data/uploads/urunler/deneme.webp';
check('Sıkıştırılmış dosya oluştu', file_exists($uploadedPath));
if (file_exists($uploadedPath)) {
    $info = getimagesize($uploadedPath);
    check('PNG girişi WebP çıkışına çevrildi', $info['mime'] === 'image/webp');
    check('Boyut 800px sınırı içinde', max($info[0], $info[1]) <= 800);
    check('En-boy oranı korundu', round($origInfo[0] / $origInfo[1], 2) === round($info[0] / $info[1], 2));
    check('Dosya boyutu gerçekten küçüldü (en az %80)', filesize($uploadedPath) < filesize($pngSource) * 0.2);
}

echo "=== 5. Yeni ürün ekleme ===" . PHP_EOL;
$newProductPost = [
    'model' => 'KTEST999', 'name_tr' => 'KTEST999 Smoke Test Ürünü', 'name_en' => 'KTEST999 Smoke Test',
    'brand' => 'vanti', 'category_tr' => 'Test', 'category_en' => 'Test',
    'attr_tr_label[0]' => 'Watt', 'attr_tr_value[0]' => '5W',
];
[$status] = req("$base/product-edit.php", $cookieFile, $newProductPost, true);
check('Yeni ürün kaydı başarılı (302)', $status === 302);
$saved = json_decode(file_get_contents($dataPath), true);
check('Yeni ürün veri dosyasında görünüyor', isset($saved['KTEST999']));

[$status2, $body2] = req("$base/product-edit.php", $cookieFile, $newProductPost, true);
check('Aynı model tekrar eklenince reddediliyor', $status2 === 200 && str_contains($body2, 'zaten bir ürün var'));

echo "=== 6. Marka logosu değiştirme ===" . PHP_EOL;
$sourceLogo = __DIR__ . '/../../public/images/brands/k2-logo.svg';
[$status] = req("$base/brand-logo.php", $cookieFile, [
    'brand' => 'k2', 'logo' => new CURLFile($sourceLogo, 'image/svg+xml', 'logo.svg'),
], true);
check('Logo kaydı başarılı (302)', $status === 302);
check('Logo dosyası oluştu', file_exists(__DIR__ . '/../data/uploads/brands/k2-logo.svg'));

$fakeFile = tempnam(sys_get_temp_dir(), 'fake') . '.txt';
file_put_contents($fakeFile, 'logo degil');
[, $body3] = req("$base/brand-logo.php", $cookieFile, [
    'brand' => 'vanti', 'logo' => new CURLFile($fakeFile, 'text/plain', 'sahte.txt'),
], true);
check('Geçersiz dosya (.txt) reddediliyor', str_contains($body3, 'error-banner'));
unlink($fakeFile);

echo "=== 7. Gerçek site verisi dokunulmamış mı ===" . PHP_EOL;
$realData = json_decode(file_get_contents(__DIR__ . '/../../src/data/products.json'), true);
check('src/data/products.json içinde KTEST999 YOK (izolasyon çalışıyor)', !isset($realData['KTEST999']));
check('src/data/products.json içinde DENEME YOK (izolasyon çalışıyor)', !isset($realData['DENEME']));
check('Gerçek ürün verisinde SMOKE TEST metni yok', !str_contains(json_encode($realData), 'SMOKE TEST'));

echo "=== 8. Çıkış ===" . PHP_EOL;
req("$base/logout.php", $cookieFile);
[$status] = req("$base/dashboard.php", $cookieFile);
check('Çıkıştan sonra panele erişim engelleniyor (302)', $status === 302);

echo PHP_EOL . "--- Temizlik: geçici test verilerini sil (DENEME kalıcı fixture olarak kalır) ---" . PHP_EOL;
$products = json_decode(file_get_contents($dataPath), true);
unset($products['KTEST999']);
file_put_contents($dataPath, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
@unlink(__DIR__ . '/../data/uploads/urunler/deneme.webp');
@unlink(__DIR__ . '/../data/uploads/brands/k2-logo.svg');
echo "Temizlendi." . PHP_EOL;

echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
