<?php
require __DIR__ . '/_test_helpers.php';
require __DIR__ . '/../config.php';
require __DIR__ . '/../lib/github_deploy.php';

$pass = 0;
$fail = 0;

echo "=== 1. Saf fonksiyon testleri (ağ erişimi yok) ===" . PHP_EOL;
check('Yol kodlama "/" karakterlerini koruyor', github_url_encode_path('src/data/settings.json') === 'src/data/settings.json');
check('Yol kodlama Türkçe/özel karakterleri kodluyor', github_url_encode_path('src/data/ö dosya.json') === 'src/data/%C3%B6%20dosya.json');

echo PHP_EOL . "=== 2. Kurulmamış durumda güvenli davranış (şu anki gerçek durum: config.php boş) ===" . PHP_EOL;
check('GITHUB_TOKEN şu an boş (henüz kurulmadı)', GITHUB_TOKEN === '');
check('github_deploy_configured() false döndürüyor', github_deploy_configured() === false);

$start = microtime(true);
$result = github_push_file('src/data/test.json', '{}', 'test commit');
$elapsedMs = (microtime(true) - $start) * 1000;
check('Kurulmamışken github_push_file() HİÇ ağ isteği atmadan anında hata döndürüyor', $result['ok'] === false && $elapsedMs < 500);
check('Hata mesajı anlaşılır', str_contains($result['error'], 'GitHub bağlantısı henüz kurulmadı'));

echo PHP_EOL . "=== 3. deploy.php sayfası kurulmamışken çökmeden doğru mesajı gösteriyor ===" . PHP_EOL;
$cookieFile = sys_get_temp_dir() . '/admin_deploy_test_cookies.txt';
@unlink($cookieFile);
[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

[$status, $body] = req('http://localhost:8899/admin-panel/deploy.php', $cookieFile);
check('Yayınla sayfası 200 dönüyor (çökmedi)', $status === 200);
check('"Henüz kurulmadı" mesajı gösteriliyor', str_contains($body, 'henüz kurulmadı'));
check('Yapılandırılmamışken "Şimdi Yayınla" butonu gösterilmiyor', !str_contains($body, 'Şimdi Yayınla'));

echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
