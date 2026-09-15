<?php
declare(strict_types=1);

require_once __DIR__ . '/json_format.php';

define('PROJECTS_JSON_PATH', __DIR__ . '/../../src/data/projects.json');
define('PROJECTS_BACKUP_DIR', __DIR__ . '/../data/backups');
define('PROJECTS_IMAGE_DIR', __DIR__ . '/../../public/images/references/turkiye');

/** @return array<int, array<string, mixed>> */
function load_projects(): array
{
    if (!file_exists(PROJECTS_JSON_PATH)) {
        return [];
    }
    $raw = file_get_contents(PROJECTS_JSON_PATH);
    $data = json_decode((string) $raw, true);
    return is_array($data) ? array_values($data) : [];
}

/** @param array<string, mixed> $project */
function validate_project_structure(array $project): ?string
{
    if (!isset($project['id']) || !is_string($project['id']) || $project['id'] === '') {
        return 'id eksik.';
    }
    if (!isset($project['name']) || !is_string($project['name']) || $project['name'] === '') {
        return 'name eksik.';
    }
    if (!isset($project['location']) || !is_string($project['location'])) {
        return 'location eksik.';
    }
    if (!isset($project['image']) || !is_string($project['image']) || $project['image'] === '') {
        return 'image eksik.';
    }
    return null;
}

/**
 * Gerçek src/data/projects.json'a yazar (Projects.tsx bunu okuyor) — her kaydın yapısal
 * bütünlüğünü doğrular, kaydetmeden önce yedek alır, atomik yazar.
 * @param array<int, array<string, mixed>> $projects
 */
function save_projects(array $projects): void
{
    $projects = array_values($projects);
    foreach ($projects as $p) {
        $error = validate_project_structure($p);
        if ($error !== null) {
            throw new RuntimeException("Proje kaydedilemedi: $error");
        }
    }

    if (!is_dir(PROJECTS_BACKUP_DIR)) {
        mkdir(PROJECTS_BACKUP_DIR, 0755, true);
    }
    if (file_exists(PROJECTS_JSON_PATH)) {
        copy(PROJECTS_JSON_PATH, PROJECTS_BACKUP_DIR . '/projects-' . date('Ymd-His') . '.json');
    }

    $json = json_encode_2space($projects, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false && json_last_error() === JSON_ERROR_UTF8) {
        $projects = fix_utf8_recursive($projects);
        $json = json_encode_2space($projects, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if ($json === false) {
        throw new RuntimeException('Proje verisi JSON olarak kodlanamadı: ' . json_last_error_msg());
    }

    if (!atomic_write(PROJECTS_JSON_PATH, (string) $json)) {
        throw new RuntimeException('projects.json güncellenemedi (dosya kilitli olabilir, tekrar dene).');
    }

    clearstatcache(true, PROJECTS_JSON_PATH);
    if (file_get_contents(PROJECTS_JSON_PATH) !== $json) {
        throw new RuntimeException('projects.json yazıldı ama doğrulama başarısız oldu - lütfen tekrar kaydet.');
    }
}

/** Mevcut "ref-NN" id'lerinin en büyüğünden bir sonrakini üretir. */
function generate_next_project_id(array $existingProjects): string
{
    $max = 0;
    foreach ($existingProjects as $p) {
        if (preg_match('/^ref-(\d+)$/', (string) ($p['id'] ?? ''), $m)) {
            $max = max($max, (int) $m[1]);
        }
    }
    return sprintf('ref-%02d', $max + 1);
}

/** Görseli sıkıştırıp gerçek public/images/references/turkiye/ altına {id}.webp olarak kaydeder. */
function save_project_image(string $tmpPath, string $id): array
{
    if (!is_dir(PROJECTS_IMAGE_DIR)) {
        mkdir(PROJECTS_IMAGE_DIR, 0755, true);
    }
    $destPath = PROJECTS_IMAGE_DIR . '/' . $id . '.webp';
    $result = compress_product_image($tmpPath, $destPath);
    if (!$result['ok']) {
        return $result;
    }
    return ['ok' => true, 'relativePath' => 'references/turkiye/' . basename($result['path'])];
}

/** Bir projeye ait yüklenmiş görseli diskten siler. */
function delete_project_image(string $id): void
{
    foreach (glob(PROJECTS_IMAGE_DIR . '/' . $id . '.*') ?: [] as $file) {
        @unlink($file);
    }
}
