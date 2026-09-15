<?php
declare(strict_types=1);

/**
 * FOTOGRAF_SIKISTIRMA_REHBERI.md yöntemini (resize 800x800 inside/withoutEnlargement,
 * webp quality 80) GD ile uygular; WebP yoksa JPEG'e düşer.
 * @return array{ok: bool, error?: string, path?: string}
 */
function compress_product_image(string $sourcePath, string $destPath, int $maxSize = 800, int $quality = 80): array
{
    $info = @getimagesize($sourcePath);
    if ($info === false) {
        return ['ok' => false, 'error' => 'Dosya bir görsel olarak okunamadı.'];
    }

    [$origWidth, $origHeight, $type] = $info;

    switch ($type) {
        case IMAGETYPE_JPEG:
            $src = @imagecreatefromjpeg($sourcePath);
            break;
        case IMAGETYPE_PNG:
            $src = @imagecreatefrompng($sourcePath);
            break;
        case IMAGETYPE_WEBP:
            $src = function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($sourcePath) : false;
            break;
        case IMAGETYPE_GIF:
            $src = @imagecreatefromgif($sourcePath);
            break;
        default:
            $src = false;
    }

    if ($src === false) {
        return ['ok' => false, 'error' => 'Desteklenmeyen görsel formatı (JPEG/PNG/WEBP/GIF olmalı).'];
    }

    $scale = min(1.0, $maxSize / max($origWidth, $origHeight));
    $newWidth = max(1, (int) round($origWidth * $scale));
    $newHeight = max(1, (int) round($origHeight * $scale));

    $dst = imagecreatetruecolor($newWidth, $newHeight);

    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefilledrectangle($dst, 0, 0, $newWidth, $newHeight, $transparent);

    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
    imagedestroy($src);

    if (function_exists('imagewebp') && !defined('ADMIN_TEST_FORCE_JPEG_FALLBACK')) {
        $finalPath = preg_replace('/\.[^.]+$/', '.webp', $destPath);
        $tmpPath = $finalPath . '.tmp';
        $ok = imagewebp($dst, $tmpPath, $quality);
    } else {
        $finalPath = preg_replace('/\.[^.]+$/', '.jpg', $destPath);
        $tmpPath = $finalPath . '.tmp';
        $flat = imagecreatetruecolor($newWidth, $newHeight);
        $white = imagecolorallocate($flat, 255, 255, 255);
        imagefill($flat, 0, 0, $white);
        imagealphablending($flat, true);
        imagecopy($flat, $dst, 0, 0, 0, 0, $newWidth, $newHeight);
        $ok = imagejpeg($flat, $tmpPath, $quality);
        imagedestroy($flat);
    }
    imagedestroy($dst);

    if (!$ok) {
        return ['ok' => false, 'error' => 'Sıkıştırılmış dosya yazılamadı.'];
    }

    if (!rename($tmpPath, $finalPath)) {
        @unlink($tmpPath);
        return ['ok' => false, 'error' => 'Geçici dosya asıl konumuna taşınamadı.'];
    }

    return ['ok' => true, 'path' => $finalPath];
}
