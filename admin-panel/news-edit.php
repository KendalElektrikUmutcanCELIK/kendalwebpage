<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/upload.php';
require __DIR__ . '/lib/news.php';
require __DIR__ . '/includes/layout.php';

$news = load_news();
$editId = trim((string) ($_GET['id'] ?? ''));
$isNew = $editId === '';
$error = '';
$success = isset($_GET['saved']);

/** @param array<int, array<string, mixed>> $items */
function find_news_index(array $items, string $id): ?int
{
    foreach ($items as $i => $item) {
        if (($item['id'] ?? null) === $id) {
            return $i;
        }
    }
    return null;
}

$trIdx = $isNew ? null : find_news_index($news['tr'], $editId);
$enIdx = $isNew ? null : find_news_index($news['en'], $editId);

if (!$isNew && ($trIdx === null || $enIdx === null)) {
    http_response_code(404);
    die('Haber bulunamadı.');
}

$trItem = $isNew ? ['id' => '', 'title' => '', 'date' => '', 'images' => [], 'content' => []] : $news['tr'][$trIdx];
$enItem = $isNew ? ['id' => '', 'title' => '', 'date' => '', 'images' => [], 'content' => []] : $news['en'][$enIdx];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && is_post_too_large()) {
    $error = 'Yüklediğin dosya sunucunun kabul ettiği üst sınırı aştığı için form hiç işlenemedi. Daha küçük bir dosya dene (maks. ' . round(MAX_PHOTO_UPLOAD_BYTES / 1024 / 1024) . ' MB).';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formAction = (string) ($_POST['form_action'] ?? 'save_meta');

    if ($formAction === 'save_meta') {
        $titleTr = trim((string) ($_POST['title_tr'] ?? ''));
        $titleEn = trim((string) ($_POST['title_en'] ?? ''));
        $dateTr = trim((string) ($_POST['date_tr'] ?? ''));
        $dateEn = trim((string) ($_POST['date_en'] ?? ''));

        if ($titleTr === '' || $dateTr === '') {
            $error = 'Türkçe başlık ve tarih zorunludur.';
        } else {
            if ($isNew) {
                $id = generate_next_news_id($news['tr']);
                $trItem = ['id' => $id, 'title' => $titleTr, 'date' => $dateTr, 'images' => [], 'content' => []];
                $enItem = ['id' => $id, 'title' => $titleEn !== '' ? $titleEn : $titleTr, 'date' => $dateEn !== '' ? $dateEn : $dateTr, 'images' => [], 'content' => []];
                $news['tr'][] = $trItem;
                $news['en'][] = $enItem;
            } else {
                $id = $editId;
                $news['tr'][$trIdx]['title'] = $titleTr;
                $news['tr'][$trIdx]['date'] = $dateTr;
                $news['en'][$enIdx]['title'] = $titleEn !== '' ? $titleEn : $titleTr;
                $news['en'][$enIdx]['date'] = $dateEn !== '' ? $dateEn : $dateTr;
            }
            try {
                save_news($news);
                header('Location: news-edit.php?id=' . urlencode($id) . '&saved=1');
                exit;
            } catch (RuntimeException $e) {
                $error = $e->getMessage();
            }
        }
    } elseif (!$isNew && $formAction === 'delete_news') {
        array_splice($news['tr'], $trIdx, 1);
        array_splice($news['en'], $enIdx, 1);
        save_news($news);
        delete_news_images($editId);
        header('Location: news.php?deleted=1');
        exit;
    } elseif (!$isNew && $formAction === 'add_gallery_image') {
        if (($_FILES['gallery_image']['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            $error = 'Bir görsel seç.';
        } else {
            $uploadError = validate_upload($_FILES['gallery_image'], MAX_PHOTO_UPLOAD_BYTES);
            if ($uploadError !== null) {
                $error = $uploadError;
            } elseif (is_uploaded_file($_FILES['gallery_image']['tmp_name'])) {
                $index = count($news['tr'][$trIdx]['images']);
                $result = save_news_gallery_image($_FILES['gallery_image']['tmp_name'], $editId, $index);
                if (!$result['ok']) {
                    $error = 'Fotoğraf işlenemedi: ' . $result['error'];
                } else {
                    $news['tr'][$trIdx]['images'][] = $result['relativePath'];
                    $news['en'][$enIdx]['images'][] = $result['relativePath'];
                    save_news($news);
                    header('Location: news-edit.php?id=' . urlencode($editId) . '&saved=1');
                    exit;
                }
            }
        }
    } elseif (!$isNew && $formAction === 'remove_gallery_image') {
        $index = (int) ($_POST['index'] ?? -1);
        if (isset($news['tr'][$trIdx]['images'][$index])) {
            array_splice($news['tr'][$trIdx]['images'], $index, 1);
        }
        if (isset($news['en'][$enIdx]['images'][$index])) {
            array_splice($news['en'][$enIdx]['images'], $index, 1);
        }
        save_news($news);
        header('Location: news-edit.php?id=' . urlencode($editId) . '&saved=1');
        exit;
    } elseif (!$isNew && $formAction === 'move_gallery_image') {
        $index = (int) ($_POST['index'] ?? -1);
        $direction = (string) ($_POST['direction'] ?? '');
        $target = $direction === 'up' ? $index - 1 : $index + 1;
        if (isset($news['tr'][$trIdx]['images'][$index], $news['tr'][$trIdx]['images'][$target])) {
            [$news['tr'][$trIdx]['images'][$index], $news['tr'][$trIdx]['images'][$target]] = [$news['tr'][$trIdx]['images'][$target], $news['tr'][$trIdx]['images'][$index]];
            [$news['en'][$enIdx]['images'][$index], $news['en'][$enIdx]['images'][$target]] = [$news['en'][$enIdx]['images'][$target], $news['en'][$enIdx]['images'][$index]];
            save_news($news);
        }
        header('Location: news-edit.php?id=' . urlencode($editId) . '&saved=1');
        exit;
    } elseif (!$isNew && $formAction === 'add_paragraph') {
        $lang = (string) ($_POST['lang'] ?? '') === 'en' ? 'en' : 'tr';
        $idx = $lang === 'tr' ? $trIdx : $enIdx;
        $type = (string) ($_POST['paragraph_type'] ?? 'text');

        if ($type === 'image') {
            if (($_FILES['paragraph_image']['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
                $error = 'Bir görsel seç.';
            } else {
                $uploadError = validate_upload($_FILES['paragraph_image'], MAX_PHOTO_UPLOAD_BYTES);
                if ($uploadError !== null) {
                    $error = $uploadError;
                } elseif (is_uploaded_file($_FILES['paragraph_image']['tmp_name'])) {
                    $paraIndex = count($news[$lang][$idx]['content']);
                    $result = save_news_content_image($_FILES['paragraph_image']['tmp_name'], $editId, $lang, $paraIndex);
                    if (!$result['ok']) {
                        $error = 'Fotoğraf işlenemedi: ' . $result['error'];
                    } else {
                        $news[$lang][$idx]['content'][] = $result['contentMarker'];
                        save_news($news);
                        header('Location: news-edit.php?id=' . urlencode($editId) . '&saved=1#content-' . $lang);
                        exit;
                    }
                }
            }
        } else {
            $text = trim((string) ($_POST['paragraph_text'] ?? ''));
            if ($text === '') {
                $error = 'Paragraf metni boş olamaz.';
            } else {
                $news[$lang][$idx]['content'][] = $text;
                save_news($news);
                header('Location: news-edit.php?id=' . urlencode($editId) . '&saved=1#content-' . $lang);
                exit;
            }
        }
    } elseif (!$isNew && $formAction === 'update_paragraph') {
        $lang = (string) ($_POST['lang'] ?? '') === 'en' ? 'en' : 'tr';
        $idx = $lang === 'tr' ? $trIdx : $enIdx;
        $index = (int) ($_POST['index'] ?? -1);
        $text = trim((string) ($_POST['paragraph_text'] ?? ''));
        if ($text === '') {
            $error = 'Paragraf metni boş olamaz.';
        } elseif (isset($news[$lang][$idx]['content'][$index]) && strpos($news[$lang][$idx]['content'][$index], '[IMAGE]') !== 0) {
            $news[$lang][$idx]['content'][$index] = $text;
            save_news($news);
            header('Location: news-edit.php?id=' . urlencode($editId) . '&saved=1#content-' . $lang);
            exit;
        }
    } elseif (!$isNew && $formAction === 'delete_paragraph') {
        $lang = (string) ($_POST['lang'] ?? '') === 'en' ? 'en' : 'tr';
        $idx = $lang === 'tr' ? $trIdx : $enIdx;
        $index = (int) ($_POST['index'] ?? -1);
        if (isset($news[$lang][$idx]['content'][$index])) {
            array_splice($news[$lang][$idx]['content'], $index, 1);
            save_news($news);
        }
        header('Location: news-edit.php?id=' . urlencode($editId) . '&saved=1#content-' . $lang);
        exit;
    } elseif (!$isNew && $formAction === 'move_paragraph') {
        $lang = (string) ($_POST['lang'] ?? '') === 'en' ? 'en' : 'tr';
        $idx = $lang === 'tr' ? $trIdx : $enIdx;
        $index = (int) ($_POST['index'] ?? -1);
        $direction = (string) ($_POST['direction'] ?? '');
        $target = $direction === 'up' ? $index - 1 : $index + 1;
        if (isset($news[$lang][$idx]['content'][$index], $news[$lang][$idx]['content'][$target])) {
            [$news[$lang][$idx]['content'][$index], $news[$lang][$idx]['content'][$target]] = [$news[$lang][$idx]['content'][$target], $news[$lang][$idx]['content'][$index]];
            save_news($news);
        }
        header('Location: news-edit.php?id=' . urlencode($editId) . '&saved=1#content-' . $lang);
        exit;
    }

    if (!$isNew) {
        $trItem = $news['tr'][$trIdx];
        $enItem = $news['en'][$enIdx];
    }
}

render_header($isNew ? 'Yeni Haber' : 'Haber Düzenle', 'news');
?>
<div class="panel-header">
  <h1><?= $isNew ? 'Yeni Haber Ekle' : 'Haber Düzenle: #' . htmlspecialchars($editId, ENT_QUOTES, 'UTF-8') ?></h1>
  <div style="display:flex; gap:8px;">
    <a href="news.php" class="btn">← Haber Listesi</a>
    <?php if (!$isNew): ?>
      <form method="post" onsubmit="return confirm('Bu haber ve tüm görselleri kalıcı olarak silinsin mi? Bu işlem geri alınamaz.')">
        <input type="hidden" name="form_action" value="delete_news">
        <button type="submit" class="btn btn-danger">Haberi Sil</button>
      </form>
    <?php endif; ?>
  </div>
</div>

<?php if ($success): ?>
  <div class="success-banner">Kaydedildi. <?php if (!$isNew): ?>Haber <code>/haberler/<?= htmlspecialchars($editId, ENT_QUOTES, 'UTF-8') ?></code> adresinde (bir sonraki build'de) yayınlanacak.<?php endif; ?></div>
<?php endif; ?>
<?php if ($error): ?>
  <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
<?php endif; ?>

<form method="post" class="edit-form">
  <input type="hidden" name="form_action" value="save_meta">
  <div class="form-row">
    <label for="title_tr">Başlık (Türkçe)</label>
    <input type="text" id="title_tr" name="title_tr" value="<?= htmlspecialchars($trItem['title'], ENT_QUOTES, 'UTF-8') ?>" required>
  </div>
  <div class="form-row">
    <label for="title_en">Başlık (İngilizce)</label>
    <input type="text" id="title_en" name="title_en" value="<?= htmlspecialchars($enItem['title'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-row">
    <label for="date_tr">Tarih (Türkçe, ör. "13 Nisan 2024")</label>
    <input type="text" id="date_tr" name="date_tr" value="<?= htmlspecialchars($trItem['date'], ENT_QUOTES, 'UTF-8') ?>" required>
  </div>
  <div class="form-row">
    <label for="date_en">Tarih (İngilizce, ör. "Apr 13, 2024")</label>
    <input type="text" id="date_en" name="date_en" value="<?= htmlspecialchars($enItem['date'], ENT_QUOTES, 'UTF-8') ?>">
  </div>
  <div class="form-actions">
    <button type="submit" class="btn btn-primary"><?= $isNew ? 'Haberi Oluştur' : 'Başlık/Tarihi Kaydet' ?></button>
  </div>
</form>

<?php if (!$isNew): ?>
  <div class="panel-header" style="margin-top: 2rem;">
    <h2>Galeri Görselleri (<?= count($trItem['images']) ?>)</h2>
  </div>
  <p class="hint">Haber detay sayfasının üstündeki kaydırmalı galeri. TR ve EN sayfada aynı görseller kullanılır.</p>
  <div class="gallery-image-list">
    <?php foreach ($trItem['images'] as $i => $img): ?>
      <div class="gallery-image-item">
        <img src="/images/<?= htmlspecialchars($img, ENT_QUOTES, 'UTF-8') ?>" alt="">
        <div class="block-editor-actions" style="justify-content:center; margin-bottom:6px;">
          <form method="post" style="display:inline">
            <input type="hidden" name="form_action" value="move_gallery_image">
            <input type="hidden" name="index" value="<?= $i ?>">
            <input type="hidden" name="direction" value="up">
            <button type="submit" class="btn" <?= $i === 0 ? 'disabled' : '' ?>>↑</button>
          </form>
          <form method="post" style="display:inline">
            <input type="hidden" name="form_action" value="move_gallery_image">
            <input type="hidden" name="index" value="<?= $i ?>">
            <input type="hidden" name="direction" value="down">
            <button type="submit" class="btn" <?= $i === count($trItem['images']) - 1 ? 'disabled' : '' ?>>↓</button>
          </form>
        </div>
        <form method="post" onsubmit="return confirm('Bu görsel silinsin mi?')">
          <input type="hidden" name="form_action" value="remove_gallery_image">
          <input type="hidden" name="index" value="<?= $i ?>">
          <button type="submit" class="btn btn-danger" style="width:100%;">Sil</button>
        </form>
      </div>
    <?php endforeach; ?>
  </div>
  <form method="post" enctype="multipart/form-data" class="edit-form">
    <input type="hidden" name="form_action" value="add_gallery_image">
    <div class="form-row">
      <label>Yeni Galeri Görseli</label>
      <input type="file" name="gallery_image" accept="image/png,image/jpeg,image/webp,image/gif" required>
    </div>
    <div class="form-actions"><button type="submit" class="btn">+ Görsel Ekle</button></div>
  </form>

  <?php foreach (['tr' => 'Türkçe', 'en' => 'İngilizce'] as $lang => $langLabel):
      $item = $lang === 'tr' ? $trItem : $enItem;
  ?>
    <div class="panel-header" id="content-<?= $lang ?>" style="margin-top: 2.5rem;">
      <h2>Haber Metni (<?= $langLabel ?>) — <?= count($item['content']) ?> paragraf</h2>
    </div>

    <?php foreach ($item['content'] as $i => $paragraph):
        $isImage = strpos($paragraph, '[IMAGE]') === 0;
    ?>
      <div class="block-editor-card">
        <div class="block-editor-head">
          <strong>#<?= $i + 1 ?> — <?= $isImage ? 'Görsel' : 'Metin' ?></strong>
          <div class="block-editor-actions">
            <form method="post" style="display:inline">
              <input type="hidden" name="form_action" value="move_paragraph">
              <input type="hidden" name="lang" value="<?= $lang ?>">
              <input type="hidden" name="index" value="<?= $i ?>">
              <input type="hidden" name="direction" value="up">
              <button type="submit" class="btn" <?= $i === 0 ? 'disabled' : '' ?>>↑</button>
            </form>
            <form method="post" style="display:inline">
              <input type="hidden" name="form_action" value="move_paragraph">
              <input type="hidden" name="lang" value="<?= $lang ?>">
              <input type="hidden" name="index" value="<?= $i ?>">
              <input type="hidden" name="direction" value="down">
              <button type="submit" class="btn" <?= $i === count($item['content']) - 1 ? 'disabled' : '' ?>>↓</button>
            </form>
            <form method="post" style="display:inline" onsubmit="return confirm('Bu paragraf silinsin mi?')">
              <input type="hidden" name="form_action" value="delete_paragraph">
              <input type="hidden" name="lang" value="<?= $lang ?>">
              <input type="hidden" name="index" value="<?= $i ?>">
              <button type="submit" class="btn btn-danger">Sil</button>
            </form>
          </div>
        </div>
        <?php if ($isImage): ?>
          <img src="<?= htmlspecialchars(substr($paragraph, 7), ENT_QUOTES, 'UTF-8') ?>" alt="" style="max-width:240px; border-radius:8px; border:1px solid var(--border);">
        <?php else: ?>
          <form method="post">
            <input type="hidden" name="form_action" value="update_paragraph">
            <input type="hidden" name="lang" value="<?= $lang ?>">
            <input type="hidden" name="index" value="<?= $i ?>">
            <textarea name="paragraph_text" rows="3"><?= htmlspecialchars($paragraph, ENT_QUOTES, 'UTF-8') ?></textarea>
            <div class="form-actions" style="margin-top:10px;"><button type="submit" class="btn btn-primary">Bu Paragrafı Kaydet</button></div>
          </form>
        <?php endif; ?>
      </div>
    <?php endforeach; ?>

    <div class="block-editor-card">
      <h3 style="margin-top:0;">+ <?= $langLabel ?> Paragraf Ekle</h3>
      <form method="post" style="margin-bottom: 14px;">
        <input type="hidden" name="form_action" value="add_paragraph">
        <input type="hidden" name="lang" value="<?= $lang ?>">
        <input type="hidden" name="paragraph_type" value="text">
        <textarea name="paragraph_text" rows="3" placeholder="Yeni paragraf metni..."></textarea>
        <div class="form-actions" style="margin-top:10px;"><button type="submit" class="btn">+ Metin Paragrafı Ekle</button></div>
      </form>
      <form method="post" enctype="multipart/form-data">
        <input type="hidden" name="form_action" value="add_paragraph">
        <input type="hidden" name="lang" value="<?= $lang ?>">
        <input type="hidden" name="paragraph_type" value="image">
        <input type="file" name="paragraph_image" accept="image/png,image/jpeg,image/webp,image/gif" required>
        <div class="form-actions" style="margin-top:10px;"><button type="submit" class="btn">+ Görsel Paragrafı Ekle</button></div>
      </form>
    </div>
  <?php endforeach; ?>
<?php else: ?>
  <p class="hint" style="margin-top: 1.5rem;">Galeri görselleri ve haber metnini eklemek için önce haberi oluştur.</p>
<?php endif; ?>
<?php
render_footer();
