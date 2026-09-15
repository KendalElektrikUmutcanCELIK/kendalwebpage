<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/news.php';
require __DIR__ . '/includes/layout.php';

$news = load_news();
$q = trim((string) ($_GET['q'] ?? ''));

$items = $news['tr'];
usort($items, fn ($a, $b) => (int) $b['id'] <=> (int) $a['id']);

if ($q !== '') {
    $needle = mb_strtolower($q, 'UTF-8');
    $items = array_filter($items, fn ($n) => str_contains(mb_strtolower($n['title'] . ' ' . $n['id'], 'UTF-8'), $needle));
}

render_header('Haberler', 'news');
?>
<div class="panel-header">
  <h1>Haberler</h1>
  <a href="news-edit.php" class="btn btn-primary">+ Yeni Haber</a>
</div>
<p class="page-subtitle">"/haberler" listesi ve haber detay sayfalarını yönetir. Türkçe ve İngilizce içerik ayrı ayrı düzenlenir.</p>

<?php if (isset($_GET['deleted'])): ?>
  <div class="success-banner">Haber silindi.</div>
<?php endif; ?>

<form method="get" class="filter-bar">
  <input type="text" name="q" placeholder="Başlık veya ID ara..." value="<?= htmlspecialchars($q, ENT_QUOTES, 'UTF-8') ?>">
  <button type="submit" class="btn">Ara</button>
</form>

<p class="result-count"><?= count($items) ?> haber gösteriliyor.</p>

<div class="product-grid">
  <?php foreach ($items as $n): ?>
    <a href="news-edit.php?id=<?= urlencode($n['id']) ?>" class="product-card">
      <div class="product-thumb">
        <?php if (!empty($n['images'][0])): ?>
          <img src="/images/<?= htmlspecialchars($n['images'][0], ENT_QUOTES, 'UTF-8') ?>" alt="">
        <?php endif; ?>
      </div>
      <div class="product-info">
        <span class="product-id">#<?= htmlspecialchars($n['id'], ENT_QUOTES, 'UTF-8') ?> · <?= htmlspecialchars($n['date'], ENT_QUOTES, 'UTF-8') ?></span>
        <span class="product-name"><?= htmlspecialchars($n['title'], ENT_QUOTES, 'UTF-8') ?></span>
      </div>
    </a>
  <?php endforeach; ?>
</div>
<?php if (empty($items)): ?>
  <p class="hint">Hiç haber bulunamadı.</p>
<?php endif; ?>
<?php
render_footer();
