<?php
declare(strict_types=1);

/**
 * Benzersiz bir .tmp dosyasına yazıp rename eder (Windows'ta ara sıra kilitlenirse kısa
 * retry ile), sonra içerik doğrulanır. Tmp dosya adı her çağrıda rastgele üretilir —
 * aynı $path'e eşzamanlı iki yazma çakışıp birbirinin geçici dosyasının üzerine
 * yazamasın diye (paylaşılan sabit ".tmp" adı kullanılsaydı, iki eşzamanlı admin kaydı
 * birbirinin içeriğini geçici dosyada ezebilirdi).
 */
function atomic_write(string $path, string $content): bool
{
    $tmpPath = $path . '.' . bin2hex(random_bytes(6)) . '.tmp';
    if (file_put_contents($tmpPath, $content, LOCK_EX) === false) {
        return false;
    }

    $delaysMs = [0, 150, 300, 600, 1000];
    foreach ($delaysMs as $delayMs) {
        if ($delayMs > 0) {
            usleep($delayMs * 1000);
        }
        if (@rename($tmpPath, $path)) {
            clearstatcache(true, $path);
            return file_get_contents($path) === $content;
        }
    }

    @unlink($tmpPath);
    return false;
}
