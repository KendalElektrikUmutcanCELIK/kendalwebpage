<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/navlinks.php';
require __DIR__ . '/lib/pages.php';
require __DIR__ . '/includes/layout.php';

$links = load_nav_links();
$error = '';
$success = isset($_GET['saved']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formAction = (string) ($_POST['form_action'] ?? '');

    if ($formAction === 'add_link') {
        $labelTr = trim((string) ($_POST['label_tr'] ?? ''));
        $labelEn = trim((string) ($_POST['label_en'] ?? ''));
        $url = trim((string) ($_POST['url'] ?? ''));

        if ($labelTr === '' || $url === '') {
            $error = 'Başlık (Türkçe) ve adres zorunludur.';
        } elseif (!str_starts_with($url, '/') && !preg_match('#^https?://#', $url)) {
            $error = 'Adres "/" ile başlamalı (site içi) veya http(s):// ile başlamalı (dış site).';
        } else {
            $links[] = [
                'id' => generate_nav_link_id(),
                'label' => ['tr' => $labelTr, 'en' => $labelEn !== '' ? $labelEn : $labelTr],
                'url' => $url,
            ];
            try {
                save_nav_links($links);
                header('Location: navbar-links.php?saved=1');
                exit;
            } catch (RuntimeException $e) {
                $error = $e->getMessage();
            }
        }
    } elseif ($formAction === 'delete_link') {
        $id = (string) ($_POST['id'] ?? '');
        $links = array_values(array_filter($links, fn ($l) => ($l['id'] ?? null) !== $id));
        save_nav_links($links);
        header('Location: navbar-links.php?saved=1');
        exit;
    } elseif ($formAction === 'move_link') {
        $id = (string) ($_POST['id'] ?? '');
        $direction = (string) ($_POST['direction'] ?? '');
        $idx = null;
        foreach ($links as $i => $l) {
            if (($l['id'] ?? null) === $id) { $idx = $i; break; }
        }
        if ($idx !== null) {
            $target = $direction === 'up' ? $idx - 1 : $idx + 1;
            if ($target >= 0 && $target < count($links)) {
                [$links[$idx], $links[$target]] = [$links[$target], $links[$idx]];
                save_nav_links($links);
            }
        }
        header('Location: navbar-links.php?saved=1');
        exit;
    }
}

$customPages = load_pages();

render_header('Navbar Linkleri', 'navbar-links');
?>
<div class="panel-header">
  <h1>Navbar Linkleri</h1>
</div>
<p class="page-subtitle">Ana sitenin üst menüsüne (navbar) "Sayfalarımız" başlığı altında ek linkler ekler. Genellikle "Sayfalar" bölümünde oluşturduğun bir sayfaya link vermek için kullanılır. Hiç link yoksa menüde ek bir bölüm görünmez.</p>

<?php if ($success): ?>
  <div class="success-banner">Kaydedildi. Değişiklik bir sonraki build/dev-server yenilemesinde gerçek siteye yansır.</div>
<?php endif; ?>
<?php if ($error): ?>
  <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
<?php endif; ?>

<?php if (empty($links)): ?>
  <p class="hint">Henüz hiç navbar linki yok.</p>
<?php else: ?>
  <div class="block-editor-card">
    <?php foreach ($links as $i => $link): ?>
      <div class="block-editor-head" style="border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 10px;">
        <div>
          <strong><?= htmlspecialchars($link['label']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?></strong>
          <span class="hint">&nbsp;→ <?= htmlspecialchars($link['url'] ?? '', ENT_QUOTES, 'UTF-8') ?></span>
        </div>
        <div class="block-editor-actions">
          <form method="post" style="display:inline">
            <input type="hidden" name="form_action" value="move_link">
            <input type="hidden" name="id" value="<?= htmlspecialchars($link['id'], ENT_QUOTES, 'UTF-8') ?>">
            <input type="hidden" name="direction" value="up">
            <button type="submit" class="btn" <?= $i === 0 ? 'disabled' : '' ?>>↑</button>
          </form>
          <form method="post" style="display:inline">
            <input type="hidden" name="form_action" value="move_link">
            <input type="hidden" name="id" value="<?= htmlspecialchars($link['id'], ENT_QUOTES, 'UTF-8') ?>">
            <input type="hidden" name="direction" value="down">
            <button type="submit" class="btn" <?= $i === count($links) - 1 ? 'disabled' : '' ?>>↓</button>
          </form>
          <form method="post" style="display:inline" onsubmit="return confirm('Bu link silinsin mi?')">
            <input type="hidden" name="form_action" value="delete_link">
            <input type="hidden" name="id" value="<?= htmlspecialchars($link['id'], ENT_QUOTES, 'UTF-8') ?>">
            <button type="submit" class="btn btn-danger">Sil</button>
          </form>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<div class="block-editor-card">
  <h2 style="margin-top:0;">+ Yeni Link Ekle</h2>
  <form method="post" class="edit-form">
    <input type="hidden" name="form_action" value="add_link">
    <?php if (!empty($customPages)): ?>
      <div class="form-row">
        <label for="page_picker">Mevcut bir sayfadan seç (opsiyonel, adres otomatik dolar)</label>
        <select id="page_picker" onchange="if(this.value){document.getElementById('url').value=this.value;}">
          <option value="">— Seç —</option>
          <?php foreach ($customPages as $slug => $p): ?>
            <option value="/<?= htmlspecialchars($slug, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($p['title']['tr'] ?? $slug, ENT_QUOTES, 'UTF-8') ?></option>
          <?php endforeach; ?>
        </select>
      </div>
    <?php endif; ?>
    <div class="form-row">
      <label for="label_tr">Menüde Görünecek Başlık (Türkçe)</label>
      <input type="text" id="label_tr" name="label_tr" required>
    </div>
    <div class="form-row">
      <label for="label_en">Menüde Görünecek Başlık (İngilizce, opsiyonel)</label>
      <input type="text" id="label_en" name="label_en">
    </div>
    <div class="form-row">
      <label for="url">Adres</label>
      <input type="text" id="url" name="url" placeholder="/ozel-kampanya veya https://..." required>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Link Ekle</button>
    </div>
  </form>
</div>
<?php
render_footer();
