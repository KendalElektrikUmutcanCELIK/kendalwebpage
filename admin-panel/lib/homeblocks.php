<?php
declare(strict_types=1);

require_once __DIR__ . '/json_format.php';

define('HOME_BLOCKS_JSON_PATH', __DIR__ . '/../../src/data/homeBlocks.json');
define('HOME_BLOCKS_BACKUP_DIR', __DIR__ . '/../data/backups');

/**
 * Anasayfanın sabit bölümleri arasındaki "boşluklar" — Next.js tarafındaki
 * src/data/homeBlocks.ts'teki HOME_BLOCK_SLOTS ile anahtar/sıra olarak BİREBİR
 * aynı tutulmalı. Yeni bir sabit bölüm eklenir/kaldırılırsa ikisi de güncellenmeli.
 * @return array<string, string>
 */
function home_block_slots(): array
{
    return [
        'after-hero' => 'Hero ile Hakkımızda Arasına',
        'after-about' => 'Hakkımızda ile Markalarımız Arasına',
        'after-brands' => 'Markalarımız ile Şirket İstatistikleri Arasına',
        'after-stats' => 'Şirket İstatistikleri ile Katalog CTA Arasına',
        'after-catalog-cta' => 'Katalog CTA ile Şirket Videosu Arasına',
        'after-video' => 'Şirket Videosu ile Küresel Varlık Arasına',
        'after-global-presence' => 'Küresel Varlık ile Haberler Arasına',
        'after-news-preview' => 'Haberlerden Sonra (Sayfa Sonu)',
    ];
}

/** @return array<string, array<int, array<string, mixed>>> */
function load_home_blocks(): array
{
    $data = [];
    if (file_exists(HOME_BLOCKS_JSON_PATH)) {
        $raw = json_decode((string) file_get_contents(HOME_BLOCKS_JSON_PATH), true);
        if (is_array($raw)) {
            $data = $raw;
        }
    }
    foreach (array_keys(home_block_slots()) as $slot) {
        if (!isset($data[$slot]) || !is_array($data[$slot])) {
            $data[$slot] = [];
        } else {
            $data[$slot] = array_values($data[$slot]);
        }
    }
    return $data;
}

/** @param array<string, mixed> $homeBlocks */
function validate_home_blocks_structure(array $homeBlocks): ?string
{
    foreach (array_keys(home_block_slots()) as $slot) {
        if (!isset($homeBlocks[$slot]) || !is_array($homeBlocks[$slot])) {
            return "\"$slot\" dizisi eksik.";
        }
        foreach ($homeBlocks[$slot] as $block) {
            if (!is_array($block) || !isset($block['id'], $block['type'], $block['data'])) {
                return "\"$slot\" içinde bir blok kaydı eksik alanlara sahip (id/type/data gerekli).";
            }
            if (!in_array($block['type'], VALID_BLOCK_TYPES, true)) {
                return 'Geçersiz blok tipi: ' . (string) $block['type'];
            }
            if (!is_array($block['data'])) {
                return 'Blok verisi (data) dizi olmalı.';
            }
        }
    }
    return null;
}

/**
 * Gerçek src/data/homeBlocks.json'a yazar (HomeClient.tsx'teki HomeCustomBlocks
 * bunu okuyor) — yapısal bütünlüğü doğrular (next build'i kıramaz), yedek alır,
 * atomik yazar.
 * @param array<string, array<int, array<string, mixed>>> $homeBlocks
 */
function save_home_blocks(array $homeBlocks): void
{
    foreach (array_keys(home_block_slots()) as $slot) {
        $homeBlocks[$slot] = array_values($homeBlocks[$slot] ?? []);
    }

    $error = validate_home_blocks_structure($homeBlocks);
    if ($error !== null) {
        throw new RuntimeException("Anasayfa blokları kaydedilemedi: $error");
    }

    if (!is_dir(HOME_BLOCKS_BACKUP_DIR)) {
        mkdir(HOME_BLOCKS_BACKUP_DIR, 0755, true);
    }
    if (file_exists(HOME_BLOCKS_JSON_PATH)) {
        copy(HOME_BLOCKS_JSON_PATH, HOME_BLOCKS_BACKUP_DIR . '/homeblocks-' . date('Ymd-His') . '.json');
    }

    $json = json_encode_2space($homeBlocks, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $homeBlocks = fix_utf8_recursive($homeBlocks);
        $json = json_encode_2space($homeBlocks, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Anasayfa blok verisi JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(HOME_BLOCKS_JSON_PATH, (string) $json)) {
        throw new RuntimeException('homeBlocks.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
    }

    clearstatcache(true, HOME_BLOCKS_JSON_PATH);
    if (file_get_contents(HOME_BLOCKS_JSON_PATH) !== $json) {
        throw new RuntimeException('homeBlocks.json yazıldı ama doğrulama başarısız oldu - lütfen tekrar kaydet.');
    }
}
