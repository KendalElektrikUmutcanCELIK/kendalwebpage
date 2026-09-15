<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_news_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$dataPath = __DIR__ . '/../../src/data/news.json';
$original = file_get_contents($dataPath);
$originalData = json_decode($original, true);
$originalCount = count($originalData['tr']);

$testPhotoSource = sys_get_temp_dir() . '/admin_news_test_photo_src.png';
$im = imagecreatetruecolor(200, 150);
imagefill($im, 0, 0, imagecolorallocate($im, 50, 90, 200));
imagepng($im, $testPhotoSource);
imagedestroy($im);

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Liste sayfasi mevcut haberleri gosteriyor ===" . PHP_EOL;
[$status, $body] = req('http://localhost:8899/admin-panel/news.php', $cookieFile);
check('Sayfa 200 donuyor', $status === 200);
check('Mevcut ilk haber basligi listede', str_contains($body, htmlspecialchars($originalData['tr'][0]['title'], ENT_QUOTES, 'UTF-8')));

echo PHP_EOL . "=== 2. Yeni haber olusturma (Turkce/emoji basliklarla) ===" . PHP_EOL;
$titleTr = 'Test Haberi Işıklı 💡';
$dateTr = '01 Ocak 2026';
[$status2] = req('http://localhost:8899/admin-panel/news-edit.php', $cookieFile, [
    'form_action' => 'save_meta',
    'title_tr' => $titleTr, 'date_tr' => $dateTr,
    'title_en' => 'Test News', 'date_en' => 'Jan 01, 2026',
]);
check('Olusturma basarili (302)', $status2 === 302);

$saved = json_decode(file_get_contents($dataPath), true);
check('TR listesine eklendi', count($saved['tr']) === $originalCount + 1);
check('EN listesine eklendi', count($saved['en']) === $originalCount + 1);
$newItem = $saved['tr'][$originalCount];
$newId = $newItem['id'];
check('Turkce/emoji baslik bozulmadan kaydedildi', $newItem['title'] === $titleTr);
check('id otomatik uretildi (sayisal)', preg_match('/^\d+$/', $newId) === 1);

echo PHP_EOL . "=== 3. Galeri gorseli ekleme (TR ve EN'de paylasimli) ===" . PHP_EOL;
[$status3] = req('http://localhost:8899/admin-panel/news-edit.php?id=' . $newId, $cookieFile, [
    'form_action' => 'add_gallery_image',
    'gallery_image' => new CURLFile($testPhotoSource, 'image/png', 'gallery1.png'),
], true);
check('Galeri ekleme basarili (302)', $status3 === 302);
$saved3 = json_decode(file_get_contents($dataPath), true);
$trItem3 = current(array_filter($saved3['tr'], fn ($n) => $n['id'] === $newId));
$enItem3 = current(array_filter($saved3['en'], fn ($n) => $n['id'] === $newId));
check('TR images 1 kayit', count($trItem3['images']) === 1);
check('EN images de ayni (paylasimli)', $enItem3['images'] === $trItem3['images']);
$galleryFile = __DIR__ . '/../../public/images/' . $trItem3['images'][0];
check('Galeri dosyasi gercekten diskte', is_file($galleryFile));

echo PHP_EOL . "=== 4. Metin paragrafi ekleme (TR, Turkce ozel karakterlerle) ===" . PHP_EOL;
$paraText = 'Işıklı test paragrafı: ğüşiöç.';
req('http://localhost:8899/admin-panel/news-edit.php?id=' . $newId, $cookieFile, [
    'form_action' => 'add_paragraph', 'lang' => 'tr', 'paragraph_type' => 'text', 'paragraph_text' => $paraText,
]);
$saved4 = json_decode(file_get_contents($dataPath), true);
$trItem4 = current(array_filter($saved4['tr'], fn ($n) => $n['id'] === $newId));
check('TR content 1 paragraf', count($trItem4['content']) === 1);
check('Paragraf metni bozulmadan kaydedildi', $trItem4['content'][0] === $paraText);

