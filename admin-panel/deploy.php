<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/github_deploy.php';
require __DIR__ . '/includes/layout.php';

/** Admin panelin düzenlediği tüm veri dosyaları — hepsi Yayınla'da GitHub'a gönderilir. */
define('DEPLOY_DATA_FILES', [
    'aboutContent.json', 'certificates.json', 'homeBlocks.json', 'missionVision.json',
    'navLinks.json', 'news.json', 'pages.json', 'products.json', 'projects.json',
    'retailers.json', 'settings.json', 'slug-map.json',
]);

define('DEPLOY_WORKFLOW_FILE', 'deploy-test-kendalelektrikcom.yml');

$results = [];
$triggerResult = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && github_deploy_configured()) {
    $allOk = true;
    foreach (DEPLOY_DATA_FILES as $filename) {
        $repoPath = 'src/data/' . $filename;
        $localPath = __DIR__ . '/../src/data/' . $filename;
        if (!is_file($localPath)) {
            continue;
        }
        $content = file_get_contents($localPath);
        $result = github_push_file($repoPath, (string) $content, 'Admin panel: içerik güncellendi (' . date('Y-m-d H:i') . ')');
        $results[$repoPath] = $result;
        if (!$result['ok']) {
            $allOk = false;
        }
    }

    if ($allOk) {
        $triggerResult = github_trigger_workflow(DEPLOY_WORKFLOW_FILE);
    }
}

render_header('Yayınla', 'deploy');
?>
<div class="panel-header">
  <h1>Yayınla</h1>
</div>
<p class="page-subtitle">Admin panelde yapılan tüm değişiklikleri (ürünler, marketler, projeler, sertifikalar, haberler, sayfalar, anasayfa blokları, navbar linkleri, hakkımızda/misyon-vizyon, site ayarları) GitHub'a gönderir ve siteyi gerçekten yeniden derleyip kendalelektrik.com'a yayınlar. ~5-10 dakika sürer.</p>

<?php if (!github_deploy_configured()): ?>
  <div class="error-banner">
    Otomatik yayın henüz kurulmadı. <code>admin-panel/config.php</code> içindeki <code>GITHUB_TOKEN</code> ve <code>GITHUB_REPO</code> değerleri boş.
    Kurulum adımları için <code>admin-panel/README.md</code> içindeki "Otomatik Yayın Kurulumu" bölümüne bakın.
  </div>
<?php else: ?>
  <?php if (!empty($results)): ?>
    <?php $allOk = true; foreach ($results as $repoPath => $r) { if (!$r['ok']) { $allOk = false; } } ?>
    <?php if ($allOk && $triggerResult !== null && $triggerResult['ok']): ?>
      <div class="success-banner">Gönderildi ve site yeniden derlenip yayınlanmak üzere GitHub Actions'a alındı — ~5-10 dakika içinde kendalelektrik.com'da görünecek.</div>
    <?php elseif ($allOk && $triggerResult !== null && !$triggerResult['ok']): ?>
      <div class="error-banner">Veriler GitHub'a gönderildi ama siteyi yeniden yayınlama tetiklenemedi: <?= htmlspecialchars($triggerResult['error'], ENT_QUOTES, 'UTF-8') ?></div>
    <?php else: ?>
      <div class="error-banner">Bazı dosyalar gönderilemedi, aşağıya bakın.</div>
    <?php endif; ?>
    <ul class="hint">
      <?php foreach ($results as $repoPath => $r): ?>
        <li><?= htmlspecialchars($repoPath, ENT_QUOTES, 'UTF-8') ?>: <?= $r['ok'] ? 'başarılı' : 'HATA — ' . htmlspecialchars($r['error'], ENT_QUOTES, 'UTF-8') ?></li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>

  <form method="post" class="edit-form">
    <p class="hint">Gönderilecek dosyalar: <?= implode(', ', array_map(fn ($f) => '<code>' . htmlspecialchars($f, ENT_QUOTES, 'UTF-8') . '</code>', DEPLOY_DATA_FILES)) ?>.</p>
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Şimdi Yayınla</button>
    </div>
  </form>
<?php endif; ?>
<?php
render_footer();
