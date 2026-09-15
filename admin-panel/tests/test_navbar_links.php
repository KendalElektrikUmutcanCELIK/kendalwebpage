<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_navbar_links_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/navLinks.json';
$original = file_get_contents($dataPath);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Boş listede sayfa doğru yükleniyor ===" . PHP_EOL;
[$status, $body] = req('http://localhost:8899/admin-panel/navbar-links.php', $cookieFile);
check('Sayfa 200 dönüyor', $status === 200);
check('Boş liste mesajı görünüyor', str_contains($body, 'Henüz hiç navbar linki yok'));

echo PHP_EOL . "=== 2. Yeni link ekleme (Türkçe/emoji karakterlerle) ===" . PHP_EOL;
$labelTr = 'Özel Kampanya 🎉';
[$status2] = req('http://localhost:8899/admin-panel/navbar-links.php', $cookieFile, [
    'form_action' => 'add_link', 'label_tr' => $labelTr, 'label_en' => 'Special Campaign', 'url' => '/ozel-kampanya',
]);
check('Ekleme başarılı (302)', $status2 === 302);
$saved = json_decode(file_get_contents($dataPath), true);
check('Link gerçek navLinks.json\'a eklendi', count($saved) === 1);
check('Türkçe/emoji başlık bozulmadan kaydedildi', ($saved[0]['label']['tr'] ?? '') === $labelTr);
check('URL doğru kaydedildi', ($saved[0]['url'] ?? '') === '/ozel-kampanya');
$firstId = $saved[0]['id'];

echo PHP_EOL . "=== 3. Geçersiz adres (protokol yok, / ile başlamıyor) reddediliyor ===" . PHP_EOL;
[, $body3] = req('http://localhost:8899/admin-panel/navbar-links.php', $cookieFile, [
    'form_action' => 'add_link', 'label_tr' => 'Kötü Link', 'label_en' => '', 'url' => 'javascript:alert(1)',
]);
check('Geçersiz adres reddediliyor', str_contains($body3, 'error-banner'));

echo PHP_EOL . "=== 4. İkinci link ekle, sıralama testi ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/navbar-links.php', $cookieFile, [
    'form_action' => 'add_link', 'label_tr' => 'İkinci Link', 'label_en' => 'Second Link', 'url' => '/iletisim',
]);
$saved4 = json_decode(file_get_contents($dataPath), true);
check('İkinci link eklendi, toplam 2', count($saved4) === 2);
$secondId = $saved4[1]['id'];

req('http://localhost:8899/admin-panel/navbar-links.php', $cookieFile, [
    'form_action' => 'move_link', 'id' => $secondId, 'direction' => 'up',
]);
$saved5 = json_decode(file_get_contents($dataPath), true);
check('İkinci link yukarı taşındı, artık ilk sırada', $saved5[0]['id'] === $secondId);
check('İlk link şimdi ikinci sırada', $saved5[1]['id'] === $firstId);

echo PHP_EOL . "=== 5. Silme ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/navbar-links.php', $cookieFile, [
    'form_action' => 'delete_link', 'id' => $secondId,
]);
$saved6 = json_decode(file_get_contents($dataPath), true);
check('Bir link silindikten sonra 1 kaldı', count($saved6) === 1);
check('Kalan link doğru olan', $saved6[0]['id'] === $firstId);

req('http://localhost:8899/admin-panel/navbar-links.php', $cookieFile, [
    'form_action' => 'delete_link', 'id' => $firstId,
]);

echo PHP_EOL . "=== 6. Temizlik: dosya tam olarak eski hâline döndü mü ===" . PHP_EOL;
$finalContent = file_get_contents($dataPath);
check('navLinks.json byte-byte teste başlamadan önceki hâliyle aynı', $finalContent === $original);
if ($finalContent !== $original) {
    echo "⚠️ UYARI: temizlik tam olmadı, orijinal veri elle geri yükleniyor!" . PHP_EOL;
    file_put_contents($dataPath, $original);
}

echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