echo PHP_EOL . "=== 5. Gorsel paragrafi ekleme (TR) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/news-edit.php?id=' . $newId, $cookieFile, [
    'form_action' => 'add_paragraph', 'lang' => 'tr', 'paragraph_type' => 'image',
    'paragraph_image' => new CURLFile($testPhotoSource, 'image/png', 'content1.png'),
], true);
$saved5 = json_decode(file_get_contents($dataPath), true);
$trItem5 = current(array_filter($saved5['tr'], fn ($n) => $n['id'] === $newId));
check('TR content 2 paragraf', count($trItem5['content']) === 2);
check('Ikinci paragraf [IMAGE] ile basliyor', str_starts_with($trItem5['content'][1], '[IMAGE]/images/haberler/'));
$contentImagePath = __DIR__ . '/../../public' . substr($trItem5['content'][1], 7);
check('Icerik gorseli gercekten diskte', is_file($contentImagePath));

echo PHP_EOL . "=== 6. EN paragraf tamamen bagimsiz (etkilenmedi) ===" . PHP_EOL;
$enItem6 = current(array_filter($saved5['en'], fn ($n) => $n['id'] === $newId));
check('EN content hala bos', count($enItem6['content']) === 0);

echo PHP_EOL . "=== 7. Paragrafi guncelleme ===" . PHP_EOL;
$updatedText = 'Guncellenmis paragraf metni.';
req('http://localhost:8899/admin-panel/news-edit.php?id=' . $newId, $cookieFile, [
    'form_action' => 'update_paragraph', 'lang' => 'tr', 'index' => '0', 'paragraph_text' => $updatedText,
]);
$saved7 = json_decode(file_get_contents($dataPath), true);
$trItem7 = current(array_filter($saved7['tr'], fn ($n) => $n['id'] === $newId));
check('Paragraf guncellendi', $trItem7['content'][0] === $updatedText);

echo PHP_EOL . "=== 8. Paragraf siralama (yukari tasima) ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/news-edit.php?id=' . $newId, $cookieFile, [
    'form_action' => 'move_paragraph', 'lang' => 'tr', 'index' => '1', 'direction' => 'up',
]);
$saved8 = json_decode(file_get_contents($dataPath), true);
$trItem8 = current(array_filter($saved8['tr'], fn ($n) => $n['id'] === $newId));
check('Gorsel paragraf yukari tasindi (artik index 0)', str_starts_with($trItem8['content'][0], '[IMAGE]'));

echo PHP_EOL . "=== 9. Paragraf silme ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/news-edit.php?id=' . $newId, $cookieFile, [
    'form_action' => 'delete_paragraph', 'lang' => 'tr', 'index' => '0',
]);
$saved9 = json_decode(file_get_contents($dataPath), true);
$trItem9 = current(array_filter($saved9['tr'], fn ($n) => $n['id'] === $newId));
check('Paragraf sayisi 1e dustu', count($trItem9['content']) === 1);

echo PHP_EOL . "=== 10. Galeri gorseli silme ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/news-edit.php?id=' . $newId, $cookieFile, [
    'form_action' => 'remove_gallery_image', 'index' => '0',
]);
$saved10 = json_decode(file_get_contents($dataPath), true);
$trItem10 = current(array_filter($saved10['tr'], fn ($n) => $n['id'] === $newId));
check('Galeri gorseli silindi', count($trItem10['images']) === 0);

echo PHP_EOL . "=== 11. Haberi tamamen silme ===" . PHP_EOL;
req('http://localhost:8899/admin-panel/news-edit.php?id=' . $newId, $cookieFile, [
    'form_action' => 'delete_news',
]);
$saved11 = json_decode(file_get_contents($dataPath), true);
check('TR listesi orijinal sayiya dondu', count($saved11['tr']) === $originalCount);
check('EN listesi orijinal sayiya dondu', count($saved11['en']) === $originalCount);
check('Icerik gorseli klasoru diskten silindi', !is_file($contentImagePath));
check('Gercek ilk haberin galeri gorseli etkilenmedi', is_file(__DIR__ . '/../../public/images/' . $originalData['tr'][0]['images'][0]));

echo PHP_EOL . "=== 12. Temizlik: dosya tam olarak eski haline dondu mu ===" . PHP_EOL;
$finalContent = file_get_contents($dataPath);
check('news.json byte-byte teste baslamadan onceki haliyle ayni', $finalContent === $original);
if ($finalContent !== $original) {
    echo "UYARI: temizlik tam olmadi, orijinal veri elle geri yukleniyor!" . PHP_EOL;
    file_put_contents($dataPath, $original);
}
@unlink($testPhotoSource);

echo PHP_EOL . "=== SONUC: $pass gecti, $fail basarisiz ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
