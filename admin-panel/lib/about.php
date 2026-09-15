<?php
declare(strict_types=1);

require_once __DIR__ . '/json_format.php';

define('ABOUT_JSON_PATH', __DIR__ . '/../../src/data/aboutContent.json');
define('ABOUT_BACKUP_DIR', __DIR__ . '/../data/backups');

/** @return array<string, array<string, mixed>> */
function load_about(): array
{
    if (!file_exists(ABOUT_JSON_PATH)) {
        throw new RuntimeException('aboutContent.json bulunamadı.');
    }
    $raw = file_get_contents(ABOUT_JSON_PATH);
    $data = json_decode((string) $raw, true);
    return is_array($data) ? $data : [];
}

/** @param array<string, mixed> $about */
function validate_about_structure(array $about): ?string
{
    foreach (['tr', 'en'] as $lang) {
        if (!isset($about[$lang]) || !is_array($about[$lang])) {
            return "\"$lang\" içeriği eksik.";
        }
        if (!isset($about[$lang]['title']) || !is_string($about[$lang]['title']) || $about[$lang]['title'] === '') {
            return "\"$lang\" başlığı eksik.";
        }
        if (!isset($about[$lang]['text1']) || !is_string($about[$lang]['text1'])) {
            return "\"$lang\" text1 eksik.";
        }
        if (!isset($about[$lang]['text2']) || !is_string($about[$lang]['text2'])) {
            return "\"$lang\" text2 eksik.";
        }
        if (!isset($about[$lang]['beats']) || !is_array($about[$lang]['beats'])) {
            return "\"$lang\" beats dizisi eksik.";
        }
        foreach ($about[$lang]['beats'] as $beat) {
            if (!is_array($beat) || !isset($beat['title'], $beat['text']) || !is_string($beat['title']) || !is_string($beat['text'])) {
                return "\"$lang\" içinde bir beats kaydı eksik/bozuk.";
            }
        }
    }
    return null;
}

/**
 * Gerçek src/data/aboutContent.json'a yazar (AboutUs.tsx bunu okuyor) — yapısal
 * bütünlüğü doğrular, yedek alır, atomik yazar.
 * @param array<string, array<string, mixed>> $about
 */
function save_about(array $about): void
{
    $error = validate_about_structure($about);
    if ($error !== null) {
        throw new RuntimeException("Hakkımızda içeriği kaydedilemedi: $error");
    }

    if (!is_dir(ABOUT_BACKUP_DIR)) {
        mkdir(ABOUT_BACKUP_DIR, 0755, true);
    }
    if (file_exists(ABOUT_JSON_PATH)) {
        copy(ABOUT_JSON_PATH, ABOUT_BACKUP_DIR . '/about-' . date('Ymd-His') . '.json');
    }

    $json = json_encode_2space($about, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $about = fix_utf8_recursive($about);
        $json = json_encode_2space($about, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Hakkımızda verisi JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(ABOUT_JSON_PATH, (string) $json)) {
        throw new RuntimeException('aboutContent.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
    }

    clearstatcache(true, ABOUT_JSON_PATH);
    if (file_get_contents(ABOUT_JSON_PATH) !== $json) {
        throw new RuntimeException('aboutContent.json yazıldı ama doğrulama başarısız oldu - lütfen tekrar kaydet.');
    }
}
