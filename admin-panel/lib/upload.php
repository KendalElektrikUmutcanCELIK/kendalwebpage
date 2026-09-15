<?php
declare(strict_types=1);

const MAX_PHOTO_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_LOGO_UPLOAD_BYTES = 5 * 1024 * 1024;

/** post_max_size aşılınca PHP $_POST/$_FILES'ı sessizce boşaltır; bunu ayırt etmek için kullan. */
function is_post_too_large(): bool
{
    return empty($_POST) && empty($_FILES) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0;
}

/**
 * @param array{tmp_name?: string, error?: int, size?: int} $file $_FILES['xxx']
 */
function validate_upload(array $file, int $maxBytes): ?string
{
    $error = $file['error'] ?? UPLOAD_ERR_NO_FILE;

    if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE) {
        return 'Dosya çok büyük (sunucunun izin verdiği üst sınırı aşıyor).';
    }
    if ($error !== UPLOAD_ERR_OK) {
        return 'Dosya yüklenirken bir sorun oluştu (kod: ' . $error . ').';
    }
    if (($file['size'] ?? 0) > $maxBytes) {
        $maxMb = round($maxBytes / 1024 / 1024, 1);
        return "Dosya çok büyük. En fazla {$maxMb} MB olabilir.";
    }
    if (($file['size'] ?? 0) <= 0) {
        return 'Dosya boş görünüyor.';
    }
    return null;
}
