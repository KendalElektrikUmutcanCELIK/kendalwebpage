'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export const PrivacyContent = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
        {language === 'tr' ? (
          <div className="prose prose-invert prose-red max-w-none text-justify">
            <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-[var(--brand-red)]">
              Gizlilik ve Çerez Politikası
            </h1>
            <p className="text-gray-300 leading-relaxed mb-6">
              Kendal Elektrik Aydınlatma Elektronik İnş. San. Dış. Tic. A.Ş.’ de
              (“Şirket”, “biz” ya da “bizim”) müşterilerimizin gizlilik
              haklarının sürdürülmesine önem veriyor ve saygı gösteriyoruz. Bu
              doğrultuda işbu Gizlilik Politikasını oluşturduk.
              www.kendalelektrik.com Sitesini (“Site”) ziyaret ettiğinizde
              edinebileceğiniz bilgilerden tarafınızı haberdar etmek ve neden
              müşteri bilgilerine ihtiyaç duyduğumuz, bilgileri hangi amaçlarla
              kullandığımız, hangi koşullar altında bilgileri ifşa etmek zorunda
              kalacağımız ve söz konusu bilgilerin kullanımı konusunda
              tarafımızı nasıl sınırlandırabileceğiniz hususlarında tarafınızı
              aydınlatmak için söz konusu gizlilik politika beyanını oluşturmuş
              bulunmaktayız.
            </p>
            <p className="text-gray-300 leading-relaxed mb-10">
              Herhangi bir sorunuz olursa lütfen{' '}
              <a
                href="mailto:info@kendalelektrik.com.tr"
                className="text-[var(--brand-red)] hover:underline"
              >
                info@kendalelektrik.com.tr
              </a>{' '}
              adresinden Müşteri Hizmetleri Ekibine e-posta göndermek ya da{' '}
              <strong>0212 482 75 90 - 91</strong> numaralı telefondan aramak
              suretiyle bize ulaşınız.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              1. Sizden Ne Tür Bilgiler Talep Ediyoruz?
            </h2>
            <h3 className="text-xl font-medium mb-2 text-white/80 mt-4">
              Trafik Verileri
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Sitemizi ziyaret ettiğinizde şu bilgileri otomatik olarak takibe
              alıyoruz: (i) IP adresiniz; (ii) kullanmakta olduğunuz
              bilgisayarın türü ve (iii) kullanmakta olduğunuz tarayıcının türü
              (toplu halde “Trafik Verileri”).
            </p>
            <h3 className="text-xl font-medium mb-2 text-white/80 mt-4">
              Kişisel Bilgiler
            </h3>
            <p className="text-gray-300 leading-relaxed mb-10">
              Site aracılığıyla satışa sunduğumuz ürünleri satın alabilmeniz
              için ise kişisel kimliğinizi tanımlayan bilgileri tarafımıza
              sağlamanız gerekmektedir. Girdiğiniz bilgileri Şirket Sitesine
              alarak kayda geçirmekteyiz. Örneğin sizden, iletişim bilgilerinize
              yönelik (isim, adres, telefon numarası, e-posta adresi gibi) bir
              kayıt formu doldurmanızı talep edebiliriz. Tüm bunlara ek olarak,
              Siteden herhangi bir siparişte bulunduğunuzda, bazı müşteri
              (sipariş edilen ürünler ve ilgili promosyon kodları gibi) ve
              teslimat (teslimatı almak için müsait olmadığınızda alternatif
              iletişim, adres ve telefon numarası) bilgileri de tarafınızdan
              talep edilebilir. Bu bilgiler toplu halde “Kişisel Bilgiler”
              olarak adlandırılır. E-posta yoluyla bize ulaşır ya da online
              form, anket veya ek girdilerini doldurursanız, bu yolla elde
              edilen bilgiler Kişisel Bilgiler olarak derlenebilir. Belirli
              Kişisel Bilgilerinizi bizimle paylaşmayabilirsiniz. Bu durumda da
              Sitemizin belirli bölümlerini görüntüleyebilir ve Siteye erişim
              sağlayabilirsiniz. Ayrıca, isteğe bağlı bazı bilgileri de temin
              etmeyebilirsiniz. Ancak o zaman, Şirket Sitesine ait birçok
              avantajdan faydalanma şansınız söz konusu olmayacaktır.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              2. Edindiğimiz Bilgileri Nasıl Kullanıyoruz?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Tarafınızdan edindiğimiz Kişisel Bilgileri, taleplerinize cevap
              verme, müşteri siparişlerini işleme alma ve doldurma, belirli ürün
              ve hizmetlere yönelik sınırlamalarınızı doğrulama, faturalandırma,
              hizmetlerimizi geliştirme, daha üst düzey ve kişiselleştirilmiş
              bir alışveriş deneyimi sunma, sizinle irtibata geçme, özel teklif
              ve indirimlerden sizi haberdar etme amaçları doğrultusunda
              kullanıyoruz. Belirli zamanlarda, yeni ürün numunelerini ya da
              genellikle sipariş ettiklerinizden farklı olan ürün markalarını
              size göndermek için de Kişisel Bilgilerinizden
              faydalanabilmekteyiz. Diğer bir yandan, siparişinizin yerine
              getirilmesi ve işleminizin tamamlanması için gerekli olan
              düzeydeki Kişisel Bilgilerinizi üçüncü şahıslarla paylaşabiliriz.
              Örneğin, belirli ürünler için üçüncü şahıs bir tedarikçi ile,
              siparişleri naklettirmek için harici bir nakliye şirketi ile,
              kullanıcıları mal ve hizmetler için faturalandırabilmek için ise
              kredi kartı işlemeleri yapan şirketler ile birlikte çalışmamız söz
              konusu olabilir. Ayrıca aşağıda 5. Bölümde belirtilen doğrultuda
              yine Kişisel Bilgilerinizi paylaşabiliriz. Yukarıda ve aşağıda 5.
              Bölümde aksi belirtilmedikçe ve tarafınızdan müsaade edilmedikçe,
              Kişisel Bilgileriniz üçüncü şahıslar ile paylaşılmayacaktır.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              3. Tanımlama Bilgilerini (Çerezleri) Nasıl Kullanıyoruz?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              “Tanımlama bilgisi”, sabit diskinize depolanan size ilişkin
              bilgilerdir. Kendal Elektrik kullanıcılarına ilişkin tanımlama
              bilgileri, sizi eski ziyaretçi olarak görür ve siz Sitede
              dolaştıkça bilgilerinizi hatırlamasını sağlar. Sistemimizin
              bilgisayarınıza tanımlama bilgisi atamasına müsaade ettiğinizde,
              ziyaret başına tek seferden fazla şifre girmeniz gerekmeyecektir.
              Böylelikle sitemizde gezinirken zaman kazanmış olursunuz.
              Tanımlama bilgileri, aynı zamanda ilgilerinizi öğrenmemize ve
              Sitemizdeki deneyimlerinizi üst düzeylere çıkarmamıza olanak
              tanır. Ancak tanımlama bilgilerini kullanarak Kişisel (e-posta
              adresiniz hariç) ve Finansal Bilgilerinizi depolamıyoruz. Birçok
              İnternet tarayıcısı, tanımlama bilgilerini otomatik olarak kabul
              eder ve tarayıcınızın, söz konusu tanımlama bilgilerini
              kullanmaması konusunda talimat verebilme seçeneği sunar. Bu işlevi
              etkisizleştirdiğinizde siteyi kullanmaya devam edebilirsiniz.
            </p>
            <p className="text-gray-300 leading-relaxed mb-10">
              Online reklam verebilmek için piksellerden veya bağımsız GIF
              dosyalarından faydalanmaktayız. Söz konusu GIF dosyaları, reklam
              yönetim ortağımız tarafından sağlanır. Bu dosyalar sayesinde,
              İnternet tarayıcınızdaki eşsiz tanımlama bilgilerini saptar ve
              böylelikle hangi reklamların kullanıcıları Sitemize
              yönlendirdiğini öğrenmemizi sağlar. Tanımlama bilgisi bizim ile
              çalışan bir başka reklamcı tarafından yerleştirilir. Tanımlama
              Bilgisi ve Ön Plan teknolojileri yardımıyla, edindiğimiz ve
              paylaştığımız bilgiler anonim bir nitelik kazanır ve kişisel
              olarak saptanamaz. Söz konusu teknolojiler, isim, adres, telefon
              numarası veya e-posta adresi gibi bilgilerinizi içermeyecektir.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              4. Kayıt Dosyaları
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Trendleri analiz etmek, Siteyi yönetmek, kullanıcı faaliyetlerini
              takip etmek, anonim ve kitlesel kullanım hakkındaki demografik
              bilgileri kapsamlı bir biçimde paylaşmak için IP adreslerinden
              faydalanıyoruz.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              5. Kişisel Bilgilerin Paylaşılması
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Yukarıdaki 2. bölüme ek olarak, anonim ve kitlesel bir bazda,
              demografik bilgileri iş ortaklarımız ve reklamcılarımızla
              paylaşıyoruz. Bu tür bilgiler, kişisel olarak saptanabilir
              bilgiler ile bağlantılı değildir.
              <br />
              <br />
              Hizmetlerimizi size ulaştırmak için üçüncü şahıslarla yakın
              çalışmalar yürütüyor ve bir başka şirketle işbirliğimiz söz konusu
              olduğunda, fonksiyonların yerine getirilebilmesi için bu
              şirketlerle bilgi paylaşımında bulunuyoruz.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              6. Piyasa Araştırması
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Kendal Elektrik, hizmet ve ürün bileşimimizi geliştirmek adına
              tarafınızdan bilgi edinmek için piyasa araştırma şirketinin
              sağladığı hizmetleri güvence altına alabilir. Söz konusu geri
              bildiriminiz isteğe bağlıdır ve sonuçlar, kitlesel eleştirilerde
              kullanılacaktır.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              7. Gizliliğinizin Sınırları
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Sitemiz, diğer İnternet sitelerinin linklerini içerebilir. Kendal
              Elektrik, linklere ve/veya sizi üçüncü şahıs İnternet sitelerine
              yönlendiren reklam sembollerine tıkladığınızda, bizden ziyade
              üçüncü şahısların gizlilik politikalarına tabi olacağınızın
              bilincinde olmanızı istemektedir. İnternette gizliliğin
              korunmasını desteklememize rağmen, üçüncü şahısların ve diğer
              İnternet sitelerinin gizlilik politikalarını ilgilendiren
              faaliyetler konusunda sorumluluk almamaktayız. Herhangi başka bir
              İnternet sitesi ile iletişime geçtiğinizde ya da söz konusu
              sitelere herhangi bir kişisel bilgi sağlamadan önce, tarafınıza
              gönderdiğimiz gizlilik beyanını ve kullanıcı koşul ve şartlarını
              okumanızı tavsiye ederiz. İş bu Gizlilik Politikası, yalnızca
              Şirketin bu Siteden edindiği bilgiler için geçerlidir.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              8. Güvenliğiniz
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Kendal Elektrik, kişisel bilgilerinizi korumak amacıyla çeşitli
              önlemler almaktadır. İletişim formumuzda kullanıcılardan hassas
              bilgilerin girilmesi istendiğinde söz konusu bilgiler şifrelenir
              ve şifreleme yazılımı ile koruma altına alınır. Sitemiz,
              bilgilerinizi güvenli soket katmanı (SSL) şifreleme teknolojisi
              kullanılmak suretiyle İnternete aktarılmadan önce şifreler.
              Formlar gibi güvenli bir sayfada herhangi bir işlem yapmaksızın
              “gezinirken”, Microsoft Internet Explorer, Mozilla, Opera, Safari,
              Google Crome ve Maxthon gibi İnternet tarayıcılarının alt kısmında
              görünen kilit ikonu, kilitsiz ya da açık modun aksine
              kilitlenmektedir.
            </p>
            <p className="text-gray-300 leading-relaxed mb-10">
              Kişisel Bilgilerinizi edindiğimizde, gizliliklerini sürdürmek için
              gerekli çabayı göstermemize rağmen, İnternete ya da diğer kamusal
              ağlara veri aktarımının %100 güvenli şekilde
              gerçekleştirilebileceği hususunda garanti verilememektedir. Bunun
              sonucunda, tarafımıza aktardığınız herhangi bir bilginin ya da
              online ürün ve hizmetlerden tarafımızca aktarılan veya sizin
              edindiğiniz bilgilerin güvenliğini temin ve garanti edemiyoruz.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              9. Kayıp ya da Çalıntı Bilgiler
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Kullanıcı adınız veya şifreniz kaybolur, çalınır ya da izinsiz
              olarak kullanılırsa, derhal bizi durumdan haberdar etmelisiniz.
              Böyle bir olay meydana geldiğinde, sistemimizde bulunan, kullanıcı
              adınızı veya şifrenizi iptal etmenizi hatırlatıyor ve uygun
              şekilde kayıtlarımızı güncelliyoruz.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              10. Bilgilerinizin Kullanılması Nasıl Sınırlandırılır?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Kullanıcılarımıza, siparişlerinin alınması, işlenmesi, yerine
              getirilmesi ve teslim edilmesi amacıyla verdikleri bilgileri, bu
              amaçlarla doğrudan bağlantılı olmayan konularda kullandırma
              hakkından “çekilme” seçeneği sunulmaktadır. Bu haktan çekilmek ve
              ürün bilgisi, ürün numunesi, promosyonlara yönelik
              iletiler/e-postalar gibi ilginizi çekeceğini düşündüğümüz
              materyallerin bizden, sitelerden ve sahibi olduğumuz şirketlerden
              tarafınıza gönderilmesinden feragat etmeyi tercih ederseniz,
              aşağıdaki iki yöntemden birini seçerek bize bildirimde
              bulunabilirsiniz:
            </p>
            <ul className="list-disc pl-6 text-gray-300 leading-relaxed mb-10 space-y-2">
              <li>
                Müşteri Hizmetleri Grubu: www.kendalelektrik.com adresinden bize
                ulaşabilirsiniz. Veya 0212 482 75 90 - 91 no’lu telefondan
                arayabilirsiniz.
              </li>
              <li>
                Tarafımızda gönderilen herhangi bir broşür ya da iletiye
                sahipseniz lütfen bunu talebinizde bildiriniz; söz konusu
                materyaller mevcut değil ise yalnızca posta adresinizi ve
                e-posta adresinizi belirtmeniz yeterlidir.
              </li>
              <li>
                info@kendalelektrik.com.tr adresinden bize e-posta
                gönderebilirsiniz (lütfen posta adresinizi belirtiniz).
              </li>
              <li>
                Bilginizin kullanılmasını sınırlandırmaya yönelik
                talimatlarınız, mümkün olan en kısa sürede işleme alınacaktır.
                Ayrıca, Sitede bulunan Hesabınız adlı bölümden de bilgilerinizi
                güncelleyebilirsiniz.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              11. Düzeltmeler
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Kişisel Bilgilerinizden herhangi biri değişirse (Posta Kodu gibi)
              ya da hizmetimizden faydalanmayı sonlandırmak isterseniz,
              tarafımıza sağlanan kişisel bilgileri düzeltebilir,
              güncelleyebilir veya kaldırabiliriz. Bunun için yeni bilgilerinizi
              info@kendalelektrik.com.tr adresine göndermeniz gerekmektedir.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              12. Onayınız ve Mevcut Politikayı Değiştirme
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Sitemizi kullanarak, işbu Gizlilik Politikasının şartları
              çerçevesinde bilgilerinizin edinilmesine ve kullanılmasına rıza
              gösterdiğinizi ifade etmiş olursunuz. Gizlilik Politikamızı
              değiştirmeye karar verirsek, bilgiyi nasıl edindiğimiz, nasıl
              kullandığımız ve hangi koşullar altında ifşa ettiğimizi öğrenmeniz
              için söz konusu değişiklikleri Sitede yayınlayacağız. Bildirimden
              sonra da bu sitenin kullanımına devam edilmesi, bilgilerinizin,
              tarafımızca değiştirilen politika doğrultusunda kullanılmasını
              onayladığınız anlamına gelecektir. Gizlilik Politikası veya
              Müşteri Sözleşmesi üzerinde gerçekleştirilen değişikliklerden
              haberdar olmak isterseniz, lütfen bildirimin gönderilmesini
              istediğiniz adres üzerinden info@kendalelektrik.com.tr adresine
              e-posta gönderiniz.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              13. Yasalarca Öngörülen İfşa Koşulları
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Yasalarca gerekli görüldüğünde veya iyi niyetimizle söz konusu
              ifşa faaliyetinin yasa buyruklarına riayet etmek için gerekli
              olduğunu düşündüğümüz durumlarda ya da Kendal Elektrik çalışanları
              ve yöneticilerine yönelik mahkeme kararı veya yasal sürece itaat
              etmek adına bazı Kişisel Bilgilerinizi ifşa edebiliriz. Ayrıca
              Kendal Elektrik, kendisinin oluşturduğu Kullanım Koşullarını ihlal
              eden ya da Kendal Elektrik’ in mülkiyet haklarına, kayıtlı ve
              potansiyel müşterilerine veya söz konusu faaliyetten etkilenen
              herhangi bir kimseye zarar veren ya da müdahalede bulunan tarafı
              belirlemek, iletişime geçmek ve karşı dava açmak için gerekli
              olduğuna inanılan bu tür bilgileri ifşa etme hakkını saklı tutar.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              14. Yorumlarınız
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Kendal Elektrik, Gizlilik Politikasına yönelik geri
              bildirimlerinizi bizim için çok değerlidir. Lütfen soru ve
              yorumlarınızı info@kendalelektrik.com.tr adresine gönderiniz.
            </p>
          </div>
        ) : (
          <div className="prose prose-invert prose-red max-w-none text-justify">
            <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-[var(--brand-red)]">
              Privacy and Cookie Policy
            </h1>
            <p className="text-gray-300 leading-relaxed mb-6">
              We, Kendal Elektrik Aydınlatma Elektronik İnş. San. Dış. Tic. A.Ş.
              (“Company”, “we” or “our”), value and respect the maintenance of
              our customers' privacy rights. Accordingly, we have created this
              Privacy Policy. We have created this privacy policy statement to
              inform you about the information you may obtain when you visit the
              www.kendalelektrik.com Site (“Site”) and to enlighten you about
              why we need customer information, for what purposes we use the
              information, under what conditions we may have to disclose the
              information, and how you can restrict us regarding the use of such
              information.
            </p>
            <p className="text-gray-300 leading-relaxed mb-10">
              If you have any questions, please contact us by sending an e-mail
              to the Customer Service Team at{' '}
              <a
                href="mailto:info@kendalelektrik.com.tr"
                className="text-[var(--brand-red)] hover:underline"
              >
                info@kendalelektrik.com.tr
              </a>{' '}
              or by calling <strong>0212 482 75 90 - 91</strong>.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              1. What Kind of Information Do We Request From You?
            </h2>
            <h3 className="text-xl font-medium mb-2 text-white/80 mt-4">
              Traffic Data
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              When you visit our site, we automatically track the following
              information: (i) your IP address; (ii) the type of computer you
              are using and (iii) the type of browser you are using
              (collectively “Traffic Data”).
            </p>
            <h3 className="text-xl font-medium mb-2 text-white/80 mt-4">
              Personal Information
            </h3>
            <p className="text-gray-300 leading-relaxed mb-10">
              In order to purchase the products we offer for sale through the
              Site, you must provide us with personally identifiable
              information. We record the information you enter by taking it to
              the Company Site. For example, we may ask you to fill out a
              registration form regarding your contact information (such as
              name, address, phone number, e-mail address). In addition to all
              these, when you place an order from the Site, some customer (such
              as ordered products and relevant promotional codes) and delivery
              (alternative contact, address, and phone number when you are not
              available to receive the delivery) information may also be
              requested from you. This information is collectively referred to
              as “Personal Information”. If you contact us via e-mail or fill
              out online forms, surveys, or additional entries, the information
              obtained in this way may be compiled as Personal Information. You
              may choose not to share certain Personal Information with us. In
              this case, you can still view certain parts of our Site and access
              the Site. You may also choose not to provide some optional
              information. However, you will not have the chance to benefit from
              many advantages of the Company Site then.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              2. How Do We Use the Information We Acquire?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              We use the Personal Information we acquire from you for the
              purposes of responding to your requests, processing and fulfilling
              customer orders, verifying your restrictions on certain products
              and services, billing, improving our services, providing a higher
              level and personalized shopping experience, contacting you, and
              informing you about special offers and discounts. At certain
              times, we may also use your Personal Information to send you new
              product samples or product brands that are generally different
              from what you order. On the other hand, we may share your Personal
              Information with third parties to the extent necessary to fulfill
              your order and complete your transaction. For example, we may need
              to work with a third-party supplier for certain products, with an
              external shipping company to transport orders, and with companies
              that process credit cards to bill users for goods and services. We
              may also share your Personal Information as specified in Section 5
              below. Unless otherwise specified above and in Section 5 below and
              permitted by you, your Personal Information will not be shared
              with third parties.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              3. How Do We Use Cookies?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A “cookie” is information about you stored on your hard drive.
              Cookies for Kendal Elektrik users see you as a returning visitor
              and allow them to remember your information as you navigate the
              Site. When you allow our system to assign a cookie to your
              computer, you will not need to enter your password more than once
              per visit. This saves you time while browsing our site. Cookies
              also allow us to learn your interests and elevate your experiences
              on our Site. However, we do not store your Personal (except for
              your e-mail address) and Financial Information using cookies. Most
              Internet browsers automatically accept cookies and offer the
              option to instruct your browser not to use these cookies. You can
              continue to use the site even when you disable this function.
            </p>
            <p className="text-gray-300 leading-relaxed mb-10">
              We use pixels or independent GIF files for online advertising.
              These GIF files are provided by our advertising management
              partner. Thanks to these files, it detects the unique cookies on
              your Internet browser and thus allows us to learn which
              advertisements direct users to our Site. The cookie is placed by
              another advertiser working with us. With the help of Cookie and
              Front Plan technologies, the information we acquire and share
              gains an anonymous quality and cannot be identified personally.
              These technologies will not include your information such as name,
              address, phone number, or e-mail address.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              4. Log Files
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              We use IP addresses to analyze trends, administer the Site, track
              user activities, and comprehensively share demographic information
              about anonymous and mass usage.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              5. Sharing Personal Information
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              In addition to section 2 above, we share demographic information
              with our business partners and advertisers on an anonymous and
              mass basis. Such information is not linked to personally
              identifiable information.
              <br />
              <br />
              We work closely with third parties to deliver our services to you,
              and when we collaborate with another company, we share information
              with these companies so that the functions can be fulfilled.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              6. Market Research
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Kendal Elektrik may secure the services provided by a market
              research company to obtain information from you to improve our
              service and product combination. This feedback is optional and the
              results will be used in mass critiques.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              7. Limits of Your Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Our site may contain links to other Internet sites. Kendal
              Elektrik wants you to be aware that when you click on links and/or
              advertising symbols that direct you to third-party Internet sites,
              you will be subject to the privacy policies of third parties
              rather than us. Although we support the protection of privacy on
              the Internet, we take no responsibility for the activities
              involving the privacy policies of third parties and other Internet
              sites. When you contact any other Internet site or before
              providing any personal information to such sites, we recommend
              that you read the privacy statement and user terms and conditions
              we have sent to you. This Privacy Policy applies only to the
              information acquired by the Company from this Site.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              8. Your Security
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Kendal Elektrik takes various measures to protect your personal
              information. When users are asked to enter sensitive information
              on our contact form, that information is encrypted and protected
              with encryption software. Our site encrypts your information
              before it is transferred to the Internet by using secure socket
              layer (SSL) encryption technology. When “browsing” without
              performing any action on a secure page like forms, the lock icon
              appearing at the bottom of Internet browsers such as Microsoft
              Internet Explorer, Mozilla, Opera, Safari, Google Chrome, and
              Maxthon is locked, as opposed to unlocked or open mode.
            </p>
            <p className="text-gray-300 leading-relaxed mb-10">
              Although we make the necessary effort to maintain their privacy
              when we acquire your Personal Information, it cannot be guaranteed
              that data transfer to the Internet or other public networks can be
              carried out 100% securely. As a result, we cannot guarantee and
              warrant the security of any information you transfer to us or the
              information we transfer or you acquire from online products and
              services.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              9. Lost or Stolen Information
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              If your username or password is lost, stolen, or used without
              authorization, you must notify us immediately. When such an event
              occurs, we remind you to cancel your username or password in our
              system and update our records accordingly.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              10. How to Restrict the Use of Your Information?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our users are offered an “opt-out” option regarding the right to
              use the information they provide for the purpose of receiving,
              processing, fulfilling, and delivering their orders in matters not
              directly related to these purposes. If you choose to opt out of
              this right and waive the delivery of materials that we think will
              interest you, such as product information, product samples,
              promotional messages/e-mails, from us, our sites, and the
              companies we own, you can notify us by choosing one of the
              following two methods:
            </p>
            <ul className="list-disc pl-6 text-gray-300 leading-relaxed mb-10 space-y-2">
              <li>
                Customer Service Group: You can reach us at
                www.kendalelektrik.com. Or you can call 0212 482 75 90 - 91.
              </li>
              <li>
                If you have any brochure or message sent to us, please state
                this in your request; if such materials are not available, it is
                sufficient to provide only your postal address and e-mail
                address.
              </li>
              <li>
                You can send us an e-mail at info@kendalelektrik.com.tr (please
                specify your postal address).
              </li>
              <li>
                Your instructions regarding restricting the use of your
                information will be processed as soon as possible. In addition,
                you can update your information from the Your Account section on
                the Site.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              11. Corrections
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              If any of your Personal Information changes (such as Zip Code) or
              if you want to stop benefiting from our service, we can correct,
              update, or remove the personal information provided to us. For
              this, you need to send your new information to
              info@kendalelektrik.com.tr.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              12. Your Consent and Modifying Current Policy
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              By using our site, you express that you consent to the acquisition
              and use of your information within the framework of the terms of
              this Privacy Policy. If we decide to change our Privacy Policy, we
              will publish such changes on the Site so that you can learn how we
              acquire the information, how we use it, and under what conditions
              we disclose it. Continued use of this site after the notification
              will mean that you approve the use of your information in line
              with the policy modified by us. If you wish to be informed about
              the changes made on the Privacy Policy or Customer Agreement,
              please send an e-mail to info@kendalelektrik.com.tr from the
              address where you want the notification to be sent.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              13. Disclosure Conditions Required by Law
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              We may disclose some of your Personal Information when required by
              law or in cases where we believe in good faith that such
              disclosure activity is necessary to comply with legal edicts or to
              obey a court order or legal process against Kendal Elektrik
              employees and managers. In addition, Kendal Elektrik reserves the
              right to disclose such information that is believed to be
              necessary to identify, contact, and file a counter-suit against
              the party that violates the Terms of Use created by itself or
              harms or interferes with Kendal Elektrik's property rights,
              registered and potential customers, or anyone affected by such
              activity.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              14. Your Comments
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Kendal Elektrik values your feedback regarding the Privacy Policy
              very much. Please send your questions and comments to
              info@kendalelektrik.com.tr.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
