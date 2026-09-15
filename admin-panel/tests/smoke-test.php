<?php
// Çalıştırma: bkz. admin-panel/README.md ("Yerel test"). Geçici test ürünleri oluşturup
// siler, gerçek src/data/products.json'u testten önceki hâline tam olarak geri döndürür.

declare(strict_types=1);

require __DIR__ . '/_test_helpers.php';

$base = 'http://localhost:8899/admin-panel';
$cookieFile = sys_get_temp_dir() . '/admin_smoke_test_cookies.txt';
@unlink($cookieFile);

$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/products.json';
$originalProducts = file_get_contents($dataPath);

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

echo "=== 3. Yeni test ürünü oluşturma (Türkçe karakterlerle) ===" . PHP_EOL;
$turkishName = 'DENEME Test Ürünü (SMOKE TEST) — ışık rengi değişti';
[$status] = req("$base/product-edit.php", $cookieFile, [
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
$uploadedPath = __DIR__ . '/../../public/images/urunler/deneme.webp';
check('Sıkıştırılmış dosya oluştu', file_exists($uploadedPath));
if (file_exists($uploadedPath)) {
    $info = getimagesize($uploadedPath);
    check('PNG girişi WebP çıkışına çevrildi', $info['mime'] === 'image/webp');
    check('Boyut 800px sınırı içinde', max($info[0], $info[1]) <= 800);
    check('En-boy oranı korundu', round($origInfo[0] / $origInfo[1], 2) === round($info[0] / $info[1], 2));
    check('Dosya boyutu gerçekten küçüldü (en az %80)', filesize($uploadedPath) < filesize($pngSource) * 0.2);
}

echo "=== 5. Yeni ürün ekleme (ikinci bir test ürünü) ===" . PHP_EOL;
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

echo "=== 6. Marka logosu değiştirme (gerçek public/images/brands/'a yazıyor) ===" . PHP_EOL;
// Not: yükleme kaynağı olarak hedef dosyanın KENDİSİ kullanılmıyor — aynı dosyayı hem
// CURLFile ile okuyup hem sunucu tarafında üzerine rename etmeye çalışmak, istemcinin
// tuttuğu okuma kilidiyle Windows'ta geçici bir "Access Denied" çakışmasına yol açıyor
// (gerçek kullanımda admin hep FARKLI bir dosya yükler, bu sadece testin kendi kurgusuyla
// ilgili bir tuzak) — bu yüzden ayrı bir kopya üzerinden yükleniyor.
$logoPath = __DIR__ . '/../../public/images/brands/k2-logo.svg';
$originalLogo = file_get_contents($logoPath);
$logoCopy = tempnam(sys_get_temp_dir(), 'k2logo') . '.svg';
copy($logoPath, $logoCopy);
[$status] = req("$base/brand-logo.php", $cookieFile, [
    'brand' => 'k2', 'logo' => new CURLFile($logoCopy, 'image/svg+xml', 'logo.svg'),
], true);
check('Logo kaydı başarılı (302)', $status === 302);
check('Gerçek logo dosyası hâlâ (aynı içerikle) duruyor', file_get_contents($logoPath) === $originalLogo);
unlink($logoCopy);

$vantiLogoPath = __DIR__ . '/../../public/images/brands/vanti-logo.svg';
$originalVantiLogo = file_get_contents($vantiLogoPath);
$modifiedSvg = str_replace('<svg', '<svg data-smoke-test="1"', $originalVantiLogo);
$modifiedFile = tempnam(sys_get_temp_dir(), 'svgmod') . '.svg';
file_put_contents($modifiedFile, $modifiedSvg);
req("$base/brand-logo.php", $cookieFile, ['brand' => 'vanti', 'logo' => new CURLFile($modifiedFile, 'image/svg+xml', 'v.svg')], true);
check('Değiştirilmiş SVG gerçekten kaydedildi (bağlantı çalışıyor)', file_get_contents($vantiLogoPath) === $modifiedSvg);
file_put_contents($vantiLogoPath, $originalVantiLogo);
check('Vanti logosu tam olarak eski hâline döndürüldü', file_get_contents($vantiLogoPath) === $originalVantiLogo);
unlink($modifiedFile);

$pngLogoFile = __DIR__ . '/../../public/textures/earth-topology.png';
[, $body3b] = req("$base/brand-logo.php", $cookieFile, ['brand' => 'global', 'logo' => new CURLFile($pngLogoFile, 'image/png', 'logo.png')], true);
check('SVG olmayan format (PNG) reddediliyor (site sadece .svg arıyor)', str_contains($body3b, 'Sadece SVG dosyası'));

$fakeFile = tempnam(sys_get_temp_dir(), 'fake') . '.txt';
file_put_contents($fakeFile, 'logo degil');
[, $body3] = req("$base/brand-logo.php", $cookieFile, [
    'brand' => 'vanti', 'logo' => new CURLFile($fakeFile, 'text/plain', 'sahte.txt'),
], true);
check('Geçersiz dosya (.txt) reddediliyor', str_contains($body3, 'error-banner'));
unlink($fakeFile);

echo "=== 7. Gerçek siteye gerçekten yansıyor mu (DENEME artık gerçek products.json'da) ===" . PHP_EOL;
$realData = json_decode(file_get_contents($dataPath), true);
check('DENEME gerçek src/data/products.json içinde görünüyor (bağlantı çalışıyor)', isset($realData['DENEME']));
check('KTEST999 de gerçek dosyada görünüyor', isset($realData['KTEST999']));
check('Gerçek 856 üründen hiçbiri kaybolmadı (858 olmalı: 856 + 2 test)', count($realData) === 858);

echo "=== 8. Test ürünlerini sil, gerçek veriyi tam olarak eski hâline döndür ===" . PHP_EOL;
req("$base/product-edit.php?id=DENEME", $cookieFile, ['form_action' => 'delete_product']);
req("$base/product-edit.php?id=KTEST999", $cookieFile, ['form_action' => 'delete_product']);
$afterCleanup = file_get_contents($dataPath);
check('Silme sonrası dosya TAM OLARAK teste başlamadan önceki hâliyle aynı (byte-byte)', $afterCleanup === $originalProducts);
check('Yüklenen test fotoğrafı da silindi', !file_exists($uploadedPath));

echo "=== 9. Çıkış ===" . PHP_EOL;
req("$base/logout.php", $cookieFile);
[$status] = req("$base/dashboard.php", $cookieFile);
check('Çıkıştan sonra panele erişim engelleniyor (302)', $status === 302);

if ($afterCleanup !== $originalProducts) {
    echo PHP_EOL . "⚠️ UYARI: temizlik tam olmadı, orijinal veri elle geri yükleniyor!" . PHP_EOL;
    file_put_contents($dataPath, $originalProducts);
}

echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
