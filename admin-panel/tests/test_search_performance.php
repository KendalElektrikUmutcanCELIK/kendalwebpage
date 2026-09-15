<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_perf_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

$SLOW_MS = 3000; // yerel PHP dahili sunucusu için gevşek bir üst sınır

function timed_req(string $url, string $cookieFile): array
{
    $start = microtime(true);
    [$status, $body] = req($url, $cookieFile);
    $ms = (microtime(true) - $start) * 1000;
    return [$status, $body, $ms];
}

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

echo "=== 1. Ürün listesi/arama performansı (gerçek 856 ürünlük izole kopya üzerinde) ===" . PHP_EOL;
[$s1, , $t1] = timed_req('http://localhost:8899/admin-panel/products.php', $cookieFile);
echo "  Tüm liste (filtresiz): {$t1} ms" . PHP_EOL;
check('Filtresiz liste 200 döndü', $s1 === 200);
check("Filtresiz liste {$SLOW_MS}ms altında", $t1 < $SLOW_MS);

[$s2, , $t2] = timed_req('http://localhost:8899/admin-panel/products.php?q=' . urlencode('led'), $cookieFile);
echo "  \"led\" araması (çok sonuçlu): {$t2} ms" . PHP_EOL;
check('"led" araması 200 döndü', $s2 === 200);
check("\"led\" araması {$SLOW_MS}ms altında", $t2 < $SLOW_MS);

[$s3, , $t3] = timed_req('http://localhost:8899/admin-panel/products.php?brand=k2&q=' . urlencode('xyzxyz-yok'), $cookieFile);
echo "  Marka+sıfır-sonuç araması: {$t3} ms" . PHP_EOL;
check('Sıfır sonuçlu arama 200 döndü', $s3 === 200);
check("Sıfır sonuçlu arama {$SLOW_MS}ms altında", $t3 < $SLOW_MS);

echo PHP_EOL . "=== 2. Sayfa listesi/arama performansı (1000 sentetik sayfayla) ===" . PHP_EOL;
$pagesPath = __DIR__ . '/../../src/data/pages.json';
$originalPages = file_get_contents($pagesPath);

$synthetic = [];
$cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Gaziantep'];
for ($i = 0; $i < 1000; $i++) {
    $city = $cities[$i % count($cities)];
    $slug = 'perf-test-sayfa-' . $i;
    $synthetic[$slug] = [
        'slug' => $slug,
        'title' => ['tr' => "$city Bölge Kampanyası $i", 'en' => "$city Regional Campaign $i"],
        'metaDescription' => ['tr' => '', 'en' => ''],
        'blocks' => [],
    ];
}
file_put_contents($pagesPath, json_encode($synthetic, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

[$s4, , $t4] = timed_req('http://localhost:8899/admin-panel/pages.php', $cookieFile);
echo "  1000 sayfalık liste (filtresiz): {$t4} ms" . PHP_EOL;
check('1000 sayfalık liste 200 döndü', $s4 === 200);
check("1000 sayfalık liste {$SLOW_MS}ms altında", $t4 < $SLOW_MS);

[$s5, $body5, $t5] = timed_req('http://localhost:8899/admin-panel/pages.php?q=' . urlencode('İstanbul'), $cookieFile);
echo "  \"İstanbul\" araması (Türkçe karakterli, ~125 sonuç): {$t5} ms" . PHP_EOL;
check('Türkçe karakterli arama 200 döndü', $s5 === 200);
check("Türkçe karakterli arama {$SLOW_MS}ms altında", $t5 < $SLOW_MS);
check('Arama gerçekten sonuç buluyor (en az bir İstanbul kaydı görünüyor)', str_contains($body5, 'İstanbul Bölge Kampanyası'));
check('Arama alakasız şehri filtrelemiş (Ankara görünmüyor)', !str_contains($body5, 'Ankara Bölge Kampanyası'));

file_put_contents($pagesPath, $originalPages);
echo PHP_EOL . "Temizlendi: pages.json orijinal haline (" . strlen($originalPages) . " byte) döndürüldü." . PHP_EOL;

echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
