<?php
/** Sidebar + üst kısmı basar; her sayfa render_footer() ile kapatmalı. */
function render_header(string $title, string $active = ''): void
{
    $navItems = [
        'dashboard' => ['dashboard.php', 'Panel'],
        'products' => ['products.php', 'Ürünler'],
        'brand-logo' => ['brand-logo.php', 'Marka Logoları'],
        'retailers' => ['retailers.php', 'Zincir Marketler'],
        'projects' => ['projects.php', 'Projeler'],
        'certificates' => ['certificates.php', 'Sertifikalar'],
        'about' => ['about.php', 'Hakkımızda'],
        'mission-vision' => ['mission-vision.php', 'Misyon ve Vizyon'],
        'news' => ['news.php', 'Haberler'],
        'pages' => ['pages.php', 'Sayfalar'],
        'navbar-links' => ['navbar-links.php', 'Navbar Linkleri'],
        'settings' => ['settings.php', 'Site Ayarları'],
        'deploy' => ['deploy.php', 'Yayınla'],
    ];
    ?>
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?> | Kendal Elektrik Yönetim Paneli</title>
<link rel="stylesheet" href="assets/style.css">
<link rel="stylesheet" href="assets/panel.css">
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="sidebar-brand-mark">K</span>
        <span class="sidebar-brand-text">Kendal Elektrik</span>
      </div>
      <nav class="sidebar-nav">
        <?php foreach ($navItems as $key => [$href, $label]): ?>
          <a href="<?= $href ?>" class="sidebar-link<?= $key === $active ? ' is-active' : '' ?>"><?= $label ?></a>
        <?php endforeach; ?>
      </nav>
      <a href="logout.php" class="sidebar-logout">Çıkış Yap</a>
    </aside>
    <div class="app-main">
      <header class="topbar">
        <button class="sidebar-toggle" onclick="document.querySelector('.app-shell').classList.toggle('sidebar-open')" aria-label="Menü">☰</button>
        <h1 class="topbar-title"><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></h1>
      </header>
      <main class="panel">
    <?php
}

function render_footer(): void
{
    ?>
      </main>
    </div>
  </div>
</body>
</html>
    <?php
}
