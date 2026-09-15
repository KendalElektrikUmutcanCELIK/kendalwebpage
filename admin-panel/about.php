<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/about.php';
require __DIR__ . '/includes/layout.php';

$about = load_about();
$error = '';
$success = isset($_GET['saved']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formAction = (string) ($_POST['form_action'] ?? '');

    if ($formAction === 'save_intro') {
        $about['tr']['title'] = trim((string) ($_POST['tr_title'] ?? ''));
        $about['tr']['text1'] = trim((string) ($_POST['tr_text1'] ?? ''));
        $about['tr']['text2'] = trim((string) ($_POST['tr_text2'] ?? ''));
        $about['en']['title'] = trim((string) ($_POST['en_title'] ?? ''));
        $about['en']['text1'] = trim((string) ($_POST['en_text1'] ?? ''));
        $about['en']['text2'] = trim((string) ($_POST['en_text2'] ?? ''));

        if ($about['tr']['title'] === '') {
            $error = 'Türkçe başlık zorunludur.';
        } else {
            try {
                save_about($about);
                header('Location: about.php?saved=1');
                exit;
            } catch (RuntimeException $e) {
                $error = $e->getMessage();
            }
        }
    } elseif ($formAction === 'add_beat') {
        $about['tr']['beats'][] = ['title' => '', 'text' => ''];
        $about['en']['beats'][] = ['title' => '', 'text' => ''];
        save_about($about);
        header('Location: about.php?saved=1#beats');
        exit;
    } elseif ($formAction === 'update_beat') {
        $idx = (int) ($_POST['index'] ?? -1);
        if (isset($about['tr']['beats'][$idx], $about['en']['beats'][$idx])) {
            $about['tr']['beats'][$idx] = [
                'title' => trim((string) ($_POST['tr_beat_title'] ?? '')),
                'text' => trim((string) ($_POST['tr_beat_text'] ?? '')),
            ];
            $about['en']['beats'][$idx] = [
                'title' => trim((string) ($_POST['en_beat_title'] ?? '')),
                'text' => trim((string) ($_POST['en_beat_text'] ?? '')),
            ];
            try {
                save_about($about);
            } catch (RuntimeException $e) {
                $error = $e->getMessage();
            }
        }
        if ($error === '') {
            header('Location: about.php?saved=1#beats');
            exit;
        }
    } elseif ($formAction === 'delete_beat') {
        $idx = (int) ($_POST['index'] ?? -1);
        if (isset($about['tr']['beats'][$idx])) {
            array_splice($about['tr']['beats'], $idx, 1);
            array_splice($about['en']['beats'], $idx, 1);
            save_about($about);
        }
        header('Location: about.php?saved=1#beats');
        exit;
    } elseif ($formAction === 'move_beat') {
        $idx = (int) ($_POST['index'] ?? -1);
        $direction = (string) ($_POST['direction'] ?? '');
        $target = $direction === 'up' ? $idx - 1 : $idx + 1;
        if (isset($about['tr']['beats'][$idx], $about['tr']['beats'][$target])) {
            foreach (['tr', 'en'] as $lang) {
                [$about[$lang]['beats'][$idx], $about[$lang]['beats'][$target]] = [$about[$lang]['beats'][$target], $about[$lang]['beats'][$idx]];
            }
            save_about($about);
        }
        header('Location: about.php?saved=1#beats');
        exit;
    }
}

render_header('Hakkımızda', 'about');
?>
<div class="panel-header">
  <h1>Hakkımızda</h1>
</div>
<p class="page-subtitle">Anasayfadaki "Hakkımızda" bölümünün metnini ve zaman çizelgesindeki maddeleri yönetir. Kaydedince <strong>gerçek siteye yansır</strong> (bir sonraki build/yayınlamada).</p>

<?php if ($success): ?>
  <div class="success-banner">Kaydedildi.</div>
<?php endif; ?>
<?php if ($error): ?>
  <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
<?php endif; ?>

