'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export const KVKKContent = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
        {language === 'tr' ? (
          <div className="prose prose-invert prose-red max-w-none text-justify">
            <h1 className="text-3xl md:text-5xl font-bold mb-10 text-center text-[var(--brand-red)]">
              KVKK Aydınlatma Metni
            </h1>

            <div className="text-gray-300 leading-relaxed">
              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">
                1. GİRİŞ
              </h2>
              <p className="mb-4">
                Kişisel verilerinizin güvenliği ve/veya korunması hususu Kendal
                Elektrik Aydınlatma Elektronik İnşaat Sanayi ve Dış Ticaret A.Ş
                (“Şirket/Şirketimiz”) olarak önceliklerimiz arasındadır. Bu
                bilinçle, Şirket olarak ürün ve hizmetlerimizden faydalanan
                kişiler dahil, Şirket ile ilişkili tüm şahıslara ait her türlü
                kişisel verilerin 6698 sayılı Kişisel Verilerin Korunması Kanunu
                (“KVK Kanunu”)’na uygun olarak işlenerek, muhafaza edilmesine
                büyük önem vermekteyiz. Bu doğrultuda, KVK Kanunu’nda tanımlı
                şekli ile “Veri Sorumlusu” sıfatıyla ve yine KVK Kanunu’nun 10.
                Maddesi ile Kişisel Verilerin Korunması Kurulu’nca 10 MART 2018
                tarihinde 30356 sayılı Resmi Gazete’de yayımlanan Aydınlatma
                Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul Ve Esaslar
                Hakkında Tebliğ (“Tebliğ”)’e uygun olarak, kişisel verilerin
                elde edilmesi sırasında kişisel veri sahiplerini aydınlatma
                görevini yerine getirmek için; Şirketimiz tarafından kişisel
                veri sahiplerine kişisel verilerinin elde edilmesi sırasında
                Şirketimizin kimliği, kişisel verilerin hangi amaçla işleneceği,
                işlenen kişisel verilerin kimlere ve hangi amaçla
                aktarılabileceği, kişisel veri toplamanın yöntemi ve hukuki
                sebebi ile kişisel veri sahibinin KVK Kanunu’nun 11inci maddesi
                kapsamında sahip olduğu haklara ilişkin bu bilgilendirmeyi
                sunarız.
              </p>
              <p className="mb-8">
                İşbu Aydınlatma Metninde geçen “biz” ve “bizim” gibi ifadeler,
                aksi açıkça belirtilmedikçe, Kendal Elektrik Aydınlatma
                Elektronik İnşaat Sanayi ve Dış Ticaret A.Ş ’yi ifade etmek için
                kullanılmaktadır.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">
                2. KİŞİSEL VERİ
              </h2>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Kişisel Veri Tanımı
              </h3>
              <p className="mb-4">
                KVK Kanunu m.3/I(d) çerçevesinde “kişisel veri”, kimliği belirli
                veya belirlenebilir gerçek kişilere ilişkin her türlü bilgiyi
                ifade eder. Bu kapsamda kişisel veri; belirli veya
                belirlenebilir gerçek bir kişiye ilişkin her türlü bilgiyi ifade
                etmektedir. Örnek olarak; adınız, soyadınız, TC kimlik
                numaranız, adresiniz, telefon numaranız, e-posta adresiniz,
                doğum tarihiniz, erişimde bulunduğunuz IP numarası, yaptığınız
                işlemlere ait bilgiler, vb. size ilişkin bilgiler kişisel
                verilerinizdir. Ayrıca KVK Kanunu’na göre; kişilerin ırkı, etnik
                kökeni, siyasi düşüncesi, felsefi inancı, dini, mezhebi veya
                diğer inançları, kılık ve kıyafeti, dernek, vakıf, sendika, vb.
                üyelikleri, sağlığı, cinsel hayatı, ceza mahkûmiyeti ve güvenlik
                tedbirleriyle ilgili verileri ile biyometrik ve genetik
                verileri, vb. veriler özel nitelikli kişisel verilerdir. Bu
                kapsamda, anonim bilgiler, anonim hale getirilen bilgiler ve
                belirli bir kişi ile ilişkilendirilemeyen diğer veriler
                Şirketimiz’in bu konudaki Politikası gereği kişisel veri olarak
                kabul edilmez.
              </p>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Kişisel Verilerin İşlenmesi Kavramı
              </h3>
              <p className="mb-8">
                KVK Kanunu m.3/I(e) çerçevesinde Kişisel verilerin işlenmesi,
                kişisel verilerin tamamen veya kısmen otomatik olan ya da
                herhangi bir veri kayıt sisteminin parçası olmak kaydıyla
                otomatik olmayan yollarla elde edilmesi, kaydedilmesi,
                depolanması, muhafaza edilmesi, değiştirilmesi, yeniden
                düzenlenmesi, açıklanması, aktarılması, devralınması, elde
                edilebilir hâle getirilmesi, sınıflandırılması ya da
                kullanılmasının engellenmesi gibi veriler üzerinde
                gerçekleştirilen her türlü işlemi ifade etmektedir.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">
                3. AYDINLATMA KAPSAMI
              </h2>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Veri Sorumlusunun Kimliği
              </h3>
              <p className="mb-4">
                KVK Kanunu’na göre, “Veri Sorumlusu” kişisel verilerin işleme
                amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin
                kurulmasından ve yönetilmesinden sorumlu olan gerçek veya tüzel
                kişiyi ifade ettiğinden, KVK Kanunu uyarınca Muhatap “Veri
                Sorumlusu” olan Kendal Elektrik Aydınlatma Elektronik İnşaat
                Sanayi ve Dış Ticaret A.Ş’nin Kurumsal Kimlik Bilgileri şu
                şekildedir:
              </p>
              <ul className="list-none space-y-2 mb-6">
                <li>
                  <strong>Ticaret Sicil No:</strong> 453321, İstanbul
                </li>
                <li>
                  <strong>Mersis No:</strong> 05440605937900001
                </li>
                <li>
                  <strong>Vergi Dairesi:</strong> Beyoğlu Vergi Dairesi
                </li>
                <li>
                  <strong>Vergi Numarası:</strong> 5440659379
                </li>
                <li>
                  <strong>Merkez Adresi:</strong> Şahkulu Mahallesi Büyükhendek
                  cad. No 28 Beyoğlu/İstanbul
                </li>
                <li>
                  <strong>Telefon:</strong> 0212 251 77 90
                </li>
                <li>
                  <strong>Faks:</strong> 0212 243 18 96
                </li>
                <li>
                  <strong>İnternet Sitesi:</strong> www.kendalelektrik.com
                </li>
                <li>
                  <strong>Eposta Adresi:</strong> info@kendalelektrik.com.tr
                </li>
              </ul>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Kişisel Verilerin Toplanması, İşlenmesi ve İşleme Amaçları
              </h3>
              <p className="mb-4">
                Kişisel Verileriniz, Şirketimiz tarafından verilen hizmet, ürün
                ya da ticari faaliyete bağlı olarak değişkenlik gösterebilmekle;
                otomatik ya da otomatik olmayan yöntemlerle, ofisler, şubeler,
                bayiler, çağrı merkezi, internet sitesi, sosyal medya mecraları,
                mobil uygulamalar ve benzeri vasıtalarla sözlü, yazılı ya da
                elektronik olarak toplanmaktadır/toplanabilecektir.
              </p>
              <p className="mb-4">
                K.V.K. Kanunu Madde 5.2 ve Madde 6.3 kapsamında kanuni
                yükümlülüklerimizi yerine getirmek, bir sözleşmenin kurulması
                veya ifası, hukuki yükümlülüklerimizi yerine getirmek, bir
                hakkın tesisi, kullanılması veya korunması ve temel hak ve
                özgürlüklerinize zarar vermeksizin, meşru menfaatlerimizin
                korunması amacıyla ve alenileştirdiğiniz kişisel veriler
                bakımından açık rızanız olmaksızın işlenebilmektedir. Yine
                Kişisel verileriniz, işbu Aydınlatma Metni’nde belirtilen
                amaçlar dahilinde K.V.K.Kanunu Madde 5.1 ve Madde 6.2 kapsamında
                açık rızanızın alınması şartı ile de işlenebilmektedir. Kendal
                b2b üyelik/Bayilik programı başta olmak üzere sair
                üyelik/sadakat programımız/programlarımız ve üyeliklere dahil
                olmaksızın da tüm ürünlerimizi temin edebilmektesiniz. Buna
                mukabil Kendal b2b üyelik/Sadakat programı ve diğer sadakat
                programlarımız ve üyeliklerimiz, üyelerine özel avantajlar
                sunduğundan, program/üyelik avantajlardan yararlanabilmek adına
                programlara dahil olmanız/üyelik yaptırmanız ile birlikte
                Kişisel Verilerinizin istisnai haller dışında da işlenmesine
                açık rıza vermektesiniz.
              </p>
              <p className="mb-6">
                Toplanan kişisel verileriniz, Şirketimiz tarafından sunulan ürün
                ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların
                iş birimlerimiz tarafından yapılması, Şirketimiz tarafından
                sunulan ürün ve hizmetlerin sizlerin beğeni, kullanım
                alışkanlıkları ve ihtiyaçlarına göre özelleştirilerek sizlere
                önerilmesi, Şirketimizin ve Şirketimizle iş ilişkisi içerisinde
                olan kişilerin hukuki ve ticari güvenliğinin temini (Şirketimiz
                tarafından yürütülen iletişime yönelik idari operasyonlar,
                Şirkete ait lokasyonların fiziksel güvenliğini ve denetimini
                sağlamak, iş ortağı/müşteri/tedarikçi (yetkili veya çalışanları)
                değerlendirme süreçleri, hukuki uyum süreci, mali işler v.b.),
                Şirketimizin ticari ve iş stratejilerinin belirlenmesi ve
                uygulanması ve Şirketimizin insan kaynakları politikalarının
                yürütülmesinin temini amaçlarıyla KVK Kanunu’nun 5. ve 6.
                maddelerinde belirtilen kişisel veri işleme şartları ile
                amaçları dahilinde ve yürürlükteki sair yasal mevzuata uygun
                işlenmektedir/işlenecektir.
              </p>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                İşlenen Kişisel Verilerin Yurtiçi ve/veya Yurtdışında Kimlere ve
                Hangi Amaçla Aktarılabileceği
              </h3>
              <p className="mb-4">
                Toplanan Kişisel verileriniz; Şirketimiz tarafından sunulan ürün
                ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların
                iş birimlerimiz tarafından yapılması, Şirketimiz tarafından
                sunulan ürün ve hizmetlerin sizlerin beğeni, kullanım
                alışkanlıkları ve ihtiyaçlarına göre özelleştirilerek sizlere
                önerilmesi, Şirketimizin ve Şirketimizle iş ilişkisi içerisinde
                olan kişilerin hukuki ve ticari güvenliğinin temini (Şirketimiz
                tarafından yürütülen iletişime yönelik idari operasyonlar,
                Şirkete ait lokasyonların fiziksel güvenliğini ve denetimini
                sağlamak, iş ortağı/müşteri/tedarikçi (yetkili veya çalışanları)
                değerlendirme süreçleri, hukuki uyum süreci, mali işler v.b.),
                Şirketimizin ticari ve iş stratejilerinin belirlenmesi ve
                uygulanması ile Şirketimizin insan kaynakları politikalarının
                yürütülmesinin temini amaçlarıyla,
              </p>
              <p className="mb-4">
                Yasal olarak aktarılması gereken idari ve resmi makamlara,
                mevzuatın gerektirmesi ve hukuki yükümlülüğün yerine getirilmesi
                için ilgili kişi ve kurumlara, hukuki zorunluluklar nedeniyle ve
                yasal sınırlamalar çerçevesinde bağımsız denetim şirketlerine,
                vergi danışmanlarına ve diğer harici profesyonel danışmanlara,
                avukatlara, sigorta şirketlerine, ortaklarına, hizmet alınan
                veya alınacak olan yurt içi – yurt dışı üçüncü taraflara,
                hissedarlarımıza, iş ortaklarımıza, tedarikçilerimize, kanunen
                yetkili kamu kurumları ve özel kişilere, gerek KVK Kanunu’nun 8.
                ve 9. maddelerinde belirtilen kişisel veri işleme şartları ve
                amaçları çerçevesinde ve gerekse de sair yasal mevzuat
                kapsamında aktarılmaktadır/aktarılabilecektir.
              </p>
              <p className="mb-6">
                Toplanan Kişisel verileriniz; KVK Kurulu tarafından yeterli
                korumaya sahip olduğu ilan edilen yabancı ülkelere (“Yeterli
                Korumaya Sahip Yabancı Ülke”) veya yeterli korumanın bulunmaması
                durumunda Türkiye’deki ve ilgili yabancı ülkedeki veri
                sorumlularının yeterli bir korumayı yazılı olarak taahhüt ettiği
                ve KVK Kurulu’nun izninin bulunduğu yabancı ülkelere (“Yeterli
                Korumayı Taahhüt Eden Veri Sorumlusunun Bulunduğu Yabancı Ülke”)
                aktarılmaktadır/aktarılabilecektir. Şirketimiz bu doğrultuda KVK
                Kanunu’nun 9. maddesinde öngörülen düzenlemelere ve sair yasal
                mevzuata uygun hareket etmektedir/edecektir.
              </p>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Kişisel Veri Toplamanın Yöntemi Ve Hukuki Sebebi
              </h3>
              <p className="mb-6">
                Kişisel verileriniz, denetim ve danışmanlık hizmetlerimiz,
                Şirketimiz çalışanlarına yapılan yazılı/dijital başvurular,
                internet sitemiz, telefon numaralarımızın aranması, sosyal
                medya, SMS kanalları, ve sair sözlü, yazılı veya elektronik
                ortamda, otomatik ya da otomatik olmayan yöntemlerle ve
                Şirketimiz’in sizler ile iletişime geçtiği veya ileride
                iletişime geçebileceği sair kanallar vasıtasıyla temin edilerek
                faaliyetlerimizi yürütmek, sizlerle aramızdaki sözleşmesel ve
                kanuni yükümlülüklerimizi yerine getirmek amaçlarıyla elde
                edilmekte ve elde edilen kişisel veriler ilgili Mevzuatlar
                uyarınca yasal süreler içerisinde saklanmaktadır.
              </p>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Kişisel Veri Sahibinin KVK Kanunu’nun 11. Maddesinde Sayılan
                Hakları
              </h3>
              <p className="mb-4">
                Kişisel veri sahipleri olarak, haklarınıza ilişkin
                taleplerinizi, işbu Aydınlatma Metni’nde aşağıda düzenlenen
                yöntemlerle Şirketimize iletmeniz durumunda Şirketimiz talebin
                niteliğine göre talebi en geç otuz gün içinde ücretsiz olarak
                sonuçlandıracaktır. Ancak, Kişisel Verileri Koruma Kurulunca bir
                ücret öngörülmesi halinde, Şirketimiz tarafından belirlenen
                tarifedeki ücret alınacaktır. Bu kapsamda kişisel veri
                sahipleri, K.V.K. Kanunu Madde 11 uyarınca;
              </p>
              <p className="mb-4">
                Kişisel Verilerinin işlenip işlenmediğini öğrenme, işlenmişse
                buna ilişkin bilgi talep etme, Kişisel Verilerinin işlenme
                amacını ve bunların amacına uygun kullanılıp kullanılmadığını
                öğrenme, yurt içinde veya yurt dışında kişisel verilerinin
                aktarıldığı üçüncü kişileri bilme, kişisel verilerinin eksik
                veya yanlış işlenmiş olması halinde bunların düzeltilmesini
                isteme, amaç, süre ve meşruiyet prensipleri dahilinde
                değerlendirilmek üzere kişisel verilerinin işlenmesini
                gerektiren sebeplerin ortadan kalkması halinde silinmesini veya
                yok edilmesini isteme, Kişisel Verilerinin düzeltilmesi,
                silinmesi ya da yok edilmesi halinde bu işlemlerin kişisel
                verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,
                işlenen kişisel verilerinin münhasıran otomatik sistemler
                vasıtasıyla analiz edilmesi durumunda aleyhlerine bir sonucun
                ortaya çıkması halinde bu sonuca itiraz etme, Kişisel
                Verilerinin kanuna aykırı olarak işlenmesi ve bu sebeple zarara
                uğramaları halinde zararın giderilmesini talep etme haklarına
                sahiptirler.
              </p>
              <p className="mb-4">
                KVK Kanunu’nun 13. maddesinin 1. fıkrası gereğince, yukarıda
                belirtilen haklarınızı kullanmak ile ilgili talebinizi, yazılı
                veya Kişisel Verileri Koruma Kurulu’nun belirlediği diğer
                yöntemlerle Şirketimize iletebilirsiniz. Kişisel Verileri Koruma
                Kurulu, şu aşamada herhangi bir yöntem belirlemediği için,
                başvurunuzu, KVK Kanunu gereğince, yazılı olarak Şirketimize
                iletmeniz gerekmektedir. Bu çerçevede Şirketimize KVK Kanunu’nun
                11. maddesi kapsamında yapacağınız başvurularda yazılı olarak
                başvurunuzu ileteceğiniz kanallar ve usuller aşağıda
                açıklanmaktadır:
              </p>
              <p className="mb-4">
                Yukarıda belirtilen haklarınızı kullanmak için kimliğinizi
                tespit edici gerekli bilgiler ile KVK Kanunu’nun 11. maddesinde
                belirtilen haklardan kullanmayı talep ettiğiniz hakkınıza
                yönelik açıklamalarınızı içeren talebinizi;
                www.kendalelektrik.com adresindeki formu doldurarak, formun
                imzalı bir nüshasını Şahkulu Mahallesi Büyükhendek cad. No 28
                Beyoğlu/İstanbul /İstanbul adresine kimliğinizi tespit edici
                belgeler ile bizzat elden iletebilir, noter kanalıyla veya KVK
                Kanunu’nda belirtilen diğer yöntemler ile gönderebilir veya
                ilgili formu info@kendalelektrik.com.tr adresine
                iletebilirsiniz.
              </p>
              <p className="mb-8">
                Kişisel verilerinizin açık rıza ile işlendiği hallerde söz
                konusu açık rızanızı geri almanız durumunda söz konusu açık
                rızaya dayalı işlemenin gerekli olduğu üyelik/sadakat
                programından çıkarılacağınızı ve söz konusu işlemeler sayesinde
                yararlandığınız avantajlardan ilgili tarih itibariyle
                yararlandırılamayacağınızı önemle belirtmek isteriz.
              </p>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert prose-red max-w-none text-justify">
            <h1 className="text-3xl md:text-5xl font-bold mb-10 text-center text-[var(--brand-red)]">
              KVKK Illumination Text
            </h1>

            <div className="text-gray-300 leading-relaxed">
              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">
                1. INTRODUCTION
              </h2>
              <p className="mb-4">
                The security and/or protection of your personal data is among
                our priorities as Kendal Elektrik Aydınlatma Elektronik İnşaat
                Sanayi ve Dış Ticaret A.Ş ("Company/Our Company"). With this
                awareness, as a Company, we attach great importance to the
                processing and preservation of all kinds of personal data
                belonging to all individuals associated with the Company,
                including those who benefit from our products and services, in
                accordance with the Personal Data Protection Law No. 6698 ("KVKK
                Law"). In this direction, in the capacity of "Data Controller"
                as defined in the KVKK Law and in accordance with the Communiqué
                on the Procedures and Principles to be Followed in Fulfilling
                the Obligation to Inform ("Communiqué") published in the
                Official Gazette dated MARCH 10, 2018 and numbered 30356 by the
                Personal Data Protection Board with Article 10 of the KVKK Law,
                in order to fulfill the duty of informing the personal data
                owners during the acquisition of personal data; We present this
                information regarding the identity of our Company, the purpose
                for which personal data will be processed, to whom and for what
                purpose the processed personal data can be transferred, the
                method and legal reason for collecting personal data, and the
                rights of the personal data owner within the scope of Article 11
                of the KVKK Law.
              </p>
              <p className="mb-8">
                Expressions such as "we" and "our" in this Illumination Text are
                used to express Kendal Elektrik Aydınlatma Elektronik İnşaat
                Sanayi ve Dış Ticaret A.Ş, unless explicitly stated otherwise.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">
                2. PERSONAL DATA
              </h2>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Definition of Personal Data
              </h3>
              <p className="mb-4">
                Within the framework of KVKK Law Art.3/I(d), "personal data"
                refers to any information relating to an identified or
                identifiable natural person. In this context, personal data;
                expresses any information regarding an identified or
                identifiable natural person. For example; your name, surname, TR
                identity number, address, phone number, e-mail address, date of
                birth, IP number you accessed, information about the
                transactions you have made, etc. are your personal data. In
                addition, according to the KVKK Law; data regarding individuals'
                race, ethnic origin, political opinion, philosophical belief,
                religion, sect or other beliefs, appearance and dress,
                association, foundation, union, etc. memberships, health, sexual
                life, criminal conviction and security measures, and biometric
                and genetic data, etc. are special categories of personal data.
                In this context, anonymous information, anonymized information
                and other data that cannot be associated with a specific person
                are not considered personal data in accordance with our
                Company's Policy on this matter.
              </p>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Concept of Processing Personal Data
              </h3>
              <p className="mb-8">
                Within the framework of KVKK Law Art.3/I(e), processing of
                personal data refers to any operation performed upon personal
                data such as obtaining, recording, storing, preserving,
                altering, re-arranging, disclosing, transferring, taking over,
                making retrievable, classifying or preventing its use by fully
                or partially automatic means or non-automatic means provided
                that they form part of any data recording system.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">
                3. SCOPE OF ILLUMINATION
              </h2>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Identity of Data Controller
              </h3>
              <p className="mb-4">
                Since "Data Controller" according to the KVKK Law refers to the
                natural or legal person who determines the purposes and means of
                processing personal data and is responsible for the
                establishment and management of the data recording system, the
                Corporate Identity Information of Kendal Elektrik Aydınlatma
                Elektronik İnşaat Sanayi ve Dış Ticaret A.Ş, which is the
                Addressee "Data Controller" in accordance with the KVKK Law, is
                as follows:
              </p>
              <ul className="list-none space-y-2 mb-6">
                <li>
                  <strong>Trade Registry No:</strong> 453321, Istanbul
                </li>
                <li>
                  <strong>Mersis No:</strong> 05440605937900001
                </li>
                <li>
                  <strong>Tax Office:</strong> Beyoğlu Tax Office
                </li>
                <li>
                  <strong>Tax Number:</strong> 5440659379
                </li>
                <li>
                  <strong>Headquarters Address:</strong> Şahkulu Mahallesi
                  Büyükhendek cad. No 28 Beyoğlu/Istanbul
                </li>
                <li>
                  <strong>Phone:</strong> +90 212 251 77 90
                </li>
                <li>
                  <strong>Fax:</strong> +90 212 243 18 96
                </li>
                <li>
                  <strong>Website:</strong> www.kendalelektrik.com
                </li>
                <li>
                  <strong>Email Address:</strong> info@kendalelektrik.com.tr
                </li>
              </ul>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Collection, Processing and Purposes of Processing Personal Data
              </h3>
              <p className="mb-4">
                Your Personal Data may vary depending on the service, product or
                commercial activity provided by our Company; and is/can be
                collected automatically or non-automatically, verbally, in
                writing or electronically through offices, branches, dealers,
                call centers, website, social media channels, mobile
                applications and similar means.
              </p>
              <p className="mb-4">
                It can be processed within the scope of KVKK Law Article 5.2 and
                Article 6.3 to fulfill our legal obligations, for the
                establishment or performance of a contract, to fulfill our legal
                obligations, for the establishment, use or protection of a
                right, and for the protection of our legitimate interests
                without harming your fundamental rights and freedoms, and
                without your explicit consent for personal data you have made
                public. Again, your Personal data can also be processed for the
                purposes specified in this Illumination Text, on the condition
                that your explicit consent is obtained within the scope of KVKK
                Law Article 5.1 and Article 6.2. You can procure all our
                products without being included in any membership/loyalty
                program/programs, especially the Kendal b2b
                membership/Dealership program. On the other hand, since the
                Kendal b2b membership/Loyalty program and our other loyalty
                programs and memberships offer special advantages to their
                members, by joining the programs/becoming a member in order to
                benefit from program/membership advantages, you give your
                explicit consent to the processing of your Personal Data except
                for exceptional cases.
              </p>
              <p className="mb-6">
                Your collected personal data is/will be processed by our
                business units to carry out the necessary works to benefit you
                from the products and services offered by our Company, to
                customize the products and services offered by our Company
                according to your tastes, usage habits and needs and recommend
                them to you, to ensure the legal and commercial security of our
                Company and those who have a business relationship with our
                Company (administrative operations for communication carried out
                by our Company, ensuring the physical security and audit of
                locations belonging to the Company, business
                partner/customer/supplier (authorized or employees) evaluation
                processes, legal compliance process, financial affairs, etc.),
                to determine and implement our Company's commercial and business
                strategies, and to ensure the execution of our Company's human
                resources policies, within the personal data processing
                conditions and purposes specified in Articles 5 and 6 of the
                KVKK Law and in accordance with other applicable legal
                legislation.
              </p>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                To Whom and For What Purpose Processed Personal Data Can Be
                Transferred
              </h3>
              <p className="mb-4">
                Your collected Personal data; by our business units to carry out
                the necessary works to benefit you from the products and
                services offered by our Company, to customize the products and
                services offered by our Company according to your tastes, usage
                habits and needs and recommend them to you, to ensure the legal
                and commercial security of our Company and those who have a
                business relationship with our Company (administrative
                operations for communication carried out by our Company,
                ensuring the physical security and audit of locations belonging
                to the Company, business partner/customer/supplier (authorized
                or employees) evaluation processes, legal compliance process,
                financial affairs, etc.), to determine and implement our
                Company's commercial and business strategies, and to ensure the
                execution of our Company's human resources policies,
              </p>
              <p className="mb-4">
                Is/can be transferred to administrative and official authorities
                that legally need to be transferred, to relevant persons and
                institutions as required by legislation and to fulfill legal
                obligations, to independent audit companies within the framework
                of legal obligations and legal limitations, tax advisors and
                other external professional advisors, lawyers, insurance
                companies, partners, domestic - foreign third parties from whom
                services are received or will be received, our shareholders,
                business partners, suppliers, legally authorized public
                institutions and private persons, both within the framework of
                the personal data processing conditions and purposes specified
                in Articles 8 and 9 of the KVKK Law and within the scope of
                other legal legislation.
              </p>
              <p className="mb-6">
                Your collected Personal data; is/can be transferred to foreign
                countries declared by the KVKK Board to have adequate protection
                ("Foreign Country with Adequate Protection") or, in the absence
                of adequate protection, to foreign countries where the data
                controllers in Turkey and the relevant foreign country undertake
                an adequate protection in writing and the permission of the KVKK
                Board is available ("Foreign Country Where Data Controller
                Undertaking Adequate Protection is Located"). Our Company
                acts/will act in accordance with the regulations stipulated in
                Article 9 of the KVKK Law and other legal legislation in this
                direction.
              </p>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Method and Legal Reason for Collecting Personal Data
              </h3>
              <p className="mb-6">
                Your personal data is obtained to carry out our activities and
                fulfill our contractual and legal obligations with you by being
                provided through our audit and consultancy services,
                written/digital applications made to our Company employees, our
                website, calling our phone numbers, social media, SMS channels,
                and other verbal, written or electronic media, through automatic
                or non-automatic methods, and other channels through which our
                Company contacts or may contact you in the future, and the
                obtained personal data is stored within the legal periods in
                accordance with the relevant Legislations.
              </p>

              <h3 className="text-xl font-medium text-white/90 mb-3 mt-6">
                Rights of Personal Data Owner Counted in Article 11 of KVKK Law
              </h3>
              <p className="mb-4">
                As personal data owners, if you submit your requests regarding
                your rights to our Company using the methods set out below in
                this Illumination Text, our Company will conclude the request
                free of charge within thirty days at the latest depending on the
                nature of the request. However, if a fee is stipulated by the
                Personal Data Protection Board, the fee in the tariff determined
                by our Company will be charged. In this context, personal data
                owners, pursuant to Article 11 of KVKK Law;
              </p>
              <p className="mb-4">
                Have the right to learn whether Personal Data is processed, to
                request information if it has been processed, to learn the
                purpose of processing Personal Data and whether they are used
                appropriately for their purpose, to know the third parties to
                whom personal data is transferred domestically or abroad, to
                request correction of personal data if it is incomplete or
                incorrectly processed, to request the deletion or destruction of
                personal data in the event that the reasons requiring its
                processing disappear to be evaluated within the principles of
                purpose, duration and legitimacy, to request that these
                operations be notified to third parties to whom personal data
                has been transferred in the event that Personal Data is
                corrected, deleted or destroyed, to object to a result to their
                detriment in the event that the processed personal data is
                analyzed exclusively through automated systems, to request
                compensation for the damage in the event that their Personal
                Data is processed unlawfully and they suffer damage as a result.
              </p>
              <p className="mb-4">
                Pursuant to paragraph 1 of Article 13 of the KVKK Law, you can
                submit your request to use your above-mentioned rights to our
                Company in writing or by other methods determined by the
                Personal Data Protection Board. Since the Personal Data
                Protection Board has not determined any method at this stage,
                you must submit your application to our Company in writing in
                accordance with the KVKK Law. Within this framework, the
                channels and procedures through which you will submit your
                application in writing in the applications you will make to our
                Company within the scope of Article 11 of the KVKK Law are
                explained below:
              </p>
              <p className="mb-4">
                To use your above-mentioned rights, you can personally deliver
                your request containing the necessary information identifying
                your identity and your explanations regarding your right that
                you request to use among the rights specified in Article 11 of
                the KVKK Law; by filling out the form at
                www.kendalelektrik.com, hand-delivering a signed copy of the
                form along with identifying documents to Şahkulu Mahallesi
                Büyükhendek cad. No 28 Beyoğlu/Istanbul address, sending it via
                a notary public or other methods specified in the KVKK Law, or
                you can send the relevant form to info@kendalelektrik.com.tr.
              </p>
              <p className="mb-8">
                We would like to emphasize that in cases where your personal
                data is processed with explicit consent, if you withdraw your
                explicit consent, you will be removed from the
                membership/loyalty program for which processing based on
                explicit consent is necessary, and you will not be able to
                benefit from the advantages you benefited from through these
                processings as of the relevant date.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
