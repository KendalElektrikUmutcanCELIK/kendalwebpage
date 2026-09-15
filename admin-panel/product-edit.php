<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/lib/atomic_write.php';
require __DIR__ . '/lib/utf8.php';
require __DIR__ . '/lib/products.php';
require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/image_url.php';
require __DIR__ . '/lib/upload.php';
require __DIR__ . '/includes/layout.php';

$products = load_products();
$editId = trim((string) ($_GET['id'] ?? ''));
$isNew = $editId === '';
$error = '';
$success = isset($_GET['saved']);

$product = $isNew ? [
    'id' => '', 'model' => '', 'image' => '',
    'name' => ['tr' => '', 'en' => ''],
    'attributes' => ['tr' => [], 'en' => []],
    'category' => ['tr' => [], 'en' => []],
    'brand' => 'k2',
] : ($products[$editId] ?? null);

if (!$isNew && $product === null) {
    http_response_code(404);
    die('Ürün bulunamadı.');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['form_action'] ?? '') === 'delete_product' && !$isNew) {
    $imagePath = $product['image'] ?? '';
    unset($products[$editId]);
    save_products($products);
    if ($imagePath !== '') {
        delete_product_upload($imagePath);
    }
    header('Location: products.php?deleted=1');
    exit;
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && is_post_too_large()) {
    $error = 'Yüklediğin dosya sunucunun kabul ettiği üst sınırı aştığı için form hiç işlenemedi. Daha küçük bir dosya dene (maks. ' . round(MAX_PHOTO_UPLOAD_BYTES / 1024 / 1024) . ' MB).';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $model = trim((string) ($_POST['model'] ?? ''));
    $nameTr = trim((string) ($_POST['name_tr'] ?? ''));
    $nameEn = trim((string) ($_POST['name_en'] ?? ''));
    $categoryTr = trim((string) ($_POST['category_tr'] ?? ''));
    $categoryEn = trim((string) ($_POST['category_en'] ?? ''));
    $brand = (string) ($_POST['brand'] ?? 'k2');

    if ($model === '' || $nameTr === '' || $categoryTr === '') {
        $error = 'Model, Türkçe ürün adı ve kategori zorunludur.';
    } else {
        $id = $isNew ? generate_product_id($model) : $editId;

        if ($isNew && isset($products[$id])) {
            $error = "Bu model için zaten bir ürün var (ID: $id). Farklı bir model kodu kullanın.";
        } else {
            $attrTrLabels = $_POST['attr_tr_label'] ?? [];
            $attrTrValues = $_POST['attr_tr_value'] ?? [];
            $attrEnLabels = $_POST['attr_en_label'] ?? [];
            $attrEnValues = $_POST['attr_en_value'] ?? [];

            $attributesTr = [];
            $attributesEn = [];
            for ($i = 0; $i < count($attrTrLabels); $i++) {
                $label = trim((string) ($attrTrLabels[$i] ?? ''));
                $value = trim((string) ($attrTrValues[$i] ?? ''));
                if ($label === '' && $value === '') {
                    continue;
                }
                $attributesTr[] = ['label' => $label, 'value' => $value];
                $attributesEn[] = [
                    'label' => trim((string) ($attrEnLabels[$i] ?? $label)),
                    'value' => trim((string) ($attrEnValues[$i] ?? $value)),
                ];
            }

            $record = $isNew ? [] : $product;
            $record['id'] = $id;
            $record['model'] = $model;
            $record['name'] = ['tr' => $nameTr, 'en' => $nameEn !== '' ? $nameEn : $nameTr];
            $record['attributes'] = ['tr' => $attributesTr, 'en' => $attributesEn];
            $record['category'] = [
                'tr' => array_filter(array_map('trim', explode(',', $categoryTr))),
                'en' => array_filter(array_map('trim', explode(',', $categoryEn !== '' ? $categoryEn : $categoryTr))),
            ];
            $record['brand'] = in_array($brand, ['k2', 'vanti', 'global'], true) ? $brand : 'k2';
            $record['category']['tr'] = array_values($record['category']['tr']);
            $record['category']['en'] = array_values($record['category']['en']);

            if (!isset($record['image']) || $record['image'] === '') {
                $record['image'] = 'urunler/' . strtolower($id) . '.webp';
            }

            if (($_FILES['photo']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                $uploadError = validate_upload($_FILES['photo'], MAX_PHOTO_UPLOAD_BYTES);
                if ($uploadError !== null) {
                    $error = $uploadError;
                } elseif (is_uploaded_file($_FILES['photo']['tmp_name'])) {
                    $uploadDir = __DIR__ . '/data/uploads/urunler';
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0755, true);
                    }
                    $destFilename = strtolower($id) . '.webp';
                    $destPath = $uploadDir . '/' . $destFilename;
                    $result = compress_product_image($_FILES['photo']['tmp_name'], $destPath);
                    if (!$result['ok']) {
                        $error = 'Fotoğraf işlenemedi: ' . $result['error'];
                    } else {
                        $record['image'] = 'urunler/' . basename($result['path']);
                    }
                }
            }

            if ($error === '') {
                $products[$id] = $record;
                try {
                    save_products($products);
                    header('Location: product-edit.php?id=' . urlencode($id) . '&saved=1');
                    exit;
                } catch (RuntimeException $e) {
                    $error = $e->getMessage();
                }
            }
        }
    }

    $product = [
        'id' => $isNew ? '' : $editId,
        'model' => $model,
        'image' => $product['image'] ?? '',
        'name' => ['tr' => $nameTr, 'en' => $nameEn],
        'attributes' => [
            'tr' => array_map(null, $_POST['attr_tr_label'] ?? [], $_POST['attr_tr_value'] ?? []),
        ],
        'category' => ['tr' => [$categoryTr], 'en' => [$categoryEn]],
        'brand' => $brand,
    ];
    $rawAttrs = [];
    foreach (($_POST['attr_tr_label'] ?? []) as $i => $label) {
        $rawAttrs[] = ['label' => $label, 'value' => $_POST['attr_tr_value'][$i] ?? ''];
    }
    $product['attributes']['tr'] = $rawAttrs;
}

