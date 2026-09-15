<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/products.php';
require __DIR__ . '/lib/pages.php';
require __DIR__ . '/lib/homeblocks.php';
require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/upload.php';
require __DIR__ . '/includes/layout.php';

/** @param array<string, mixed> $tr */
function localized_from_post_hb(string $trKey, string $enKey, bool $fallbackTrToEn = true): array
{
    $tr = trim((string) ($_POST[$trKey] ?? ''));
    $en = trim((string) ($_POST[$enKey] ?? ''));
    return ['tr' => $tr, 'en' => $en !== '' ? $en : ($fallbackTrToEn ? $tr : '')];
}

$slots = home_block_slots();
$homeBlocks = load_home_blocks();
$slot = trim((string) ($_GET['slot'] ?? ''));
$hasSlot = $slot !== '' && isset($slots[$slot]);
$error = '';
$success = isset($_GET['saved']);

if ($hasSlot && $_SERVER['REQUEST_METHOD'] === 'POST' && is_post_too_large()) {
    $error = 'Yüklediğin dosya sunucunun kabul ettiği üst sınırı aştığı için form hiç işlenemedi. Daha küçük bir dosya dene (maks. ' . round(MAX_PHOTO_UPLOAD_BYTES / 1024 / 1024) . ' MB).';
} elseif ($hasSlot && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $blocks = $homeBlocks[$slot];
    $formAction = (string) ($_POST['form_action'] ?? '');
    $filenamePrefix = 'home-' . $slot;

    if ($formAction === 'add_block') {
        $blockType = (string) ($_POST['block_type'] ?? '');
        if (!in_array($blockType, VALID_BLOCK_TYPES, true)) {
            $error = 'Geçersiz blok tipi.';
        } else {
            $blocks[] = new_empty_block($blockType);
            $homeBlocks[$slot] = $blocks;
            save_home_blocks($homeBlocks);
            header('Location: home-blocks.php?slot=' . urlencode($slot) . '&saved=1');
            exit;
        }
    } elseif ($formAction === 'delete_block') {
        $blockId = (string) ($_POST['block_id'] ?? '');
        $homeBlocks[$slot] = array_values(array_filter($blocks, fn ($b) => ($b['id'] ?? null) !== $blockId));
        save_home_blocks($homeBlocks);
        header('Location: home-blocks.php?slot=' . urlencode($slot) . '&saved=1');
        exit;
    } elseif ($formAction === 'move_block') {
        $blockId = (string) ($_POST['block_id'] ?? '');
        $direction = (string) ($_POST['direction'] ?? '');
        $idx = find_block_index($blocks, $blockId);
        if ($idx !== null) {
            $target = $direction === 'up' ? $idx - 1 : $idx + 1;
            if ($target >= 0 && $target < count($blocks)) {
                [$blocks[$idx], $blocks[$target]] = [$blocks[$target], $blocks[$idx]];
                $homeBlocks[$slot] = $blocks;
                save_home_blocks($homeBlocks);
            }
        }
        header('Location: home-blocks.php?slot=' . urlencode($slot) . '&saved=1');
        exit;
    } elseif ($formAction === 'update_block') {
        $blockId = (string) ($_POST['block_id'] ?? '');
        $blockType = (string) ($_POST['block_type'] ?? '');
        $idx = find_block_index($blocks, $blockId);

        if ($idx === null || $blocks[$idx]['type'] !== $blockType) {
            $error = 'Blok bulunamadı.';
        } else {
            $data = $blocks[$idx]['data'];

            if ($blockType === 'heading_text') {
                $heading = localized_from_post_hb('heading_tr', 'heading_en');
                $body = localized_from_post_hb('body_tr', 'body_en');
                if ($heading['tr'] === '' || $body['tr'] === '') {
                    $error = 'Başlık ve metin (Türkçe) zorunludur.';
                } else {
                    $data = ['heading' => $heading, 'body' => $body];
                }
            } elseif ($blockType === 'cta') {
                $buttonLabel = localized_from_post_hb('button_label_tr', 'button_label_en');
                $buttonUrl = trim((string) ($_POST['button_url'] ?? ''));
                if ($buttonLabel['tr'] === '' || $buttonUrl === '') {
                    $error = 'Buton metni ve adresi zorunludur.';
                } elseif (strpos($buttonUrl, '/') !== 0 && !preg_match('#^https?://#', $buttonUrl)) {
                    $error = 'Buton adresi "/" ile başlamalı (site içi) veya http(s):// ile başlamalı (dış site).';
                } else {
                    $data = [
                        'heading' => localized_from_post_hb('heading_tr', 'heading_en', false),
                        'text' => localized_from_post_hb('text_tr', 'text_en', false),
                        'buttonLabel' => $buttonLabel,
                        'buttonUrl' => $buttonUrl,
                    ];
                }
            } elseif ($blockType === 'text_image') {
                $heading = localized_from_post_hb('heading_tr', 'heading_en');
                $text = localized_from_post_hb('text_tr', 'text_en');
                $imagePosition = (string) ($_POST['image_position'] ?? 'right') === 'left' ? 'left' : 'right';
                $imageAlt = localized_from_post_hb('image_alt_tr', 'image_alt_en');
                $image = $data['image'] ?? '';

                if ($heading['tr'] === '' || $text['tr'] === '') {
                    $error = 'Başlık ve metin (Türkçe) zorunludur.';
                } elseif (($_FILES['block_image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                    $uploadError = validate_upload($_FILES['block_image'], MAX_PHOTO_UPLOAD_BYTES);
                    if ($uploadError !== null) {
                        $error = $uploadError;
                    } elseif (is_uploaded_file($_FILES['block_image']['tmp_name'])) {
                        $result = save_block_image($_FILES['block_image']['tmp_name'], $filenamePrefix . '-' . $blockId);
                        if (!$result['ok']) {
                            $error = 'Fotoğraf işlenemedi: ' . $result['error'];
                        } else {
                            $image = $result['relativePath'];
                        }
                    }
                } elseif ($image === '') {
                    $error = 'Bir görsel yüklemelisin.';
                }

                if ($error === '') {
                    $data = ['heading' => $heading, 'text' => $text, 'image' => $image, 'imageAlt' => $imageAlt, 'imagePosition' => $imagePosition];
                }
            } elseif ($blockType === 'image_gallery') {
                $title = localized_from_post_hb('title_tr', 'title_en', false);
                $data = ['title' => $title, 'images' => $data['images'] ?? []];
            }

            if ($error === '') {
                $blocks[$idx]['data'] = $data;
                $homeBlocks[$slot] = $blocks;
                save_home_blocks($homeBlocks);
                header('Location: home-blocks.php?slot=' . urlencode($slot) . '&saved=1');
                exit;
            }
        }
    } elseif ($formAction === 'add_gallery_image') {
        $blockId = (string) ($_POST['block_id'] ?? '');
        $idx = find_block_index($blocks, $blockId);
        if ($idx === null) {
            $error = 'Blok bulunamadı.';
        } elseif (($_FILES['gallery_image']['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            $error = 'Bir görsel seç.';
        } else {
            $uploadError = validate_upload($_FILES['gallery_image'], MAX_PHOTO_UPLOAD_BYTES);
            if ($uploadError !== null) {
                $error = $uploadError;
            } elseif (is_uploaded_file($_FILES['gallery_image']['tmp_name'])) {
                $imageIndex = count($blocks[$idx]['data']['images'] ?? []);
                $result = save_block_image($_FILES['gallery_image']['tmp_name'], $filenamePrefix . '-' . $blockId . '-' . $imageIndex);
                if (!$result['ok']) {
                    $error = 'Fotoğraf işlenemedi: ' . $result['error'];
                } else {
                    $alt = localized_from_post_hb('gallery_alt_tr', 'gallery_alt_en', false);
                    $blocks[$idx]['data']['images'][] = ['url' => $result['relativePath'], 'alt' => $alt];
                    $homeBlocks[$slot] = $blocks;
                    save_home_blocks($homeBlocks);
                    header('Location: home-blocks.php?slot=' . urlencode($slot) . '&saved=1');
                    exit;
                }
            }
        }
    } elseif ($formAction === 'remove_gallery_image') {
        $blockId = (string) ($_POST['block_id'] ?? '');
        $imageIndex = (int) ($_POST['image_index'] ?? -1);
        $idx = find_block_index($blocks, $blockId);
        if ($idx !== null && isset($blocks[$idx]['data']['images'][$imageIndex])) {
            array_splice($blocks[$idx]['data']['images'], $imageIndex, 1);
            $homeBlocks[$slot] = $blocks;
            save_home_blocks($homeBlocks);
        }
        header('Location: home-blocks.php?slot=' . urlencode($slot) . '&saved=1');
        exit;
    }
}

render_header('Anasayfa Blokları', 'home-blocks');
?>
<div class="panel-header">
  <h1>Anasayfa Blokları</h1>
</div>
<p class="page-subtitle">Anasayfanın sabit bölümleri arasına (ör. "Hakkımızda" ile "Markalarımız" arasına) opsiyonel içerik blokları ekler. Hiç blok eklemezsen anasayfa hiç değişmez.</p>

<?php if ($success): ?>
  <div class="success-banner">Kaydedildi. Değişiklik bir sonraki build/dev-server yenilemesinde gerçek siteye yansır.</div>
<?php endif; ?>
<?php if ($error): ?>
  <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
<?php endif; ?>

<?php if (!$hasSlot): ?>
  <div class="product-grid">
    <?php foreach ($slots as $key => $label): $count = count($homeBlocks[$key]); ?>
      <a href="home-blocks.php?slot=<?= urlencode($key) ?>" class="product-card" style="padding: 18px;">
        <div class="product-info" style="padding:0;">
          <span class="product-name"><?= htmlspecialchars($label, ENT_QUOTES, 'UTF-8') ?></span>
          <span class="product-brand"><?= $count ?> blok</span>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
<?php else:
    $blockLabels = [
        'heading_text' => 'Başlık + Metin',
        'image_gallery' => 'Görsel Galerisi',
        'text_image' => 'Metin + Görsel',
        'cta' => 'Buton / Harekete Geçirici',
    ];
    $blocks = $homeBlocks[$slot];
    ?>
  <div class="panel-header">
    <h2 style="margin:0;"><?= htmlspecialchars($slots[$slot], ENT_QUOTES, 'UTF-8') ?> (<?= count($blocks) ?> blok)</h2>
    <a href="home-blocks.php" class="btn">← Tüm Bölgeler</a>
  </div>

  <?php foreach ($blocks as $i => $block): $d = $block['data']; ?>
    <div class="block-editor-card">
      <div class="block-editor-head">
        <strong><?= $i + 1 ?>. <?= htmlspecialchars($blockLabels[$block['type']] ?? $block['type'], ENT_QUOTES, 'UTF-8') ?></strong>
        <div class="block-editor-actions">
          <form method="post" style="display:inline">
            <input type="hidden" name="form_action" value="move_block">
            <input type="hidden" name="block_id" value="<?= htmlspecialchars($block['id'], ENT_QUOTES, 'UTF-8') ?>">
            <input type="hidden" name="direction" value="up">
            <button type="submit" class="btn" <?= $i === 0 ? 'disabled' : '' ?>>↑</button>
          </form>
          <form method="post" style="display:inline">
            <input type="hidden" name="form_action" value="move_block">
            <input type="hidden" name="block_id" value="<?= htmlspecialchars($block['id'], ENT_QUOTES, 'UTF-8') ?>">
            <input type="hidden" name="direction" value="down">
            <button type="submit" class="btn" <?= $i === count($blocks) - 1 ? 'disabled' : '' ?>>↓</button>
          </form>
          <form method="post" style="display:inline" onsubmit="return confirm('Bu blok silinsin mi?')">
            <input type="hidden" name="form_action" value="delete_block">
            <input type="hidden" name="block_id" value="<?= htmlspecialchars($block['id'], ENT_QUOTES, 'UTF-8') ?>">
            <button type="submit" class="btn btn-danger">Sil</button>
          </form>
        </div>
      </div>

      <?php if ($block['type'] === 'heading_text'): ?>
        <form method="post" class="edit-form">
          <input type="hidden" name="form_action" value="update_block">
          <input type="hidden" name="block_id" value="<?= htmlspecialchars($block['id'], ENT_QUOTES, 'UTF-8') ?>">
          <input type="hidden" name="block_type" value="heading_text">
          <div class="form-row"><label>Başlık (TR)</label><input type="text" name="heading_tr" value="<?= htmlspecialchars($d['heading']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?>" required></div>
          <div class="form-row"><label>Başlık (EN)</label><input type="text" name="heading_en" value="<?= htmlspecialchars($d['heading']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?>"></div>
          <div class="form-row"><label>Metin (TR)</label><textarea name="body_tr" rows="4" required><?= htmlspecialchars($d['body']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?></textarea></div>
          <div class="form-row"><label>Metin (EN)</label><textarea name="body_en" rows="4"><?= htmlspecialchars($d['body']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?></textarea></div>
          <div class="form-actions"><button type="submit" class="btn btn-primary">Bloğu Kaydet</button></div>
        </form>

      <?php elseif ($block['type'] === 'text_image'): ?>
        <form method="post" enctype="multipart/form-data" class="edit-form">
          <input type="hidden" name="form_action" value="update_block">
          <input type="hidden" name="block_id" value="<?= htmlspecialchars($block['id'], ENT_QUOTES, 'UTF-8') ?>">
          <input type="hidden" name="block_type" value="text_image">
          <div class="form-row"><label>Başlık (TR)</label><input type="text" name="heading_tr" value="<?= htmlspecialchars($d['heading']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?>" required></div>
          <div class="form-row"><label>Başlık (EN)</label><input type="text" name="heading_en" value="<?= htmlspecialchars($d['heading']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?>"></div>
          <div class="form-row"><label>Metin (TR)</label><textarea name="text_tr" rows="4" required><?= htmlspecialchars($d['text']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?></textarea></div>
          <div class="form-row"><label>Metin (EN)</label><textarea name="text_en" rows="4"><?= htmlspecialchars($d['text']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?></textarea></div>
          <div class="form-row">
            <label>Görsel Konumu</label>
            <select name="image_position">
              <option value="right" <?= ($d['imagePosition'] ?? 'right') === 'right' ? 'selected' : '' ?>>Sağda</option>
              <option value="left" <?= ($d['imagePosition'] ?? 'right') === 'left' ? 'selected' : '' ?>>Solda</option>
            </select>
          </div>
          <div class="form-row"><label>Görsel Alt Metni (TR)</label><input type="text" name="image_alt_tr" value="<?= htmlspecialchars($d['imageAlt']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?>"></div>
          <div class="form-row"><label>Görsel Alt Metni (EN)</label><input type="text" name="image_alt_en" value="<?= htmlspecialchars($d['imageAlt']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?>"></div>
          <div class="form-row">
            <label>Görsel</label>
            <?php if (!empty($d['image'])): ?>
              <div class="current-photo"><img src="/images/<?= htmlspecialchars($d['image'], ENT_QUOTES, 'UTF-8') ?>" alt=""><span class="hint">Mevcut görsel.</span></div>
            <?php endif; ?>
            <input type="file" name="block_image" accept="image/png,image/jpeg,image/webp,image/gif">
            <p class="hint">Yeni bir dosya seçersen mevcut görselin yerine geçer. Otomatik 800x800 içine sığdırılıp WebP'ye çevrilir.</p>
          </div>
          <div class="form-actions"><button type="submit" class="btn btn-primary">Bloğu Kaydet</button></div>
        </form>

      <?php elseif ($block['type'] === 'cta'): ?>
        <form method="post" class="edit-form">
          <input type="hidden" name="form_action" value="update_block">
          <input type="hidden" name="block_id" value="<?= htmlspecialchars($block['id'], ENT_QUOTES, 'UTF-8') ?>">
          <input type="hidden" name="block_type" value="cta">
          <div class="form-row"><label>Başlık (TR, opsiyonel)</label><input type="text" name="heading_tr" value="<?= htmlspecialchars($d['heading']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?>"></div>
          <div class="form-row"><label>Başlık (EN, opsiyonel)</label><input type="text" name="heading_en" value="<?= htmlspecialchars($d['heading']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?>"></div>
          <div class="form-row"><label>Açıklama (TR, opsiyonel)</label><input type="text" name="text_tr" value="<?= htmlspecialchars($d['text']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?>"></div>
          <div class="form-row"><label>Açıklama (EN, opsiyonel)</label><input type="text" name="text_en" value="<?= htmlspecialchars($d['text']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?>"></div>
          <div class="form-row"><label>Buton Metni (TR)</label><input type="text" name="button_label_tr" value="<?= htmlspecialchars($d['buttonLabel']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?>" required></div>
          <div class="form-row"><label>Buton Metni (EN)</label><input type="text" name="button_label_en" value="<?= htmlspecialchars($d['buttonLabel']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?>"></div>
          <div class="form-row"><label>Buton Adresi</label><input type="text" name="button_url" value="<?= htmlspecialchars($d['buttonUrl'] ?? '', ENT_QUOTES, 'UTF-8') ?>" placeholder="/iletisim veya https://..." required></div>
          <div class="form-actions"><button type="submit" class="btn btn-primary">Bloğu Kaydet</button></div>
        </form>

      <?php elseif ($block['type'] === 'image_gallery'): ?>
        <form method="post" class="edit-form">
          <input type="hidden" name="form_action" value="update_block">
          <input type="hidden" name="block_id" value="<?= htmlspecialchars($block['id'], ENT_QUOTES, 'UTF-8') ?>">
          <input type="hidden" name="block_type" value="image_gallery">
          <div class="form-row"><label>Galeri Başlığı (TR, opsiyonel)</label><input type="text" name="title_tr" value="<?= htmlspecialchars($d['title']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?>"></div>
          <div class="form-row"><label>Galeri Başlığı (EN, opsiyonel)</label><input type="text" name="title_en" value="<?= htmlspecialchars($d['title']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?>"></div>
          <div class="form-actions"><button type="submit" class="btn btn-primary">Başlığı Kaydet</button></div>
        </form>

        <div class="gallery-image-list">
          <?php foreach (($d['images'] ?? []) as $imgIdx => $img): ?>
            <div class="gallery-image-item">
              <img src="/images/<?= htmlspecialchars($img['url'], ENT_QUOTES, 'UTF-8') ?>" alt="">
              <form method="post" onsubmit="return confirm('Bu görsel silinsin mi?')">
                <input type="hidden" name="form_action" value="remove_gallery_image">
                <input type="hidden" name="block_id" value="<?= htmlspecialchars($block['id'], ENT_QUOTES, 'UTF-8') ?>">
                <input type="hidden" name="image_index" value="<?= $imgIdx ?>">
                <button type="submit" class="btn btn-danger">Sil</button>
              </form>
            </div>
          <?php endforeach; ?>
        </div>

        <form method="post" enctype="multipart/form-data" class="edit-form">
          <input type="hidden" name="form_action" value="add_gallery_image">
          <input type="hidden" name="block_id" value="<?= htmlspecialchars($block['id'], ENT_QUOTES, 'UTF-8') ?>">
          <div class="form-row"><label>Yeni Görsel</label><input type="file" name="gallery_image" accept="image/png,image/jpeg,image/webp,image/gif" required></div>
          <div class="form-row"><label>Alt Metni (TR)</label><input type="text" name="gallery_alt_tr"></div>
          <div class="form-row"><label>Alt Metni (EN)</label><input type="text" name="gallery_alt_en"></div>
          <div class="form-actions"><button type="submit" class="btn">+ Görsel Ekle</button></div>
        </form>
      <?php endif; ?>
    </div>
  <?php endforeach; ?>

  <div class="block-editor-card">
    <form method="post" class="edit-form">
      <input type="hidden" name="form_action" value="add_block">
      <div class="form-row">
        <label>Yeni Blok Ekle</label>
        <select name="block_type">
          <?php foreach ($blockLabels as $val => $label): ?>
            <option value="<?= $val ?>"><?= htmlspecialchars($label, ENT_QUOTES, 'UTF-8') ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="form-actions"><button type="submit" class="btn btn-primary">+ Blok Ekle</button></div>
    </form>
  </div>
<?php endif; ?>
<?php
render_footer();
