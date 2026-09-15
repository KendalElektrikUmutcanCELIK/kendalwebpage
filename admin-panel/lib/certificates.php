<?php
declare(strict_types=1);

require_once __DIR__ . '/json_format.php';

define('CERTIFICATES_JSON_PATH', __DIR__ . '/../../src/data/certificates.json');
define('CERTIFICATES_BACKUP_DIR', __DIR__ . '/../data/backups');
define('CERTIFICATES_IMAGE_ROOT', __DIR__ . '/../../public/images/certifications');
define('CERTIFICATE_CATEGORIES', [
    'iso' => ['label' => 'ISO Yönetim Sistemi Sertifikaları', 'dir' => 'iso-belgeleri'],
    'tse' => ['label' => 'TSE Ürün Onay Sertifikaları', 'dir' => 'tse-belgeleri'],
    'marka-tescil' => ['label' => 'Marka Tescil Belgeleri', 'dir' => 'marka-tescil-belgeleri'],
]);

/** @return array<string, array<int, string>> */
function load_certificates(): array
{
    $data = [];
    if (file_exists(CERTIFICATES_JSON_PATH)) {
        $raw = file_get_contents(CERTIFICATES_JSON_PATH);
        $decoded = json_decode((string) $raw, true);
        if (is_array($decoded)) {
            $data = $decoded;
        }
    }
    foreach (array_keys(CERTIFICATE_CATEGORIES) as $cat) {
        if (!isset($data[$cat]) || !is_array($data[$cat])) {
            $data[$cat] = [];
        } else {
            $data[$cat] = array_values($data[$cat]);
        }
    }
    return $data;
}

/** @param array<string, mixed> $certificates */
function validate_certificates_structure(array $certificates): ?string
{
    foreach (array_keys(CERTIFICATE_CATEGORIES) as $cat) {
        if (!isset($certificates[$cat]) || !is_array($certificates[$cat])) {
            return "\"$cat\" kategorisi eksik veya dizi değil.";
        }
        foreach ($certificates[$cat] as $path) {
            if (!is_string($path) || $path === '') {
                return "\"$cat\" kategorisinde geçersiz bir görsel yolu var.";
            }
        }
    }
    return null;
}

/**
 * Gerçek src/data/certificates.json'a yazar (sertifikalar/{iso,tse,marka-tescil}
 * sayfaları bunu okuyor) — yapısal bütünlüğü doğrular, yedek alır, atomik yazar.
 * @param array<string, array<int, string>> $certificates
 */
function save_certificates(array $certificates): void
{
    foreach (array_keys(CERTIFICATE_CATEGORIES) as $cat) {
        $certificates[$cat] = array_values($certificates[$cat] ?? []);
    }

    $error = validate_certificates_structure($certificates);
    if ($error !== null) {
        throw new RuntimeException("Sertifikalar kaydedilemedi: $error");
    }

    if (!is_dir(CERTIFICATES_BACKUP_DIR)) {
        mkdir(CERTIFICATES_BACKUP_DIR, 0755, true);
    }
    if (file_exists(CERTIFICATES_JSON_PATH)) {
        copy(CERTIFICATES_JSON_PATH, CERTIFICATES_BACKUP_DIR . '/certificates-' . date('Ymd-His') . '.json');
    }

    $json = json_encode_2space($certificates, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $certificates = fix_utf8_recursive($certificates);
        $json = json_encode_2space($certificates, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Sertifika verisi JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(CERTIFICATES_JSON_PATH, (string) $json)) {
        throw new RuntimeException('certificates.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
    }

    clearstatcache(true, CERTIFICATES_JSON_PATH);
    if (file_get_contents(CERTIFICATES_JSON_PATH) !== $json) {
        throw new RuntimeException('certificates.json yazıldı ama doğrulama başarısız oldu - lütfen tekrar kaydet.');
    }
}

/** Bir kategorinin görsel klasörünü döner, yoksa oluşturur. */
function certificate_category_dir(string $category): string
{
    $dir = CERTIFICATES_IMAGE_ROOT . '/' . CERTIFICATE_CATEGORIES[$category]['dir'];
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir;
}

/** Görseli sıkıştırıp ilgili kategori klasörüne kaydeder, certificates.json'da saklanacak göreli yolu döndürür. */
function save_certificate_image(string $tmpPath, string $category): array
{
    $dir = certificate_category_dir($category);
    $filenameBase = CERTIFICATE_CATEGORIES[$category]['dir'] . '-' . bin2hex(random_bytes(4));
    $destPath = $dir . '/' . $filenameBase . '.webp';
    $result = compress_product_image($tmpPath, $destPath, 1400, 85);
    if (!$result['ok']) {
        return $result;
    }
    return ['ok' => true, 'relativePath' => 'certifications/' . CERTIFICATE_CATEGORIES[$category]['dir'] . '/' . basename($result['path'])];
}

/** Belirli bir sertifika görselini diskten siler (relativePath "certifications/..." ile başlar). */
function delete_certificate_image_file(string $relativePath): void
{
    $path = __DIR__ . '/../../public/images/' . $relativePath;
    if (is_file($path)) {
        @unlink($path);
    }
}
