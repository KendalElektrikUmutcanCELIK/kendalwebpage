<?php
// SADECE YEREL TEST İÇİN, deploy edilmeyecek: /images/... isteklerini public/images/...'a eşler.

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if (str_starts_with($uri, '/images/')) {
    $file = __DIR__ . '/../public' . $uri;
    if (is_file($file)) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        $mime = match ($ext) {
            'webp' => 'image/webp',
            'png' => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            'svg' => 'image/svg+xml',
            default => 'application/octet-stream',
        };
        header('Content-Type: ' . $mime);
        readfile($file);
        return true;
    }
    http_response_code(404);
    return true;
}

return false; // diger her sey normal sekilde (admin-panel/ altindaki dosyalar) islensin
