<?php
declare(strict_types=1);
require __DIR__ . '/../lib/atomic_write.php';

// Kullanım: php _concurrent_writer.php <hedef-dosya> <icerik> <mikro-saniye-gecikme>
[, $target, $content, $delayMicro] = $argv;
usleep((int) $delayMicro);
$ok = atomic_write($target, $content);
echo $ok ? 'OK' : 'FAIL';
