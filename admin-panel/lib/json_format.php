<?php
declare(strict_types=1);

/**
 * PHP'nin JSON_PRETTY_PRINT'i her zaman 4 boşluk girinti kullanır, ama bu projedeki
 * gerçek site veri dosyaları (Node/TypeScript tarafından 2 boşlukla yazılmıştı) 2 boşluk
 * kullanıyor. Bu fonksiyon aynı veriyi kodlayıp girintiyi 2 boşluğa çevirir — böylece
 * admin panel bir dosyayı ilk kez kaydettiğinde tüm dosya 4 boşluğa "yeniden biçimlenip"
 * git diff'te alakasız devasa bir fark oluşturmaz.
 * @param mixed $data
 * @return string|false
 */
function json_encode_2space($data, int $extraFlags = 0)
{
    $json = json_encode($data, JSON_PRETTY_PRINT | $extraFlags);
    if ($json === false) {
        return false;
    }
    $json = preg_replace_callback('/^(?: {4})+/m', function (array $m): string {
        return str_repeat('  ', (int) (strlen($m[0]) / 4));
    }, $json);
    return $json . "\n";
}
