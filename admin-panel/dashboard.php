<?php
require __DIR__ . '/config.php';
require_admin_login();
require __DIR__ . '/includes/layout.php';

render_header('Panel', 'dashboard');
?>
<h1 class="page-title">Hoş geldin</h1>
<p class="page-subtitle">K2, Vanti ve Global ürün kataloğunu buradan yönetebilirsin.</p>

<div class="quick-links">
  <a href="products.php" class="quick-link-card">
    <span class="quick-link-title">Ürünler</span>
    <span class="quick-link-desc">Ürün ekle, fotoğraf/isim/teknik özellik güncelle</span>
  </a>
  <a href="brand-logo.php" class="quick-link-card">
    <span class="quick-link-title">Marka Logoları</span>
    <span class="quick-link-desc">K2, Vanti, Global logolarını değiştir</span>
  </a>
  <a href="pages.php" class="quick-link-card">
    <span class="quick-link-title">Sayfalar</span>
    <span class="quick-link-desc">Blok tabanlı yeni sayfalar oluştur</span>
  </a>
  <a href="settings.php" class="quick-link-card">
    <span class="quick-link-title">Site Ayarları</span>
    <span class="quick-link-desc">İletişim bilgileri ve sosyal medya linkleri</span>
  </a>
  <a href="deploy.php" class="quick-link-card">
    <span class="quick-link-title">Yayınla</span>
    <span class="quick-link-desc">Değişiklikleri gerçek siteye gönder</span>
  </a>
</div>
<?php
render_footer();
