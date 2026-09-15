# Yönetim Paneli Planı — Kendal Webpage

Bu dosya, projeye kodsuz bir "yönetim paneli" (admin panel) eklenmesiyle ilgili 2026-09-14 tarihli konuşmanın özeti. Amaç: birkaç hafta sonra yeni bir Claude Code session'ına sadece bu dosya okutulduğunda, neden bu karar alındığını ve nereden başlanması gerektiğini anlaması. İşin kendisi henüz **başlamadı** — bu dosya sadece plan/karar özetidir, hiçbir kod yazılmadı.

## Neden bu ihtiyaç doğdu

Proje sahibi (Umutcan), Kendal Elektrik'ten ayrılması durumunda bile şirketin bu siteyi **kodsuz** yönetebilmesi gerektiğini belirtti. Şu an her içerik değişikliği (yazı, fotoğraf, yeni ürün/haber) geliştiricinin kod düzenleyip `npm run build` alıp cPanel'e yüklemesini gerektiriyor — bu, geliştirici olmayan biri için sürdürülemez.

## Talep edilen özellikler (kullanıcının kendi ifadesiyle)

- `www.kendalelektrik.com.tr/admin` gibi bir adreste, şifreyle giriş yapılan bir panel.
- Panelden: **sayfa ekleyebilme**, **sayfalardaki yazıları güncelleyebilme**, **fotoğrafları güncelleyebilme/silebilme**, **PDF yükleyebilme**.
- "Sayfa ekleme" konusunda kullanıcı **tamamen serbest, sıfırdan yeni sayfa/layout kurabilme** istedi (bkz. "Sayfa oluşturma" bölümü — bunun pratikte ne anlama geldiği aşağıda netleştirildi).
- Yayınlama hızı: **10-15 dakikalık bir gecikme kabul edilebilir** (anlık/real-time yayın şart değil).
- **Dış kaynak/3. parti SaaS kullanılmayacak** (Builder.io, Plasmic gibi hazır sayfa oluşturucular kullanıcıya önerildi, **açıkça reddedildi** — "dış kaynak kullanmadan kodla bunu yapabilir miyiz? birlikte" dendi). Yani bu panel **tamamen kendi kodumuzla, bu Claude Code oturumları üzerinden birlikte** inşa edilecek.
- Yüklenen fotoğraf/PDF'lerin **silinebilir** olması da istendi (hem dosya hem veritabanı kaydı temizlenmeli).
- cPanel'de eski OpenCart'tan kalma bir MySQL veritabanı (`kendalel_site`) var — yeni panel bunu kullanır mı yoksa sıfırdan mı kurulur, **henüz karara bağlanmadı** ("sonra bakarız" dendi, bkz. Açık Sorular).

## Neden bu, "basit bir admin sayfası ekle" değil — mimari çelişki

Proje **tamamen statik export** olarak çalışıyor (`output: "export"`, bkz. proje kökündeki `CLAUDE.md`):
- cPanel'de çalışan bir Node/sunucu süreci **yok**, Apache sadece önceden üretilmiş `.html` dosyalarını sunuyor.
- `src/proxy.ts` (Next middleware) bile statik export'ta çalışmıyor.
- Şu an her değişiklik: kod düzenle → `npm run build` (~5-7 dk, 5120 sayfa) → `out/` klasörünü (900MB+) cPanel'e elle yükle.

Bu yüzden "login ol, yazı değiştir, hemen görün" tarzı klasik bir CMS **doğrudan** kurulamıyor — çünkü ortada isteği anında işleyecek çalışan bir sunucu yok. Kullanıcı 10-15 dk yayın gecikmesini kabul ettiği için, mevcut statik mimariyi bozmadan (yani `.htaccess` subdomain yönlendirmesi, `getAssetPath`/basePath sistemi, GH Pages ikili build hedefi gibi hiçbir şeye dokunmadan) ilerleyebiliriz — bkz. "Seçilen Mimari" bölümü.

## Seçilen mimari (karar verildi)

**Statik export korunacak + panel kendi backend'ini/veritabanını yönetecek + "yayınla" dediğinde otomatik rebuild+deploy tetiklenecek.**

