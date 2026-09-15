<?php
declare(strict_types=1);

require_once __DIR__ . '/json_format.php';

define('MISSIONVISION_JSON_PATH', __DIR__ . '/../../src/data/missionVision.json');
define('MISSIONVISION_BACKUP_DIR', __DIR__ . '/../data/backups');

/** @return array<string, array<string, mixed>> */
function load_mission_vision(): array
{
    if (!file_exists(MISSIONVISION_JSON_PATH)) {
        throw new RuntimeException('missionVision.json bulunamadı.');
    }
    $raw = file_get_contents(MISSIONVISION_JSON_PATH);
    $data = json_decode((string) $raw, true);
    return is_array($data) ? $data : [];
}

/** @param array<string, mixed> $data */
function validate_mission_vision_structure(array $data): ?string
{
    foreach (['tr', 'en'] as $lang) {
        if (!isset($data[$lang]) || !is_array($data[$lang])) {
            return "\"$lang\" içeriği eksik.";
        }
        foreach (['mission', 'vision'] as $section) {
            $entry = $data[$lang][$section] ?? null;
            if (!is_array($entry) || !isset($entry['title'], $entry['content']) || !is_string($entry['title']) || $entry['title'] === '' || !is_string($entry['content'])) {
                return "\"$lang.$section\" eksik veya bozuk.";
            }
        }
    }
    return null;
}

/**
 * Gerçek src/data/missionVision.json'a yazar (MissionVisionClient.tsx bunu okuyor) —
 * yapısal bütünlüğü doğrular, yedek alır, atomik yazar.
 * @param array<string, array<string, mixed>> $data
 */
function save_mission_vision(array $data): void
{
    $error = validate_mission_vision_structure($data);
    if ($error !== null) {
        throw new RuntimeException("Misyon/Vizyon içeriği kaydedilemedi: $error");
    }

    if (!is_dir(MISSIONVISION_BACKUP_DIR)) {
        mkdir(MISSIONVISION_BACKUP_DIR, 0755, true);
    }
    if (file_exists(MISSIONVISION_JSON_PATH)) {
        copy(MISSIONVISION_JSON_PATH, MISSIONVISION_BACKUP_DIR . '/missionvision-' . date('Ymd-His') . '.json');
    }

    $json = json_encode_2space($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $data = fix_utf8_recursive($data);
        $json = json_encode_2space($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Misyon/Vizyon verisi JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(MISSIONVISION_JSON_PATH, (string) $json)) {
        throw new RuntimeException('missionVision.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
    }

    clearstatcache(true, MISSIONVISION_JSON_PATH);
    if (file_get_contents(MISSIONVISION_JSON_PATH) !== $json) {
        throw new RuntimeException('missionVision.json yazıldı ama doğrulama başarısız oldu - lütfen tekrar kaydet.');
    }
}
