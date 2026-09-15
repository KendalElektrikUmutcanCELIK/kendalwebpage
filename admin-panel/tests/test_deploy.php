<?php
require __DIR__ . '/_test_helpers.php';
require __DIR__ . '/../config.php';
require __DIR__ . '/../lib/github_deploy.php';

$pass = 0;
$fail = 0;

echo "=== 1. Saf fonksiyon testleri (ağ erişimi yok) ===" . PHP_EOL;
check('Yol kodlama "/" karakterlerini koruyor', github_url_encode_path('src/data/settings.json') === 'src/data/settings.json');
check('Yol kodlama Türkçe/özel karakterleri kodluyor', github_url_encode_path('src/data/ö dosya.json') === 'src/data/%C3%B6%20dosya.json');

$cookieFile = sys_get_temp_dir() . '/admin_deploy_test_cookies.txt';
@unlink($cookieFile);
[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

if (github_deploy_configured()) {
    echo PHP_EOL . "=== 2. Yapılandırılmış durumda davranış (bu makinede GITHUB_TOKEN dolu) ===" . PHP_EOL;
    check('GITHUB_TOKEN dolu', GITHUB_TOKEN !== '');
    check('GITHUB_REPO dolu', GITHUB_REPO !== '');
    check('github_deploy_configured() true döndürüyor', github_deploy_configured() === true);

    [$status, $body] = req('http://localhost:8899/admin-panel/deploy.php', $cookieFile);
    check('Yayınla sayfası 200 dönüyor', $status === 200);
    check('"Henüz kurulmadı" mesajı ARTIK gösterilmiyor', !str_contains($body, 'henüz kurulmadı'));
    check('"Şimdi Yayınla" butonu gösteriliyor', str_contains($body, 'Şimdi Yayınla'));
} else {
    echo PHP_EOL . "=== 2. Kurulmamış durumda güvenli davranış (bu makinede config.php boş) ===" . PHP_EOL;
    check('GITHUB_TOKEN boş', GITHUB_TOKEN === '');
    check('github_deploy_configured() false döndürüyor', github_deploy_configured() === false);

    $start = microtime(true);
    $result = github_push_file('src/data/test.json', '{}', 'test commit');
    $elapsedMs = (microtime(true) - $start) * 1000;
    check('Kurulmamışken github_push_file() HİÇ ağ isteği atmadan anında hata döndürüyor', $result['ok'] === false && $elapsedMs < 500);
    check('Hata mesajı anlaşılır', str_contains($result['error'], 'GitHub bağlantısı henüz kurulmadı'));

    [$status, $body] = req('http://localhost:8899/admin-panel/deploy.php', $cookieFile);
    check('Yayınla sayfası 200 dönüyor (çökmedi)', $status === 200);
    check('"Henüz kurulmadı" mesajı gösteriliyor', str_contains($body, 'henüz kurulmadı'));
    check('Yapılandırılmamışken "Şimdi Yayınla" butonu gösterilmiyor', !str_contains($body, 'Şimdi Yayınla'));
}

echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
