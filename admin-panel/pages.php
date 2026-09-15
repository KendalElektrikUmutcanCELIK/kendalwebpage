<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/products.php';
require __DIR__ . '/lib/pages.php';
require __DIR__ . '/includes/layout.php';

$pages = load_pages();

$q = trim((string) ($_GET['q'] ?? ''));
if ($q !== '') {
    $needle = mb_strtolower($q, 'UTF-8');
    $pages = array_filter($pages, function ($p) use ($needle) {
        $haystack = mb_strtolower(($p['title']['tr'] ?? '') . ' ' . ($p['slug'] ?? ''), 'UTF-8');
        return str_contains($haystack, $needle);
    });
}

render_header('Sayfalar', 'pages');
?>
<div class="panel-header">
  <h1>Sayfalar</h1>
  <a href="page-edit.php" class="btn btn-primary">+ Yeni Sayfa</a>
</div>
<p class="page-subtitle">Blok tabanlı serbest sayfalar. Her sayfa <code>/{slug}</code> adresinde yayınlanır (ürün linkleriyle veya sabit sayfalarla aynı isimde olamaz), navbar'a otomatik eklenmez.</p>

<?php if (isset($_GET['deleted'])): ?>
  <div class="success-banner">Sayfa silindi.</div>
<?php endif; ?>

<form method="get" class="filter-bar">
  <input type="text" name="q" placeholder="Başlık veya slug ara..." value="<?= htmlspecialchars($q, ENT_QUOTES, 'UTF-8') ?>">
  <button type="submit" class="btn">Ara</button>
</form>

<?php if (empty($pages)): ?>
  <p class="hint">Henüz hiç sayfa yok. "+ Yeni Sayfa" ile başla.</p>
<?php else: ?>
<div class="product-grid">
  <?php foreach ($pages as $slug => $p): ?>
    <a href="page-edit.php?slug=<?= urlencode($slug) ?>" class="product-card">
      <div class="product-info">
        <span class="product-id">/<?= htmlspecialchars($slug, ENT_QUOTES, 'UTF-8') ?></span>
        <span class="product-name"><?= htmlspecialchars($p['title']['tr'] ?? $slug, ENT_QUOTES, 'UTF-8') ?></span>
        <span class="product-brand"><?= count($p['blocks'] ?? []) ?> blok</span>
      </div>
    </a>
  <?php endforeach; ?>
</div>
<?php endif; ?>
<?php
render_footer();
