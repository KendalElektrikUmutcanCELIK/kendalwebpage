<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/upload.php';
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/certificates.php';
require __DIR__ . '/includes/layout.php';

$certificates = load_certificates();
$error = '';
$success = isset($_GET['saved']);
$activeCategory = (string) ($_GET['cat'] ?? 'iso');
if (!isset(CERTIFICATE_CATEGORIES[$activeCategory])) {
    $activeCategory = 'iso';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && is_post_too_large()) {
    $error = 'Yüklediğin dosya sunucunun kabul ettiği üst sınırı aştığı için form hiç işlenemedi. Daha küçük bir dosya dene (maks. ' . round(MAX_PHOTO_UPLOAD_BYTES / 1024 / 1024) . ' MB).';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formAction = (string) ($_POST['form_action'] ?? '');
    $category = (string) ($_POST['category'] ?? '');

    if (!isset(CERTIFICATE_CATEGORIES[$category])) {
        $error = 'Geçersiz kategori.';
    } elseif ($formAction === 'add_image') {
        $activeCategory = $category;
        $photoErrorCode = $_FILES['photo']['error'] ?? UPLOAD_ERR_NO_FILE;
        if ($photoErrorCode === UPLOAD_ERR_NO_FILE) {
            $error = 'Bir görsel seçmedin.';
        } else {
            $uploadError = validate_upload($_FILES['photo'], MAX_PHOTO_UPLOAD_BYTES);
            if ($uploadError !== null) {
                $error = $uploadError;
            } elseif (!is_uploaded_file($_FILES['photo']['tmp_name'])) {
                $error = 'Bir görsel seçmedin.';
            } else {
                $result = save_certificate_image($_FILES['photo']['tmp_name'], $category);
                if (!$result['ok']) {
                    $error = $result['error'];
                } else {
                    $certificates[$category][] = $result['relativePath'];
                    try {
                        save_certificates($certificates);
                        header('Location: certificates.php?saved=1&cat=' . urlencode($category));
                        exit;
                    } catch (RuntimeException $e) {
                        $error = $e->getMessage();
                    }
                }
            }
        }
    } elseif ($formAction === 'delete_image') {
        $activeCategory = $category;
        $path = (string) ($_POST['path'] ?? '');
        $certificates[$category] = array_values(array_filter($certificates[$category], fn ($p) => $p !== $path));
        save_certificates($certificates);
        delete_certificate_image_file($path);
        header('Location: certificates.php?saved=1&cat=' . urlencode($category));
        exit;
    } elseif ($formAction === 'move_image') {
        $activeCategory = $category;
        $path = (string) ($_POST['path'] ?? '');
        $direction = (string) ($_POST['direction'] ?? '');
        $idx = array_search($path, $certificates[$category], true);
        if ($idx !== false) {
            $target = $direction === 'up' ? $idx - 1 : $idx + 1;
            if ($target >= 0 && $target < count($certificates[$category])) {
                [$certificates[$category][$idx], $certificates[$category][$target]] = [$certificates[$category][$target], $certificates[$category][$idx]];
                save_certificates($certificates);
            }
        }
        header('Location: certificates.php?saved=1&cat=' . urlencode($category));
        exit;
    }
}

render_header('Sertifikalar', 'certificates');
?>
<div class="panel-header">
  <h1>Sertifikalar</h1>
</div>
<p class="page-subtitle">"/sertifikalar/iso", "/sertifikalar/tse" ve "/sertifikalar/marka-tescil" sayfalarındaki belge görsellerini yönetir.</p>

<?php if ($success): ?>
  <div class="success-banner">Kaydedildi. Değişiklik bir sonraki build/dev-server yenilemesinde gerçek siteye yansır.</div>
<?php endif; ?>
<?php if ($error): ?>
  <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
<?php endif; ?>

<div class="tab-bar">
  <?php foreach (CERTIFICATE_CATEGORIES as $key => $info): ?>
    <a href="certificates.php?cat=<?= urlencode($key) ?>" class="btn<?= $key === $activeCategory ? ' btn-primary' : '' ?>"><?= htmlspecialchars($info['label'], ENT_QUOTES, 'UTF-8') ?> (<?= count($certificates[$key]) ?>)</a>
  <?php endforeach; ?>
</div>

<div class="gallery-image-list">
  <?php foreach ($certificates[$activeCategory] as $i => $path): ?>
    <div class="gallery-image-item">
      <img src="/images/<?= htmlspecialchars($path, ENT_QUOTES, 'UTF-8') ?>" alt="">
      <div class="block-editor-actions" style="justify-content:center; margin-bottom:6px;">
        <form method="post" style="display:inline">
          <input type="hidden" name="form_action" value="move_image">
          <input type="hidden" name="category" value="<?= htmlspecialchars($activeCategory, ENT_QUOTES, 'UTF-8') ?>">
          <input type="hidden" name="path" value="<?= htmlspecialchars($path, ENT_QUOTES, 'UTF-8') ?>">
          <input type="hidden" name="direction" value="up">
          <button type="submit" class="btn" <?= $i === 0 ? 'disabled' : '' ?>>↑</button>
        </form>
        <form method="post" style="display:inline">
          <input type="hidden" name="form_action" value="move_image">
          <input type="hidden" name="category" value="<?= htmlspecialchars($activeCategory, ENT_QUOTES, 'UTF-8') ?>">
          <input type="hidden" name="path" value="<?= htmlspecialchars($path, ENT_QUOTES, 'UTF-8') ?>">
          <input type="hidden" name="direction" value="down">
          <button type="submit" class="btn" <?= $i === count($certificates[$activeCategory]) - 1 ? 'disabled' : '' ?>>↓</button>
        </form>
      </div>
      <form method="post" onsubmit="return confirm('Bu görsel silinsin mi?')">
        <input type="hidden" name="form_action" value="delete_image">
        <input type="hidden" name="category" value="<?= htmlspecialchars($activeCategory, ENT_QUOTES, 'UTF-8') ?>">
        <input type="hidden" name="path" value="<?= htmlspecialchars($path, ENT_QUOTES, 'UTF-8') ?>">
        <button type="submit" class="btn btn-danger" style="width:100%;">Sil</button>
      </form>
    </div>
  <?php endforeach; ?>
</div>
<?php if (empty($certificates[$activeCategory])): ?>
  <p class="hint">Bu kategoride henüz hiç belge yok.</p>
<?php endif; ?>

<div class="block-editor-card">
  <h2 style="margin-top:0;">+ <?= htmlspecialchars(CERTIFICATE_CATEGORIES[$activeCategory]['label'], ENT_QUOTES, 'UTF-8') ?> Kategorisine Belge Ekle</h2>
  <form method="post" enctype="multipart/form-data" class="edit-form">
    <input type="hidden" name="form_action" value="add_image">
    <input type="hidden" name="category" value="<?= htmlspecialchars($activeCategory, ENT_QUOTES, 'UTF-8') ?>">
    <div class="form-row">
      <label for="photo">Belge Görseli</label>
      <input type="file" id="photo" name="photo" accept="image/*" required>
      <p class="hint">Otomatik olarak 1400x1400 içine sığdırılıp WebP'ye çevrilir. Maksimum dosya boyutu: 10 MB.</p>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Belge Ekle</button>
    </div>
  </form>
</div>
<?php
render_footer();
