<?php
require __DIR__ . '/config.php';

if (is_admin_logged_in()) {
    header('Location: dashboard.php');
    exit;
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['login_locked_until'] = 0;
}

$error = '';
$locked = $_SESSION['login_locked_until'] > time();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$locked) {
    $token = $_POST['csrf_token'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!hash_equals($_SESSION['csrf_token'], $token)) {
        $error = 'Oturum süresi doldu, lütfen tekrar deneyin.';
    } elseif (password_verify($password, ADMIN_PASSWORD_HASH)) {
        $_SESSION['login_attempts'] = 0;
        session_regenerate_id(true);
        $_SESSION[ADMIN_SESSION_KEY] = true;
        header('Location: dashboard.php');
        exit;
    } else {
        $_SESSION['login_attempts']++;
        if ($_SESSION['login_attempts'] >= 5) {
            $_SESSION['login_locked_until'] = time() + 60;
            $_SESSION['login_attempts'] = 0;
            $locked = true;
        }
        $error = 'Şifre hatalı.';
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Yönetim Paneli Girişi | Kendal Elektrik</title>
<link rel="stylesheet" href="assets/style.css">
</head>
<body class="login-body">
  <div class="login-box">
    <img src="assets/kendal-icon.png" alt="Kendal Elektrik" class="login-mark">
    <h1>Kendal Elektrik</h1>
    <p class="subtitle">Yönetim Paneli</p>

    <?php if ($locked): ?>
      <p class="error">Çok fazla hatalı deneme yapıldı. Lütfen 1 dakika sonra tekrar deneyin.</p>
    <?php elseif ($error): ?>
      <p class="error"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
    <?php endif; ?>

    <form method="post" autocomplete="off">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8') ?>">
      <label for="password">Şifre</label>
      <input type="password" id="password" name="password" required <?= $locked ? 'disabled' : 'autofocus' ?>>
      <button type="submit" <?= $locked ? 'disabled' : '' ?>>Giriş Yap</button>
    </form>
  </div>
</body>
</html>
