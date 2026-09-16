# Yönetim Paneli — admin-panel/

Bu klasör, ana Next.js sitesinden (`kendalwebpage`) **tamamen ayrı, bağımsız bir PHP uygulaması**. Next.js build süreciyle (`npm run build`, `out/`) hiçbir ilgisi yok — ayrı olarak cPanel'e yüklenir.

Genel plan için proje kökündeki `ADMIN_PANEL_PLAN.md` dosyasına bakın. Bu README sadece bu klasörün kurulumu/deploy'u ile ilgili.

## Şu an ne var

**Giriş (Faz 1):**
- Şifreyle giriş yapılan bir `/login.php` sayfası
- Oturum yönetimi (PHP session), CSRF koruması, 5 yanlış denemeden sonra 1 dakikalık kilit

**Ürün yönetimi (Faz 1.5) — artık gerçek siteye bağlı:**
- `products.php` — ürün listesi, marka filtresi + arama
- `product-edit.php` — ürün düzenleme (isim TR/EN, kategori, teknik özellikler/attributes), yeni ürün ekleme ve **ürün silme** (onay istemli, ürünle birlikte yüklü fotoğrafı da diskten temizler); fotoğraf yükleme otomatik olarak 800x800'e sığdırılıp WebP'ye çevriliyor (kalite 80). **Doğrudan gerçek `src/data/products.json`'a (856 ürün) ve `public/images/urunler/`'a yazıyor** — kaydedilen değişiklik bir sonraki `npm run build` + deploy sonrası canlı siteye yansır. `save_products()` her kayıttan önce yapısal bütünlüğü doğruluyor (bkz. `ADMIN_PANEL_PLAN.md`).
- `brand-logo.php` — K2/Vanti/Global logo değiştirme. Doğrudan gerçek `public/images/brands/{brand}-logo.svg`'a yazıyor. **Sadece SVG kabul ediyor** — sitenin tüm logo referansları (15+ dosyada) özellikle `.svg` uzantısını arıyor, başka bir format kaydedilse bile siteye hiç yansımaz; bu yüzden PNG/WEBP/JPG yükleme seçeneği kaldırıldı.
- `settings.php` — footer'daki paylaşılan iletişim bilgileri/sosyal medya linkleri. Doğrudan `src/data/settings.json`'a (gerçek site verisi) yazıyor ve `Footer.tsx`/`BrandFooter.tsx`/`IletisimClient.tsx`/`OrganizationSchema.tsx` buradan okuyor. Kaydettiğinde bir sonraki build/dev-server yenilemesinde gerçek siteye yansır.

**Blok tabanlı yeni sayfalar (Faz 6, sürüyor):**
- `pages.php`/`page-edit.php` — blok tabanlı serbest sayfa oluşturma/düzenleme/silme. `settings.php` gibi izole değil, doğrudan `src/data/pages.json`'a (gerçek site verisi) yazıyor; sayfalar `www.kendalelektrik.com/sayfa/{slug}` adresinde yayınlanır (`src/app/(main)/sayfa/[slug]/`). Slug oluşturulduktan sonra değiştirilemez. Blok editörü: 4 blok tipi (Başlık+Metin, Metin+Görsel, Buton/CTA, Görsel Galerisi) eklenebilir/silinebilir/sıralanabilir; fotoğraflar mevcut `compress_product_image()` ile otomatik WebP'ye çevrilip gerçek `public/images/sayfalar/` altına kaydediliyor. "Sayfayı Sil" ile sayfa ve tüm görselleri kalıcı silinebilir. **Sağlamlaştırma:** `save_pages()` her kayıttan önce yapısal bütünlüğü doğruluyor (bkz. `ADMIN_PANEL_PLAN.md` Faz 6 Aşama 5), ayrıca Next.js tarafındaki blok bileşenleri boş/doldurulmamış bloklarda `null` dönerek build'i asla kırmıyor — gerçek bir `npm run build` ile kanıtlandı.

