<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/products.php';
require __DIR__ . '/lib/pages.php';
require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/upload.php';
require __DIR__ . '/includes/layout.php';

$pages = load_pages();
$editSlug = trim((string) ($_GET['slug'] ?? ''));
$isNew = $editSlug === '';
$error = '';
$success = isset($_GET['saved']);

$page = $isNew ? [
    'slug' => '', 'title' => ['tr' => '', 'en' => ''],
    'metaDescription' => ['tr' => '', 'en' => ''], 'blocks' => [],
] : ($pages[$editSlug] ?? null);

if (!$isNew && $page === null) {
    http_response_code(404);
    die('Sayfa bulunamadı.');
}

/** @param array<string, mixed> $tr */
function localized_from_post(string $trKey, string $enKey, bool $fallbackTrToEn = true): array
{
    $tr = trim((string) ($_POST[$trKey] ?? ''));
    $en = trim((string) ($_POST[$enKey] ?? ''));
    return ['tr' => $tr, 'en' => $en !== '' ? $en : ($fallbackTrToEn ? $tr : '')];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && is_post_too_large()) {
    $error = 'Yüklediğin dosya sunucunun kabul ettiği üst sınırı aştığı için form hiç işlenemedi. Daha küçük bir dosya dene (maks. ' . round(MAX_PHOTO_UPLOAD_BYTES / 1024 / 1024) . ' MB).';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formAction = (string) ($_POST['form_action'] ?? 'save_meta');

    if ($formAction === 'save_meta') {
        $titleTr = trim((string) ($_POST['title_tr'] ?? ''));
        $titleEn = trim((string) ($_POST['title_en'] ?? ''));
        $metaTr = trim((string) ($_POST['meta_tr'] ?? ''));
        $metaEn = trim((string) ($_POST['meta_en'] ?? ''));

        $parentSlug = $isNew ? trim((string) ($_POST['parent_slug'] ?? '')) : '';
        if ($parentSlug !== '' && !isset($pages[$parentSlug])) {
            $parentSlug = '';
        }

        if ($titleTr === '') {
            $error = 'Türkçe başlık zorunludur.';
        } else {
            $slug = $isNew ? generate_unique_page_slug($titleTr, $pages, $parentSlug) : $editSlug;
            $record = $isNew ? ['blocks' => []] : $page;
            $record['slug'] = $slug;
            $record['title'] = ['tr' => $titleTr, 'en' => $titleEn !== '' ? $titleEn : $titleTr];
            $record['metaDescription'] = ['tr' => $metaTr, 'en' => $metaEn !== '' ? $metaEn : $metaTr];
            $record['blocks'] = $record['blocks'] ?? [];

            $pages[$slug] = $record;
            try {
                save_pages($pages);
                header('Location: page-edit.php?slug=' . urlencode($slug) . '&saved=1');
                exit;
            } catch (RuntimeException $e) {
                $error = $e->getMessage();
            }
        }

        $page = [
            'slug' => $isNew ? '' : $editSlug,
            'title' => ['tr' => $titleTr, 'en' => $titleEn],
            'metaDescription' => ['tr' => $metaTr, 'en' => $metaEn],
            'blocks' => $page['blocks'] ?? [],
        ];
    } elseif (!$isNew) {
        $blocks = $page['blocks'] ?? [];

        if ($formAction === 'delete_page') {
            unset($pages[$editSlug]);
            save_pages($pages);
            delete_page_images($editSlug);
            header('Location: pages.php?deleted=1');
            exit;
        } elseif ($formAction === 'add_block') {
            $blockType = (string) ($_POST['block_type'] ?? '');
            if (!in_array($blockType, VALID_BLOCK_TYPES, true)) {
                $error = 'Geçersiz blok tipi.';
            } else {
                $blocks[] = new_empty_block($blockType);
                $page['blocks'] = $blocks;
                $pages[$editSlug] = $page;
                save_pages($pages);
                header('Location: page-edit.php?slug=' . urlencode($editSlug) . '&saved=1');
                exit;
            }
        } elseif ($formAction === 'delete_block') {
            $blockId = (string) ($_POST['block_id'] ?? '');
            $page['blocks'] = array_values(array_filter($blocks, fn ($b) => ($b['id'] ?? null) !== $blockId));
            $pages[$editSlug] = $page;
            save_pages($pages);
            header('Location: page-edit.php?slug=' . urlencode($editSlug) . '&saved=1');
            exit;
        } elseif ($formAction === 'move_block') {
            $blockId = (string) ($_POST['block_id'] ?? '');
            $direction = (string) ($_POST['direction'] ?? '');
            $idx = find_block_index($blocks, $blockId);
            if ($idx !== null) {
                $target = $direction === 'up' ? $idx - 1 : $idx + 1;
                if ($target >= 0 && $target < count($blocks)) {
                    [$blocks[$idx], $blocks[$target]] = [$blocks[$target], $blocks[$idx]];
                    $page['blocks'] = $blocks;
                    $pages[$editSlug] = $page;
                    save_pages($pages);
                }
            }
            header('Location: page-edit.php?slug=' . urlencode($editSlug) . '&saved=1');
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
                    $heading = localized_from_post('heading_tr', 'heading_en');
                    $body = localized_from_post('body_tr', 'body_en');
                    if ($heading['tr'] === '' || $body['tr'] === '') {
                        $error = 'Başlık ve metin (Türkçe) zorunludur.';
                    } else {
                        $data = ['heading' => $heading, 'body' => $body];
                    }
                } elseif ($blockType === 'cta') {
                    $buttonLabel = localized_from_post('button_label_tr', 'button_label_en');
                    $buttonUrl = trim((string) ($_POST['button_url'] ?? ''));
                    if ($buttonLabel['tr'] === '' || $buttonUrl === '') {
                        $error = 'Buton metni ve adresi zorunludur.';
                    } elseif (!str_starts_with($buttonUrl, '/') && !preg_match('#^https?://#', $buttonUrl)) {
                        $error = 'Buton adresi "/" ile başlamalı (site içi) veya http(s):// ile başlamalı (dış site).';
                    } else {
                        $data = [
                            'heading' => localized_from_post('heading_tr', 'heading_en', false),
                            'text' => localized_from_post('text_tr', 'text_en', false),
                            'buttonLabel' => $buttonLabel,
                            'buttonUrl' => $buttonUrl,
                        ];
                    }
                } elseif ($blockType === 'text_image') {
                    $heading = localized_from_post('heading_tr', 'heading_en');
                    $text = localized_from_post('text_tr', 'text_en');
                    $imagePosition = (string) ($_POST['image_position'] ?? 'right') === 'left' ? 'left' : 'right';
                    $imageAlt = localized_from_post('image_alt_tr', 'image_alt_en');
                    $image = $data['image'] ?? '';

                    if ($heading['tr'] === '' || $text['tr'] === '') {
                        $error = 'Başlık ve metin (Türkçe) zorunludur.';
                    } elseif (($_FILES['block_image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                        $uploadError = validate_upload($_FILES['block_image'], MAX_PHOTO_UPLOAD_BYTES);
                        if ($uploadError !== null) {
                            $error = $uploadError;
                        } elseif (is_uploaded_file($_FILES['block_image']['tmp_name'])) {
                            $result = save_block_image($_FILES['block_image']['tmp_name'], page_slug_filename_prefix($editSlug) . '-' . $blockId);
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
                    $title = localized_from_post('title_tr', 'title_en', false);
                    $data = ['title' => $title, 'images' => $data['images'] ?? []];
                }

                if ($error === '') {
                    $blocks[$idx]['data'] = $data;
                    $page['blocks'] = $blocks;
                    $pages[$editSlug] = $page;
                    save_pages($pages);
                    header('Location: page-edit.php?slug=' . urlencode($editSlug) . '&saved=1');
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
                    $result = save_block_image($_FILES['gallery_image']['tmp_name'], page_slug_filename_prefix($editSlug) . '-' . $blockId . '-' . $imageIndex);
                    if (!$result['ok']) {
                        $error = 'Fotoğraf işlenemedi: ' . $result['error'];
                    } else {
                        $alt = localized_from_post('gallery_alt_tr', 'gallery_alt_en', false);
                        $blocks[$idx]['data']['images'][] = ['url' => $result['relativePath'], 'alt' => $alt];
                        $page['blocks'] = $blocks;
                        $pages[$editSlug] = $page;
                        save_pages($pages);
                        header('Location: page-edit.php?slug=' . urlencode($editSlug) . '&saved=1');
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
                $page['blocks'] = $blocks;
                $pages[$editSlug] = $page;
                save_pages($pages);
            }
            header('Location: page-edit.php?slug=' . urlencode($editSlug) . '&saved=1');
            exit;
        }
    }
}

render_header($isNew ? 'Yeni Sayfa' : 'Sayfa Düzenle', 'pages');
?>
<div class="panel-header">
  <h1><?= $isNew ? 'Yeni Sayfa Ekle' : 'Sayfa Düzenle: ' . htmlspecialchars($editSlug, ENT_QUOTES, 'UTF-8') ?></h1>
  <div style="display:flex; gap:8px;">
    <a href="pages.php" class="btn">← Sayfa Listesi</a>
    <?php if (!$isNew): ?>
      <form method="post" onsubmit="return confirm('Bu sayfa ve tüm blokları/görselleri kalıcı olarak silinsin mi? Bu işlem geri alınamaz.')">
        <input type="hidden" name="form_action" value="delete_page">
        <button type="submit" class="btn btn-danger">Sayfayı Sil</button>
      </form>
    <?php endif; ?>
  </div>
</div>

<?php if ($success): ?>
  <div class="success-banner">Kaydedildi. <?php if (!$isNew): ?>Sayfa <code>/<?= htmlspecialchars($editSlug, ENT_QUOTES, 'UTF-8') ?></code> adresinde (bir sonraki build'de) yayınlanacak.<?php endif; ?></div>
<?php endif; ?>
<?php if ($error): ?>
  <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
<?php endif; ?>

<form method="post" class="edit-form">
  <input type="hidden" name="form_action" value="save_meta">
  <?php if (!$isNew): ?>
    <div class="form-row">
      <label>Adres (URL)</label>
      <input type="text" value="/<?= htmlspecialchars($editSlug, ENT_QUOTES, 'UTF-8') ?>" readonly>
      <p class="hint">Adres, sayfa oluşturulduktan sonra değiştirilemez (eski linklerin kırılmaması için).</p>
    </div>
  <?php else: ?>
    <p class="hint">Adres, Türkçe başlıktan otomatik oluşturulacak (ör. "Özel Kampanya" → /ozel-kampanya). Ürün linkleriyle veya sabit sayfalarla (ör. "haberler") çakışırsa sonuna otomatik "-2" gibi bir ek eklenir.</p>
    <?php if (!empty($pages)): ?>
      <div class="form-row">
        <label for="parent_slug">Üst Sayfa (opsiyonel)</label>
        <select id="parent_slug" name="parent_slug">
          <option value="">— Yok (kök adres) —</option>
          <?php foreach ($pages as $pSlug => $p): ?>
            <option value="<?= htmlspecialchars($pSlug, ENT_QUOTES, 'UTF-8') ?>">/<?= htmlspecialchars($pSlug, ENT_QUOTES, 'UTF-8') ?> — <?= htmlspecialchars($p['title']['tr'] ?? $pSlug, ENT_QUOTES, 'UTF-8') ?></option>
          <?php endforeach; ?>
        </select>
        <p class="hint">Seçersen adres "/üst-sayfa/bu-sayfa" şeklinde iç içe olur (ör. "/iletisim/kampanya").</p>
      </div>
    <?php endif; ?>
  <?php endif; ?>

  <div class="form-row">
    <label for="title_tr">Sayfa Başlığı (Türkçe)</label>
    <input type="text" id="title_tr" name="title_tr" value="<?= htmlspecialchars($page['title']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?>" required>
  </div>

  <div class="form-row">
    <label for="title_en">Sayfa Başlığı (İngilizce)</label>
    <input type="text" id="title_en" name="title_en" value="<?= htmlspecialchars($page['title']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
  </div>

  <div class="form-row">
    <label for="meta_tr">Arama Motoru Açıklaması (Türkçe, opsiyonel)</label>
    <input type="text" id="meta_tr" name="meta_tr" value="<?= htmlspecialchars($page['metaDescription']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
  </div>

  <div class="form-row">
    <label for="meta_en">Arama Motoru Açıklaması (İngilizce, opsiyonel)</label>
    <input type="text" id="meta_en" name="meta_en" value="<?= htmlspecialchars($page['metaDescription']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary">Kaydet</button>
  </div>
</form>

<?php if (!$isNew):
    $blockLabels = [
        'heading_text' => 'Başlık + Metin',
        'image_gallery' => 'Görsel Galerisi',
        'text_image' => 'Metin + Görsel',
        'cta' => 'Buton / Harekete Geçirici',
    ];
    ?>
  <div class="panel-header" style="margin-top: 2rem;">
    <h2>İçerik Blokları (<?= count($page['blocks'] ?? []) ?>)</h2>
  </div>

  <?php foreach (($page['blocks'] ?? []) as $i => $block): $d = $block['data']; ?>
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
            <button type="submit" class="btn" <?= $i === count($page['blocks']) - 1 ? 'disabled' : '' ?>>↓</button>
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
