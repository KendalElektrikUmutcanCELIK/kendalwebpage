<?php
declare(strict_types=1);

require_once __DIR__ . '/json_format.php';

define('NAVLINKS_JSON_PATH', __DIR__ . '/../../src/data/navLinks.json');
define('NAVLINKS_BACKUP_DIR', __DIR__ . '/../data/backups');

/** @return array<int, array<string, mixed>> */
function load_nav_links(): array
{
    if (!file_exists(NAVLINKS_JSON_PATH)) {
        return [];
    }
    $raw = file_get_contents(NAVLINKS_JSON_PATH);
    $data = json_decode((string) $raw, true);
    return is_array($data) ? array_values($data) : [];
}

/**
 * Bir link kaydının next.js tarafında çökmeyecek minimum yapıda olduğunu doğrular.
 * @param array<string, mixed> $link
 */
function validate_nav_link_structure(array $link): ?string
{
    if (!isset($link['id']) || !is_string($link['id']) || $link['id'] === '') {
        return 'id eksik.';
    }
    if (!isset($link['label']) || !is_array($link['label']) || !isset($link['label']['tr']) || $link['label']['tr'] === '') {
        return 'label.tr eksik.';
    }
    if (!isset($link['url']) || !is_string($link['url']) || $link['url'] === '') {
        return 'url eksik.';
    }
    return null;
}

/**
 * Gerçek src/data/navLinks.json'a yazar (Navbar.tsx bunu okuyup menüye ekliyor) —
 * her linkin yapısal bütünlüğünü doğrular, kaydetmeden önce yedek alır, atomik yazar.
 * @param array<int, array<string, mixed>> $links
 */
function save_nav_links(array $links): void
{
    $links = array_values($links);
    foreach ($links as $link) {
        $error = validate_nav_link_structure($link);
        if ($error !== null) {
            throw new RuntimeException("Link kaydedilemedi: $error");
        }
    }

    if (!is_dir(NAVLINKS_BACKUP_DIR)) {
        mkdir(NAVLINKS_BACKUP_DIR, 0755, true);
    }
    if (file_exists(NAVLINKS_JSON_PATH)) {
        copy(NAVLINKS_JSON_PATH, NAVLINKS_BACKUP_DIR . '/navlinks-' . date('Ymd-His') . '.json');
    }

    $json = json_encode_2space($links, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $links = fix_utf8_recursive($links);
        $json = json_encode_2space($links, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Link verisi JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(NAVLINKS_JSON_PATH, (string) $json)) {
        throw new RuntimeException('navLinks.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
    }

    clearstatcache(true, NAVLINKS_JSON_PATH);
    if (file_get_contents(NAVLINKS_JSON_PATH) !== $json) {
        throw new RuntimeException('navLinks.json yazıldı ama doğrulama başarısız oldu - lütfen tekrar kaydet.');
    }
}

function generate_nav_link_id(): string
{
    return bin2hex(random_bytes(4));
}