**Navbar Linkleri:**
- `navbar-links.php` — ana sitenin üst menüsüne (navbar) "Sayfalarımız" başlığı altında ek link ekleme/silme/sıralama. Doğrudan gerçek `src/data/navLinks.json`'a yazıyor; `Navbar.tsx` bunu okuyup **hiç link yoksa menüye ek bir bölüm eklemiyor** (mevcut menüde hiçbir değişiklik/regresyon olmuyor), en az 1 link varsa "Sayfalarımız" adında yeni bir açılır grup görünüyor. "Sayfalar" bölümünde oluşturulan bir sayfayı seçip adresini otomatik doldurma kolaylığı var.

**Zincir Marketler / Projeler / Sertifikalar / Hakkımızda / Misyon-Vizyon / Haberler (2026-09-15, `ADMIN_PANEL_PLAN.md`'deki "İncelendi, kod değiştirilmedi" listesinin tamamlanması):**
- `retailers.php` — anasayfadaki zincir market logo şeridi (`RetailPresence.tsx`). Doğrudan `src/data/retailers.json` + `public/images/retail/`'a yazıyor; ekle/sil/sırala, logo otomatik WebP'ye çevriliyor.
- `projects.php` — referans projeler şeridi (`Projects.tsx`). Doğrudan `src/data/projects.json` + `public/images/references/turkiye/`'a yazıyor; id'ler otomatik `ref-NN` olarak üretiliyor, ekle/sil/sırala.
- `certificates.php` — `/sertifikalar/{iso,tse,marka-tescil}` sayfalarındaki belge görselleri. Doğrudan `src/data/certificates.json` + `public/images/certifications/{kategori}-belgeleri/`'a yazıyor; 3 kategori sekmeli, her birinde ekle/sil/sırala. (Anasayfadaki üst 5 kartlık sabit liste — nadiren değişen ikon+link — kapsam dışı bırakıldı, bkz. `ADMIN_PANEL_PLAN.md`.)
- `about.php` — anasayfadaki "Hakkımızda" bölümü (`AboutUs.tsx`). Doğrudan `src/data/aboutContent.json`'a yazıyor (daha önce `src/lib/i18n/tr.json`/`en.json` içindeki `about` anahtarıydı, ayrı dosyaya taşındı — `nav.about` menü etiketi i18n'de kaldı, etkilenmedi). Ana metin (rozet/başlık/alt metin, TR+EN) + zaman çizelgesi maddeleri (ekle/sil/sırala/düzenle, TR+EN karşılıklı).
- `mission-vision.php` — "/misyon-ve-vizyon" sayfası. Doğrudan `src/data/missionVision.json`'a yazıyor (aynı şekilde `tr.json`/`en.json`'daki `mission_page`/`vision_page`'den taşındı). Misyon + Vizyon başlık/metin, TR+EN.
- `news.php`/`news-edit.php` — "/haberler" listesi ve "/haberler/{id}" detay sayfaları. Veri kaynağı `src/data/news-tr.ts`/`news-en.ts` (TypeScript literal dizi) idi, **`src/data/news.json`'a taşındı** (`news-tr.ts`/`news-en.ts` artık bu JSON'u okuyan ince birer sarmalayıcı — dışa açık tip/API'leri birebir korundu, tüketen bileşenler değişmedi). Başlık/tarih TR ve EN ayrı düzenlenir; galeri görselleri (üstteki kaydırmalı slider) TR/EN arasında paylaşılır (siteye zaten hep aynı şekilde yansıyordu); haber metni paragrafları (TR ve EN tamamen bağımsız listeler) ekle/sil/sırala/düzenle — hem düz metin paragrafı hem paragraflar arası görsel (`[IMAGE]...` işaretli, `NewsDetailClient.tsx`'in beklediği format) desteklenir. Yeni haber için id otomatik artan sayı olarak üretilir. "Haberi Sil" habere ait tüm görselleri de diskten temizler.

**Arayüz:** Tüm sayfalar `includes/layout.php`'deki ortak sidebar+üst bar şablonunu kullanıyor (`render_header()`/`render_footer()`), HTML tekrarı yok. Mobilde sidebar açılır menüye dönüşüyor.

