<?php
declare(strict_types=1);

define('SETTINGS_JSON_PATH', __DIR__ . '/../../src/data/settings.json');
define('SETTINGS_BACKUP_DIR', __DIR__ . '/../data/backups');

/** @return array<string, mixed> */
function load_settings(): array
{
    if (!file_exists(SETTINGS_JSON_PATH)) {
        return default_settings();
    }
    $raw = file_get_contents(SETTINGS_JSON_PATH);
    $data = json_decode((string) $raw, true);
    return is_array($data) ? array_replace_recursive(default_settings(), $data) : default_settings();
}

/**
 * Gerçek src/data/settings.json'a yazar (Footer.tsx/BrandFooter.tsx/IletisimClient.tsx
 * bunu doğrudan okuyor) — kaydetmeden önce yedek alır, atomik yazar.
 * @param array<string, mixed> $settings
 */
function save_settings(array $settings): void
{
    if (!is_dir(SETTINGS_BACKUP_DIR)) {
        mkdir(SETTINGS_BACKUP_DIR, 0755, true);
    }
    if (file_exists(SETTINGS_JSON_PATH)) {
        copy(SETTINGS_JSON_PATH, SETTINGS_BACKUP_DIR . '/settings-' . date('Ymd-His') . '.json');
    }

    $json = json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $settings = fix_utf8_recursive($settings);
        $json = json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Ayarlar JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(SETTINGS_JSON_PATH, $json)) {
        throw new RuntimeException('settings.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
    }

    clearstatcache(true, SETTINGS_JSON_PATH);
    if (file_get_contents(SETTINGS_JSON_PATH) !== $json) {
        throw new RuntimeException('settings.json yazıldı ama doğrulama başarısız oldu - lütfen tekrar kaydet.');
    }
}

/** Gerçek sitedeki (Footer.tsx, BrandFooter.tsx) mevcut değerlerle aynı varsayılanlar. */
function default_settings(): array
{
    return [
        'tr' => [
            'address' => 'Selimpaşa Org. San. Böl. 5008 Sokak No:6 Selimpaşa Silivri/İSTANBUL',
            'phone' => '0212 482 75 90 - 91',
            'salesPhone' => '0850 259 41 41',
            'supportPhone' => '444 34 98',
        ],
        'en' => [
            'address' => 'Selimpaşa Org. San. Böl. 5008 Sokak No:6 Selimpaşa Silivri/ISTANBUL',
            'phone' => '+90 212 482 75 90 - 91',
            'salesPhone' => '+90 850 259 41 41',
            'supportPhone' => '444 34 98',
        ],
        'email' => 'info@kendalelektrik.com.tr',
        'facebookUrl' => 'https://www.facebook.com/kendalelektrik/',
        'linkedinUrl' => 'https://www.linkedin.com/company/kendal-elektrik-ayd%C4%B1nlatma-a-%C5%9F/',
        'instagramUrl' => 'https://www.instagram.com/kendalelektrik.k2ledsystems/',
    ];
}