Somut akış:
1. Panelde girilen her değişiklik (yazı, foto, yeni sayfa vb.) kendi veritabanımıza/dosya deposuna yazılır — **siteye anında yansımaz**.
2. "Yayınla" butonuna basılınca bir otomasyon (GitHub Actions'a benzer, mevcut `.github/workflows/nextjs.yml` deseni) tetiklenir: veritabanından/depodan güncel içerik çekilir → `npm run build` çalışır → sonuç cPanel'e otomatik yüklenir.
3. ~10-15 dakika içinde değişiklik canlıya yansır.

**Reddedilen alternatif:** Statik export'tan çıkıp Next.js'i cPanel'de gerçek bir Node sunucusu olarak çalıştırmak (SSR/ISR) — bu, anlık yayın sağlardı ama mevcut çift-hedef build sistemini (cPanel + GitHub Pages), subdomain `.htaccess` rewrite hack'ini ve tüm deployment modelini yeniden tasarlamayı gerektirirdi. Kullanıcı 10-15 dk gecikmeyi kabul ettiği için bu daha riskli yola gerek kalmadı.

## Yüklenen dosyalar (foto/PDF) nereye gidecek — kritik karar

Görseller/PDF'ler **proje reposunun (`kendalwebpage`, `public/` klasörü) İÇİNE değil**, cPanel'de **ayrı, kalıcı bir klasöre** yazılacak (build/deploy sürecinin dışında, hiç silinmeyen bir yer). Sebep: her otomatik rebuild+deploy, statik build çıktısını (`out/`) **tamamen siler ve yeniden oluşturur** — eğer yüklenen dosyalar oraya karışırsa bir sonraki güncellemede kaybolurlar. Site, bu kalıcı klasördeki dosyalara sadece URL ile referans verecek (dosyanın kendisi hiçbir zaman git'e girmeyecek).

## "Sayfa ekleme" — kapsamın netleştirilmesi

Kullanıcı "tamamen serbest, sıfırdan yeni sayfa/layout kurabilmeliler" dedi. Gerçek bir piksel-seviyesinde sürükle-bırak tasarım motorunu (Wix/Webflow benzeri) sıfırdan yazmak bu ölçekte gerçekçi değil — bu şirketlerde bu iş yıllarca süren, onlarca mühendislik ekibi gerektiren bir çalışma. Kullanıcıya önerilen ve **kabul gören** pratik orta yol:

- Önceden tanımlı, sınırlı sayıda "blok" (Lego parçası gibi): başlık+metin bloğu, görsel galerisi bloğu, metin+foto yan yana bloğu, buton/CTA bloğu vb.
- Yönetici, yeni bir sayfa açtığında bu blokları seçip alt alta dizerek (sırasını değiştirerek, içeriğini doldurarak) kendi sayfasını oluşturur.
- Bu, "tamamen serbest tasarım" değil ama "kod bilmeden, istediği içerikle yeni bir sayfa kurma" ihtiyacını gerçekçi şekilde karşılıyor.

**Not:** Bu blok-tabanlı yaklaşım öneri olarak sunuldu ve kullanıcı genel yöne onay verdi, ama "blok listesi" kavramı üzerinde kelimesi kelimesine bir onay alınmadı — implementasyona başlarken bu kapsamı tekrar kısaca teyit etmek iyi olur.

## Bu panele girmeyecek olanlar (önerildi, itiraz gelmedi)

- **Marka mikro-siteleri (K2/Vanti/Global 3D sahneleri, `src/components/brand/*/`)** — Three.js/R3F ile elle kodlanmış özel deneyimler, bir blok editörüyle temsil edilemez. Geliştirici kontrolünde kalmalı.
- **Ürün kataloğu mekaniği** (`CategoryFirstShowcase` — arama/filtre/URL senkronu) — kendi başına karmaşık bir sistem; panelden "yeni ürün ekle" gibi ayrı, daha basit bir form üzerinden beslenmeli, blok editörüne karışmamalı.
- Panele girecekler: Anasayfa metinleri, Hakkımızda, İletişim, Misyon-Vizyon, Sertifikalar, Kariyer, Haberler, yeni serbest sayfalar, ürün/haber ekleme formları.

## Açık sorular (bir sonraki oturumda netleştirilecek)

1. **Veritabanı:** Eski OpenCart MySQL DB'si (`kendalel_site`) kullanılacak mı, yoksa sıfırdan yeni bir DB mi kurulacak? (Kullanıcı: "sonra bakarız" dedi — henüz karar yok.)
2. ~~**Backend teknolojisi**~~ — **KARAR VERİLDİ (2026-09-14):** cPanel arama kutusunda hem "Node" hem "Python" denendi, ikisinde de "Setup Node.js App" / "Setup Python App" gibi bir sonuç çıkmadı (sadece alakasız genel arama sonuçları geldi) — bu hosting planında Node.js/Python App desteği yok. Admin panelinin backend'i **PHP** ile yazılacak (cPanel'de PHP zaten çalışıyor, eski OpenCart sitesi de PHP'ydi, garanti çalışır, ekstra kurulum gerekmez, ve modern PHP bu ölçekteki bir panel için gayet uygun/güncel bir seçim).
3. **Otomatik deploy mekanizması:** Rebuild sonrası `out/` klasörünü cPanel'e nasıl otomatik yükleyeceğiz (FTP? SSH/rsync? cPanel API?) — GitHub Actions'tan cPanel'e credential'lar nasıl güvenli aktarılacak?
4. Blok listesi kapsamı (yukarıdaki not) — implementasyon başında tekrar kısaca teyit edilmeli.

## Uygulama planı — aşamalı, küçük adımlarla

Kullanıcı ilk kez böyle bir talep yönetiyor ve süreçte gerginlik belirtti — bu yüzden **büyük patlamalı (big-bang) bir kurulum yerine, küçük ve kanıtlanmış adımlarla** ilerlenmesi özellikle önemli.

1. ~~**Faz 0 — Araştırma**~~ **TAMAMLANDI:** Backend teknolojisi PHP olarak netleşti (yukarıdaki Açık Soru #2). Kalan araştırma: Açık Soru #3 (otomatik deploy mekanizması) ve #1 (veritabanı).
2. ~~**Faz 1 — İskelet**~~ **TAMAMLANDI (2026-09-14 gece, otonom çalışma):** `admin-panel/` klasöründe çalışan bir PHP uygulaması yazıldı ve **uçtan uca test edildi** (yerel PHP kurulup gerçek bir sunucu üzerinde denendi):
   - `login.php` — şifreyle giriş, CSRF korumalı form
   - `dashboard.php` — girişten sonra gösterilen boş panel ("Hoş geldin")
   - `logout.php`, `index.php` — oturum kapatma / yönlendirme
   - Güvenlik: `password_hash`/`password_verify`, CSRF token, 5 yanlış denemeden sonra 1 dakikalık kilit (hepsi curl ile test edildi, çalışıyor)
   - Kurulum ve **şifre değiştirme talimatları**: `admin-panel/README.md`
   - **Henüz yapılmadı / kullanıcı erişimi gerektirir:** cPanel'e gerçek yükleme (kullanıcı `admin-panel/` içeriğini `public_html/admin/` altına FTP/Dosya Yöneticisi ile yükleyecek), gerçek şifrenin `config.php`'de değiştirilmesi (şu an test şifresi `degistir123` duruyor — **canlıya koymadan önce mutlaka değiştirilmeli**, bkz. README).
   - Ek sağlamlaştırma: `admin-panel/.htaccess` ile `config.php`'nin doğrudan tarayıcıdan istenmesi engellendi (savunma katmanı).
   - Henüz git'e commit edilmedi — kullanıcı gördükten sonra onaylarsa commit edilecek.
3. **Faz 2 — Pilot: tek bir basit sayfa üzerinde metin düzenleme.** Örn. İletişim sayfasındaki telefon/adres metinleri panelden değiştirilebilsin, "Yayınla" ile gerçekten canlıya yansısın. Bu, uçtan uca boru hattını (panel → veritabanı → rebuild → deploy) kanıtlar.
4. **Faz 3 — Fotoğraf/PDF yükleme + silme**, kalıcı dosya deposu ile.
5. **Faz 4 — Diğer mevcut sayfaları (Hakkımızda, Misyon-Vizyon, Sertifikalar, Kariyer) panele bağlama.**
6. **Faz 5 — Haber ve ürün ekleme formları** (mevcut `news-tr.ts`/`news-en.ts` ve `products.json` iş akışlarının panel karşılığı).
7. **Faz 6 — Blok-tabanlı serbest sayfa oluşturma.**

## Otonom çalışma talimatı (2026-09-14 gece — kullanıcıdan)

Kullanıcı bilgisayarı açık bırakıp gitti, şu talimatı verdi (aynen aktarılıyor):
- **HİÇBİR ZAMAN commit yapma** — kullanıcı özellikle "hiç commitleme" dedi. Tüm iş uncommitted/untracked kalacak, kullanıcı dönünce kendisi gözden geçirip commit edecek.
- **1 saat çalış, 1 saat mola ver, bunu kullanıcı "dur" deyene kadar tüm gün tekrarla** (sadece bu geceyle sınırlı değil).
- Kullanıcı fiziksel olarak bilgisayar başında olmayacak — bu yüzden test ettiğim her şey **gerçekten sağlam ve güvenilir** olmalı, "büyük ihtimalle çalışır" yeterli değil.
- Odak: **alt marka (K2/Vanti/Global) ürün kataloğu yönetimi** özellikleri. Kullanıcının istediği somut yetenekler (aşağıdaki "Ürün Yönetimi Özellikleri" listesi) — önce hepsini çıkar, sonra sırayla yapıp test ederek ilerle.

## Ürün Yönetimi Özellikleri (Faz 1.5) — kullanıcının istediği liste

**TÜMÜ TAMAMLANDI VE TEST EDİLDİ (2026-09-14 gece, otonom çalışma).** Hepsi çalışıyor, `admin-panel/tests/smoke-test.php` ile uçtan uca doğrulandı (23/23 kontrol geçti).

**Önemli test-hijyeni notu (kullanıcı talimatıyla eklendi):** Düzenleme testleri artık gerçek ürünler (KSL900 vb.) üzerinde YAPILMIYOR — bunun yerine kalıcı, özel bir **`DENEME`** test ürünü var (`admin-panel/data/products.json` içinde, smoke-test.php ilk çalıştığında yoksa otomatik oluşturuyor). Böylece test sırasında gerçek katalog verileri (admin'in izole kopyasında bile) karışmıyor/bozulmuyor.

**Kullanıcıdan gelen 2 istek — İKİSİ DE TAMAMLANDI (2026-09-14, ikinci otonom tur):**
1. [x] **Dosya boyutu limiti** — `admin-panel/lib/upload.php` eklendi. Fotoğraf için 10MB, logo için 5MB üst sınır. Ayrıca PHP'nin kendi `post_max_size`'ı aşıldığında (bu durumda PHP $_POST'u TAMAMEN sessizce boşaltıyor, sadece dosyayı değil) yanıltıcı "alanlar zorunlu" hatası yerine doğru/anlaşılır bir mesaj gösterecek özel bir tespit (`is_post_too_large()`) eklendi. Gerçek 11MB/6MB dosyalarla test edildi, doğru reddediliyor; limit altındaki normal dosyalar hâlâ çalışıyor.
2. [x] **Kategori değiştirme/yeni kategori ekleme** — `admin-panel/tests/test_category.php` ile test edildi: (a) mevcut bir kategoriye taşıma çalışıyor, (b) hiç var olmayan yepyeni bir kategori adı yazmak çalışıyor ve bu kategori otomatik olarak genel kategori listesinin bir parçası oluyor (kategoriler ayrı bir sabit liste değil, ürünlerden türetiliyor), (c) virgülle ayrılmış birden fazla kategori de doğru kaydediliyor.

**Bu turda ayrıca tamamlanan ek sağlamlaştırmalar:**
- [x] **JPEG yedek planı** — cPanel'in gerçek PHP'sinde WebP desteği çıkmazsa diye `compress_product_image()` artık JPEG'e düşebiliyor (saydamlık beyaz zemine oturtuluyor). Gerçek bir test kancasıyla (`admin-panel/tests/test_jpeg_fallback.php`) doğrulandı: 800x400 JPEG doğru üretiliyor. Fonksiyonun dönüş değeri artık gerçek dosya yolunu (`path`) da veriyor çünkü uzantı `.webp`/`.jpg` arasında değişebiliyor — `product-edit.php` buna göre güncellendi.
- [x] **Güvenlik/uç durum testleri** (`admin-panel/tests/test_edge_cases.php`, hepsi DENEME üzerinde): XSS denemesi (`<script>`, `onerror=`) hem ürün düzenleme sayfasında hem ürün listesinde doğru kaçırılıyor (`htmlspecialchars` her yerde doğru uygulanmış); 10.000 karakterlik metin çökmeden kaydediliyor; sahte/bozuk bir "resim" dosyası (.jpg uzantılı ama aslında düz metin) reddediliyor; model alanına path-traversal denemesi (`../../../etc/passwd`) ID üretiminde otomatik temizleniyor (`ETCPASSWD` oluyor, path karakteri kalmıyor).
- [x] **Kod/güvenlik gözden geçirmesi** — tüm PHP dosyaları `php -l` ile sözdizimi kontrolünden geçirildi (hata yok). Kullanıcı verisinin ekrana basıldığı her yer manuel taranıp `htmlspecialchars` kullanımı doğrulandı (yukarıdaki XSS testi bunu ayrıca kanıtladı). **Gerçek bir güvenlik açığı bulundu ve düzeltildi:** `admin-panel/data/products.json` (ve yedekler) `.htaccess` ile korunmuyordu — giriş yapmadan biri URL'i bilse tüm ürün kataloğunu doğrudan indirebilirdi. Artık `.htaccess` ile tüm `.json` dosyaları ve `data/backups/` klasörü web'den tamamen kapatıldı (`data/uploads/` kasıtlı olarak açık kalıyor, çünkü ürün fotoğrafları oradan gösteriliyor). **Not: PHP'nin dahili test sunucusu `.htaccess` işlemediği için bu değişiklik gerçek Apache/cPanel'de henüz test edilemedi** — sözdizimi diğer çalışan `.htaccess` dosyalarıyla (config.php koruması, ana site `public/.htaccess`) aynı desende, ama kullanıcı döndüğünde gerçek sunucuda bir kez doğrulanmalı.

1. [x] **Ürün listesi görüntüleme/arama** — `products.php`. Marka filtresi (K2/Vanti/Global) + isim/model/ID arama. 856 üründen ilk 60 sonuç gösteriliyor (arama ile daraltılabilir).
2. [x] **Ürün fotoğrafı güncelleme** — `product-edit.php`. PHP'de **Node/sharp yok ama GD kütüphanesi var ve WebP desteği açık** (yerel test makinesinde doğrulandı: `imagewebp()` çalışıyor, GD'nin WebP Support=1). `admin-panel/lib/image.php` içinde `FOTOGRAF_SIKISTIRMA_REHBERI.md` ile aynı mantık (800x800 inside/withoutEnlargement, webp quality 80, aynı-dosya-üzerine-yazma güvenliği için .tmp+rename) GD ile uygulandı. **Gerçek bir PNG ile test edildi** (2048x1024, 369KB → 800x400 WebP, 9KB, %97 küçülme, en-boy oranı korundu) — kullanıcının PNG yükleyip WebP olarak kaydedilmesi isteği tam olarak çalışıyor. **⚠️ cPanel'in gerçek production PHP'sinde GD+WebP desteği olup olmadığı henüz teyit edilmedi** — kullanıcı döndüğünde kontrol edilmeli (aşağıya not düşüldü).
3. [x] **Ürün adı değiştirme** (TR + EN) — gerçek Türkçe karakterlerle test edildi (İ, Ğ, Ş, ı vb. sorunsuz kaydediliyor).
4. [x] **Yeni ürün ekleme** — model kodundan otomatik ID üretimi, aynı modelin tekrar eklenmesi engelleniyor (hata mesajı gösteriliyor).
5. [x] **Marka logosu değiştirme** — `brand-logo.php`. Logolar SVG (vektör) olduğu için GD ile yeniden boyutlandırılmıyor, olduğu gibi kaydediliyor (bu doğru yaklaşım — vektör dosyayı rasterize etmek kaliteyi bozar). Geçersiz dosya uzantıları (.txt vb.) reddediliyor.
6. [x] **Ürün teknik özellik (attribute) değiştirme** — dinamik satır ekle/sil (renk, watt, ölçü vb.), JS ile satır ekleme/silme.

**Bulunan ve düzeltilen gerçek bir hata:** `save_products()` içinde `json_encode()` bozuk/geçersiz UTF-8 baytları olan bir girdiyle karşılaşırsa artık sessizce/fatal şekilde çökmüyor — `mb_scrub()` ile geçersiz baytları temizleyip tekrar deniyor (`admin-panel/lib/products.php`, `fix_utf8_recursive()`). Bu, "hiç bilgisayar başında olmayacağım" isteği için önemli bir sağlamlaştırma.

### Veri deposu kararı (bu oturumda alındı)

Açık Soru #1 (veritabanı) hâlâ kullanıcı tarafından karara bağlanmadı, ama bu özellikleri **test edilebilir** kılmak için şu an şu yaklaşım kullanılıyor: admin panel kendi **izole kopyası** üzerinde çalışıyor (`admin-panel/data/products.json` — gerçek `src/data/products.json`'dan bir kopya, canlı siteyi besleyen dosyaya **dokunmuyor**). Yeni/değişen fotoğraflar da `admin-panel/data/uploads/` altına yazılıyor, `public/images/` klasörüne **dokunulmuyor**. Böylece hiçbir test, kullanıcı dönmeden önce siteyi bozma riski taşımıyor. Gerçek `src/data/products.json`'a nasıl/ne zaman yansıtılacağı (otomatik deploy mekanizmasıyla birlikte, Açık Soru #3) kullanıcı döndüğünde birlikte karara bağlanacak.

## Kullanıcı döndüğünde kontrol edilmesi/karar verilmesi gerekenler

1. ~~**cPanel'in gerçek PHP'sinde GD + WebP desteği var mı?**~~ **ÖNEMİ AZALDI:** JPEG yedek planı eklendi ve test edildi (bkz. yukarısı) — WebP olmasa bile panel çalışmaya devam ediyor. Yine de cPanel'de "Select PHP Version" / "PHP Extensions" aracından `gd` işaretli mi diye bakmakta fayda var (WebP varsa dosyalar daha küçük olur).
2. **Ürünlerin `variantOptions` alanı** (watt/socket/light/casing gibi ayrı bir yapı, `attributes`'tan farklı) şu an panelden düzenlenemiyor — kullanıcı "teknik özellik, renk falan" derken muhtemelen `attributes`'ı kastetti (öyle yapıldı), ama `variantOptions` da düzenlenebilir olsun istenirse ayrı bir iş kalemi.
3. Yukarıdaki "Ürün Yönetimi Özellikleri" listesindeki `[x]` işaretli maddeler tamamlanıp test edildi demektir.

## Kod stili, arayüz, ve K2/Vanti/Global sitesi incelemesi (2026-09-14, 3. otonom tur — kullanıcı talimatıyla)

Kullanıcı üç şey istedi: (1) yorumları sadece fonksiyon üstünde kısa şekilde bırak, kod içine satır satır yorum ekleme, (2) arayüzü daha şık yap, (3) K2 (ve Vanti/Global) sitesinde adminin değiştirmek isteyebileceği her şeye bak (navbar'a sayfa ekleme, footer güncelleme gibi), yapılabilecekleri yap.

1. [x] **Yorum temizliği** — tüm `admin-panel/*.php` dosyalarındaki satır-içi/blok açıklama yorumları kaldırıldı, sadece fonksiyonların hemen üstünde tek satırlık kısa açıklamalar bırakıldı. `php -l` ile hepsi tekrar doğrulandı, testler hâlâ geçiyor.
2. [x] **Arayüz yenilendi** — Sidebar + üst bar düzenine geçildi (`admin-panel/includes/layout.php` — `render_header()`/`render_footer()` fonksiyonları, tüm sayfalar artık bunu kullanıyor, HTML tekrarı kalmadı). `assets/style.css`/`panel.css` baştan yazıldı: daha iyi renk paleti, yumuşak gölgeler, focus/hover geçişleri, mobilde sidebar açılır menüye dönüşüyor. Görsel olarak tarayıcıda gösteremedim (bu ortamda tarayıcı erişimim yok) ama yapısal olarak doğrulandı (aktif sekme vurgusu, tüm sayfalarda doğru render) ve tüm testler (23+4+9+diğerleri) hâlâ geçiyor.
3. [x] **K2/Vanti/Global sitesi incelendi** (`BrandNavbar.tsx`, `BrandFooter.tsx`) — önemli bulgu: **navbar ve footer şu an tamamen JSX içine gömülü, herhangi bir veri/JSON dosyasından okumuyor** (ürünlerin aksine). Navbar'da sabit 2 link var (Ana Sayfa, Ürünler) + bir CTA butonu; footer'da adres/telefon/e-posta/sosyal medya linkleri/yasal linkler hep sabit metin. Bunları admin panelden düzenlenebilir yapmak, **gerçek `BrandNavbar.tsx`/`BrandFooter.tsx` dosyalarını** (şu ana kadar hiç dokunulmayan, canlı site kaynak kodu) değiştirip bu bileşenlerin sabit JSX yerine bir veri kaynağından okumasını sağlamayı gerektiriyor — bu, ürün özelliklerinden farklı olarak **canlı sitenin render davranışını değiştiren** bir adım.
4. [x] **Bu sınırın içinde kalarak yapılan somut ilerleme — "Site Ayarları" özelliği** (`settings.php`, `lib/settings.php`): footer'da görünen paylaşılan iletişim bilgilerini (adres, 3 telefon hattı, e-posta, Facebook/LinkedIn/Instagram linkleri) düzenleyen bir form eklendi, `admin-panel/data/settings.json`'a (izole, gerçek siteye dokunmadan) kaydediyor. Varsayılan değerler gerçek sitedeki mevcut içerikle birebir aynı. `admin-panel/tests/test_settings.php` ile test edildi (4/4 geçti), sidebar'a ve panel ana sayfasına eklendi.
## 🎉 Footer artık gerçekten canlı siteye bağlı (2026-09-14, kullanıcı onayıyla — "eğer bunu da yaparsan molaya girebilirsin")

Kullanıcı sınırı bilerek genişletmemi istedi: "Site Ayarları" verisinin gerçek siteye bağlanmasını onayladı. Yapılanlar:

1. [x] **`src/data/settings.json` oluşturuldu** (gerçek Next.js proje verisi, `admin-panel/` dışında) — `{tr:{address,phone,salesPhone,supportPhone}, en:{...}, email, facebookUrl, linkedinUrl, instagramUrl}` şeklinde. TR/EN ayrı tutuldu çünkü **telefon numaraları dilde farklı formatta** (EN'de +90 uluslararası format) — bunu fark edip doğru şekilde korudum, tek bir düz yapı kullanmadım.
2. [x] **Gerçek bileşenler güncellendi** — `Footer.tsx`, `BrandFooter.tsx` (K2/Vanti/Global için ortak), `IletisimClient.tsx`, `OrganizationSchema.tsx` (JSON-LD, sadece sosyal linkler) artık bu dosyadan okuyor, sabit metin yerine. Varsayılan değerler mevcut içerikle birebir aynı olacak şekilde yazıldı — `npm run dev` ile test edildi, `tsc --noEmit` temiz, sayfalar görsel olarak **hiç değişmeden** render oldu (adres/telefon/email/sosyal linkler tıpatıp aynı çıktı).
3. [x] **`admin-panel/settings.php` artık gerçek `src/data/settings.json`'a yazıyor** (izole kopyaya değil) — TR/EN alanları ayrı ayrı form içinde. `admin-panel/lib/settings.php` güncellendi.
4. [x] **UÇTAN UCA GERÇEKTEN DOĞRULANDI:** Next.js dev server çalışırken admin panelden telefon numarasını değiştirdim → `src/data/settings.json` güncellendi → **çalışan siteyi yeniden yüklediğimde yeni numara gerçekten göründü** (İletişim sayfasında, curl ile doğrulandı). Bu, projenin "panelden değişiklik yap → siteye yansısın" ana hedefinin **ilk gerçek kanıtı**.
5. [x] **Yol boyunca bulunan ve düzeltilen 2 gerçek hata:**
   - `save_settings()`'te `fix_utf8_recursive()` UTF-8 güvenlik ağı eksikti (sadece `save_products()`'ta vardı) — eklendi, paylaşılan `admin-panel/lib/utf8.php`'ye taşındı.
   - Dosya yazma/doğrulama akışı sağlamlaştırıldı: `admin-panel/lib/atomic_write.php` artık hem `.tmp`+rename hem de yazma sonrası içerik doğrulaması yapıyor, `save_products()`/`save_settings()` ikisi de bunu kullanıyor.
   - **Önemli metodolojik not:** Test sırasında "Windows'ta rename dosya izleyiciyle çakışıp dosyayı boşaltıyor" diye yanlış bir teşhis koyup epey vakit harcadım — gerçek sebep, Bash/curl üzerinden Türkçe karakter geçen komutları shell'in yanlış kodlamasıydı (bu oturumun başında da karşılaşılan aynı sorun). Ders: **Türkçe karakter içeren testleri her zaman PHP tabanlı bir istemciyle yap, asla shell/curl argümanı olarak geçme.**

**Bilinçli olarak hâlâ yapılmayanlar (kullanıcı onayı gerektirir):** Navbar'a yeni link ekleme özelliği ve "sıfırdan yeni sayfa oluşturma" (Faz 6, blok editörü) — ikisi de gerçek Next.js route/component değişikliği gerektiriyor, footer'dan daha büyük bir kapsam (yeni sayfa route'ları, `BrandNavbar.tsx`'in link listesini dinamikleştirmesi). Kullanıcı döndüğünde bu ikisine de aynı şekilde devam edilip edilmeyeceğine karar verebilir.

## Nereden başlanacak

**Faz 1, Faz 1.5 (6 ürün özelliği), dosya limiti/kategori/JPEG-yedek/güvenlik sağlamlaştırmaları, arayüz yenileme, "Site Ayarları" özelliği VE bunun gerçek siteye bağlanması tamamlandı ve uçtan uca test edildi.** `admin-panel/` klasörü + `src/data/settings.json` + 4 güncellenen bileşen dosyası hazır, henüz git'e commit edilmedi (talimat: "hiç commitleme"). Kullanıcı döndüğünde:
1. `admin-panel/README.md` — "Yerel test" bölümündeki adımlarla yerelde deneyebilir (artık şık bir sidebar arayüzü var), veya `php admin-panel/tests/smoke-test.php` ile otomatik testi tekrar çalıştırabilir (sunucu ayaktayken).
2. `git diff src/` ile footer/iletişim/schema değişikliklerini gözden geçirebilir — hepsi görsel olarak aynı çıktıyı veriyor, sadece veri kaynağı değişti.
3. Beğenirse commit edilir, gerçek şifre belirlenir, cPanel'e yüklenir.
4. Kalan karar: navbar'a link ekleme, yeni sayfa oluşturma, ve `products.json`'ın da gerçek siteye bağlanması (Açık Soru #1/#3 netleşmesini bekliyor) özelliklerine aynı şekilde devam edilsin mi?

## Küçük temizlik turu (2026-09-14, 4. otonom tur)

Büyük/onay gerektiren hiçbir şeye dokunulmadı; sadece `/loop` talimatının (c) maddesi (kod tekrarını azaltma) uygulandı:

- [x] **Test dosyalarındaki `req()`/`check()` tekrarı giderildi** — 6 test dosyasının 4'ünde (`smoke-test.php`, `test_upload_limits.php`, `test_category.php`, `test_edge_cases.php`, `test_settings.php`) neredeyse birebir aynı `req()`/`check()` fonksiyonları ayrı ayrı tanımlıydı. Şimdi hepsi tek bir `admin-panel/tests/_test_helpers.php` dosyasından `require` ediliyor (`test_jpeg_fallback.php` zaten bu fonksiyonları kullanmıyordu, dokunulmadı). Davranış birebir korundu (`req()` üç elemanlı `[status, body, redirect]` döndürüyor, 2 elemanlı destructuring yapan eski çağrılar PHP'de sorunsuz çalışıyor).
- [x] **Doğrulama:** `php -l` ile 6 dosya da hatasız; yerel PHP sunucusu açılıp **tüm 6 test dosyası tek tek çalıştırıldı** — sonuçlar refactor öncesiyle birebir aynı (smoke-test 23/23, test_edge_cases 9/9, test_settings 5/5, test_category/test_upload_limits/test_jpeg_fallback çıktıları değişmedi).
- [x] **Emoji/çok dilli Unicode testi eklendi** — `test_edge_cases.php`'ye 5. bölüm olarak eklendi: emoji (💡⚡✨🎨) + Latin-dışı alfabe (Çince 太阳能, Arapça مصباح) içeren ürün adı/özellik değeri DENEME üzerinde kaydedildi, hem `products.json`'a bozulmadan yazıldığı hem düzenleme sayfasında doğru göründüğü doğrulandı (4 yeni kontrol, test artık 9 yerine 13 kontrol). Ardından tam smoke-test (23/23) tekrar çalıştırılıp DENEME fixture'ının temiz kaldığı, iki test dosyası arasında veri karışması olmadığı doğrulandı.
- Not: (a) eşzamanlı kayıt çakışması / arama performansı testleri, (b) ürün silme kararı, (d) README-plan tutarlılık kontrolü henüz yapılmadı — sıradaki tur için bekliyor.

## Faz 6 — Blok-tabanlı yeni sayfa oluşturma (2026-09-14 gece, kullanıcı onayıyla başladı)

Kullanıcı canlı sohbette şu ikisini netleştirip onay verdi: (1) yeni sayfaların URL yapısı **`/sayfa/{slug}`** (mevcut ürün kısa linki `/{slug}` ile çakışmasın diye ayrı segment), (2) **navbar'a link ekleme bu kapsamda YOK** — sadece sayfa oluşturma, sayfalara şimdilik doğrudan URL ile erişilecek. Kullanıcı ayrıca "küçük parçalara böl, her parçayı test et, doğruysa sonrakine geç, kendini kasma, sabah 8'e kadar 1 saat çalış/1 saat dinlen döngüsüyle devam et" dedi ve gece için ayrıldı.

**Aşama 1+2 TAMAMLANDI VE TEST EDİLDİ — veri modeli + gerçek route + tam production build doğrulaması:**

- [x] `src/data/pages.ts` — `CustomPage`/`PageBlock` tipleri (4 blok tipi: `heading_text`, `image_gallery`, `text_image`, `cta`, hepsi TR/EN `LocalizedText` ile), `getAllCustomPageSlugs()`/`getCustomPageBySlug()`. `src/data/pages.json` gerçek site verisi (şu an `{}` — boş, henüz hiç sayfa yok).
- [x] `src/components/blocks/` — `BlockRenderer.tsx` + 4 blok bileşeni (`HeadingTextBlock`, `ImageGalleryBlock`, `TextImageBlock`, `CtaBlock`), mevcut sitenin görsel diliyle uyumlu (bkz. `IletisimClient.tsx`/`MissionVisionClient.tsx` — `bg-white/[0.03] border border-white/10 rounded-3xl`, `var(--brand-red)` vurgular, GSAP fade-up stagger).
- [x] `src/app/(main)/sayfa/[slug]/page.tsx` + `PageBlocksClient.tsx` — gerçek yeni route, `generateStaticParams`/`generateMetadata` mevcut `[slug]` route'uyla aynı `Promise<{slug}>` deseninde.
- [x] `src/lib/i18n/LanguageProvider.tsx` — `Language` tipi dışa aktarıldı (`export type Language`), blok bileşenlerinin tip alması için gerekliydi, minimal/güvenli değişiklik.
- [x] **Gerçek doğrulama (küçük bir kısım değil, uçtan uca):** `pages.json`'a geçici bir test sayfası (`test-sayfa-taslak`, 4 blok tipinin hepsini kullanan, Türkçe karakterli) eklendi → `npx tsc --noEmit` temiz → `npm run dev` ile `/sayfa/test-sayfa-taslak` gerçekten 200 döndü, tüm blok içerikleri ve Türkçe karakterler (ışık, şeffaf, öğün, çiçek, ğüzel) doğru render oldu → mevcut route'larla çakışma yok (`/`, `/iletisim`, gerçek bir ürün kısa linki `/ges230-...`, hepsi 200; olmayan bir `/sayfa/...` slug'ı doğru 404 verdi) → **tam `npm run build` çalıştırıldı, 5125 sayfanın TAMAMI hatasız üretildi** (yeni route dahil, `out/sayfa/test-sayfa-taslak/index.html` doğru üretilmiş, görsel yolu `/images/factory-bg.webp` doğru). Test sayfası doğrulamadan sonra `pages.json`'dan silindi (gerçek veri temiz, `{}`'e döndü).

**Aşama 3 TAMAMLANDI VE TEST EDİLDİ — admin panelde sayfa listesi + yeni sayfa formu:**

- [x] `admin-panel/lib/pages.php` — `load_pages()`/`save_pages()` (tıpkı `settings.php` gibi: yedek alır `data/backups/pages-*.json`, `fix_utf8_recursive()` güvenlik ağı, `atomic_write()`, yazma sonrası doğrulama), `generate_unique_page_slug()` (başlıktan `slugify_tr()` ile slug üretir, çakışırsa `-2`, `-3` ekler).
- [x] `admin-panel/pages.php` — sayfa listesi (arama, boş-durum mesajı), `admin-panel/page-edit.php` — yeni sayfa oluşturma (başlık TR/EN + opsiyonel meta açıklama TR/EN, slug otomatik ve **oluşturduktan sonra değiştirilemez** — eski linklerin kırılmaması için, tıpkı ürünlerdeki model kodu gibi) + mevcut sayfayı düzenleme (başlık/meta güncellenebilir, slug sabit kalır). Mevcut `product-grid`/`product-card`/`form-row` CSS sınıfları yeniden kullanıldı, yeni CSS eklenmedi. Sidebar'a "Sayfalar" linki, dashboard'a hızlı erişim kartı eklendi.
- [x] **Gerçek bir hata bulundu ve düzeltildi (test ortamı, kod değil):** Yerel test PHP kurulumunda `mbstring` eklentisi `php.ini`'de kapalıymış (`;extension=mbstring`) — `slugify_tr()` ve arama kodu `mb_strtolower()` kullandığı için sayfa oluşturma fatal error veriyordu. **Önemli ek bulgu:** Bu, aslında **önceden var olan bir kod yoluydu** — `products.php`'nin arama özelliği de `mb_strtolower()` kullanıyor ama daha önceki testlerde (`test_edge_cases.php`'nin `products.php?q=DENEME` çağrısı) hiç gerçekten çalışmamış olabilir; o testin assertion'ı ("ham script etiketi YOK") bir fatal error sayfasında da yanlışlıkla geçerdi (fatal error metni de `<script>` içermiyor). `php.ini`'de `extension=mbstring` satırı açılıp yerel sunucu yeniden başlatılınca hem yeni sayfa testi hem TÜM eski testler (23+13+5+15) tekrar çalıştırıldı, hepsi gerçekten (maskeli değil) geçti. **cPanel'de mbstring'in açık olduğu neredeyse kesin** (WordPress dahil hemen her PHP uygulaması gerektirir, hosting sağlayıcıları varsayılan açar) ama GD/WebP gibi bu da kullanıcı döndüğünde "Select PHP Version → Extensions" ekranından bir kez teyit edilmeli.
- [x] `admin-panel/tests/test_pages.php` yazıldı (paylaşılan `_test_helpers.php` kullanıyor) — 15 kontrol: boş liste, Türkçe karakterli yeni sayfa oluşturma, otomatik slug üretimi, aynı başlıktan ikinci sayfada `-2` çakışma çözümü, mevcut sayfa düzenlemede slug'ın sabit kalması, listede arama, boş başlığın reddedilmesi. Hepsi geçti, gerçek `src/data/pages.json` her testten sonra orijinaline (`{}`) döndürülüyor.

**Aşama 4 TAMAMLANDI VE TEST EDİLDİ — admin panelde blok editörü:**

- [x] `admin-panel/lib/pages.php`'ye eklendi: `new_empty_block()` (4 blok tipi için boş şablon), `find_block_index()`, `generate_block_id()`, `save_block_image()` (mevcut `compress_product_image()`'ı kullanır, gerçek `public/images/sayfalar/` altına `{slug}-{blockId}.webp` adıyla kaydeder, `pages.json`'da saklanacak göreli yolu döndürür), `VALID_BLOCK_TYPES` sabiti.
- [x] `admin-panel/page-edit.php` genişletildi — `form_action` alanına göre dallanan tek bir POST işleyici: `add_block`, `update_block` (4 blok tipine özel alan/doğrulama), `delete_block`, `move_block` (yukarı/aşağı, komşuyla yer değiştirme), `add_gallery_image`/`remove_gallery_image` (galeri blok tipi için ayrı, çünkü dosya yüklemesi diğer bloklardan farklı). Her blok kartında sırala/sil butonları + tipine özel doldurma formu var. Yeni blok eklemek için altta bir seçim kutusu + buton.
- [x] `admin-panel/assets/style.css`'e küçük eklemeler: `.btn-danger`, `.block-editor-card`, `.block-editor-head`, `.block-editor-actions`, `.gallery-image-list`, `.gallery-image-item` — mevcut tasarım diliyle (aynı `--border`/`--surface`/`--brand-red` değişkenleri) tutarlı.
- [x] **Gerçek bir hata bulundu ve düzeltilmeden önce commit edilmeden yakalandı:** İlk yazımda blok görselleri `<img src="../public/images/...">` (dosya sistemi göreli yolu) ile gösteriliyordu — bu tarayıcıda YANLIŞ URL üretir (hem yerelde hem cPanel'de, çünkü admin panel `/admin/` alt dizininde çalışıyor, `../public/images/` gerçek bir web yolu değil). `product_image_url()`'nin kullandığı doğru desenle (`/images/{yol}`, kök-göreli) değiştirildi, iki yerde.
- [x] `admin-panel/tests/test_page_blocks.php` yazıldı — 21 kontrol: test sayfası oluştur → `heading_text` bloğu ekle+doldur (emoji dahil Türkçe metinle) → `text_image` bloğu ekle+gerçek PNG yükle (WebP'ye çevrildiği ve diskte gerçekten oluştuğu doğrulandı) → `cta` bloğu ekle+`javascript:` protokolünün reddedildiğini doğrula+geçerli URL ile kaydet → `image_gallery` bloğuna 2 görsel ekle+1'ini sil+doğru olanın kaldığını doğrula → blok sıralama (yukarı taşı, komşuyla yer değiştirdiği doğrulandı) → blok silme → zorunlu alan eksikken reddedildiğini doğrula. **Hepsi ilk gerçek çalıştırmada geçti (21/21).** Ardından tüm eski testler (smoke-test 23/23, test_pages 15/15) tekrar çalıştırılıp regresyon olmadığı doğrulandı. Test sonunda `pages.json` orijinaline (`{}`) döndürülüyor, yüklenen test görselleri diskten siliniyor.

**Aşama 5 TAMAMLANDI VE TEST EDİLDİ — build'i asla kıramayacak sağlamlaştırma (iki katmanlı):**

- [x] **Katman 1 — Next.js tarafı (asıl garanti):** 4 blok bileşeninin hepsi (`HeadingTextBlock`, `TextImageBlock`, `ImageGalleryBlock`, `CtaBlock`) artık eksik/boş veriye karşı savunmalı: `TextImageBlock` görseli boşsa `null` döner (render edilmez), `CtaBlock` `buttonUrl`/`buttonLabel` boşsa `null` döner, `ImageGalleryBlock` boş `url`'li görselleri filtreler ve hiç görsel kalmazsa `null` döner, tüm metin alanları `?.` ile korunuyor (`data.heading?.[language] ?? ''`). Bunun anlamı: bir admin bir blok ekleyip **doldurmadan bırakırsa** (ör. "Görsel Ekle" deyip fotoğraf yüklemeden çıkarsa), site çökmez — o blok sessizce görünmez olur, sayfanın geri kalanı normal render olur. Bu, PHP tarafındaki herhangi bir doğrulamadan bağımsız, kalıcı bir garanti (hatta biri ileride `pages.json`'ı elle düzenlese bile geçerli).
- [x] **Katman 2 — PHP tarafı (savunma derinliği):** `admin-panel/lib/pages.php`'ye `validate_page_structure()` eklendi ve `save_pages()`'in İÇİNE gömüldü (artık her kayıttan önce OTOMATİK çalışıyor, unutulamaz) — her sayfanın `slug`/`title.tr`/`blocks` alanlarının doğru tipte olduğunu, her bloğun `id`/`type`/`data` alanlarına sahip olduğunu ve `type`'ın `VALID_BLOCK_TYPES` içinde olduğunu doğruluyor. **Bilinçli tasarım kararı:** içerik alanlarının DOLU olması burada aranmıyor (yeni eklenen bir blok meşru şekilde boş olabilir, Katman 1 bunu zaten güvenle idare ediyor) — sadece yapısal bütünlük (undefined.xxx çökmesine yol açacak eksik anahtarlar) engelleniyor.
- [x] **Ek küçük sağlamlaştırma:** `save_pages()`'e `products.php`'deki gibi yedek budama (`prune_old_pages_backups()`, son 50 yedek) eklendi — daha önce `pages-*.json` yedekleri sınırsız birikiyordu.
- [x] `admin-panel/tests/test_page_hardening.php` yazıldı (HTTP değil, doğrudan PHP fonksiyon testi) — 10 kontrol: geçerli/tam kayıt geçer, henüz doldurulmamış bloklu bir sayfa da geçer (Katman 1'in bunu idare edeceği için), eksik slug/boş başlık/dizi-olmayan blocks/eksik blok alanı/geçersiz blok tipi/dizi-olmayan blok verisi reddedilir, ve **`save_pages()`'in bozuk bir kaydı gerçekten reddedip dosyaya hiç yazmadığı** doğrulanır. 10/10 geçti.

**Aşama 6 TAMAMLANDI VE TEST EDİLDİ — gerçek admin panelden oluşturulan sayfayla tam production build:**

- [x] Admin panelin GERÇEK HTTP arayüzü üzerinden (birebir kullanıcının yapacağı gibi, kısayol yok) bir test sayfası oluşturuldu: `heading_text` (Türkçe/emoji metinle), `text_image` (gerçek PNG yükleyip WebP'ye çevrilerek), `cta` (geçerli `/iletisim` linkiyle), `image_gallery` (1 gerçek görselle) — **ve kasıtlı olarak 5. bir blok (`text_image`) eklenip HİÇ DOLDURULMADAN bırakıldı**, Aşama 5'in Katman 1 savunmasını gerçek bir build ile sınamak için.
- [x] **Tam `npm run build` çalıştırıldı: 5125 sayfanın TAMAMI sıfır hatayla üretildi**, yeni test sayfası dahil (`/sayfa/asama-6-gercek-build-testi`).
- [x] Üretilen gerçek HTML dosyası (`out/sayfa/.../index.html`) incelendi: doldurulan 4 blok da doğru render olmuş (başlık, görsel yolu, buton metni, galeri görseli hepsi mevcut); **doldurulmamış 5. blok hiçbir iz bırakmadan sessizce atlanmış** — ne kırık bir `<img src="/images/">` etiketi ne de başka bir hata var. Katman 1 savunması gerçek bir build'de kanıtlandı.
- [x] Test verisi temizlendi: `src/data/pages.json` tekrar `{}`'e döndürüldü, yüklenen 2 test görseli `public/images/sayfalar/` altından silindi, geçici kurulum betiği silindi.

**Ek küçük özellik — Sayfa Silme (aynı gece, Faz 6 kapsamının doğal bir tamamlayıcısı, yeni büyük özellik SAYILMADI):** Oluşturma/düzenleme zaten vardı, silme eksikti — temel CRUD'un doğal bir parçası olduğu ve gerçek ürün verisine dokunmadığı için onay beklemeden eklendi. `page-edit.php`'ye "Sayfayı Sil" butonu (onay istemli), `lib/pages.php`'ye `delete_page_images()` (sayfanın tüm yüklenmiş görsellerini de diskten temizler). `test_pages.php`'ye 5 yeni kontrol eklendi (silme sonrası yönlendirme, `pages.json`'dan kalıcı silinme, diğer sayfaların etkilenmemesi, liste sayfasında bildirim) — toplam 20/20 geçti.

---

## 🎉 FAZ 6 MVP TAMAMLANDI (2026-09-15 gece/sabah, otonom çalışma)

Blok tabanlı yeni sayfa oluşturma özelliğinin **uçtan uca çalışan bir ilk sürümü** hazır: admin panelden sayfa oluştur/düzenle/sil, 4 blok tipiyle (Başlık+Metin, Metin+Görsel, Buton/CTA, Görsel Galerisi) içerik ekle/sil/sırala, fotoğrafları otomatik WebP'ye çevir — hepsi **gerçek `src/data/pages.json`'a** yazıyor ve **gerçek `npm run build` ile 5125 sayfanın tamamının sorunsuz üretildiği** kanıtlandı. Toplam yeni/güncellenen otomatik test sayısı bu özellik için: `test_pages.php` (20), `test_page_blocks.php` (21), `test_page_hardening.php` (10) — hepsi geçiyor, hiçbiri gerçek ürün verisine dokunmuyor.

**Kullanıcı sabah döndüğünde göreceği/karar vereceği şeyler:**
1. **Hiçbir şey commit edilmedi** (talimat gereği) — `git status` ile `ADMIN_PANEL_PLAN.md` + `src/lib/i18n/LanguageProvider.tsx` (küçük `export type` eklendi) + `src/app/(main)/iletisim/IletisimClient.tsx`/`OrganizationSchema.tsx`/`BrandFooter.tsx`/`Footer.tsx` (önceki turdan, Site Ayarları özelliği) değişikliklerini, ve `src/data/pages.ts`/`pages.json` (şu an `{}`), `src/components/blocks/`, `src/app/(main)/sayfa/`, `admin-panel/` (bütün klasör) gibi yeni/untracked dosyaları görecek.
2. **Yerelde deneyebilir:** `php -S localhost:8899 admin-panel/_local-test-router.php` (proje kökünden), tarayıcıda `http://localhost:8899/admin-panel/` → Sayfalar → Yeni Sayfa. **Not: yerel `php.ini`'de artık `mbstring` açık** (daha önce kapalıydı, bu oturumda düzeltildi) — kalıcı bir makine ayarı, tekrar açmaya gerek yok.
3. **Otomatik testleri tekrar çalıştırabilir:** `php admin-panel/tests/smoke-test.php` (ve diğerleri) — hepsi yeşil.
4. **Karar vermesi gerekenler:**
   - Beğenirse: commit edilir, `admin-panel/config.php`'deki test şifresi değiştirilir (bkz. README), `admin-panel/` cPanel'e `public_html/admin/` altına yüklenir, gerçek siteye `npm run build` + upload ile deploy edilir (mevcut deploy sürecinin aynısı, sadece artık `src/data/pages.json`/`src/data/settings.json` da build'e dahil).
   - Kalan büyük kapsam kararları (hâlâ onay bekliyor, bu gece dokunulmadı): navbar'a otomatik link ekleme, oluşturulan sayfaların navbar/footer'dan link verilmesi, `products.json`'ın da admin panelden gerçek siteye bağlanması (Açık Soru #1/#3).
5. Bu gece boyunca gerçek/faydalı 3 hata bulunup düzeltildi (hepsi yukarıda ilgili aşamada detaylı): (a) test ortamında kapalı `mbstring` eklentisi + bunu maskeleyen zayıf bir test assertion'ı, (b) blok görsellerinin yanlış (dosya sistemi göreli) URL ile gösterilmesi, (c) doldurulmamış bir bloğun build'i kırma riski — üçü de kalıcı olarak giderildi ve testlerle kanıtlandı.

**Bilinçli olarak yapılmayan (kullanıcı onayı olmadan):** Navbar'a otomatik link ekleme — kullanıcı bu geceki kapsamdan açıkça çıkardı, ayrı bir karar olarak kalıyor.

## Ek sağlamlaştırma turu (2026-09-15, Faz 6 MVP sonrası — önceden onaylı küçük kalan işler)

Büyük yeni özellik başlatılmadı; `/loop` talimatının (a)/(b)/(c) maddeleri uygulandı:

- [x] **(a) Eşzamanlı kayıt çakışması — gerçek bir hata bulundu ve düzeltildi:** `admin-panel/lib/atomic_write.php` tüm eşzamanlı yazma çağrıları için **paylaşılan sabit bir `.tmp` dosya adı** kullanıyordu (`$path . '.tmp'`). İki admin (veya aynı admin iki sekmede) tam olarak aynı anda kaydetseydi, ikisi de aynı geçici dosyayı kullanacağı için birbirinin içeriğini geçici dosyada ezebilir, bu da bir tarafın kaydının sessizce kaybolmasına veya yanıltıcı bir "kaydedilemedi" hatasına yol açabilirdi (kod okunarak tespit edildi; `products.php`, `pages.php` ve `settings.php`'nin ÜÇÜ de bu ortak fonksiyonu kullandığı için hepsini etkiliyordu). **Düzeltme:** her çağrıda rastgele/benzersiz bir tmp dosya adı üretiliyor (`$path . '.' . bin2hex(random_bytes(6)) . '.tmp'`) — artık iki eşzamanlı yazma birbirinin geçici dosyasına asla dokunamıyor; kalan tek risk (hangi kaydın SONUNCU olarak dosyaya yansıyacağı) dosya-tabanlı, kilitsiz bir sistemde kaçınılmaz ve tek-admin kullanım senaryosu için kabul edilebilir bir sınır olarak bırakıldı (tam mutex/kilitleme daha büyük bir kapsam değişikliği olur, şu an için gerekli görülmedi).
  - `admin-panel/tests/test_concurrent_writes.php` (+ yardımcı `_concurrent_writer.php`) yazıldı — **gerçek iki ayrı PHP alt süreci** (`proc_open`) aynı anda aynı geçici dosyaya yazmaya çalışıyor; sonucun HER ZAMAN iki içerikten birinin TAM/bozulmamış hali olduğu (asla yarı yarıya karışmış olmadığı) ve geride hiç yetim `.tmp` dosyası kalmadığı, 1 tekil + 15 tekrarlı senaryoda doğrulandı (7/7 geçti). Test, gerçek `products.json`/`pages.json`'a değil, `sys_get_temp_dir()` altında geçici bir dosyaya karşı çalışıyor — hiçbir gerçek veriye risk yok.
- [x] **(b) Arama performansı test edildi:** `admin-panel/tests/test_search_performance.php` — ürün listesi/araması **gerçek 856 ürünlük izole kopya** üzerinde (~25-65ms), sayfa listesi/araması **1000 sentetik sayfa** üzerinde (geçici olarak yazılıp test sonunda orijinaline döndürülen `pages.json` ile, ~37ms) ölçüldü. **Sonuç: performans sorunu yok**, her ikisi de milisaniyeler mertebesinde yanıt veriyor (3 saniyelik gevşek eşiğin çok altında). Not: `pages.php` listesi `products.php`'nin aksine sonuçları 60 ile sınırlamıyor (tüm eşleşenleri gösteriyor) — 1000 kayıtta bile sorun çıkarmadı, gerçekçi kullanımda (muhtemelen onlarca sayfa) hiç sorun olmayacaktır; ileride sayfa sayısı çok büyürse (binlerce) bir sayfalama eklenebilir, şimdilik gereksiz.
- [x] **(c) README/PLAN tutarlılığı:** `admin-panel/README.md`'nin "Otomatik testler" listesi bu turda eklenen 2 yeni test dosyasıyla güncellendi. İki dosya da baştan sona gözden geçirildi, büyük bir tutarsızlık bulunmadı.

**Bu turun sonu:** Faz 6 MVP + bu sağlamlaştırmalarla birlikte, `/loop` talimatının önceden onaylı kapsamındaki TÜM küçük/güvenli işler tamamlandı. Kalan her şey (navbar link ekleme, sayfalara navbar/footer'dan link verme, `products.json`'ın gerçek siteye bağlanması, DB kararı, ürün silme özelliği) kullanıcının kendi kararını bekliyor — bunlara dokunulmadı. Otomatik test toplamı artık: smoke-test (23) + test_edge_cases (13) + test_settings (5) + test_pages (20) + test_page_blocks (21) + test_page_hardening (10) + test_concurrent_writes (7) + test_search_performance (12) + test_category/test_upload_limits/test_jpeg_fallback (çıktı tabanlı, sayaçsız) — **hepsi yeşil.**

## Ürün silme özelliği eklendi (2026-09-15, kullanıcı canlı sohbette onay verdi)

Kullanıcı döngü durduktan sonra sohbette karar bekleyen maddeleri sordu, madde 3'ün (ürün silme) kolay olduğu söylenince "onu da yap sonra duralım" dedi. Yapıldı:

- [x] `admin-panel/lib/products.php`'ye `delete_product_upload()` eklendi (admin'in kendi izole `data/uploads/` deposundaki fotoğrafı siler, gerçek `public/images/`'a dokunmaz).
- [x] `product-edit.php`'ye "Ürünü Sil" butonu (onay istemli) eklendi — `form_action=delete_product` ile ürünü `products.json`'dan kalıcı siliyor, yüklü fotoğrafını da temizliyor, `products.php?deleted=1`'e yönlendiriyor. `products.php`'ye silme bildirimi banner'ı eklendi.
- [x] `admin-panel/tests/test_product_delete.php` yazıldı — 10 kontrol: fotoğraflı test ürünü oluştur → sil → `products.json`'dan kalıcı silindiğini, diğer ürünlerin (DENEME) etkilenmediğini, fotoğrafın da diskten silindiğini, listede bildirim göründüğünü, silinen ürüne erişimin 404 verdiğini, gerçek `src/data/products.json`'un hiç etkilenmediğini doğrula. **10/10 ilk çalıştırmada geçti.** Ardından smoke-test (23/23) ve test_edge_cases (13/13) tekrar çalıştırılıp regresyon olmadığı doğrulandı.
- README güncellendi (`product-edit.php` açıklaması + yeni test dosyası listeye eklendi).

Bu, sayfa silme özelliğiyle birebir aynı desen; admin panelin kendi izole ürün kopyası üzerinde çalıştığı için gerçek site verisine hiç dokunulmadı.

## Otomatik Yayın ("Yayınla") altyapısı hazırlandı (2026-09-15 sabah, kullanıcı onayıyla)

Kullanıcıyla sohbette Açık Soru #1 (DB) ve #3 (otomatik deploy) konuşuldu:
- **DB kararı: JSON'a devam** — statik export olduğu için veritabanı sadece build anında işe yarardı, ekstra bakım yükü getirir ama fayda sağlamaz. Kullanıcıya bu yönde öneri sunuldu.
- **Otomatik deploy yöntemi olarak GitHub Actions öneri sunuldu ve kabul edildi**: admin panel → GitHub (Contents API ile dosya günceller) → GitHub Actions (`npm run build`) → FTP ile cPanel'e yükleme. Kullanıcı GitHub'ın sadece geliştirme önizlemesi için kullanıldığını sanıyordu, private repo tutmanın hem sürüm geçmişi hem bu otomasyon için gerekli olduğu açıklandı, onayladı.
- Kullanıcı bilgisayar başında değilken ("2 saate gelirim") **kimlik bilgisi gerektirmeyen kısmı şimdiden hazırla, sonra ne göndereceğimi söyle** dedi. Yapıldı:

**Hazırlanan altyapı (gerçek kimlik bilgisi olmadan da tam çalışır/test edilir haldeler):**
- [x] `admin-panel/config.php`'ye `GITHUB_TOKEN`/`GITHUB_REPO`/`GITHUB_BRANCH` sabitleri eklendi (şu an boş — kullanıcı dolduracak).
- [x] `admin-panel/lib/github_deploy.php` — GitHub Contents API istemcisi: `github_deploy_configured()`, `github_get_file_sha()`, `github_push_file()` (dosyayı commit'ler, varsa SHA'sıyla günceller), `github_url_encode_path()`. Ağ çağrıları (`github_curl_get`/`github_curl_put`) saf mantıktan (URL/header/payload oluşturma) ayrıldı ki gerçek token olmadan da test edilebilsin.
- [x] `admin-panel/deploy.php` — yeni "Yayınla" sayfası: yapılandırılmamışken (şu anki gerçek durum) çökmeden anlaşılır bir "henüz kurulmadı" mesajı gösteriyor; yapılandırıldığında `settings.json` + `pages.json`'ı GitHub'a gönderen bir buton sunuyor. Sidebar'a ve dashboard'a eklendi.
- [x] `.github/workflows/deploy-cpanel.yml` (YENİ workflow, mevcut GH Pages önizleme workflow'una dokunulmadı) — `src/**`/`public/**` değiştiğinde veya elle tetiklenince `npm run build` çalıştırıp sonucu `SamKirkland/FTP-Deploy-Action` ile FTP üzerinden cPanel'e yüklüyor. YAML sözdizimi `js-yaml` ile doğrulandı. Secret'lar (`CPANEL_FTP_SERVER/USERNAME/PASSWORD/SERVER_DIR`) henüz repoda yok — normal, IDE bunu uyarı olarak gösteriyor, hata değil.
- [x] `admin-panel/tests/test_deploy.php` yazıldı — 9 kontrol: saf fonksiyonlar (yol kodlama) doğru çalışıyor; **yapılandırılmamışken `github_push_file()` HİÇ ağ isteği atmadan (< 500ms) anında anlaşılır bir hata döndürüyor** (yanlışlıkla "asılı kalma" veya yanıltıcı hata riski yok); `deploy.php` gerçek HTTP isteğiyle test edilip 200 döndüğü ve doğru mesajı gösterdiği doğrulandı. 9/9 geçti. Ardından smoke-test (23/23)/test_pages (20/20)/test_settings (5/5) tekrar çalıştırılıp regresyon olmadığı doğrulandı.
- [x] `admin-panel/README.md`'ye "Otomatik Yayın Kurulumu" bölümü eklendi — adım adım: (1) GitHub'da fine-grained Personal Access Token oluşturma (sadece bu repo, Contents: Read/write) → `config.php`'ye yapıştırma, (2) cPanel'de kısıtlı bir FTP hesabı açma → bilgilerini GitHub reposunun Settings → Secrets and variables → Actions kısmına 4 secret olarak ekleme.

**⚠️ Önemli, unutulmaması gereken bir bağımlılık:** "Yayınla" butonu sadece VERİ dosyalarını (`settings.json`/`pages.json`) günceller. Ama bu gece yazılan asıl KOD (tüm `admin-panel/`, blok editörü bileşenleri, `/sayfa` route'u, footer/settings bağlantısı) **henüz hiç commit edilmedi** — GitHub Actions'ın bunları build edebilmesi için önce bir kerelik normal bir `git commit` + `git push` gerekiyor. Bu, "Yayınla" kurulumundan AYRI, kullanıcının onayını gerektiren bir adım (mevcut "HİÇ COMMİT YAPMA" talimatı hâlâ geçerli, kullanıcı ne zaman commit edilsin isterse o zaman yapılacak).

**Kullanıcının yapması/göndermesi gerekenler (2 saat sonra bilgisayar başına dönünce):**
1. GitHub'da bir Personal Access Token oluşturup ya bana göndersin ya da `admin-panel/config.php`'deki `GITHUB_TOKEN`'a kendisi yapıştırsın, `GITHUB_REPO`'yu da doldursun.
2. cPanel'de bir FTP hesabı açıp bilgilerini GitHub reposunun Secrets kısmına eklesin (bu adımı ben yapamam, kendi GitHub/cPanel hesabı gerekiyor).
3. Ne zaman commit edilip cPanel'e ilk kez yüklenmesini istediğine karar versin.

## 🛑 Kullanıcı isteğiyle burada durulundu (2026-09-15, sabah)

Kullanıcı canlı sohbette ürün silme özelliğini onayladı, eklendi ve test edildi. Ardından DB/deploy yöntemi konuşuldu, GitHub Actions + FTP yöntemine karar verildi, kimlik bilgisi gerektirmeyen tüm altyapı koda döküldü ve test edildi. Kullanıcı 2 saat sonra dönüp GitHub token/cPanel FTP bilgilerini sağlayacak. Hâlâ karar bekleyenler: navbar'a link ekleme, sayfalara navbar/footer'dan link verme, `products.json`'ın gerçek siteye bağlanması, ilk kod commit'inin ne zaman yapılacağı. Hiçbir şey commit edilmedi.