**⚠️ Test ederken gerçek ürünleri bozmayın:** Ürünler artık gerçek `src/data/products.json`'a yazıyor (izole kopya kaldırıldı) — deneme/test amaçlı düzenlemeleri **kalıcı olmayan, geçici** bir test ürünüyle yapın (ör. `DENEME` modeliyle oluşturup işiniz bitince "Ürünü Sil" ile tamamen silin — `admin-panel/tests/*.php` dosyaları da tam bu deseni kullanıyor). KSL900 gibi gerçek ürün kayıtlarını test için kullanmayın, gerçek bir düzenleme yapacaksanız ne yaptığınızdan emin olun.

**✅ Artık her şey gerçek siteye bağlı:** Ürünler, sayfalar, site ayarları VE marka logoları — hepsi doğrudan gerçek site verisine/dosyalarına yazıyor (`src/data/products.json`, `src/data/pages.json`, `src/data/settings.json`, `public/images/`). Admin panelden yapılan değişiklikler bir sonraki build/deploy'da canlı siteye yansır. İzole/test-amaçlı bir kopya artık hiçbir bölümde yok.

**Dosya boyutu limitleri:** Fotoğraf yükleme en fazla 10MB, logo yükleme en fazla 5MB (bkz. `admin-panel/lib/upload.php`). Aşan dosyalar anlaşılır bir hata mesajıyla reddediliyor.

**WebP olmazsa JPEG'e düşer:** cPanel'in gerçek PHP'sinde WebP desteği çıkmazsa (`admin-panel/lib/image.php`), fotoğraf sıkıştırma otomatik olarak JPEG'e düşüyor — sistem yine çalışmaya devam eder, sadece dosya uzantısı `.jpg` olur.

