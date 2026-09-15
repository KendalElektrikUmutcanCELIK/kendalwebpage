<?php
define('ADMIN_TEST_FORCE_JPEG_FALLBACK', true);
require __DIR__ . '/../lib/image.php';

$source = __DIR__ . '/../../public/textures/earth-topology.png';
$dest = sys_get_temp_dir() . '/jpeg_fallback_test.webp'; // .webp istiyoruz ama .jpg cikmali

@unlink(sys_get_temp_dir() . '/jpeg_fallback_test.jpg');

$result = compress_product_image($source, $dest);
echo 'ok: ' . var_export($result['ok'], true) . PHP_EOL;
if ($result['ok']) {
    echo 'gercek dosya yolu: ' . $result['path'] . PHP_EOL;
    echo '.jpg ile bitiyor mu: ' . var_export(str_ends_with($result['path'], '.jpg'), true) . PHP_EOL;
    echo 'dosya var mi: ' . var_export(file_exists($result['path']), true) . PHP_EOL;
    $info = getimagesize($result['path']);
    echo 'mime: ' . $info['mime'] . PHP_EOL;
    echo 'boyut: ' . $info[0] . 'x' . $info[1] . PHP_EOL;
    echo 'dosya boyutu: ' . filesize($result['path']) . ' byte' . PHP_EOL;
    unlink($result['path']);
} else {
    echo 'HATA: ' . $result['error'] . PHP_EOL;
}
