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
2. **Faz 1 — İskelet:** `/admin` altında şifreli giriş ekranı + boş bir panel. Henüz hiçbir içeriği düzenlemiyor, sadece "girebiliyorum" kanıtı.
3. **Faz 2 — Pilot: tek bir basit sayfa üzerinde metin düzenleme.** Örn. İletişim sayfasındaki telefon/adres metinleri panelden değiştirilebilsin, "Yayınla" ile gerçekten canlıya yansısın. Bu, uçtan uca boru hattını (panel → veritabanı → rebuild → deploy) kanıtlar.
4. **Faz 3 — Fotoğraf/PDF yükleme + silme**, kalıcı dosya deposu ile.
5. **Faz 4 — Diğer mevcut sayfaları (Hakkımızda, Misyon-Vizyon, Sertifikalar, Kariyer) panele bağlama.**
6. **Faz 5 — Haber ve ürün ekleme formları** (mevcut `news-tr.ts`/`news-en.ts` ve `products.json` iş akışlarının panel karşılığı).
7. **Faz 6 — Blok-tabanlı serbest sayfa oluşturma.**

## Nereden başlanacak

Kullanıcı hazır olduğunda bu dosyayı Claude Code'a göstererek devam edebilir. Backend teknolojisi netleşti (PHP), kalan açık sorular #1 (veritabanı) ve #3 (otomatik deploy mekanizması) — oradan devam edilebilir, ya da doğrudan Faz 1'e (iskelet: şifreli giriş ekranı) geçilebilir.
