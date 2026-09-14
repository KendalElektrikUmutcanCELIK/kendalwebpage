# Kendal Webpage - Ürün Bilgi Formu (ÜBF) Üretim Rehberi

Merhaba Gelecekteki Ajan! Kullanıcı (Umutcan) sana "ürün bilgi formu oluştur", "ÜBF üret", "şu ürünler için ÜBF yok, oluştur" gibi bir şey dediğinde bu dosyayı oku ve aşağıdaki adımları **direkt** uygula — tekrar sıfırdan script yazmana gerek yok, her şey hazır.

---

## 1. Script nerede, ne yapıyor

- **Script:** kök dizinde `generate_urun_bilgi_formu.js` (kalıcı, silinmedi, tekrar tekrar kullanılıyor).
- **Veri kaynağı:** `src/data/products.json` — her ürünün `name`, `attributes.tr/en`, `category`, `brand`, `image` alanlarını okur.
- **Çıktı:** `public/urun-bilgi-formlari/{MODEL} Ürün Bilgi Formu.pdf` — bu klasör ve isimlendirme kalıbı `src/lib/getProductPdfForm.ts`'nin siteyi canlıda PDF eşleştirmek için kullandığı **gerçek** klasör/isim kalıbı, değiştirme.
- **Bağımlılık:** `puppeteer`, `package.json`'da zaten `devDependencies`'te kayıtlı, `npm install` sonrası hazır.
- Tek bir PDF ~2 saniye sürüyor (tarayıcı bir kere açılıp tüm ürünler için tekrar kullanılıyor). 856 ürünün tamamı ~25-30 dakika sürer — uzun sürecekse arka planda (`run_in_background`) çalıştır.

## 2. Nasıl çalıştırılır (3 mod)

```bash
# 1) Tüm katalog için (var olanların da üzerine yazar)
node generate_urun_bilgi_formu.js

# 2) Belirli ürünler için (id'leri boşlukla ayır — products.json anahtarları)
node generate_urun_bilgi_formu.js KES119 KWP4040 KCF291

# 3) Sadece PDF'i eksik olan ürünler için
node generate_urun_bilgi_formu.js --missing
```

- **"Eksik" ne demek?** `--missing`, `public/urun-bilgi-formlari/` klasöründeki mevcut PDF isimlerini `src/lib/getProductPdfForm.ts` ile **aynı mantıkla** (model/isim substring eşleşmesi) kontrol eder. Yani bir ürün için kendi adına PDF yoksa ama zaten eşleşen daha eski/aile bazlı bir PDF varsa (örn. "GDL414" tüm GDL414xx varyantlarını karşılıyorsa) o ürün "eksik" sayılmaz — siteyle birebir tutarlı.
- Kullanıcı "X, Y, Z ürünleri için ÜBF oluştur" derse → mod 2, ilgili id'leri ver.
- Kullanıcı "eksik olanlar için oluştur" derse → mod 3 (`--missing`).
- Kullanıcı "hepsini yeniden oluştur" derse → mod 1 (argümansız).

## 3. Çalıştırdıktan sonra ne kontrol edilir

Script sonunda konsola özet basar (Başarılı / Engellenen / Hata / Uyarı sayıları). **Engellenenler** listesini mutlaka oku:
- `görsel bulunamadı: ...` → o ürünün `public/images/...` altında fotoğrafı yok, PDF üretilemez. Bu bir kod sorunu değil, gerçek fotoğraf eksikliği — kullanıcıya söyle, kendin fotoğraf üretme/uydurma.
- `name.tr/en eksik` veya `attributes.tr/en eksik` → `products.json`'da o kaydın verisi eksik, önce veriyi tamamla.

Toplu üretimden sonra en az birkaç örneği (farklı marka: k2/vanti/global, uzun isimli bir ürün, çok satırlı bir ürün) gerçekten `Read` tool ile açıp görsel kontrol et — bkz. bu projede daha önce yapılan kontroller (KES119, KWP4040, KCF291, GDL4140_60X60, KDL109 gibi).

## 4. Tasarım/mantık kararları (bunları bozma, bilinçli seçildi)

- **TR ve EN değer aynıysa tekrar etme:** `36W / 36W` gibi anlamsız tekrar YOK — `combineValue()` fonksiyonu TR=EN ise tek değer yazıyor.
- **Aynı etikete sahip birden fazla attribute satırı birleştirilir:** Bazı ürünlerde (örn. vantilatörler) veri içinde iki ayrı "Özellik" kaydı olabiliyor — bunlar tek "Diğer Özellikler / Additional Features" satırında `/` ile birleştirilip gösteriliyor, iki ayrı satır AÇILMIYOR.
- **Etiket çevirileri (`LABEL_MAP`):** `Watt→Güç/Power`, `Çalışma Ömrü→Ömür/Life Time`, `Özellik→Diğer Özellikler/Additional Features`, `Renk→Renk Seçenekleri/Color Options`. Section başlığı da bilinçli olarak "TECHNICAL FEATURES" (Specs değil) — çünkü satır etiketi de "Features" diyor, ikisi aynı kelimeyi kullanmalı (kullanıcı bunu özellikle istedi, tutarsız bırakma).
- **Başlık satırını zorla `<br>` ile bölme** — tarayıcının doğal satır kaydırmasına bırak. Uzun isimlerde (`h3`, 32px) bunu test ettik, düzgün sarıyor.
- **Marka logosu:** `product.brand` alanına göre (`k2`/`vanti`/`global`) otomatik seçiliyor, bilinmeyen/boş marka → k2 logosuna düşüyor.

## 5. Çalışma sonrası temizlik

Script her çalıştığında kök dizine iki geçici dosya yazar: `urun_bilgi_formu_calisma_log.txt` (konsol logu) ve `urun_bilgi_formu_rapor.json` (detaylı engellenen/hata/uyarı listesi). Bunlar `.gitignore`'a eklendi, **commit'lenmesine gerek yok** — bir sonraki çalıştırmada zaten üzerine yazılıyorlar. Kullanıcı özellikle "detay rapor istiyorum" demedikçe bunları repo'da tutma/commit'leme.
