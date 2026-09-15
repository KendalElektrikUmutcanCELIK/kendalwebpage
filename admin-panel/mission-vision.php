<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/missionvision.php';
require __DIR__ . '/includes/layout.php';

$error = '';
$success = isset($_GET['saved']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'tr' => [
            'mission' => [
                'title' => trim((string) ($_POST['tr_mission_title'] ?? '')),
                'content' => trim((string) ($_POST['tr_mission_content'] ?? '')),
            ],
            'vision' => [
                'title' => trim((string) ($_POST['tr_vision_title'] ?? '')),
                'content' => trim((string) ($_POST['tr_vision_content'] ?? '')),
            ],
        ],
        'en' => [
            'mission' => [
                'title' => trim((string) ($_POST['en_mission_title'] ?? '')),
                'content' => trim((string) ($_POST['en_mission_content'] ?? '')),
            ],
            'vision' => [
                'title' => trim((string) ($_POST['en_vision_title'] ?? '')),
                'content' => trim((string) ($_POST['en_vision_content'] ?? '')),
            ],
        ],
    ];

    if ($data['tr']['mission']['title'] === '' || $data['tr']['vision']['title'] === '') {
        $error = 'Türkçe Misyon ve Vizyon başlıkları zorunludur.';
    } else {
        try {
            save_mission_vision($data);
            header('Location: mission-vision.php?saved=1');
            exit;
        } catch (RuntimeException $e) {
            $error = $e->getMessage();
        }
    }
}

$data = $data ?? load_mission_vision();

render_header('Misyon ve Vizyon', 'mission-vision');
?>
<div class="panel-header">
  <h1>Misyon ve Vizyon</h1>
</div>
<p class="page-subtitle">"/misyon-ve-vizyon" sayfasındaki iki kartın metnini yönetir. Kaydedince <strong>gerçek siteye yansır</strong> (bir sonraki build/yayınlamada).</p>

<?php if ($success): ?>
  <div class="success-banner">Kaydedildi.</div>
<?php endif; ?>
<?php if ($error): ?>
  <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
<?php endif; ?>

<form method="post" class="edit-form" style="max-width: 800px;">
  <h2 style="margin-top:0;">Misyon</h2>
  <div class="form-row">
    <label for="tr_mission_title">Başlık (Türkçe)</label>
    <input type="text" id="tr_mission_title" name="tr_mission_title" value="<?= htmlspecialchars($data['tr']['mission']['title'], ENT_QUOTES, 'UTF-8') ?>" required>
  </div>
  <div class="form-row">
    <label for="en_mission_title">Başlık (İngilizce)</label>
    <input type="text" id="en_mission_title" name="en_mission_title" value="<?= htmlspecialchars($data['en']['mission']['title'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="tr_mission_content">Metin (Türkçe)</label>
    <textarea id="tr_mission_content" name="tr_mission_content" rows="5"><?= htmlspecialchars($data['tr']['mission']['content'], ENT_QUOTES, 'UTF-8') ?></textarea>
  </div>
  <div class="form-row">
    <label for="en_mission_content">Metin (İngilizce)</label>
    <textarea id="en_mission_content" name="en_mission_content" rows="5"><?= htmlspecialchars($data['en']['mission']['content'], ENT_QUOTES, 'UTF-8') ?></textarea>
  </div>

  <h2>Vizyon</h2>
  <div class="form-row">
    <label for="tr_vision_title">Başlık (Türkçe)</label>
    <input type="text" id="tr_vision_title" name="tr_vision_title" value="<?= htmlspecialchars($data['tr']['vision']['title'], ENT_QUOTES, 'UTF-8') ?>" required>
  </div>
  <div class="form-row">
    <label for="en_vision_title">Başlık (İngilizce)</label>
    <input type="text" id="en_vision_title" name="en_vision_title" value="<?= htmlspecialchars($data['en']['vision']['title'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="tr_vision_content">Metin (Türkçe)</label>
    <textarea id="tr_vision_content" name="tr_vision_content" rows="5"><?= htmlspecialchars($data['tr']['vision']['content'], ENT_QUOTES, 'UTF-8') ?></textarea>
  </div>
  <div class="form-row">
    <label for="en_vision_content">Metin (İngilizce)</label>
    <textarea id="en_vision_content" name="en_vision_content" rows="5"><?= htmlspecialchars($data['en']['vision']['content'], ENT_QUOTES, 'UTF-8') ?></textarea>
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary">Kaydet</button>
  </div>
</form>
<?php
render_footer();
