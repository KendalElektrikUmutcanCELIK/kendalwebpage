<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_page_blocks_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$pagesPath = __DIR__ . '/../../src/data/pages.json';
$originalPages = file_get_contents($pagesPath);
$imagesDir = __DIR__ . '/../../public/images/sayfalar';
$pngSource = __DIR__ . '/../../public/textures/earth-topology.png';

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 0. Test sayfası oluştur ===" . PHP_EOL;
$pageTitle = 'Blok Editörü Test Sayfası — Işıklı Öğe';
req('http://localhost:8899/admin-panel/page-edit.php', $cookieFile, [
    'form_action' => 'save_meta', 'title_tr' => $pageTitle, 'title_en' => 'Block Editor Test Page',
    'meta_tr' => '', 'meta_en' => '',
]);
$saved = json_decode(file_get_contents($pagesPath), true);
$slug = null;
foreach ($saved as $s => $p) {
    if (($p['title']['tr'] ?? '') === $pageTitle) { $slug = $s; break; }
}
check('Test sayfası oluşturuldu', $slug !== null);

echo PHP_EOL . "=== 1. heading_text bloğu ekle + doldur ===" . PHP_EOL;
[$status1] = req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'add_block', 'block_type' => 'heading_text',
]);
check('Blok ekleme başarılı (302)', $status1 === 302);
$saved1 = json_decode(file_get_contents($pagesPath), true);
check('Blok listeye eklendi', count($saved1[$slug]['blocks'] ?? []) === 1);
$blockId1 = $saved1[$slug]['blocks'][0]['id'];

$headingText = 'Başlık: ışıklı öğeler ✨';
[$status1b] = req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'update_block', 'block_id' => $blockId1, 'block_type' => 'heading_text',
    'heading_tr' => $headingText, 'heading_en' => 'Heading', 'body_tr' => 'Gövde metni', 'body_en' => 'Body text',
]);
check('Blok içeriği kaydedildi (302)', $status1b === 302);
$saved1b = json_decode(file_get_contents($pagesPath), true);
check('Türkçe/emoji başlık doğru kaydedildi', ($saved1b[$slug]['blocks'][0]['data']['heading']['tr'] ?? '') === $headingText);

echo PHP_EOL . "=== 2. text_image bloğu ekle + fotoğraf yükle ===" . PHP_EOL;
req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'add_block', 'block_type' => 'text_image',
]);
$saved2 = json_decode(file_get_contents($pagesPath), true);
$blockId2 = $saved2[$slug]['blocks'][1]['id'];

[$status2, $body2] = req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'update_block', 'block_id' => $blockId2, 'block_type' => 'text_image',
    'heading_tr' => 'Görsel Başlığı', 'heading_en' => 'Image Heading',
    'text_tr' => 'Görsel açıklaması', 'text_en' => 'Image text',
    'image_position' => 'left', 'image_alt_tr' => 'Alt TR', 'image_alt_en' => 'Alt EN',
    'block_image' => new CURLFile($pngSource, 'image/png', 'test.png'),
], true);
check('Fotoğraflı blok kaydı başarılı (302, gövde: ' . $status2 . ')', $status2 === 302);
$saved2b = json_decode(file_get_contents($pagesPath), true);
$imagePath = $saved2b[$slug]['blocks'][1]['data']['image'] ?? '';
check('Görsel yolu kaydedildi', $imagePath !== '');
check('Görsel gerçekten diskte oluştu', $imagePath !== '' && file_exists(__DIR__ . '/../../public/images/' . $imagePath));
check('imagePosition doğru kaydedildi', ($saved2b[$slug]['blocks'][1]['data']['imagePosition'] ?? '') === 'left');

echo PHP_EOL . "=== 3. cta bloğu ekle + geçersiz URL reddi ===" . PHP_EOL;
req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'add_block', 'block_type' => 'cta',
]);
$saved3 = json_decode(file_get_contents($pagesPath), true);
$blockId3 = $saved3[$slug]['blocks'][2]['id'];

[, $badCtaBody] = req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'update_block', 'block_id' => $blockId3, 'block_type' => 'cta',
    'button_label_tr' => 'Tıkla', 'button_label_en' => 'Click', 'button_url' => 'javascript:alert(1)',
]);
check('Geçersiz protokol reddediliyor', str_contains($badCtaBody, 'error-banner'));