<form method="post" class="edit-form" style="max-width: 800px; margin-bottom: 28px;">
  <input type="hidden" name="form_action" value="save_intro">
  <h2 style="margin-top:0;">Ana Metin</h2>
  <div class="form-row">
    <label for="tr_title">Rozet Metni (Türkçe)</label>
    <input type="text" id="tr_title" name="tr_title" value="<?= htmlspecialchars($about['tr']['title'], ENT_QUOTES, 'UTF-8') ?>" required>
  </div>
  <div class="form-row">
    <label for="en_title">Rozet Metni (İngilizce)</label>
    <input type="text" id="en_title" name="en_title" value="<?= htmlspecialchars($about['en']['title'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="tr_text1">Başlık (Türkçe)</label>
    <textarea id="tr_text1" name="tr_text1" rows="3"><?= htmlspecialchars($about['tr']['text1'], ENT_QUOTES, 'UTF-8') ?></textarea>
  </div>
  <div class="form-row">
    <label for="en_text1">Başlık (İngilizce)</label>
    <textarea id="en_text1" name="en_text1" rows="3"><?= htmlspecialchars($about['en']['text1'], ENT_QUOTES, 'UTF-8') ?></textarea>
  </div>
  <div class="form-row">
    <label for="tr_text2">Alt Metin (Türkçe)</label>
    <textarea id="tr_text2" name="tr_text2" rows="3"><?= htmlspecialchars($about['tr']['text2'], ENT_QUOTES, 'UTF-8') ?></textarea>
  </div>
  <div class="form-row">
    <label for="en_text2">Alt Metin (İngilizce)</label>
    <textarea id="en_text2" name="en_text2" rows="3"><?= htmlspecialchars($about['en']['text2'], ENT_QUOTES, 'UTF-8') ?></textarea>
  </div>
  <div class="form-actions">
    <button type="submit" class="btn btn-primary">Ana Metni Kaydet</button>
  </div>
</form>

<h2 id="beats">Zaman Çizelgesi Maddeleri</h2>
<p class="hint" style="margin-bottom:16px;">Her madde TR ve EN sitede aynı sırada, karşılıklı gösterilir (iki dilde farklı metin olabilir, ama sırası ortaktır).</p>

<?php foreach ($about['tr']['beats'] as $i => $beat): ?>
  <div class="block-editor-card">
    <div class="block-editor-head">
      <strong>#<?= $i + 1 ?> — <?= htmlspecialchars($beat['title'], ENT_QUOTES, 'UTF-8') ?></strong>
      <div class="block-editor-actions">
        <form method="post" style="display:inline">
          <input type="hidden" name="form_action" value="move_beat">
          <input type="hidden" name="index" value="<?= $i ?>">
          <input type="hidden" name="direction" value="up">
          <button type="submit" class="btn" <?= $i === 0 ? 'disabled' : '' ?>>↑</button>
        </form>
        <form method="post" style="display:inline">
          <input type="hidden" name="form_action" value="move_beat">
          <input type="hidden" name="index" value="<?= $i ?>">
          <input type="hidden" name="direction" value="down">
          <button type="submit" class="btn" <?= $i === count($about['tr']['beats']) - 1 ? 'disabled' : '' ?>>↓</button>
        </form>
        <form method="post" style="display:inline" onsubmit="return confirm('Bu madde silinsin mi?')">
          <input type="hidden" name="form_action" value="delete_beat">
          <input type="hidden" name="index" value="<?= $i ?>">
          <button type="submit" class="btn btn-danger">Sil</button>
        </form>
      </div>
    </div>
    <form method="post">
      <input type="hidden" name="form_action" value="update_beat">
      <input type="hidden" name="index" value="<?= $i ?>">
      <div class="form-row">
        <label>Başlık (Türkçe)</label>
        <input type="text" name="tr_beat_title" value="<?= htmlspecialchars($beat['title'], ENT_QUOTES, 'UTF-8') ?>">
      </div>
      <div class="form-row">
        <label>Metin (Türkçe)</label>
        <textarea name="tr_beat_text" rows="2"><?= htmlspecialchars($beat['text'], ENT_QUOTES, 'UTF-8') ?></textarea>
      </div>
      <div class="form-row">
        <label>Başlık (İngilizce)</label>
        <input type="text" name="en_beat_title" value="<?= htmlspecialchars($about['en']['beats'][$i]['title'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
      </div>
      <div class="form-row">
        <label>Metin (İngilizce)</label>
        <textarea name="en_beat_text" rows="2"><?= htmlspecialchars($about['en']['beats'][$i]['text'] ?? '', ENT_QUOTES, 'UTF-8') ?></textarea>
      </div>
      <div class="form-actions" style="margin-top:0;">
        <button type="submit" class="btn btn-primary">Bu Maddeyi Kaydet</button>
      </div>
    </form>
  </div>
<?php endforeach; ?>

<form method="post">
  <input type="hidden" name="form_action" value="add_beat">
  <button type="submit" class="btn">+ Yeni Madde Ekle</button>
</form>
<?php
render_footer();
