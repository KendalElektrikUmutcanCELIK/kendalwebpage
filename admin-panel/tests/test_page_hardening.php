<?php
require __DIR__ . '/../lib/utf8.php';
require __DIR__ . '/../lib/products.php';
require __DIR__ . '/../lib/pages.php';

$pass = 0;
$fail = 0;

function check(string $label, bool $condition): void
{
    global $pass, $fail;
    if ($condition) { echo "  ✓ $label" . PHP_EOL; }
    else { echo "  ✗ BAŞARISIZ: $label" . PHP_EOL; $fail++; return; }
    $pass++;
}

echo "=== 1. Geçerli, tam yapılandırılmış bir sayfa kaydı doğrulamadan geçer ===" . PHP_EOL;
$validPage = [
    'slug' => 'test', 'title' => ['tr' => 'Test', 'en' => 'Test'],
    'metaDescription' => ['tr' => '', 'en' => ''],
    'blocks' => [['id' => 'a1', 'type' => 'heading_text', 'data' => ['heading' => ['tr' => '', 'en' => ''], 'body' => ['tr' => '', 'en' => '']]]],
];
check('Geçerli kayıt hatasız', validate_page_structure($validPage) === null);

echo PHP_EOL . "=== 2. Henüz doldurulmamış (boş alanlı) blok da yapısal olarak geçerli sayılır ===" . PHP_EOL;
$freshBlockPage = [
    'slug' => 'test2', 'title' => ['tr' => 'Test2', 'en' => ''],
    'blocks' => [new_empty_block('text_image'), new_empty_block('cta'), new_empty_block('image_gallery')],
];
check('Yeni eklenmiş, henüz doldurulmamış bloklar da geçerli (render tarafı boşluğa dayanıklı)', validate_page_structure($freshBlockPage) === null);

echo PHP_EOL . "=== 3. Eksik/bozuk kayıtlar reddediliyor ===" . PHP_EOL;
check('Slug eksikse reddediliyor', validate_page_structure(['title' => ['tr' => 'x'], 'blocks' => []]) !== null);
check('Türkçe başlık boşsa reddediliyor', validate_page_structure(['slug' => 's', 'title' => ['tr' => ''], 'blocks' => []]) !== null);
check('blocks dizi değilse reddediliyor', validate_page_structure(['slug' => 's', 'title' => ['tr' => 'x'], 'blocks' => 'not-array']) !== null);
check('Blokta id eksikse reddediliyor', validate_page_structure(['slug' => 's', 'title' => ['tr' => 'x'], 'blocks' => [['type' => 'cta', 'data' => []]]]) !== null);
check('Geçersiz blok tipi reddediliyor', validate_page_structure(['slug' => 's', 'title' => ['tr' => 'x'], 'blocks' => [['id' => 'a', 'type' => 'not_a_real_type', 'data' => []]]]) !== null);
check('Blok data dizi değilse reddediliyor', validate_page_structure(['slug' => 's', 'title' => ['tr' => 'x'], 'blocks' => [['id' => 'a', 'type' => 'cta', 'data' => 'oops']]]) !== null);

echo PHP_EOL . "=== 4. save_pages() bozuk bir kaydı gerçekten reddediyor (dosyaya hiç yazmıyor) ===" . PHP_EOL;
$pagesPath = __DIR__ . '/../../src/data/pages.json';
$original = file_get_contents($pagesPath);
$threw = false;
try {
    save_pages(['bozuk-sayfa' => ['slug' => 'bozuk-sayfa', 'title' => ['tr' => ''], 'blocks' => []]]);
} catch (RuntimeException $e) {
    $threw = true;
}
check('save_pages() RuntimeException fırlattı', $threw);
check('Dosya değişmedi (yazma gerçekleşmedi)', file_get_contents($pagesPath) === $original);

echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
