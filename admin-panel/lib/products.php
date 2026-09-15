<?php
declare(strict_types=1);

require_once __DIR__ . '/json_format.php';

/** Gerçek site verisi — src/data/products.json, doğrudan siteyi besliyor. */
define('PRODUCTS_JSON_PATH', __DIR__ . '/../../src/data/products.json');
define('PRODUCTS_BACKUP_DIR', __DIR__ . '/../data/backups');
define('PRODUCTS_IMAGE_DIR', __DIR__ . '/../../public/images/urunler');

/**
 * @return array<string, array<string, mixed>>
 */
function load_products(): array
{
    $raw = file_get_contents(PRODUCTS_JSON_PATH);
    if ($raw === false) {
        throw new RuntimeException('products.json okunamadı.');
    }
    $data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    return is_array($data) ? $data : [];
}

/**
 * Bir ürün kaydının next.js tarafında (generateStaticParams/render) asla çökmeyecek
 * minimum yapıda olduğunu doğrular — bkz. src/data/products.ts'teki Product tipi.
 * @param array<string, mixed> $product
 */
function validate_product_structure(array $product): ?string
{
    if (!isset($product['id']) || !is_string($product['id']) || $product['id'] === '') {
        return 'id eksik.';
    }
    if (!isset($product['model']) || !is_string($product['model'])) {
        return 'model eksik.';
    }
    if (!isset($product['image']) || !is_string($product['image'])) {
        return 'image eksik.';
    }
    if (!isset($product['name']) || !is_array($product['name']) || !isset($product['name']['tr'], $product['name']['en'])) {
        return 'name.tr/name.en eksik.';
    }
    if (
        !isset($product['attributes']) || !is_array($product['attributes'])
        || !isset($product['attributes']['tr']) || !is_array($product['attributes']['tr'])
        || !isset($product['attributes']['en']) || !is_array($product['attributes']['en'])
    ) {
        return 'attributes.tr/attributes.en eksik veya dizi değil.';
    }
    if (isset($product['category']) && (!is_array($product['category']) || !isset($product['category']['tr']) || !is_array($product['category']['tr']))) {
        return 'category verilmişse category.tr bir dizi olmalı.';
    }
    return null;
}

/**
 * Yedek alır, her ürünün yapısal bütünlüğünü doğrular, JSON'a kodlar (bozuk UTF-8 varsa
 * temizleyip tekrar dener) ve atomik yazar.
 * @param array<string, array<string, mixed>> $products
 */
function save_products(array $products): void
{
    foreach ($products as $id => $product) {
        $error = validate_product_structure($product);
        if ($error !== null) {
            throw new RuntimeException("Ürün \"$id\" kaydedilemedi: $error");
        }
    }

    if (!is_dir(PRODUCTS_BACKUP_DIR)) {
        mkdir(PRODUCTS_BACKUP_DIR, 0755, true);
    }
    $backupPath = PRODUCTS_BACKUP_DIR . '/products-' . date('Ymd-His') . '.json';
    copy(PRODUCTS_JSON_PATH, $backupPath);
    prune_old_backups();

    foreach ($products as &$product) {
        if (isset($product['variantOptions']) && is_array($product['variantOptions']) && count($product['variantOptions']) === 0) {
            $product['variantOptions'] = new stdClass();
        }
    }
    unset($product);

    $json = json_encode_2space($products, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $products = fix_utf8_recursive($products);
        $json = json_encode_2space($products, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Ürün verisi JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(PRODUCTS_JSON_PATH, (string) $json)) {
        throw new RuntimeException('products.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
    }

    clearstatcache(true, PRODUCTS_JSON_PATH);
    if (file_get_contents(PRODUCTS_JSON_PATH) !== $json) {
        throw new RuntimeException('products.json yazıldı ama doğrulama başarısız oldu - lütfen tekrar kaydet.');
    }
}

/** Son 50 yedeği tutar, fazlasını siler. */
function prune_old_backups(): void
{
    $files = glob(PRODUCTS_BACKUP_DIR . '/products-*.json');
    if ($files === false || count($files) <= 50) {
        return;
    }
    sort($files);
    $toDelete = array_slice($files, 0, count($files) - 50);
    foreach ($toDelete as $file) {
        @unlink($file);
    }
}

/** Gerçek public/images/ altındaki ürün fotoğrafını siler. */
function delete_product_upload(string $relPath): void
{
    $path = __DIR__ . '/../../public/images/' . $relPath;
    if (is_file($path)) {
        @unlink($path);
    }
}

function generate_product_id(string $model): string
{
    $base = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $model) ?: 'URUN');
    return $base;
}

function slugify_tr(string $text): string
{
    $map = [
        'ı' => 'i', 'İ' => 'i', 'ş' => 's', 'Ş' => 's',
        'ğ' => 'g', 'Ğ' => 'g', 'ü' => 'u', 'Ü' => 'u',
        'ö' => 'o', 'Ö' => 'o', 'ç' => 'c', 'Ç' => 'c',
    ];
    $text = strtr($text, $map);
    $text = mb_strtolower($text, 'UTF-8');
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    return trim($text, '-');
}
