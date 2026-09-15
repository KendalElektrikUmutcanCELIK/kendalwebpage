<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/upload.php';
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/products.php';
require __DIR__ . '/lib/retailers.php';
require __DIR__ . '/includes/layout.php';

$retailers = load_retailers();
$error = '';
$success = isset($_GET['saved']);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && is_post_too_large()) {
    $error = 'Yüklediğin dosya sunucunun kabul ettiği üst sınırı aştığı için form hiç işlenemedi. Daha küçük bir dosya dene (maks. ' . round(MAX_PHOTO_UPLOAD_BYTES / 1024 / 1024) . ' MB).';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formAction = (string) ($_POST['form_action'] ?? '');

    if ($formAction === 'add_retailer') {
        $name = trim((string) ($_POST['name'] ?? ''));
        $logoErrorCode = $_FILES['logo']['error'] ?? UPLOAD_ERR_NO_FILE;

        if ($name === '') {
            $error = 'Market adı zorunludur.';
        } elseif ($logoErrorCode === UPLOAD_ERR_NO_FILE) {
            $error = 'Bir logo dosyası seçmedin.';
        } else {
            $uploadError = validate_upload($_FILES['logo'], MAX_PHOTO_UPLOAD_BYTES);
            if ($uploadError !== null) {
                $error = $uploadError;
            } elseif (!is_uploaded_file($_FILES['logo']['tmp_name'])) {
                $error = 'Bir logo dosyası seçmedin.';
            } else {
                $id = generate_unique_retailer_id($name, $retailers);
                $result = save_retailer_logo($_FILES['logo']['tmp_name'], $id);
                if (!$result['ok']) {
                    $error = $result['error'];
                } else {
                    $retailers[] = ['id' => $id, 'name' => $name, 'logo' => $result['relativePath']];
                    try {
                        save_retailers($retailers);
                        header('Location: retailers.php?saved=1');
                        exit;
                    } catch (RuntimeException $e) {
                        $error = $e->getMessage();
                    }
                }
            }
        }
    } elseif ($formAction === 'delete_retailer') {
        $id = (string) ($_POST['id'] ?? '');
        $retailers = array_values(array_filter($retailers, fn ($r) => ($r['id'] ?? null) !== $id));
        save_retailers($retailers);
        delete_retailer_logo($id);
        header('Location: retailers.php?saved=1');
        exit;
    } elseif ($formAction === 'move_retailer') {
        $id = (string) ($_POST['id'] ?? '');
        $direction = (string) ($_POST['direction'] ?? '');
        $idx = null;
        foreach ($retailers as $i => $r) {
            if (($r['id'] ?? null) === $id) { $idx = $i; break; }
        }
        if ($idx !== null) {
            $target = $direction === 'up' ? $idx - 1 : $idx + 1;
            if ($target >= 0 && $target < count($retailers)) {
                [$retailers[$idx], $retailers[$target]] = [$retailers[$target], $retailers[$idx]];
                save_retailers($retailers);
            }
        }
        header('Location: retailers.php?saved=1');
        exit;
    }
}

render_header('Zincir Marketler', 'retailers');
?>
<div class="panel-header">
  <h1>Zincir Marketler</h1>
</div>
<p class="page-subtitle">Anasayfadaki "Zincir Marketlerde" bölümünde dönen logo şeridini yönetir.</p>

<?php if ($success): ?>
  <div class="success-banner">Kaydedildi. Değişiklik bir sonraki build/dev-server yenilemesinde gerçek siteye yansır.</div>
<?php endif; ?>
<?php if ($error): ?>
  <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
<?php endif; ?>

<?php if (empty($retailers)): ?>
  <p class="hint">Henüz hiç market eklenmemiş.</p>
<?php else: ?>
  <div class="block-editor-card">
    <?php foreach ($retailers as $i => $r): ?>
      <div class="block-editor-head" style="border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 10px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="/images/<?= htmlspecialchars($r['logo'], ENT_QUOTES, 'UTF-8') ?>" alt="" style="width:56px; height:56px; object-fit:contain; border:1px solid var(--border); border-radius:8px; background:#fafafa; padding:4px;">
          <strong><?= htmlspecialchars($r['name'], ENT_QUOTES, 'UTF-8') ?></strong>
        </div>
        <div class="block-editor-actions">
          <form method="post" style="display:inline">
            <input type="hidden" name="form_action" value="move_retailer">
            <input type="hidden" name="id" value="<?= htmlspecialchars($r['id'], ENT_QUOTES, 'UTF-8') ?>">
            <input type="hidden" name="direction" value="up">
            <button type="submit" class="btn" <?= $i === 0 ? 'disabled' : '' ?>>↑</button>
          </form>
          <form method="post" style="display:inline">
            <input type="hidden" name="form_action" value="move_retailer">
            <input type="hidden" name="id" value="<?= htmlspecialchars($r['id'], ENT_QUOTES, 'UTF-8') ?>">
            <input type="hidden" name="direction" value="down">
            <button type="submit" class="btn" <?= $i === count($retailers) - 1 ? 'disabled' : '' ?>>↓</button>
          </form>
          <form method="post" style="display:inline" onsubmit="return confirm('Bu market silinsin mi? Logosu da diskten silinecek.')">
            <input type="hidden" name="form_action" value="delete_retailer">
            <input type="hidden" name="id" value="<?= htmlspecialchars($r['id'], ENT_QUOTES, 'UTF-8') ?>">
            <button type="submit" class="btn btn-danger">Sil</button>
          </form>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<div class="block-editor-card">
  <h2 style="margin-top:0;">+ Yeni Market Ekle</h2>
  <form method="post" enctype="multipart/form-data" class="edit-form">
    <input type="hidden" name="form_action" value="add_retailer">
    <div class="form-row">
      <label for="name">Market Adı</label>
      <input type="text" id="name" name="name" required>
    </div>
    <div class="form-row">
      <label for="logo">Logo</label>
      <input type="file" id="logo" name="logo" accept="image/*" required>
      <p class="hint">Otomatik olarak 800x800 içine sığdırılıp WebP'ye çevrilir. Maksimum dosya boyutu: 10 MB.</p>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Market Ekle</button>
    </div>
  </form>
</div>
<?php
render_footer();
