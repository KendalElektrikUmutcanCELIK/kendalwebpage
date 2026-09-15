<?php
declare(strict_types=1);

define('PRODUCTS_JSON_PATH', __DIR__ . '/../data/products.json');
define('PRODUCTS_BACKUP_DIR', __DIR__ . '/../data/backups');

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
 * Yedek alır, JSON'a kodlar (bozuk UTF-8 varsa temizleyip tekrar dener) ve atomik yazar.
 * @param array<string, array<string, mixed>> $products
 */
function save_products(array $products): void
{
    if (!is_dir(PRODUCTS_BACKUP_DIR)) {
        mkdir(PRODUCTS_BACKUP_DIR, 0755, true);
    }
    $backupPath = PRODUCTS_BACKUP_DIR . '/products-' . date('Ymd-His') . '.json';
    copy(PRODUCTS_JSON_PATH, $backupPath);
    prune_old_backups();

    $json = json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $products = fix_utf8_recursive($products);
        $json = json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Ürün verisi JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(PRODUCTS_JSON_PATH, (string) $json)) {
        throw new RuntimeException('products.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
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

/** Admin'in kendi izole upload deposundaki ürün fotoğrafını siler (gerçek public/images/'a dokunmaz). */
function delete_product_upload(string $relPath): void
{
    $path = __DIR__ . '/../data/uploads/' . $relPath;
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
