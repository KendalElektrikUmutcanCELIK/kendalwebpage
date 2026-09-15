<?php
declare(strict_types=1);

define('GITHUB_API_BASE', 'https://api.github.com');

/** GITHUB_TOKEN/GITHUB_REPO config.php'de dolduruldu mu kontrol eder. */
function github_deploy_configured(): bool
{
    return GITHUB_TOKEN !== '' && GITHUB_REPO !== '';
}

/** GitHub Contents API isteği için gerekli header'lar. @return array<int, string> */
function github_api_headers(): array
{
    return [
        'Authorization: Bearer ' . GITHUB_TOKEN,
        'Accept: application/vnd.github+json',
        'X-GitHub-Api-Version: 2022-11-28',
        'User-Agent: kendal-admin-panel',
    ];
}

/** "src/data/foo.json" gibi bir yolu URL'de güvenli şekilde kodlar (/ karakterlerini korur). */
function github_url_encode_path(string $path): string
{
    return implode('/', array_map('rawurlencode', explode('/', $path)));
}

/** İlgili dosyanın GitHub'daki mevcut SHA'sını döndürür (yoksa/hataysa null — yeni dosya demektir). */
function github_get_file_sha(string $repoRelativePath): ?string
{
    $url = GITHUB_API_BASE . '/repos/' . GITHUB_REPO . '/contents/' . github_url_encode_path($repoRelativePath) . '?ref=' . urlencode(GITHUB_BRANCH);
    [$status, $body] = github_curl_get($url);
    if ($status !== 200) {
        return null;
    }
    $data = json_decode($body, true);
    return is_array($data) ? ($data['sha'] ?? null) : null;
}

/**
 * Bir dosyayı GitHub'a commit'ler (varsa SHA'sıyla günceller, yoksa oluşturur).
 * @return array{ok: bool, error?: string}
 */
function github_push_file(string $repoRelativePath, string $content, string $commitMessage): array
{
    if (!github_deploy_configured()) {
        return ['ok' => false, 'error' => 'GitHub bağlantısı henüz kurulmadı (config.php içinde GITHUB_TOKEN/GITHUB_REPO boş).'];
    }

    $sha = github_get_file_sha($repoRelativePath);
    $payload = [
        'message' => $commitMessage,
        'content' => base64_encode($content),
        'branch' => GITHUB_BRANCH,
    ];
    if ($sha !== null) {
        $payload['sha'] = $sha;
    }

    $url = GITHUB_API_BASE . '/repos/' . GITHUB_REPO . '/contents/' . github_url_encode_path($repoRelativePath);
    [$status, $body] = github_curl_put($url, $payload);

    if ($status === 200 || $status === 201) {
        return ['ok' => true];
    }

    $decoded = json_decode($body, true);
    $message = is_array($decoded) ? ($decoded['message'] ?? 'Bilinmeyen hata') : 'Bilinmeyen hata';
    return ['ok' => false, 'error' => "GitHub API hatası (HTTP $status): $message"];
}

/** @return array{0: int, 1: string} [http_status, body] */
function github_curl_get(string $url): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => github_api_headers(),
        CURLOPT_TIMEOUT => 15,
    ]);
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [(int) $status, (string) $body];
}

/** @param array<string, mixed> $payload @return array{0: int, 1: string} [http_status, body] */
function github_curl_put(string $url, array $payload): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => 'PUT',
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => array_merge(github_api_headers(), ['Content-Type: application/json']),
        CURLOPT_TIMEOUT => 20,
    ]);
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [(int) $status, (string) $body];
}
