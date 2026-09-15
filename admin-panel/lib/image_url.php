<?php
declare(strict_types=1);

/** Gerçek sitedeki ürün görselinin URL'sini üretir (public/images/{relPath}). */
function product_image_url(?string $relPath): string
{
    if (!$relPath) {
        return '';
    }
    return '/images/' . $relPath;
}
