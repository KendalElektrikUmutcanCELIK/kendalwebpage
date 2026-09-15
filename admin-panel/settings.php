<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/settings.php';
require __DIR__ . '/includes/layout.php';

$error = '';
$success = isset($_GET['saved']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $settings = [
        'tr' => [
            'address' => trim((string) ($_POST['tr_address'] ?? '')),
            'phone' => trim((string) ($_POST['tr_phone'] ?? '')),
            'salesPhone' => trim((string) ($_POST['tr_sales_phone'] ?? '')),
            'supportPhone' => trim((string) ($_POST['tr_support_phone'] ?? '')),
        ],
        'en' => [
            'address' => trim((string) ($_POST['en_address'] ?? '')),
            'phone' => trim((string) ($_POST['en_phone'] ?? '')),
            'salesPhone' => trim((string) ($_POST['en_sales_phone'] ?? '')),
            'supportPhone' => trim((string) ($_POST['en_support_phone'] ?? '')),
        ],
        'email' => trim((string) ($_POST['email'] ?? '')),
        'facebookUrl' => trim((string) ($_POST['facebook_url'] ?? '')),
        'linkedinUrl' => trim((string) ($_POST['linkedin_url'] ?? '')),
        'instagramUrl' => trim((string) ($_POST['instagram_url'] ?? '')),
    ];
    if ($settings['tr']['address'] === '' || $settings['email'] === '') {
        $error = 'Türkçe adres ve e-posta zorunludur.';
    } else {
        try {
            save_settings($settings);
            header('Location: settings.php?saved=1');
            exit;
        } catch (RuntimeException $e) {
            $error = $e->getMessage();
        }
    }
}

$settings = $settings ?? load_settings();

render_header('Site Ayarları', 'settings');
?>
<div class="panel-header">
  <h1>Site Ayarları</h1>
</div>
<p class="page-subtitle">Anasayfa, K2/Vanti/Global ve İletişim sayfalarında görünen paylaşılan iletişim bilgileri. Kaydedince <strong>gerçek siteye yansır</strong> (bir sonraki build/yayınlamada).</p>

<?php if ($success): ?>
  <div class="success-banner">Kaydedildi.</div>
<?php endif; ?>
<?php if ($error): ?>
  <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
<?php endif; ?>

<form method="post" class="edit-form">
  <div class="form-row">
    <label for="tr_address">Adres (Türkçe)</label>
    <input type="text" id="tr_address" name="tr_address" value="<?= htmlspecialchars($settings['tr']['address'], ENT_QUOTES, 'UTF-8') ?>" required>
  </div>
  <div class="form-row">
    <label for="en_address">Adres (İngilizce)</label>
    <input type="text" id="en_address" name="en_address" value="<?= htmlspecialchars($settings['en']['address'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="tr_phone">İletişim Hattı (Türkçe)</label>
    <input type="text" id="tr_phone" name="tr_phone" value="<?= htmlspecialchars($settings['tr']['phone'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="en_phone">İletişim Hattı (İngilizce, ör. +90 ile başlar)</label>
    <input type="text" id="en_phone" name="en_phone" value="<?= htmlspecialchars($settings['en']['phone'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="tr_sales_phone">Satış Destek Hattı (Türkçe)</label>
    <input type="text" id="tr_sales_phone" name="tr_sales_phone" value="<?= htmlspecialchars($settings['tr']['salesPhone'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="en_sales_phone">Satış Destek Hattı (İngilizce)</label>
    <input type="text" id="en_sales_phone" name="en_sales_phone" value="<?= htmlspecialchars($settings['en']['salesPhone'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="tr_support_phone">Teknik Servis Hattı (Türkçe)</label>
    <input type="text" id="tr_support_phone" name="tr_support_phone" value="<?= htmlspecialchars($settings['tr']['supportPhone'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="en_support_phone">Teknik Servis Hattı (İngilizce)</label>
    <input type="text" id="en_support_phone" name="en_support_phone" value="<?= htmlspecialchars($settings['en']['supportPhone'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="email">E-posta</label>
    <input type="text" id="email" name="email" value="<?= htmlspecialchars($settings['email'], ENT_QUOTES, 'UTF-8') ?>" required>
  </div>
  <div class="form-row">
    <label for="facebook_url">Facebook Linki</label>
    <input type="text" id="facebook_url" name="facebook_url" value="<?= htmlspecialchars($settings['facebookUrl'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="linkedin_url">LinkedIn Linki</label>
    <input type="text" id="linkedin_url" name="linkedin_url" value="<?= htmlspecialchars($settings['linkedinUrl'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="instagram_url">Instagram Linki</label>
    <input type="text" id="instagram_url" name="instagram_url" value="<?= htmlspecialchars($settings['instagramUrl'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-actions">
    <button type="submit" class="btn btn-primary">Kaydet</button>
  </div>
</form>
<?php
render_footer();
