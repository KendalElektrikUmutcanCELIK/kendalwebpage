<?php
declare(strict_types=1);

/** Test dosyalarının ortak $pass/$fail sayaçlarına yazan basit assert fonksiyonu. */
function check(string $label, bool $condition): void
{
    global $pass, $fail;
    if ($condition) {
        echo "  ✓ $label" . PHP_EOL;
        $pass++;
    } else {
        echo "  ✗ BAŞARISIZ: $label" . PHP_EOL;
        $fail++;
    }
}

/** Çerez tutan basit cURL isteği; multipart=true iken $post dizisi olduğu gibi (CURLFile dahil) gönderilir. */
function req(string $url, string $cookieFile, $post = null, bool $multipart = false): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_COOKIEJAR => $cookieFile,
        CURLOPT_COOKIEFILE => $cookieFile,
        CURLOPT_FOLLOWLOCATION => false,
    ]);
    if ($post !== null) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $multipart ? $post : http_build_query($post));
    }
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $redirect = curl_getinfo($ch, CURLINFO_REDIRECT_URL);
    curl_close($ch);
    return [$status, $body, $redirect];
}
