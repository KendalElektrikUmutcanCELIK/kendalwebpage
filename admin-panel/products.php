<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/products.php';
require __DIR__ . '/lib/image_url.php';
require __DIR__ . '/includes/layout.php';

$products = load_products();

$q = trim((string) ($_GET['q'] ?? ''));
$brand = (string) ($_GET['brand'] ?? '');

$filtered = array_filter($products, function ($p) use ($q, $brand) {
    if ($brand !== '' && ($p['brand'] ?? 'k2') !== $brand) {
        return false;
    }
    if ($q !== '') {
        $haystack = mb_strtolower(($p['id'] ?? '') . ' ' . ($p['model'] ?? '') . ' ' . ($p['name']['tr'] ?? ''), 'UTF-8');
        if (!str_contains($haystack, mb_strtolower($q, 'UTF-8'))) {
            return false;
        }
    }
    return true;
});

$total = count($filtered);
$filtered = array_slice($filtered, 0, 60, true);

render_header('Ürünler', 'products');
?>
<div class="panel-header">
  <h1>Ürünler</h1>
  <a href="product-edit.php" class="btn btn-primary">+ Yeni Ürün</a>
</div>

<?php if (isset($_GET['deleted'])): ?>
  <div class="success-banner">Ürün silindi.</div>
<?php endif; ?>

<form method="get" class="filter-bar">
  <input type="text" name="q" placeholder="Ürün adı, model veya ID ara..." value="<?= htmlspecialchars($q, ENT_QUOTES, 'UTF-8') ?>">
  <select name="brand">
    <option value="">Tüm markalar</option>
    <option value="k2" <?= $brand === 'k2' ? 'selected' : '' ?>>K2</option>
    <option value="vanti" <?= $brand === 'vanti' ? 'selected' : '' ?>>Vanti</option>
    <option value="global" <?= $brand === 'global' ? 'selected' : '' ?>>Global</option>
  </select>
  <button type="submit" class="btn">Filtrele</button>
</form>

<p class="result-count"><?= $total ?> üründen <?= count($filtered) ?> tanesi gösteriliyor<?= $total > 60 ? ' (arama ile daraltın)' : '' ?>.</p>

<div class="product-grid">
  <?php foreach ($filtered as $id => $p): ?>
    <a href="product-edit.php?id=<?= urlencode($id) ?>" class="product-card">
      <div class="product-thumb">
        <?php $imgUrl = product_image_url($p['image'] ?? null); ?>
        <?php if ($imgUrl): ?>
          <img src="<?= htmlspecialchars($imgUrl, ENT_QUOTES, 'UTF-8') ?>" alt="">
        <?php endif; ?>
      </div>
      <div class="product-info">
        <span class="product-id"><?= htmlspecialchars($id, ENT_QUOTES, 'UTF-8') ?></span>
        <span class="product-name"><?= htmlspecialchars($p['name']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?></span>
        <span class="product-brand"><?= htmlspecialchars(strtoupper($p['brand'] ?? 'k2'), ENT_QUOTES, 'UTF-8') ?></span>
      </div>
    </a>
  <?php endforeach; ?>
</div>
<?php
render_footer();
