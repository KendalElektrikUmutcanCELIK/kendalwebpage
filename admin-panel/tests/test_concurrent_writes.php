<?php
declare(strict_types=1);

$pass = 0;
$fail = 0;

function check(string $label, bool $condition): void
{
    global $pass, $fail;
    if ($condition) { echo "  ✓ $label" . PHP_EOL; $pass++; }
    else { echo "  ✗ BAŞARISIZ: $label" . PHP_EOL; $fail++; }
}

$phpBinary = PHP_BINARY;
$writerScript = __DIR__ . '/_concurrent_writer.php';
$target = sys_get_temp_dir() . '/admin_concurrent_test_' . uniqid() . '.json';
@unlink($target);
file_put_contents($target, '{"initial":true}');

echo "=== 1. İki eşzamanlı yazma (gerçek iki ayrı süreç) birbirinin geçici dosyasını ezmiyor ===" . PHP_EOL;

$contentA = json_encode(['who' => 'A', 'padding' => str_repeat('a', 5000)]);
$contentB = json_encode(['who' => 'B', 'padding' => str_repeat('b', 5000)]);

$descriptors = [1 => ['pipe', 'w'], 2 => ['pipe', 'w']];
$procA = proc_open([$phpBinary, $writerScript, $target, $contentA, '0'], $descriptors, $pipesA);
$procB = proc_open([$phpBinary, $writerScript, $target, $contentB, '0'], $descriptors, $pipesB);

$outA = stream_get_contents($pipesA[1]);
$outB = stream_get_contents($pipesB[1]);
foreach ($pipesA as $p) { fclose($p); }
foreach ($pipesB as $p) { fclose($p); }
proc_close($procA);
proc_close($procB);

check('A süreci OK döndü', $outA === 'OK');
check('B süreci OK döndü', $outB === 'OK');

$finalContent = file_get_contents($target);
$isFullA = $finalContent === $contentA;
$isFullB = $finalContent === $contentB;
check('Sonuç dosyası A veya B\'nin TAM içeriği (yarı yarıya karışmış/bozuk değil)', $isFullA || $isFullB);
check('Sonuç geçerli JSON olarak parse edilebiliyor', json_decode($finalContent, true) !== null);

$strayTmp = glob($target . '.*.tmp');
check('Geride hiç yarım kalmış .tmp dosyası kalmadı', $strayTmp === [] || $strayTmp === false);

echo PHP_EOL . "=== 2. 15 tekrar ile istatistiksel doğrulama (her seferinde tam/bozulmamış sonuç) ===" . PHP_EOL;
$allClean = true;
for ($i = 0; $i < 15; $i++) {
    $cA = json_encode(['iter' => $i, 'who' => 'A']);
    $cB = json_encode(['iter' => $i, 'who' => 'B']);
    $pA = proc_open([$phpBinary, $writerScript, $target, $cA, (string) random_int(0, 2000)], $descriptors, $pipesA);
    $pB = proc_open([$phpBinary, $writerScript, $target, $cB, (string) random_int(0, 2000)], $descriptors, $pipesB);
    stream_get_contents($pipesA[1]);
    stream_get_contents($pipesB[1]);
    foreach ($pipesA as $p) { fclose($p); }
    foreach ($pipesB as $p) { fclose($p); }
    proc_close($pA);
    proc_close($pB);
    $c = file_get_contents($target);
    if ($c !== $cA && $c !== $cB) {
        $allClean = false;
        echo "  Bozuk sonuç bulundu (iterasyon $i): " . substr($c, 0, 80) . PHP_EOL;
        break;
    }
}
check('15 tekrarın hepsinde sonuç her zaman tam/geçerli bir içerikti', $allClean);

$strayTmp2 = glob($target . '.*.tmp');
check('15 tekrar sonrası da geride hiç .tmp kalmadı', $strayTmp2 === [] || $strayTmp2 === false);

@unlink($target);
echo PHP_EOL . "=== SONUÇ: $pass geçti, $fail başarısız ===" . PHP_EOL;
exit($fail > 0 ? 1 : 0);
