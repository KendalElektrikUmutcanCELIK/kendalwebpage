<?php
require __DIR__ . '/_test_helpers.php';

$cookieFile = sys_get_temp_dir() . '/admin_settings_test_cookies.txt';
@unlink($cookieFile);
$pass = 0;
$fail = 0;

[, $loginPage] = req('http://localhost:8899/admin-panel/login.php', $cookieFile);
preg_match('/name="csrf_token" value="([^"]+)"/', $loginPage, $m);
req('http://localhost:8899/admin-panel/login.php', $cookieFile, ['csrf_token' => $m[1], 'password' => 'degistir123']);

$settingsPath = __DIR__ . '/../../src/data/settings.json';
$original = file_get_contents($settingsPath);

[$status] = req('http://localhost:8899/admin-panel/settings.php', $cookieFile);
check('Ayarlar sayfası yükleniyor (200)', $status === 200);

$newPhone = '0212 999 99 99 (TEST)';
[$status2] = req('http://localhost:8899/admin-panel/settings.php', $cookieFile, [
    'tr_address' => 'Test Adres TR', 'tr_phone' => $newPhone, 'tr_sales_phone' => '', 'tr_support_phone' => '',
    'en_address' => 'Test Address EN', 'en_phone' => '+90 212 999 99 99', 'en_sales_phone' => '', 'en_support_phone' => '',
    'email' => 'test@example.com', 'facebook_url' => '', 'linkedin_url' => '', 'instagram_url' => '',
]);
check('Ayarlar kaydediliyor (302)', $status2 === 302);

$saved = json_decode(file_get_contents($settingsPath), true);
check('Kaydedilen TR telefon doğru', ($saved['tr']['phone'] ?? '') === $newPhone);
check('Kaydedilen EN adres doğru', ($saved['en']['address'] ?? '') === 'Test Address EN');

[, $body3] = req('http://localhost:8899/admin-panel/settings.php', $cookieFile, [
    'tr_address' => '', 'tr_phone' => '', 'tr_sales_phone' => '', 'tr_support_phone' => '',
    'en_address' => '', 'en_phone' => '', 'en_sales_phone' => '', 'en_support_phone' => '',
    'email' => '', 'facebook_url' => '', 'linkedin_url' => '', 'instagram_url' => '',
]);
check('Boş adres/e-posta reddediliyor', str_contains($body3, 'error-banner'));

file_put_contents($settingsPath, $original);
echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
