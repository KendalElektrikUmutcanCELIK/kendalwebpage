<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/upload.php';
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/products.php';
require __DIR__ . '/lib/projects.php';
require __DIR__ . '/includes/layout.php';

$projects = load_projects();
$error = '';
$success = isset($_GET['saved']);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && is_post_too_large()) {
    $error = 'Yüklediğin dosya sunucunun kabul ettiği üst sınırı aştığı için form hiç işlenemedi. Daha küçük bir dosya dene (maks. ' . round(MAX_PHOTO_UPLOAD_BYTES / 1024 / 1024) . ' MB).';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formAction = (string) ($_POST['form_action'] ?? '');

    if ($formAction === 'add_project') {
        $name = trim((string) ($_POST['name'] ?? ''));
        $location = trim((string) ($_POST['location'] ?? ''));
        $photoErrorCode = $_FILES['photo']['error'] ?? UPLOAD_ERR_NO_FILE;

        if ($name === '' || $location === '') {
            $error = 'Proje adı ve konum zorunludur.';
        } elseif ($photoErrorCode === UPLOAD_ERR_NO_FILE) {
            $error = 'Bir fotoğraf seçmedin.';
        } else {
            $uploadError = validate_upload($_FILES['photo'], MAX_PHOTO_UPLOAD_BYTES);
            if ($uploadError !== null) {
                $error = $uploadError;
            } elseif (!is_uploaded_file($_FILES['photo']['tmp_name'])) {
                $error = 'Bir fotoğraf seçmedin.';
            } else {
                $id = generate_next_project_id($projects);
                $result = save_project_image($_FILES['photo']['tmp_name'], $id);
                if (!$result['ok']) {
                    $error = $result['error'];
                } else {
                    $projects[] = ['id' => $id, 'name' => $name, 'location' => $location, 'image' => $result['relativePath']];
                    try {
                        save_projects($projects);
                        header('Location: projects.php?saved=1');
                        exit;
                    } catch (RuntimeException $e) {
                        $error = $e->getMessage();
                    }
                }
            }
        }
    } elseif ($formAction === 'delete_project') {
        $id = (string) ($_POST['id'] ?? '');
        $projects = array_values(array_filter($projects, fn ($p) => ($p['id'] ?? null) !== $id));
        save_projects($projects);
        delete_project_image($id);
        header('Location: projects.php?saved=1');
        exit;
    } elseif ($formAction === 'move_project') {
        $id = (string) ($_POST['id'] ?? '');
        $direction = (string) ($_POST['direction'] ?? '');
        $idx = null;
        foreach ($projects as $i => $p) {
            if (($p['id'] ?? null) === $id) { $idx = $i; break; }
        }
        if ($idx !== null) {
            $target = $direction === 'up' ? $idx - 1 : $idx + 1;
            if ($target >= 0 && $target < count($projects)) {
                [$projects[$idx], $projects[$target]] = [$projects[$target], $projects[$idx]];
                save_projects($projects);
            }
        }
        header('Location: projects.php?saved=1');
        exit;
    }
}

render_header('Projeler', 'projects');
?>
<div class="panel-header">
  <h1>Projeler</h1>
</div>
<p class="page-subtitle">Anasayfadaki "Türkiye'nin Dört Bir Yanında" referans projeler şeridini yönetir.</p>

<?php if ($success): ?>
  <div class="success-banner">Kaydedildi. Değişiklik bir sonraki build/dev-server yenilemesinde gerçek siteye yansır.</div>
<?php endif; ?>
<?php if ($error): ?>
  <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
<?php endif; ?>

<p class="result-count"><?= count($projects) ?> proje kayıtlı.</p>

<?php if (empty($projects)): ?>
  <p class="hint">Henüz hiç proje eklenmemiş.</p>
<?php else: ?>
  <div class="product-grid" style="margin-bottom: 24px;">
    <?php foreach ($projects as $i => $p): ?>
      <div class="product-card" style="cursor:default;">
        <div class="product-thumb">
          <img src="/images/<?= htmlspecialchars($p['image'], ENT_QUOTES, 'UTF-8') ?>" alt="">
        </div>
        <div class="product-info">
          <span class="product-id"><?= htmlspecialchars($p['id'], ENT_QUOTES, 'UTF-8') ?></span>
          <span class="product-name"><?= htmlspecialchars($p['name'], ENT_QUOTES, 'UTF-8') ?></span>
          <span class="product-brand"><?= htmlspecialchars($p['location'], ENT_QUOTES, 'UTF-8') ?></span>
        </div>
        <div class="block-editor-actions" style="padding: 0 12px 12px;">
          <form method="post" style="display:inline">
            <input type="hidden" name="form_action" value="move_project">
            <input type="hidden" name="id" value="<?= htmlspecialchars($p['id'], ENT_QUOTES, 'UTF-8') ?>">
            <input type="hidden" name="direction" value="up">
            <button type="submit" class="btn" <?= $i === 0 ? 'disabled' : '' ?>>↑</button>
          </form>
          <form method="post" style="display:inline">
            <input type="hidden" name="form_action" value="move_project">
            <input type="hidden" name="id" value="<?= htmlspecialchars($p['id'], ENT_QUOTES, 'UTF-8') ?>">
            <input type="hidden" name="direction" value="down">
            <button type="submit" class="btn" <?= $i === count($projects) - 1 ? 'disabled' : '' ?>>↓</button>
          </form>
          <form method="post" style="display:inline" onsubmit="return confirm('Bu proje silinsin mi? Fotoğrafı da diskten silinecek.')">
            <input type="hidden" name="form_action" value="delete_project">
            <input type="hidden" name="id" value="<?= htmlspecialchars($p['id'], ENT_QUOTES, 'UTF-8') ?>">
            <button type="submit" class="btn btn-danger">Sil</button>
          </form>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<div class="block-editor-card">
  <h2 style="margin-top:0;">+ Yeni Proje Ekle</h2>
  <form method="post" enctype="multipart/form-data" class="edit-form">
    <input type="hidden" name="form_action" value="add_project">
    <div class="form-row">
      <label for="name">Proje/Müşteri Adı</label>
      <input type="text" id="name" name="name" required>
    </div>
    <div class="form-row">
      <label for="location">Konum</label>
      <input type="text" id="location" name="location" placeholder="Örn. Beyoğlu – İstanbul" required>
    </div>
    <div class="form-row">
      <label for="photo">Fotoğraf</label>
      <input type="file" id="photo" name="photo" accept="image/*" required>
      <p class="hint">Otomatik olarak 800x800 içine sığdırılıp WebP'ye çevrilir. Maksimum dosya boyutu: 10 MB.</p>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Proje Ekle</button>
    </div>
  </form>
</div>
<?php
render_footer();
