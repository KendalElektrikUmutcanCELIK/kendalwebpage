<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/github_deploy.php';
require __DIR__ . '/includes/layout.php';

$results = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && github_deploy_configured()) {
    $filesToPush = [
        'src/data/settings.json' => __DIR__ . '/../src/data/settings.json',
        'src/data/pages.json' => __DIR__ . '/../src/data/pages.json',
    ];
    foreach ($filesToPush as $repoPath => $localPath) {
        $content = file_get_contents($localPath);
        $result = github_push_file($repoPath, (string) $content, 'Admin panel: içerik güncellendi (' . date('Y-m-d H:i') . ')');
        $results[$repoPath] = $result;
    }
}

render_header('Yayınla', 'deploy');
?>
<div class="panel-header">
  <h1>Yayınla</h1>
</div>
<p class="page-subtitle">Site Ayarları ve Sayfalar'daki değişiklikleri gerçek siteye gönderir. Yayınladıktan ~10-15 dakika sonra www.kendalelektrik.com güncellenmiş olur.</p>

<?php if (!github_deploy_configured()): ?>
  <div class="error-banner">
    Otomatik yayın henüz kurulmadı. <code>admin-panel/config.php</code> içindeki <code>GITHUB_TOKEN</code> ve <code>GITHUB_REPO</code> değerleri boş.
    Kurulum adımları için <code>admin-panel/README.md</code> içindeki "Otomatik Yayın Kurulumu" bölümüne bakın.
  </div>
<?php else: ?>
  <?php if (!empty($results)): ?>
    <?php $allOk = true; foreach ($results as $repoPath => $r) { if (!$r['ok']) { $allOk = false; } } ?>
    <?php if ($allOk): ?>
      <div class="success-banner">Gönderildi! GitHub otomatik olarak siteyi yeniden oluşturup yükleyecek (~10-15 dk).</div>
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
    <p class="hint">Gönderilecek dosyalar: Site Ayarları (<code>settings.json</code>), Sayfalar (<code>pages.json</code>).</p>
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Şimdi Yayınla</button>
    </div>
  </form>
<?php endif; ?>
<?php
render_footer();