[$status3] = req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'update_block', 'block_id' => $blockId3, 'block_type' => 'cta',
    'button_label_tr' => 'İletişime Geç', 'button_label_en' => 'Contact', 'button_url' => '/iletisim',
]);
check('Geçerli CTA kaydı başarılı (302)', $status3 === 302);
$saved3b = json_decode(file_get_contents($pagesPath), true);
check('CTA buton metni doğru kaydedildi', ($saved3b[$slug]['blocks'][2]['data']['buttonLabel']['tr'] ?? '') === 'İletişime Geç');

echo PHP_EOL . "=== 4. image_gallery bloğu ekle + 2 görsel ekle + 1 sil ===" . PHP_EOL;
req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'add_block', 'block_type' => 'image_gallery',
]);
$saved4 = json_decode(file_get_contents($pagesPath), true);
$blockId4 = $saved4[$slug]['blocks'][3]['id'];

req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'add_gallery_image', 'block_id' => $blockId4,
    'gallery_alt_tr' => 'Birinci', 'gallery_alt_en' => 'First',
    'gallery_image' => new CURLFile($pngSource, 'image/png', 'g1.png'),
], true);
req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'add_gallery_image', 'block_id' => $blockId4,
    'gallery_alt_tr' => 'İkinci', 'gallery_alt_en' => 'Second',
    'gallery_image' => new CURLFile($pngSource, 'image/png', 'g2.png'),
], true);
$saved4b = json_decode(file_get_contents($pagesPath), true);
check('2 görsel galeriye eklendi', count($saved4b[$slug]['blocks'][3]['data']['images'] ?? []) === 2);
check('İkinci görselin alt metni doğru (Türkçe)', ($saved4b[$slug]['blocks'][3]['data']['images'][1]['alt']['tr'] ?? '') === 'İkinci');

req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'remove_gallery_image', 'block_id' => $blockId4, 'image_index' => '0',
]);
$saved4c = json_decode(file_get_contents($pagesPath), true);
check('1 görsel silindikten sonra 1 kaldı', count($saved4c[$slug]['blocks'][3]['data']['images'] ?? []) === 1);
check('Kalan görsel doğru olan (İkinci)', ($saved4c[$slug]['blocks'][3]['data']['images'][0]['alt']['tr'] ?? '') === 'İkinci');

echo PHP_EOL . "=== 5. Blok sıralama (yukarı/aşağı taşıma) ===" . PHP_EOL;
req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'move_block', 'block_id' => $blockId4, 'direction' => 'up',
]);
$saved5 = json_decode(file_get_contents($pagesPath), true);
$order5 = array_column($saved5[$slug]['blocks'], 'id');
check('4. blok bir yukarı taşındı (artık 3. sırada)', $order5[2] === $blockId4);
check('Yer değiştirdiği blok (cta) şimdi 4. sırada', $order5[3] === $blockId3);

echo PHP_EOL . "=== 6. Blok silme ===" . PHP_EOL;
req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'delete_block', 'block_id' => $blockId1,
]);
$saved6 = json_decode(file_get_contents($pagesPath), true);
check('Blok silindikten sonra 3 blok kaldı', count($saved6[$slug]['blocks'] ?? []) === 3);
check('Silinen blok artık listede yok', find_deleted_block($saved6[$slug]['blocks'], $blockId1) === false);

function find_deleted_block(array $blocks, string $id): bool
{
    foreach ($blocks as $b) {
        if ($b['id'] === $id) { return true; }
    }
    return false;
}

echo PHP_EOL . "=== 7. Zorunlu alan eksikse blok kaydı reddediliyor ===" . PHP_EOL;
[, $emptyCtaBody] = req("http://localhost:8899/admin-panel/page-edit.php?slug=$slug", $cookieFile, [
    'form_action' => 'update_block', 'block_id' => $blockId3, 'block_type' => 'cta',
    'button_label_tr' => '', 'button_url' => '',
]);
check('Boş buton metni reddediliyor', str_contains($emptyCtaBody, 'error-banner'));

echo PHP_EOL . "--- Temizlik ---" . PHP_EOL;
file_put_contents($pagesPath, $originalPages);
foreach (glob($imagesDir . '/' . $slug . '-*') as $f) {
    @unlink($f);
}
echo "pages.json orijinaline döndürüldü, test görselleri silindi." . PHP_EOL;

echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
