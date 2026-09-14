# Türkiye Aydınlatma Sektörü Rakip GEO (Generative Engine Optimization) Analiz Raporu

**Hazırlayan:** Antigravity (Kendal Elektrik Yapay Zeka Asistanı)
**Tarih:** 12 Eylül 2026
**Amaç:** Türkiye'nin önde gelen aydınlatma firmalarının (ACK, CATA, Horoz Elektrik, Pelsan) yapay zeka arama motorları (ChatGPT, Perplexity, Claude, Google AI Overviews / SGE) nezdindeki görünürlük ve okunabilirlik (GEO) durumlarının incelenmesi. Kendal Elektrik'in yeni web projesi için Claude Code'a verilecek yapay zeka odaklı geliştirme talimatlarının belirlenmesi.

---

## 1. Rakip GEO Analizi (Yapay Zeka Botları Tarafından Okunabilirlik)

Yapay zeka arama motorları, siteleri indekslerken geleneksel Google botlarından farklı olarak **yapılandırılmış veriye (JSON-LD)**, **veri tablolarına (HTML Tables)** ve **doğrudan cevaplara** odaklanır. Rakipler üzerinde yapılan tarama sonuçları şöyledir:

### 1.1. ACK Aydınlatma (acklighting.com)
- **AI Bot Engeli (robots.txt):** GPTBot, ClaudeBot, PerplexityBot engellenmemiş.
- **Veri Yapısı:** Ana sayfa ve genel yapıda 0 adet `<table>`, 8 adet liste (`<ul>`/`<ol>`), 71 paragraf mevcut. 
- **GEO Skoru:** Çok zayıf. Ürün özellikleri genellikle düz metin veya görsel olarak sunulduğundan, yapay zekanın "ACK'nın 50W dış mekan LED'inin lümen değeri nedir?" gibi bir soruya net cevap bulması çok zor.

### 1.2. CATA Aydınlatma (cata.com.tr)
- **AI Bot Engeli (robots.txt):** Engellenmemiş.
- **Veri Yapısı:** 0 adet `<table>`, 0 adet liste, 195 adet paragraf.
- **GEO Skoru:** Kötü. Bilgiler tamamen paragraflar içerisine gömülü (div çorbası). Yapay zeka, CATA'nın ürün spesifikasyonlarını ayrıştırmakta (parsing) büyük güçlük çekecektir.

### 1.3. Horoz Elektrik (horozelektrik.com)
- **AI Bot Engeli (robots.txt):** Dosya bulunmuyor (404). Botlar serbest.
- **Veri Yapısı:** 0 adet `<table>`, 5 adet liste, 34 paragraf.
- **GEO Skoru:** Zayıf. Sınırlı metin içeriği ve tablo eksikliği nedeniyle yapay zeka asistanları bu siteden yeterli "Bilgi Kazancı" (Information Gain) sağlayamaz.

### 1.4. Pelsan Aydınlatma (pelsan.com.tr)
- **AI Bot Engeli (robots.txt):** Dosya bulunmuyor (404). Botlar serbest.
- **Veri Yapısı:** 0 adet `<table>`, 25 liste, 70 paragraf.
- **GEO Skoru:** Orta-Zayıf. Rakiplere göre daha fazla liste yapısı kullanılmış, bu LLM'ler için kısmen daha iyi bir sinyal. Ancak hala ürün spesifikasyon tabloları eksik.

---

## 2. Genel Sektör Değerlendirmesi ve Fırsatlar

Aydınlatma sektöründeki ana oyuncuların **hiçbiri GEO (Generative Engine Optimization) için hazır değil**. 
Yapay zekalar (ChatGPT Search, Perplexity vb.) teknik özellikleri kıyaslamayı (Örn: "Bana Kendal ve Cata'nın şerit led özelliklerini tablo olarak kıyasla") çok sever. Rakipler HTML tablo (`<table>`) ve semantik veri (JSON-LD) kullanmadığı için yapay zekanın radarından kaçıyorlar. 

**Fırsat:** Kendal Elektrik, sadece birkaç spesifik GEO kodlama kuralına uyarak yapay zeka aramalarında rakiplerini tamamen domine edebilir ve pazarın tek yetkili kaynağı (Authoritative Source) ilan edilebilir.

---

## 3. Kendal Elektrik İçin Claude Code'a İletilecek GEO (Yapay Zeka SEO) Talimatları

Sevgili Claude (veya Geliştirici), Kendal Elektrik'in yeni web projesini inşa ederken geleneksel SEO'nun yanı sıra doğrudan **Yapay Zeka Arama Motorları (GEO - Generative Engine Optimization)** için aşağıdaki standartları uygulamanı istiyorum:

1. **Semantik HTML Tabloları (Kritik!):**
   - Ürün özelliklerini (Güç, Lümen, Renk Sıcaklığı, IP Koruma Sınıfı vb.) ekrana basarken CSS Grid veya Div kullanmak yerine **kesinlikle standart HTML `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` etiketlerini kullan**. Yapay zeka botları verileri tablolardan (markdown/html) mükemmel okur.

2. **Yüksek "Bilgi Kazancı" (Information Gain) ve SSS (FAQ):**
   - Her kategori ve ürün detay sayfasının altına bir SSS (Sıkça Sorulan Sorular) bölümü ekle. 
   - Soruları `<h3>` veya `<details><summary>` etiketleriyle, cevapları ise net `<p>` etiketleriyle (tercihen maddeleme yaparak) ver. (Örn: "Kendal 100W Sokak Armatürü hangi direk çaplarına uygundur?") LLM'ler doğrudan cevap arar.

3. **Gelişmiş Yapılandırılmış Veri (JSON-LD):**
   - Sadece basit SEO kuralları değil, Perplexity ve Google AI Overviews için ürün sayfalarına eksiksiz **Product**, **FAQPage** ve ana sayfaya **Organization** Schema.org JSON-LD yapılarını ekle.
   - Bu şemalarda `description`, `brand`, `offers`, `aggregateRating` ve spesifikasyon verileri kesinlikle dolu olmalıdır.

4. **Bot İzinleri ve LLM Yönlendirmeleri (robots.txt):**
   - `public/robots.txt` dosyasına GPTBot, ClaudeBot, PerplexityBot vb. yapay zeka botlarının siteyi taramasına açıkça izin veren komutlar ekle.
   - (Opsiyonel) LLM'lerin site içeriğini okumasını kolaylaştırmak için ana ürün dizinini düz metin (markdown) olarak sunan gizli bir `/llm.txt` veya `/llm-sitemap.xml` route'u oluşturabilirsin.

5. **Açık, Net ve Alıntılanabilir (Citeable) Metinler:**
   - Pazarlama (Marketing) dilini (Örn: "Muhteşem parıltılı dünyamız...") azalt, yerine teknik, net ve alıntılanabilir mühendislik/teknik metinler (Örn: "Ürün 120 lümen/watt verimliliğe sahiptir") kullan. Yapay zeka net gerçekleri kaynak (citation) olarak göstermeyi sever.

Lütfen bu yönergeleri uygulayarak Kendal Elektrik'i geleneksel Google SEO'nun ötesine geçirip, "ChatGPT'ye sorulduğunda önerilen ilk aydınlatma markası" olmasını sağlayacak altyapıyı kur.