$attrRows = $product['attributes']['tr'] ?? [];
if (empty($attrRows)) {
    $attrRows = [['label' => '', 'value' => '']];
}
$currentImgUrl = product_image_url($product['image'] ?? null);

render_header($isNew ? 'Yeni Ürün' : 'Ürün Düzenle', 'products');
?>
<div class="panel-header">
  <h1><?= $isNew ? 'Yeni Ürün Ekle' : 'Ürün Düzenle: ' . htmlspecialchars($editId, ENT_QUOTES, 'UTF-8') ?></h1>
  <div style="display:flex; gap:8px;">
    <a href="products.php" class="btn">← Ürün Listesi</a>
    <?php if (!$isNew): ?>
      <form method="post" onsubmit="return confirm('Bu ürün kalıcı olarak silinsin mi? Bu işlem geri alınamaz.')">
        <input type="hidden" name="form_action" value="delete_product">
        <button type="submit" class="btn btn-danger">Ürünü Sil</button>
      </form>
    <?php endif; ?>
  </div>
</div>

    <?php if ($success): ?>
      <div class="success-banner">Kaydedildi.</div>
    <?php endif; ?>
    <?php if ($error): ?>
      <div class="error-banner"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
    <?php endif; ?>

    <form method="post" enctype="multipart/form-data" class="edit-form">
      <div class="form-row">
        <label>Fotoğraf</label>
        <?php if ($currentImgUrl): ?>
          <div class="current-photo">
            <img src="<?= htmlspecialchars($currentImgUrl, ENT_QUOTES, 'UTF-8') ?>" alt="">
            <span class="hint">Mevcut fotoğraf. Yeni bir dosya seçersen bunun yerine geçer.</span>
          </div>
        <?php endif; ?>
        <input type="file" name="photo" accept="image/png,image/jpeg,image/webp,image/gif">
        <p class="hint">Yüklenen fotoğraf otomatik olarak 800x800 içine sığdırılıp WebP'ye çevrilir. Maksimum dosya boyutu: 10 MB.</p>
      </div>

      <div class="form-row">
        <label for="model">Model Kodu <?= $isNew ? '(ör. KSL999)' : '' ?></label>
        <input type="text" id="model" name="model" value="<?= htmlspecialchars($product['model'] ?? '', ENT_QUOTES, 'UTF-8') ?>" <?= $isNew ? '' : 'readonly' ?> required>
      </div>

      <div class="form-row">
        <label for="name_tr">Ürün Adı (Türkçe)</label>
        <input type="text" id="name_tr" name="name_tr" value="<?= htmlspecialchars($product['name']['tr'] ?? '', ENT_QUOTES, 'UTF-8') ?>" required>
      </div>

      <div class="form-row">
        <label for="name_en">Ürün Adı (İngilizce)</label>
        <input type="text" id="name_en" name="name_en" value="<?= htmlspecialchars($product['name']['en'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
      </div>

      <div class="form-row">
        <label for="brand">Marka</label>
        <select id="brand" name="brand">
          <?php foreach (['k2' => 'K2', 'vanti' => 'Vanti', 'global' => 'Global'] as $val => $label): ?>
            <option value="<?= $val ?>" <?= ($product['brand'] ?? 'k2') === $val ? 'selected' : '' ?>><?= $label ?></option>
          <?php endforeach; ?>
        </select>
      </div>

      <div class="form-row">
        <label for="category_tr">Kategori (Türkçe, virgülle ayır)</label>
        <input type="text" id="category_tr" name="category_tr" value="<?= htmlspecialchars(implode(', ', $product['category']['tr'] ?? []), ENT_QUOTES, 'UTF-8') ?>" required>
      </div>

      <div class="form-row">
        <label for="category_en">Kategori (İngilizce, virgülle ayır)</label>
        <input type="text" id="category_en" name="category_en" value="<?= htmlspecialchars(implode(', ', $product['category']['en'] ?? []), ENT_QUOTES, 'UTF-8') ?>">
      </div>

      <div class="form-row">
        <label>Teknik Özellikler (Watt, Renk, Ölçü vb.)</label>
        <div id="attr-rows">
          <?php foreach ($attrRows as $i => $row): ?>
            <div class="attribute-row">
              <input type="text" name="attr_tr_label[]" placeholder="Etiket (ör. Renk)" value="<?= htmlspecialchars($row['label'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
              <input type="text" name="attr_tr_value[]" placeholder="Değer (ör. Beyaz)" value="<?= htmlspecialchars($row['value'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
              <button type="button" class="remove-attr" onclick="this.parentElement.remove()">Sil</button>
            </div>
          <?php endforeach; ?>
        </div>
        <button type="button" class="btn" onclick="addAttrRow()">+ Özellik Ekle</button>
        <p class="hint">İngilizce etiket/değer boş bırakılırsa Türkçesiyle aynı kaydedilir.</p>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Kaydet</button>
      </div>
    </form>

<script>
  function addAttrRow() {
    const container = document.getElementById('attr-rows');
    const row = document.createElement('div');
    row.className = 'attribute-row';
    row.innerHTML = '<input type="text" name="attr_tr_label[]" placeholder="Etiket (ör. Renk)">' +
      '<input type="text" name="attr_tr_value[]" placeholder="Değer (ör. Beyaz)">' +
      '<button type="button" class="remove-attr" onclick="this.parentElement.remove()">Sil</button>';
    container.appendChild(row);
  }
</script>
<?php
render_footer();