**Otomatik testler** (`admin-panel/tests/`):
- `smoke-test.php` — ana uçtan uca test (giriş, ürün düzenleme, foto yükleme, yeni ürün, marka logosu değiştirme, gerçek `src/data/products.json`'a yansıdığının ve testten önceki hâline byte-byte döndüğünün doğrulanması, çıkış) — 28 kontrol, hepsi gerçek site verisi üzerinde çalışır
- `test_category.php` — kategori değiştirme + yeni kategori ekleme
- `test_edge_cases.php` — XSS, çok uzun metin, sahte dosya, path-traversal, emoji/çok dilli Unicode denemeleri
- `test_jpeg_fallback.php` — WebP yokmuş gibi davranıp JPEG yedek yolunu test eder
- `test_upload_limits.php` — dosya boyutu limiti aşımı
- `test_settings.php` — site ayarları kaydetme/doğrulama
- `test_pages.php` — blok tabanlı sayfa oluşturma/düzenleme/arama (Faz 6)
- `test_page_blocks.php` — blok editörü: ekleme/düzenleme/silme/sıralama, 4 blok tipi, fotoğraf yükleme (Faz 6)
- `test_page_hardening.php` — `pages.json`'ın yapısal doğrulaması, `save_pages()`'in bozuk kaydı reddettiği (Faz 6)
- `test_concurrent_writes.php` — iki eşzamanlı `atomic_write()` çağrısının birbirinin geçici dosyasını ezmediğini gerçek iki alt süreçle doğrular
- `test_search_performance.php` — ürün (856 gerçek kayıt) ve sayfa (1000 sentetik kayıt) listesi/aramasının makul sürede yanıt verdiğini ölçer
- `test_product_delete.php` — ürün silme (fotoğrafıyla birlikte), izolasyonun korunduğu, silinen ürüne erişimin 404 verdiği
- `test_deploy.php` — GitHub'a dosya gönderme mantığı (yol kodlama, yapılandırılmamışken güvenli/anında hata verme), `deploy.php`'nin kurulmamış durumu çökmeden gösterdiği
- `test_navbar_links.php` — navbar linki ekleme/silme/sıralama, geçersiz adresin reddedildiği, gerçek `navLinks.json`'un byte-byte eski hâline döndüğü
- `test_retailers.php` — zincir market ekleme/sil/sırala, logo yükleme, benzersiz id üretimi, byte-byte temizlik
- `test_projects.php` — proje ekleme/sil/sırala, otomatik `ref-NN` id üretimi, görsel yükleme, byte-byte temizlik
- `test_certificates.php` — 3 sertifika kategorisinin (iso/tse/marka-tescil) izolasyonu, ekle/sil/sırala, byte-byte temizlik
- `test_mission_vision.php` — misyon/vizyon metni kaydetme, boş başlığın reddedildiği, byte-byte temizlik
- `test_about.php` — ana metin güncelleme + zaman çizelgesi maddesi ekle/düzenle/sil/sırala, byte-byte temizlik
- `test_news.php` — haber oluşturma, paylaşımlı galeri (TR/EN ortak) + bağımsız TR/EN paragraf listeleri (metin + görsel paragrafı, sırala/düzenle/sil), haber silme ile görsellerin de temizlendiği, byte-byte temizlik

Kod üzerinde değişiklik yaptıktan sonra bunları çalıştırıp hâlâ hepsinin geçtiğini görmek iyi bir alışkanlık olur (bkz. aşağıda nasıl çalıştırılacağı).

## Otomatik Yayın Kurulumu ("Yayınla" butonu)

Admin panelde "Yayınla" sayfası (`deploy.php`), Site Ayarları ve Sayfalar'daki değişiklikleri gerçek siteye göndermek için var. Şu an **kurulmadı** — `config.php` içindeki `GITHUB_TOKEN`/`GITHUB_REPO` boş olduğu sürece sayfa güvenli bir "henüz kurulmadı" mesajı gösterir, hiçbir hata vermez.

**Nasıl çalışıyor (özet):** Yayınla → admin panel değişen 12 veri dosyasının hepsini (`src/data/*.json`: ürünler, marketler, projeler, sertifikalar, haberler, sayfalar, anasayfa blokları, navbar linkleri, hakkımızda/misyon-vizyon, site ayarları, slug-map) GitHub'a gönderir → hepsi başarılıysa GitHub Actions workflow'unu (`.github/workflows/deploy-test-kendalelektrikcom.yml`) API üzerinden `workflow_dispatch` ile tetikler → o da `npm run build` çalıştırıp sonucu FTP ile `kendalelektrik.com`'a yükler → ~5-10 dk içinde site güncellenir. (`deploy-cpanel.yml`, yani `.com.tr` hedefi, kasıtlı olarak devre dışı — buraya dokunmuyor.)

**Kurulum için gerekenler (iki ayrı yerde, biri GitHub'da biri admin panelde):**

1. **GitHub Personal Access Token** (admin panelin GitHub'a dosya göndermesi için):
   - GitHub.com → sağ üstteki profil fotoğrafı → **Settings** → sol menüde en altta **Developer settings**.
   - **Personal access tokens → Fine-grained tokens → Generate new token.**
   - İsim ver (ör. `kendal-admin-panel-deploy`), **Repository access → Only select repositories** → bu repoyu seç.
   - **Permissions → Repository permissions → Contents → Read and write** seç.
   - **Generate token** → çıkan kodu kopyala (bir daha gösterilmez!) → `admin-panel/config.php` içindeki `GITHUB_TOKEN` satırına yapıştır.
   - Aynı dosyada `GITHUB_REPO`'yu da `kullaniciadi/kendalwebpage` formatında doldur (GitHub repo sayfasının adresinden görülür).

2. **cPanel FTP bilgileri** (GitHub Actions'ın build sonucunu cPanel'e yükleyebilmesi için — bunlar GitHub'a, admin panele değil):
   - cPanel → **FTP Hesapları (FTP Accounts)** → yeni bir FTP hesabı oluştur (mümkünse ana hesabı değil, sadece `public_html`'e erişimi olan ayrı/kısıtlı bir hesap — güvenlik için).
   - Sunucu adresi (host), kullanıcı adı, şifreyi not al.
   - GitHub'da bu reponun sayfası → **Settings → Secrets and variables → Actions → New repository secret** ile şu 4 secret'ı ekle:
     - `CPANEL_FTP_SERVER` (ör. `ftp.kendalelektrik.com`)
     - `CPANEL_FTP_USERNAME`
     - `CPANEL_FTP_PASSWORD`
     - `CPANEL_FTP_SERVER_DIR` (hedef klasör, ör. `/public_html/`)

Her ikisi de tamamlanmadan "Yayınla" gerçek bir şey yapmaz (GitHub tarafı olmadan admin panel dosyayı gönderemez; FTP secret'ları olmadan GitHub Actions build'i cPanel'e yükleyemez).

**Bir kereye mahsus, ayrı bir adım:** Bu ikisi kurulmadan önce bile, `admin-panel/`, blok editörü bileşenleri ve `/sayfa` route'u gibi bu gece yazılan KOD henüz hiç commit edilmedi. "Yayınla" butonu sadece VERİ dosyalarını (`settings.json`/`pages.json`) günceller — GitHub'ın bu kodu ilk kez görebilmesi için önce bir kerelik normal bir commit+push gerekiyor. Bu, kullanıcı onayı gerektiren ayrı bir adım (bkz. `ADMIN_PANEL_PLAN.md`).

## cPanel'e yükleme

`admin-panel/` klasörünün **içeriğini** (klasörün kendisini değil) cPanel'de `public_html/admin/` altına yükleyin. Örn: Dosya Yöneticisi veya FTP ile `admin-panel/login.php` dosyası sunucuda `public_html/admin/login.php` olarak durmalı.

Yükledikten sonra `https://www.kendalelektrik.com/admin/` adresinden erişilebilir olur.

## ⚠️ Şifreyi değiştirme (canlıya almadan önce ZORUNLU)

`config.php` içindeki `ADMIN_PASSWORD_HASH` şu an **geliştirme/test şifresi** (`degistir123`) ile ayarlı. Canlıya almadan önce mutlaka değiştirin:

1. Yeni bir şifre belirleyin (örn. `GucluBirSifre2026!`).
2. Bilgisayarınızda (veya cPanel'in "Terminal" aracında, varsa) şu komutu çalıştırın:
   ```
   php -r "echo password_hash('YENİ_ŞİFRENİZ', PASSWORD_DEFAULT), PHP_EOL;"
   ```
3. Çıktıyı (`$2y$10$...` ile başlayan uzun metni) kopyalayıp `config.php` içindeki `ADMIN_PASSWORD_HASH` satırına yapıştırın.
4. `config.php` dosyasını **git'e commit etmeyin** eğer gerçek şifre hash'i içeriyorsa — güvenlik için ayrı tutulması daha iyi olur (ileride bir `.env`/config-dışı yöntem düşünülebilir).

## Yerel test

Bilgisayarınızda PHP kuruluysa (`php -v` ile kontrol edin; GD/WebP desteği için `php -m | grep gd` çalıştırıp `gd` çıktığından emin olun), **proje kökünden** (admin-panel/ değil, bir üst dizin) şunu çalıştırın:
```
php -S localhost:8899 admin-panel/_local-test-router.php
```
(`_local-test-router.php`, sadece yerel testte `/images/...` yollarının `public/images/...`'a düşmesini sağlıyor — gerçek sitede buna gerek yok, Apache bunu zaten otomatik yapıyor.)

Sonra tarayıcıda `http://localhost:8899/admin-panel/` adresine gidin. Şifre: `degistir123` (değiştirilmediyse).

Otomatik testi çalıştırmak için (sunucu ayaktayken, başka bir terminalde):
```
php admin-panel/tests/smoke-test.php
```

## Sırada ne var

`ADMIN_PANEL_PLAN.md`'ye bakın — güncel durum özeti dosyanın en üstünde. Kısaca: panelin hiçbir bölümü artık izole bir kopya üzerinde çalışmıyor, hepsi gerçek site verisine/dosyalarına doğrudan yazıyor. Kalan kararlar: ilk kod commit'inin ne zaman yapılacağı ve cPanel'e ilk gerçek deploy testinin ne zaman yapılacağı.
