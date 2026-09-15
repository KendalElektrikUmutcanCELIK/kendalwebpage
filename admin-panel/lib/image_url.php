<?php
declare(strict_types=1);

/** Önce admin'in kendi upload deposuna bakar, yoksa gerçek sitenin (salt-okunur) görseline döner. */
function product_image_url(?string $relPath): string
{
    if (!$relPath) {
        return '';
    }
    $uploadFsPath = __DIR__ . '/../data/uploads/' . $relPath;
    if (file_exists($uploadFsPath)) {
        return 'data/uploads/' . $relPath;
    }
    return '/images/' . $relPath;
}
