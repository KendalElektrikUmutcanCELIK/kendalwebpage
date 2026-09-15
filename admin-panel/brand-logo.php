<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/upload.php';
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/includes/layout.php';

define('BRAND_LOGO_DIR', __DIR__ . '/../public/images/brands');

$brands = [
    'k2' => 'K2',
    'vanti' => 'Vanti',
    'global' => 'Global',
];

$error = '';
$success = isset($_GET['saved']);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && is_post_too_large()) {
    $error = 'Yüklediğin dosya sunucunun kabul ettiği üst sınırı aştığı için form hiç işlenemedi. Daha küçük bir dosya dene (maks. ' . round(MAX_LOGO_UPLOAD_BYTES / 1024 / 1024) . ' MB).';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $brand = (string) ($_POST['brand'] ?? '');
    $logoErrorCode = $_FILES['logo']['error'] ?? UPLOAD_ERR_NO_FILE;
    $uploadError = $logoErrorCode === UPLOAD_ERR_NO_FILE ? null : validate_upload($_FILES['logo'] ?? [], MAX_LOGO_UPLOAD_BYTES);
    if (!isset($brands[$brand])) {
        $error = 'Geçersiz marka.';
    } elseif ($logoErrorCode === UPLOAD_ERR_NO_FILE) {
        $error = 'Bir dosya seçmedin.';
    } elseif ($uploadError !== null) {
        $error = $uploadError;
    } elseif (!is_uploaded_file($_FILES['logo']['tmp_name'])) {
        $error = 'Bir dosya seçmedin.';
    } else {
        $tmpFile = $_FILES['logo']['tmp_name'];
        $origName = $_FILES['logo']['name'];
        $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

        if ($ext !== 'svg') {
            $error = 'Sadece SVG dosyası yükleyebilirsin — sitenin tüm marka logosu referansları özellikle .svg uzantısını arıyor, başka bir format siteye hiç yansımaz.';
        } else {
            $content = file_get_contents($tmpFile);
            if ($content === false || strpos($content, '<svg') === false) {
                $error = 'Geçerli bir SVG dosyası değil.';
            } else {
                if (!is_dir(BRAND_LOGO_DIR)) {
                    mkdir(BRAND_LOGO_DIR, 0755, true);
                }
                $destPath = BRAND_LOGO_DIR . '/' . $brand . '-logo.svg';
                if (!atomic_write($destPath, $content)) {
                    $error = 'Logo kaydedilemedi (dosya kilitli olabilir, tekrar dene).';
                }
            }
        }

        if ($error === '') {
            header('Location: brand-logo.php?saved=1');
            exit;
        }
    }
}

/** Gerçek sitedeki mevcut logo URL'sini döner (site her zaman .svg arıyor). */
function current_logo_url(string $brand): string
{
    return "/images/brands/$brand-logo.svg";
}
render_header('Marka Logoları', 'brand-logo');
?>
<div class="panel-header">
  <h1>Marka Logoları</h1>
</div>

<?php if ($success): ?>
  <div class="success-banner">Logo güncellendi.</div>
<?php endif; ?>
<?php if ($error): ?>
  <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
<?php endif; ?>

<?php foreach ($brands as $key => $label): ?>
  <form method="post" enctype="multipart/form-data" class="edit-form" style="margin-bottom: 20px;">
    <input type="hidden" name="brand" value="<?= $key ?>">
    <div class="form-row">
      <label><?= $label ?> Logosu</label>
      <div class="current-photo">
        <img src="<?= htmlspecialchars(current_logo_url($key), ENT_QUOTES, 'UTF-8') ?>" alt="<?= $label ?>" style="background:#111;">
        <span class="hint">Mevcut logo. Yeni bir dosya seçip kaydedersen bunun yerine geçer.</span>
      </div>
      <input type="file" name="logo" accept=".svg">
      <p class="hint">Sadece SVG dosyası (site sadece bu formatı gösteriyor). Maksimum dosya boyutu: 5 MB.</p>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn btn-primary"><?= $label ?> Logosunu Kaydet</button>
    </div>
  </form>
<?php endforeach; ?>
<?php
render_footer();
