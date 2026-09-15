<?php
declare(strict_types=1);

require_once __DIR__ . '/json_format.php';

define('NEWS_JSON_PATH', __DIR__ . '/../../src/data/news.json');
define('NEWS_BACKUP_DIR', __DIR__ . '/../data/backups');
define('NEWS_IMAGE_ROOT', __DIR__ . '/../../public/images/haberler');

/** @return array{tr: array<int, array<string, mixed>>, en: array<int, array<string, mixed>>} */
function load_news(): array
{
    if (!file_exists(NEWS_JSON_PATH)) {
        return ['tr' => [], 'en' => []];
    }
    $raw = file_get_contents(NEWS_JSON_PATH);
    $data = json_decode((string) $raw, true);
    if (!is_array($data)) {
        return ['tr' => [], 'en' => []];
    }
    return [
        'tr' => is_array($data['tr'] ?? null) ? array_values($data['tr']) : [],
        'en' => is_array($data['en'] ?? null) ? array_values($data['en']) : [],
    ];
}

/** @param array<string, mixed> $item */
function validate_news_item_structure(array $item): ?string
{
    if (!isset($item['id']) || !is_string($item['id']) || $item['id'] === '') {
        return 'id eksik.';
    }
    if (!isset($item['title']) || !is_string($item['title']) || $item['title'] === '') {
        return 'title eksik.';
    }
    if (!isset($item['date']) || !is_string($item['date'])) {
        return 'date eksik.';
    }
    if (!isset($item['images']) || !is_array($item['images'])) {
        return 'images dizisi eksik.';
    }
    if (!isset($item['content']) || !is_array($item['content'])) {
        return 'content dizisi eksik.';
    }
    foreach ($item['content'] as $p) {
        if (!is_string($p)) {
            return 'content içinde metin olmayan bir kayıt var.';
        }
    }
    return null;
}

/** @param array{tr: array<int, mixed>, en: array<int, mixed>} $news */
function validate_news_structure(array $news): ?string
{
    foreach (['tr', 'en'] as $lang) {
        if (!isset($news[$lang]) || !is_array($news[$lang])) {
            return "\"$lang\" listesi eksik.";
        }
        foreach ($news[$lang] as $item) {
            if (!is_array($item)) {
                return "\"$lang\" içinde geçersiz bir kayıt var.";
            }
            $error = validate_news_item_structure($item);
            if ($error !== null) {
                return "\"$lang\" içinde bir haber kaydedilemedi: $error";
            }
        }
    }
    return null;
}

/**
 * Gerçek src/data/news.json'a yazar (news-tr.ts/news-en.ts bunu okuyor) — yapısal
 * bütünlüğü doğrular, yedek alır, atomik yazar.
 * @param array{tr: array<int, mixed>, en: array<int, mixed>} $news
 */
function save_news(array $news): void
{
    $news['tr'] = array_values($news['tr'] ?? []);
    $news['en'] = array_values($news['en'] ?? []);

    $error = validate_news_structure($news);
    if ($error !== null) {
        throw new RuntimeException("Haberler kaydedilemedi: $error");
    }

    if (!is_dir(NEWS_BACKUP_DIR)) {
        mkdir(NEWS_BACKUP_DIR, 0755, true);
    }
    if (file_exists(NEWS_JSON_PATH)) {
        copy(NEWS_JSON_PATH, NEWS_BACKUP_DIR . '/news-' . date('Ymd-His') . '.json');
    }

    $json = json_encode_2space($news, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $news = fix_utf8_recursive($news);
        $json = json_encode_2space($news, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Haber verisi JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(NEWS_JSON_PATH, (string) $json)) {
        throw new RuntimeException('news.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
    }

    clearstatcache(true, NEWS_JSON_PATH);
    if (file_get_contents(NEWS_JSON_PATH) !== $json) {
        throw new RuntimeException('news.json yazıldı ama doğrulama başarısız oldu - lütfen tekrar kaydet.');
    }
}

/** Mevcut id'lerin en büyüğünden bir sonrakini üretir (id'ler sıralı string sayılar: "1".."37"...). */
function generate_next_news_id(array $trItems): string
{
    $max = 0;
    foreach ($trItems as $item) {
        if (preg_match('/^\d+$/', (string) ($item['id'] ?? ''))) {
            $max = max($max, (int) $item['id']);
        }
    }
    return (string) ($max + 1);
}

function news_image_dir(string $id): string
{
    $dir = NEWS_IMAGE_ROOT . '/' . $id;
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir;
}

/** Galeri görselini sıkıştırıp kaydeder, news.json'da saklanacak (getAssetPath öncesi) göreli yolu döndürür. */
function save_news_gallery_image(string $tmpPath, string $id, int $index): array
{
    $dir = news_image_dir($id);
    $destPath = $dir . '/' . $id . '-galeri-' . $index . '-' . bin2hex(random_bytes(3)) . '.webp';
    $result = compress_product_image($tmpPath, $destPath);
    if (!$result['ok']) {
        return $result;
    }
    return ['ok' => true, 'relativePath' => 'haberler/' . $id . '/' . basename($result['path'])];
}

/**
 * Metin içi (paragraflar arası) görsel için kaydeder — mevcut veride bu tip görseller
 * '[IMAGE]/images/...' şeklinde MUTLAK yol olarak (getAssetPath uygulanmadan) saklanıyor;
 * aynı deseni koruyoruz (NewsDetailClient.tsx bu yolu doğrudan <img src> olarak kullanıyor).
 */
function save_news_content_image(string $tmpPath, string $id, string $lang, int $index): array
{
    $dir = news_image_dir($id);
    $destPath = $dir . '/' . $id . '-icerik-' . $lang . '-' . $index . '-' . bin2hex(random_bytes(3)) . '.webp';
    $result = compress_product_image($tmpPath, $destPath);
    if (!$result['ok']) {
        return $result;
    }
    return ['ok' => true, 'contentMarker' => '[IMAGE]/images/haberler/' . $id . '/' . basename($result['path'])];
}

/** Bir habere ait tüm yüklenmiş görselleri diskten siler. */
function delete_news_images(string $id): void
{
    $dir = NEWS_IMAGE_ROOT . '/' . $id;
    if (!is_dir($dir)) {
        return;
    }
    foreach (glob($dir . '/*') ?: [] as $file) {
        @unlink($file);
    }
    @rmdir($dir);
}
