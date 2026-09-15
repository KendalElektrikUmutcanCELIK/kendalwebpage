<?php
declare(strict_types=1);

require_once __DIR__ . '/json_format.php';

define('PAGES_JSON_PATH', __DIR__ . '/../../src/data/pages.json');
define('PAGES_BACKUP_DIR', __DIR__ . '/../data/backups');
define('PAGES_IMAGE_DIR', __DIR__ . '/../../public/images/sayfalar');
define('VALID_BLOCK_TYPES', ['heading_text', 'image_gallery', 'text_image', 'cta']);

/** @return array<string, array<string, mixed>> */
function load_pages(): array
{
    if (!file_exists(PAGES_JSON_PATH)) {
        return [];
    }
    $raw = file_get_contents(PAGES_JSON_PATH);
    $data = json_decode((string) $raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Bir sayfa kaydının next.js tarafında (generateStaticParams/render) asla çökmeyecek
 * minimum yapıda olduğunu doğrular: slug/title/blocks alanları doğru tipte, her blok
 * geçerli bir tipte ve 'data' anahtarına sahip. İçerik alanlarının DOLU olması burada
 * ARANMAZ (bir blok eklenip henüz doldurulmamış olabilir) — sadece render'ın hiçbir
 * zaman "undefined.xxx" hatasıyla çökmeyeceği yapısal bütünlük garanti edilir.
 * @param array<string, mixed> $page
 */
function validate_page_structure(array $page): ?string
{
    if (!isset($page['slug']) || !is_string($page['slug']) || $page['slug'] === '') {
        return 'Sayfa kaydında slug eksik.';
    }
    if (!isset($page['title']) || !is_array($page['title']) || !isset($page['title']['tr']) || $page['title']['tr'] === '') {
        return 'Sayfa kaydında Türkçe başlık eksik.';
    }
    if (!isset($page['blocks']) || !is_array($page['blocks'])) {
        return 'Sayfa kaydında blocks dizisi eksik.';
    }
    foreach ($page['blocks'] as $block) {
        if (!is_array($block) || !isset($block['id'], $block['type'], $block['data'])) {
            return 'Bir blok kaydı eksik alanlara sahip (id/type/data gerekli).';
        }
        if (!in_array($block['type'], VALID_BLOCK_TYPES, true)) {
            return 'Geçersiz blok tipi: ' . (string) $block['type'];
        }
        if (!is_array($block['data'])) {
            return 'Blok verisi (data) dizi olmalı.';
        }
    }
    return null;
}

/**
 * Gerçek src/data/pages.json'a yazar (src/app/(main)/sayfa/[slug]/ bunu okuyor) —
 * her sayfa kaydının yapısal bütünlüğünü doğrular (next build'i kıramaz), kaydetmeden
 * önce yedek alır, atomik yazar.
 * @param array<string, array<string, mixed>> $pages
 */
function save_pages(array $pages): void
{
    foreach ($pages as $slug => $page) {
        $error = validate_page_structure($page);
        if ($error !== null) {
            throw new RuntimeException("Sayfa \"$slug\" kaydedilemedi: $error");
        }
    }

    if (!is_dir(PAGES_BACKUP_DIR)) {
        mkdir(PAGES_BACKUP_DIR, 0755, true);
    }
    if (file_exists(PAGES_JSON_PATH)) {
        copy(PAGES_JSON_PATH, PAGES_BACKUP_DIR . '/pages-' . date('Ymd-His') . '.json');
        prune_old_pages_backups();
    }

    $pagesForEncoding = $pages === [] ? new stdClass() : $pages;
    $json = json_encode_2space($pagesForEncoding, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $pagesForEncoding = fix_utf8_recursive($pages);
        $json = json_encode_2space($pagesForEncoding, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Sayfa verisi JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(PAGES_JSON_PATH, (string) $json)) {
        throw new RuntimeException('pages.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
    }

    clearstatcache(true, PAGES_JSON_PATH);
    if (file_get_contents(PAGES_JSON_PATH) !== $json) {
        throw new RuntimeException('pages.json yazıldı ama doğrulama başarısız oldu - lütfen tekrar kaydet.');
    }
}

/** Son 50 yedeği tutar, fazlasını siler (products.php'deki prune_old_backups() ile aynı desen). */
function prune_old_pages_backups(): void
{
    $files = glob(PAGES_BACKUP_DIR . '/pages-*.json');
    if ($files === false || count($files) <= 50) {
        return;
    }
    sort($files);
    $toDelete = array_slice($files, 0, count($files) - 50);
    foreach ($toDelete as $file) {
        @unlink($file);
    }
}

/** Başlıktan benzersiz bir slug üretir (mevcutsa -2, -3 ekler); next.js route segmentine güvenli. */
function generate_unique_page_slug(string $title, array $existingPages): string
{
    $base = slugify_tr($title);
    if ($base === '') {
        $base = 'sayfa';
    }
    $slug = $base;
    $i = 2;
    while (isset($existingPages[$slug])) {
        $slug = $base . '-' . $i;
        $i++;
    }
    return $slug;
}

function generate_block_id(): string
{
    return bin2hex(random_bytes(4));
}

/** Verilen blok tipi için boş/varsayılan veri şablonu üretir. */
function new_empty_block(string $type): array
{
    $id = generate_block_id();
    return match ($type) {
        'heading_text' => ['id' => $id, 'type' => $type, 'data' => [
            'heading' => ['tr' => '', 'en' => ''],
            'body' => ['tr' => '', 'en' => ''],
        ]],
        'text_image' => ['id' => $id, 'type' => $type, 'data' => [
            'heading' => ['tr' => '', 'en' => ''],
            'text' => ['tr' => '', 'en' => ''],
            'image' => '',
            'imageAlt' => ['tr' => '', 'en' => ''],
            'imagePosition' => 'right',
        ]],
        'image_gallery' => ['id' => $id, 'type' => $type, 'data' => [
            'title' => ['tr' => '', 'en' => ''],
            'images' => [],
        ]],
        'cta' => ['id' => $id, 'type' => $type, 'data' => [
            'heading' => ['tr' => '', 'en' => ''],
            'text' => ['tr' => '', 'en' => ''],
            'buttonLabel' => ['tr' => '', 'en' => ''],
            'buttonUrl' => '',
        ]],
        default => throw new InvalidArgumentException('Geçersiz blok tipi: ' . $type),
    };
}

/** @param array<int, array<string, mixed>> $blocks */
function find_block_index(array $blocks, string $blockId): ?int
{
    foreach ($blocks as $i => $block) {
        if (($block['id'] ?? null) === $blockId) {
            return $i;
        }
    }
    return null;
}

/** Bir sayfaya ait tüm yüklenmiş görselleri diskten siler (dosya adları hep "{slug}-..." ile başlar). */
function delete_page_images(string $slug): void
{
    foreach (glob(PAGES_IMAGE_DIR . '/' . $slug . '-*') ?: [] as $file) {
        @unlink($file);
    }
}

/**
 * Yüklenen fotoğrafı sıkıştırıp gerçek public/images/sayfalar/ altına kaydeder,
 * pages.json'da saklanacak göreli yolu (ör. "sayfalar/slug-abc123.webp") döndürür.
 * @return array{ok: bool, error?: string, relativePath?: string}
 */
function save_block_image(string $tmpPath, string $filenameBase): array
{
    if (!is_dir(PAGES_IMAGE_DIR)) {
        mkdir(PAGES_IMAGE_DIR, 0755, true);
    }
    $destPath = PAGES_IMAGE_DIR . '/' . $filenameBase . '.webp';
    $result = compress_product_image($tmpPath, $destPath);
    if (!$result['ok']) {
        return $result;
    }
    return ['ok' => true, 'relativePath' => 'sayfalar/' . basename($result['path'])];
}
