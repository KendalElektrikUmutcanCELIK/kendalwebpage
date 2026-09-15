<?php
declare(strict_types=1);

require_once __DIR__ . '/json_format.php';

define('RETAILERS_JSON_PATH', __DIR__ . '/../../src/data/retailers.json');
define('RETAILERS_BACKUP_DIR', __DIR__ . '/../data/backups');
define('RETAILERS_IMAGE_DIR', __DIR__ . '/../../public/images/retail');

/** @return array<int, array<string, mixed>> */
function load_retailers(): array
{
    if (!file_exists(RETAILERS_JSON_PATH)) {
        return [];
    }
    $raw = file_get_contents(RETAILERS_JSON_PATH);
    $data = json_decode((string) $raw, true);
    return is_array($data) ? array_values($data) : [];
}

/** @param array<string, mixed> $retailer */
function validate_retailer_structure(array $retailer): ?string
{
    if (!isset($retailer['id']) || !is_string($retailer['id']) || $retailer['id'] === '') {
        return 'id eksik.';
    }
    if (!isset($retailer['name']) || !is_string($retailer['name']) || $retailer['name'] === '') {
        return 'name eksik.';
    }
    if (!isset($retailer['logo']) || !is_string($retailer['logo']) || $retailer['logo'] === '') {
        return 'logo eksik.';
    }
    return null;
}

/**
 * Gerçek src/data/retailers.json'a yazar (RetailPresence.tsx bunu okuyor) — her kaydın
 * yapısal bütünlüğünü doğrular, kaydetmeden önce yedek alır, atomik yazar.
 * @param array<int, array<string, mixed>> $retailers
 */
function save_retailers(array $retailers): void
{
    $retailers = array_values($retailers);
    foreach ($retailers as $r) {
        $error = validate_retailer_structure($r);
        if ($error !== null) {
            throw new RuntimeException("Market kaydedilemedi: $error");
        }
    }

    if (!is_dir(RETAILERS_BACKUP_DIR)) {
        mkdir(RETAILERS_BACKUP_DIR, 0755, true);
    }
    if (file_exists(RETAILERS_JSON_PATH)) {
        copy(RETAILERS_JSON_PATH, RETAILERS_BACKUP_DIR . '/retailers-' . date('Ymd-His') . '.json');
    }

    $json = json_encode_2space($retailers, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $retailers = fix_utf8_recursive($retailers);
        $json = json_encode_2space($retailers, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Market verisi JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(RETAILERS_JSON_PATH, (string) $json)) {
        throw new RuntimeException('retailers.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
    }

    clearstatcache(true, RETAILERS_JSON_PATH);
    if (file_get_contents(RETAILERS_JSON_PATH) !== $json) {
        throw new RuntimeException('retailers.json yazıldı ama doğrulama başarısız oldu - lütfen tekrar kaydet.');
    }
}

/** İsimden benzersiz bir id üretir (mevcutsa -2, -3 ekler). */
function generate_unique_retailer_id(string $name, array $existingRetailers): string
{
    $base = slugify_tr($name);
    if ($base === '') {
        $base = 'market';
    }
    $existingIds = array_column($existingRetailers, 'id');
    $id = $base;
    $i = 2;
    while (in_array($id, $existingIds, true)) {
        $id = $base . '-' . $i;
        $i++;
    }
    return $id;
}

/** Logoyu sıkıştırıp gerçek public/images/retail/ altına {id}-logo.webp olarak kaydeder. */
function save_retailer_logo(string $tmpPath, string $id): array
{
    if (!is_dir(RETAILERS_IMAGE_DIR)) {
        mkdir(RETAILERS_IMAGE_DIR, 0755, true);
    }
    $destPath = RETAILERS_IMAGE_DIR . '/' . $id . '-logo.webp';
    $result = compress_product_image($tmpPath, $destPath);
    if (!$result['ok']) {
        return $result;
    }
    return ['ok' => true, 'relativePath' => 'retail/' . basename($result['path'])];
}

/** Bir markete ait yüklenmiş logo dosyasını diskten siler. */
function delete_retailer_logo(string $id): void
{
    foreach (glob(RETAILERS_IMAGE_DIR . '/' . $id . '-logo.*') ?: [] as $file) {
        @unlink($file);
    }
}
