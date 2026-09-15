<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_pages_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$pagesPath = __DIR__ . '/../../src/data/pages.json';
$originalPages = file_get_contents($pagesPath);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Sayfa listesi (boşken) ===" . PHP_EOL;
[$status, $body] = req('http://localhost:8899/admin-panel/pages.php', $cookieFile);
check('Sayfa listesi yükleniyor (200)', $status === 200);
check('Boş liste mesajı görünüyor', str_contains($body, 'Henüz hiç sayfa yok'));

echo PHP_EOL . "=== 2. Yeni sayfa oluşturma (Türkçe karakterlerle) ===" . PHP_EOL;
$pageTitle = 'Özel Kampanya Sayfası — Işıklı Öğe Testi';
[$status2] = req('http://localhost:8899/admin-panel/page-edit.php', $cookieFile, [
    'title_tr' => $pageTitle, 'title_en' => 'Special Campaign Page',
    'meta_tr' => 'Test açıklaması', 'meta_en' => 'Test description',
]);
check('Kayıt başarılı (302)', $status2 === 302);

$saved = json_decode(file_get_contents($pagesPath), true);
$generatedSlug = null;
foreach ($saved as $slug => $p) {
    if (($p['title']['tr'] ?? '') === $pageTitle) { $generatedSlug = $slug; break; }
}
check('Slug otomatik üretildi', $generatedSlug !== null);
check('Slug beklenen formatta (kucuk harf, tire)', $generatedSlug !== null && preg_match('/^[a-z0-9-]+$/', $generatedSlug) === 1);
check('Türkçe başlık bozulmadan kaydedildi', $generatedSlug !== null && ($saved[$generatedSlug]['title']['tr'] ?? '') === $pageTitle);
check('İngilizce başlık kaydedildi', $generatedSlug !== null && ($saved[$generatedSlug]['title']['en'] ?? '') === 'Special Campaign Page');
check('Yeni sayfa boş blok dizisiyle başlıyor', $generatedSlug !== null && ($saved[$generatedSlug]['blocks'] ?? null) === []);

echo PHP_EOL . "=== 3. Aynı başlıkla ikinci sayfa (slug çakışması -2 ile çözülmeli) ===" . PHP_EOL;
[$status3] = req('http://localhost:8899/admin-panel/page-edit.php', $cookieFile, [
    'title_tr' => $pageTitle, 'title_en' => '', 'meta_tr' => '', 'meta_en' => '',
]);
check('İkinci kayıt da başarılı (302)', $status3 === 302);
$saved3 = json_decode(file_get_contents($pagesPath), true);
check('İkinci sayfa için farklı bir slug üretildi (-2 ekli)', isset($saved3[$generatedSlug . '-2']));

echo PHP_EOL . "=== 4. Mevcut sayfayı düzenleme (slug değişmiyor) ===" . PHP_EOL;
[$status4] = req("http://localhost:8899/admin-panel/page-edit.php?slug=$generatedSlug", $cookieFile, [
    'title_tr' => $pageTitle . ' (güncellendi)', 'title_en' => 'Special Campaign Page (updated)',
    'meta_tr' => '', 'meta_en' => '',
]);
check('Güncelleme başarılı (302)', $status4 === 302);
$saved4 = json_decode(file_get_contents($pagesPath), true);
check('Slug aynı kaldı', isset($saved4[$generatedSlug]));
check('Başlık güncellendi', ($saved4[$generatedSlug]['title']['tr'] ?? '') === $pageTitle . ' (güncellendi)');

echo PHP_EOL . "=== 5. Sayfa listesinde arama ===" . PHP_EOL;
[, $searchBody] = req('http://localhost:8899/admin-panel/pages.php?q=' . urlencode('kampanya'), $cookieFile);
check('Arama sonucu güncellenmiş başlığı içeriyor', str_contains($searchBody, 'güncellendi'));

echo PHP_EOL . "=== 6. Boş başlıkla kayıt reddediliyor ===" . PHP_EOL;
[, $emptyBody] = req('http://localhost:8899/admin-panel/page-edit.php', $cookieFile, [
    'title_tr' => '', 'title_en' => '', 'meta_tr' => '', 'meta_en' => '',
]);
check('Boş başlık reddediliyor', str_contains($emptyBody, 'error-banner'));

echo PHP_EOL . "=== 7. Sayfa silme ===" . PHP_EOL;
[$statusDel, , $redirectDel] = req("http://localhost:8899/admin-panel/page-edit.php?slug=$generatedSlug", $cookieFile, [
    'form_action' => 'delete_page',
]);
check('Silme sonrası yönlendirme (302)', $statusDel === 302);
check('Yönlendirme pages.php?deleted=1 adresine', str_contains((string) $redirectDel, 'pages.php?deleted=1'));
$savedAfterDelete = json_decode(file_get_contents($pagesPath), true);
check('Silinen sayfa artık pages.json içinde yok', !isset($savedAfterDelete[$generatedSlug]));
check('Diğer sayfa (ikinci) hâlâ duruyor', isset($savedAfterDelete[$generatedSlug . '-2']));

[, $deletedListBody] = req('http://localhost:8899/admin-panel/pages.php?deleted=1', $cookieFile);
check('Sayfa listesinde "silindi" bildirimi görünüyor', str_contains($deletedListBody, 'Sayfa silindi'));

file_put_contents($pagesPath, $originalPages);
echo PHP_EOL . "Temizlendi: pages.json orijinal haline döndürüldü." . PHP_EOL;

echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
