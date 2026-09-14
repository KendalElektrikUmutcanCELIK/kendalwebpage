# Yapay Zeka (AI) Ürün Fotoğrafı Üretim Rehberi

Bu belge, Kendal Elektrik / K2 markası altındaki ürünlerin yapay zeka (`generate_image` aracı) kullanılarak profesyonel, gerçek hayatta kullanıma uygun "lifestyle" fotoğraflarının üretilmesi için standart kuralları ve prompt yapılarını içerir. AI asistan, fotoğraf üretimi talep edildiğinde bu rehberi okuyarak doğrudan aynı standartta üretim yapmalıdır.

## 1. Genel Kurallar

- **Format ve Çözünürlük:** Dikey (2:3 aspect ratio).
- **Referans Kullanımı:** `generate_image` aracı çağrılırken `ImagePaths` parametresine mutlaka ürünün orijinal/mevcut fotoğrafının mutlak (absolute) yolu verilmelidir (örn: `c:\Users\umutcan.celik\Documents\GitHub\kendalwebpage\public\images\urunler\kda730.webp`).
- **Dosya İsimlendirme:** Üretilen fotoğraflar mutlaka ürün koduyla BÜYÜK HARF olarak kaydedilmelidir (Örn: `KDA710.jpg`). Asistan, üretilen fotoğrafları kullanıcının masaüstünde oluşturulacak bir klasöre (`Kendal_AI_Uretimler` vb.) topluca taşımalı ve script yardımıyla (veya PowerShell ile) düzgün bir şekilde yeniden adlandırmalıdır.
- **Kullanım Senaryosu:** Ürün "çalışır durumda", yani açık ve ışık verirken tasvir edilmelidir (Katalog veya izole fotoğraf çekimi gibi kapalı ve ışıksız DEĞİL). Ürün, kadrajın ortasında/üst kısmında belirgin ama tüm resmi kaplamayacak şekilde (~%25) konumlanmalıdır. Alanın geri kalanı yazı/yaratıcı tasarımlar için boş (negative space) bırakılmalıdır.

## 2. Standart Prompt Yapısı

Aşağıdaki prompt şablonunu (İngilizce olarak), ürünün özelliğine göre (İç mekan/Dış mekan, renk sıcaklığı vb.) küçük modifikasyonlarla kullan.

> **Örnek Prompt (Dış Mekan / Aplik için):**
> Create a photorealistic, vertical 2:3 aspect ratio professional product photograph. The image represents a modern, luxurious, dimly lit exterior house wall or garden patio at dusk. The product is a compact, modern LED wall light sconce (similar to the provided reference image) mounted on the wall, placed prominently in the upper center of the frame. The fixture must take up about 20% to 25% of the total image width. Leave a massive amount of empty, continuous dark space on the left side, the right side, and the bottom half of the image for text placement. The composition must be extremely airy and spacious.
> 
> The Product: A sleek, modern wall sconce (LED Aplik) based on the reference image design.
> 
> Orientation & Physical Connection (CRITICAL): The housing is mounted PERFECTLY FLUSH AND EMBEDDED onto a textured modern dark grey or charcoal wall. The housing must NOT float in mid-air; it must look physically attached to the wall. 
> 
> Lighting & Environment (CRITICAL): The product is TURNED ON and actively working. It emits a beautiful, elegant warm white (3000K) beam/cone of light that washes over the wall surface. The warm light creates a luxurious, inviting atmosphere. The background is a continuous, dark, moody, luxurious modern exterior wall. Blurred silhouettes of garden plants or architectural details are subtly visible in the far distance. The scene is dimly lit by ambient dusk light so the warm light from the fixture stands out perfectly.
> 
> Strict Negative Instructions:
> DO NOT add any text, logos, tables, or watermarks. DO NOT include any AI watermark. DO NOT show any mounting clips or wires. DO NOT make the housing float in mid-air. DO NOT make the housing fill the entire screen. DO NOT generate multiple housings; there must be only one single housing. The light should look realistic, not overly exaggerated or blinding.

## 3. Ürün Tipine Göre Prompt Modifikasyonları

Asistan, ürünü üretmeden önce `products.json` üzerinden özelliklerini (Kategori, Renk Sıcaklığı, IP Koruma vb.) kontrol etmeli ve promptu adapte etmelidir.

1. **Ortam (Environment):**
   - Bahçe/Dış Mekan Aplikleri (Örn: IP54/IP65 ürünler) için: `exterior house wall or garden patio at dusk`
   - İç Mekan (Salon vs. IP20) Ürünler için: `dimly lit modern living room, hallway or luxurious interior wall`
2. **Işık Rengi (Color Temperature):**
   - Ürün özellikleri `Günışığı (3000K)` veya `Sıcak Beyaz` diyorsa prompt içinde mutlaka `warm white (3000K)` geçmelidir.
   - Eğer ürün `6500K` (Beyaz) ise `crisp cool white (6500K)` olarak değiştirilmelidir.
3. **Fiziksel Bağlantı (Physical Connection):** 
   - Aplikler için: `mounted PERFECTLY FLUSH AND EMBEDDED onto a textured wall.`
   - Sarkıtlar (Pendant) için: `hanging elegantly from the ceiling using a thin, realistic cable.`
   - Spotlar (Recessed) için: `mounted PERFECTLY FLUSH AND EMBEDDED into a dark, matte ceiling.`

## 4. Uygulama Adımları (AI Asistan İçin)

1. İstenen ürünlerin listesini `products.json`'dan çek.
2. Ürünlerin özelliklerine göre yukarıdaki prompt'u adapte et.
3. `generate_image` aracı ile batched (gruplar halinde) üretimleri başlat. **DİKKAT:** AI görüntü üretim aracının (Quota) limitleri vardır (429 Too Many Requests). Üretimler yapılırken bu limitlere dikkat edilmeli, hata alınırsa işlem kullanıcıya raporlanıp bekletilmelidir.
4. Üretim bitince klasördeki karmaşık isimleri `[URUNKODU].jpg` olacak şekilde yeniden adlandır.
