import type { Language } from '@/lib/i18n/LanguageProvider';

export type PrivacyBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p-email'; before: string; email: string; after: string };

export interface PrivacySection {
  heading: string;
  blocks: PrivacyBlock[];
}

export interface PrivacyIntro {
  p1: string;
  before: string;
  mid: string;
  after: string;
}

export interface PrivacyPageContent {
  pageTitle: string;
  intro: PrivacyIntro;
  sections: PrivacySection[];
}

const EMAIL = 'info@kendalelektrik.com.tr';

export const PRIVACY_CONTENT: Record<Language, PrivacyPageContent> = {
  tr: {
    pageTitle: 'Gizlilik ve Çerez Politikası',
    intro: {
      p1: 'Kendal Elektrik Aydınlatma Elektronik İnş. San. Dış. Tic. A.Ş.’de (“Şirket”, “biz” ya da “bizim”), ziyaretçilerimizin gizlilik haklarının korunmasına büyük önem veriyor ve saygı gösteriyoruz. Bu doğrultuda işbu Gizlilik ve Çerez Politikasını oluşturduk.',
      before:
        'www.kendalelektrik.com internet sitesini (“Site”) ziyaret ettiğinizde toplanan bilgilerin neler olduğu, bu bilgileri neden ve hangi amaçlarla kullandığımız, hangi koşullar altında bilgileri resmi mercilerle paylaşmak zorunda kalabileceğimiz hususlarında tarafınızı aydınlatmak amacındayız. Herhangi bir sorunuz olursa lütfen ',
      mid: ' adresinden Müşteri Hizmetleri Ekibine e-posta göndermek ya da 0212 251 77 90 numaralı telefondan aramak suretiyle bize ulaşınız.',
      after: '',
    },
    sections: [
      {
        heading: '1. Sitemizde Hangi Bilgileri Topluyoruz?',
        blocks: [
          { type: 'h3', text: 'Trafik Verileri ve Log Kayıtları' },
          {
            type: 'p',
            text: 'Sitemizi ziyaret ettiğinizde yasal güvenlik yükümlülüklerimiz (örn. 5651 Sayılı Kanun) çerçevesinde şu bilgileri sunucu taraflı olarak otomatik kayıt altına almaktayız: (i) IP adresiniz; (ii) siteye giriş tarih ve saatiniz; ve (iii) kullanmakta olduğunuz tarayıcının ve cihazın genel türü (toplu halde “Trafik Verileri”).',
          },
          { type: 'h3', text: 'Kişisel İletişim Bilgileri' },
          {
            type: 'p',
            text: 'Sitemiz tamamen dijital kurumsal bir katalog ve tanıtım arayüzü olarak hizmet vermektedir. Sitemiz üzerinde doğrudan satış, kredi kartı ile ödeme alma, sepet işlemleri veya üye kaydı ("Hesabım" paneli) modülleri bulunmamaktadır. Dolayısıyla sitemizi ziyaretiniz sırasında sizden doğrudan bir bilgi girişi talep edilmemektedir. Ancak, sitemizde yer alan telefon numaralarımızdan bizi aramanız veya e-posta adreslerimize mesaj göndermeniz halinde, kendi rızanızla bizimle paylaştığınız ad, soyad, iletişim bilgileri ve mesaj içerikleriniz ("Kişisel Bilgiler") ilgili talebinize dönüş yapabilmek amacıyla kayıt altına alınabilir.',
          },
        ],
      },
      {
        heading: '2. Edindiğimiz Bilgileri Nasıl Kullanıyoruz?',
        blocks: [
          {
            type: 'p',
            text: 'Tarafımızla paylaştığınız Kişisel Bilgileri yalnızca taleplerinize cevap verme, sorularınızı yanıtlama, ürünlerimiz hakkında sizi bilgilendirme ve kurumsal iletişimi sağlama amaçları doğrultusunda kullanıyoruz. Otomatik toplanan Trafik Verileri (IP, Log kayıtları) ise sitemizin güvenliğini sağlamak, istatistiksel ve anonim kitle analizleri yapmak (hangi sayfaların daha çok ziyaret edildiği vb.) ve kanuni yükümlülüklerimizi yerine getirmek için kullanılır. Bilgileriniz, açık rızanız veya yasal bir zorunluluk (örn. Mahkeme kararı) olmadığı sürece hiçbir üçüncü şahıs veya kurumla paylaşılmaz.',
          },
        ],
      },
      {
        heading: '3. Tanımlama Bilgilerini (Çerezleri) Nasıl Kullanıyoruz?',
        blocks: [
          {
            type: 'p',
            text: '“Çerez (Cookie)”, sitemizi ziyaret ettiğinizde bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler, web sitemizin düzgün çalışması, tercihinizin hatırlanması (örneğin çerez onay durumu, dil tercihi) ve kullanıcı deneyiminin geliştirilmesi için kullanılır.',
          },
          {
            type: 'p',
            text: 'Sitemizde, yalnızca zorunlu çerezler (sitenin teknik işlevselliği için, örn: `kendal-cookie-consent`) ve anonim istatistik toplayan analitik çerezler kullanılmaktadır. Hiçbir çerez türü üzerinden adınız, adresiniz veya benzer kişisel verileriniz toplanmamaktadır. Güncel web tarayıcılarının (Chrome, Safari, Firefox, Edge vb.) çoğu çerezleri otomatik kabul eder, ancak tarayıcı ayarlarınızdan çerezleri tamamen reddedebilir veya kısıtlayabilirsiniz. Çerezleri reddetseniz dahi sitemizi sorunsuz biçimde kullanmaya devam edebilirsiniz.',
          },
        ],
      },
      {
        heading: '4. Gizliliğinizin Sınırları ve Diğer Siteler',
        blocks: [
          {
            type: 'p',
            text: "Sitemiz, zaman zaman iş ortaklarımızın veya sosyal medya platformlarının bağlantılarını (linklerini) içerebilir. Sitemizden ayrılıp üçüncü taraf bağlantılarına tıkladığınızda, Kendal Elektrik'in değil, söz konusu harici sitelerin kendi gizlilik politikalarına tabi olacağınızı hatırlatmak isteriz. Diğer internet sitelerinin veri toplama ve gizlilik uygulamalarından tarafımızca bir sorumluluk kabul edilmemektedir.",
          },
        ],
      },
      {
        heading: '5. Bilgi Güvenliğiniz',
        blocks: [
          {
            type: 'p',
            text: 'Kendal Elektrik, sistemlerinde yer alan bilgi ve verilerinizin korunması için sektör standartlarında güvenlik önlemleri almaktadır. Sitemiz SSL (Secure Socket Layer) teknolojisi ile şifrelenmiş olup, tarayıcınız ile sunucumuz arasındaki bağlantıların gizliliği güvence altına alınmıştır. Sitemiz üzerinden hiçbir ödeme veya finansal veri alışverişi yapılmadığından, bu kapsamda doğabilecek ekstra riskler siteniz için geçerli değildir.',
          },
        ],
      },
      {
        heading:
          '6. Bilgilerinizin Kullanılmasının Sınırlandırılması ve Düzeltmeler',
        blocks: [
          {
            type: 'p-email',
            before:
              'Bize e-posta üzerinden ilettiğiniz bilgilerin silinmesini, güncellenmesini veya düzeltilmesini talep etme hakkınız bulunmaktadır. Kişisel verilerinizin değiştirilmesi veya tamamen silinmesi yönündeki taleplerinizi ',
            email: EMAIL,
            after:
              ' adresine iletebilirsiniz. Talepleriniz KVKK yükümlülükleri kapsamında en kısa sürede işleme alınacaktır.',
          },
        ],
      },
      {
        heading: '7. Onayınız ve Politikadaki Değişiklikler',
        blocks: [
          {
            type: 'p',
            text: 'Sitemizi kullanarak, işbu Gizlilik ve Çerez Politikası hükümlerine rıza göstermiş sayılırsınız. Şirketimiz, yasal mevzuata veya iş süreçlerimize uyum amacıyla politikada değişiklik yapma hakkını saklı tutar. Değişiklikler sitemizde yayınlandığı andan itibaren geçerli sayılacaktır.',
          },
        ],
      },
      {
        heading: '8. Yasalarca Öngörülen İfşa Koşulları',
        blocks: [
          {
            type: 'p',
            text: 'Kendal Elektrik; yasalarca açıkça gerekli görüldüğünde, iyi niyetli olarak söz konusu ifşanın mahkeme veya resmi mercilerin yasal emirlerine riayet etmek için zorunlu olduğuna inandığında veya sitemizin güvenliğine, Şirketin hak ve mülkiyetine yönelik yetkisiz saldırıları önlemek amacıyla elindeki dijital iz (Log, IP) kayıtlarını ilgili adli birimlerle paylaşma hakkını (ve yükümlülüğünü) saklı tutar.',
          },
        ],
      },
    ],
  },
  en: {
    pageTitle: 'Privacy and Cookie Policy',
    intro: {
      p1: 'At Kendal Elektrik Aydınlatma Elektronik İnş. San. Dış. Tic. A.Ş. ("Company", "we", or "our"), we place great importance on protecting the privacy rights of our visitors. Accordingly, we have prepared this Privacy and Cookie Policy.',
      before:
        'Our aim is to inform you about what information is collected when you visit the www.kendalelektrik.com website ("Site"), how and for what purposes we use this information, and under what conditions we might have to share it with official authorities. If you have any questions, please contact our Customer Service Team by emailing ',
      mid: ' or by calling +90 212 251 77 90.',
      after: '',
    },
    sections: [
      {
        heading: '1. What Information Do We Collect?',
        blocks: [
          { type: 'h3', text: 'Traffic Data and Log Records' },
          {
            type: 'p',
            text: 'When you visit our site, as part of our legal security obligations (e.g., Law No. 5651), we automatically record the following information on our servers: (i) your IP address; (ii) the date and time of your visit; and (iii) the general type of browser and device you are using (collectively "Traffic Data").',
          },
          { type: 'h3', text: 'Personal Contact Information' },
          {
            type: 'p',
            text: 'Our site operates entirely as a digital corporate catalog and promotional interface. There are no direct sales, credit card payment modules, cart processes, or user registration ("My Account" panels) on our site. Therefore, you are not asked for direct data entry during your visit. However, if you contact us by calling our phone numbers or emailing us, the name, contact information, and message content ("Personal Information") you voluntarily share with us may be recorded to respond to your request.',
          },
        ],
      },
      {
        heading: '2. How Do We Use the Information We Collect?',
        blocks: [
          {
            type: 'p',
            text: 'The Personal Information you share with us is used solely to respond to your requests, answer your questions, provide information about our products, and maintain corporate communication. The automatically collected Traffic Data (IP, Log records) is used to ensure the security of our site, conduct statistical and anonymous audience analysis, and fulfill our legal obligations. Your information is never shared with third parties or organizations unless you have given explicit consent or there is a legal obligation (e.g., court order).',
          },
        ],
      },
      {
        heading: '3. How Do We Use Cookies?',
        blocks: [
          {
            type: 'p',
            text: '"Cookies" are small text files saved on your computer or mobile device when you visit our site. Cookies are used for the proper functioning of our website, remembering your preferences (e.g., cookie consent, language choice), and improving the user experience.',
          },
          {
            type: 'p',
            text: 'Our site uses only essential cookies (for technical functionality, e.g., `kendal-cookie-consent`) and analytical cookies that collect anonymous statistics. No personal data such as your name, address, or similar identifying information is collected via cookies. Most modern web browsers (Chrome, Safari, Firefox, Edge, etc.) accept cookies automatically, but you can completely refuse or restrict cookies from your browser settings. Even if you refuse cookies, you can continue to use our site without any problems.',
          },
        ],
      },
      {
        heading: '4. Limits of Privacy and External Links',
        blocks: [
          {
            type: 'p',
            text: 'Our site may occasionally contain links to our business partners or social media platforms. We would like to remind you that when you leave our site and click on third-party links, you are subject to the privacy policies of those external sites, not Kendal Elektrik. We accept no responsibility for the data collection and privacy practices of other websites.',
          },
        ],
      },
      {
        heading: '5. Your Information Security',
        blocks: [
          {
            type: 'p',
            text: 'Kendal Elektrik takes industry-standard security measures to protect the information and data on its systems. Our site is encrypted with SSL (Secure Socket Layer) technology, ensuring the confidentiality of the connection between your browser and our servers. Since no payment or financial data exchange takes place on our site, any related extra risks are not applicable.',
          },
        ],
      },
      {
        heading: '6. Restricting and Correcting Your Information',
        blocks: [
          {
            type: 'p-email',
            before:
              'You have the right to request the deletion, update, or correction of the information you have sent us via email. You can forward your requests to change or completely delete your personal data to ',
            email: EMAIL,
            after:
              '. Your requests will be processed as quickly as possible within the scope of our KVKK obligations.',
          },
        ],
      },
      {
        heading: '7. Your Consent and Policy Changes',
        blocks: [
          {
            type: 'p',
            text: 'By using our site, you agree to the provisions of this Privacy and Cookie Policy. Our Company reserves the right to make changes to the policy to comply with legal legislation or our business processes. Changes will be considered effective from the moment they are published on our site.',
          },
        ],
      },
      {
        heading: '8. Legal Disclosure Requirements',
        blocks: [
          {
            type: 'p',
            text: 'Kendal Elektrik reserves (and is obligated to) the right to share digital footprints (Log, IP) with relevant judicial authorities when explicitly required by law, when acting in good faith to comply with legal orders from courts or official authorities, or to prevent unauthorized attacks against the security of our site and the rights and property of the Company.',
          },
        ],
      },
    ],
  },
  ar: {
    pageTitle: 'سياسة الخصوصية وملفات تعريف الارتباط',
    intro: {
      p1: 'في شركة Kendal Elektrik Aydınlatma Elektronik İnş. San. Dış. Tic. A.Ş. ("الشركة" أو "نحن")، نولي أهمية كبيرة لحماية حقوق الخصوصية لزوارنا. وبناءً على ذلك، أعددنا سياسة الخصوصية وملفات تعريف الارتباط هذه.',
      before:
        'نهدف إلى إطلاعكم على المعلومات التي يتم جمعها عند زيارتكم لموقع www.kendalelektrik.com ("الموقع")، ولماذا ولأي أغراض نستخدم هذه المعلومات، وفي ظل أي ظروف قد نضطر لمشاركتها مع الجهات الرسمية. إذا كان لديكم أي استفسار، يرجى التواصل مع فريق خدمة العملاء عبر البريد الإلكتروني ',
      mid: ' أو الاتصال بالرقم +90 212 251 77 90.',
      after: '',
    },
    sections: [
      {
        heading: '1. ما هي المعلومات التي نجمعها على موقعنا؟',
        blocks: [
          { type: 'h3', text: 'بيانات الزيارة وسجلات الدخول' },
          {
            type: 'p',
            text: 'عند زيارتكم لموقعنا، وفي إطار التزاماتنا الأمنية القانونية (مثل القانون رقم 5651)، نقوم تلقائياً بتسجيل المعلومات التالية على خوادمنا: (1) عنوان IP الخاص بكم؛ (2) تاريخ ووقت زيارتكم؛ (3) النوع العام للمتصفح والجهاز الذي تستخدمونه (يُشار إليها مجتمعة بـ "بيانات الزيارة").',
          },
          { type: 'h3', text: 'معلومات الاتصال الشخصية' },
          {
            type: 'p',
            text: 'يعمل موقعنا بالكامل كواجهة كتالوج مؤسسي رقمي وترويجي. لا توجد على موقعنا وحدات بيع مباشر أو دفع ببطاقة الائتمان أو سلة مشتريات أو تسجيل مستخدمين (لوحة "حسابي"). لذلك، لا يُطلب منكم إدخال أي بيانات مباشرة أثناء زيارتكم. ومع ذلك، إذا تواصلتم معنا عبر الاتصال بأرقام هاتفنا أو إرسال بريد إلكتروني إلينا، فقد يتم تسجيل الاسم ومعلومات الاتصال ومحتوى الرسالة ("المعلومات الشخصية") التي تشاركونها معنا طوعاً للرد على طلبكم.',
          },
        ],
      },
      {
        heading: '2. كيف نستخدم المعلومات التي نجمعها؟',
        blocks: [
          {
            type: 'p',
            text: 'تُستخدم المعلومات الشخصية التي تشاركونها معنا حصرياً للرد على طلباتكم، والإجابة على استفساراتكم، وتقديم معلومات حول منتجاتنا، والحفاظ على التواصل المؤسسي. أما بيانات الزيارة التي يتم جمعها تلقائياً (IP، سجلات الدخول) فتُستخدم لضمان أمن موقعنا، وإجراء تحليلات إحصائية مجهولة الهوية للزوار، والوفاء بالتزاماتنا القانونية. لا تتم مشاركة معلوماتكم أبداً مع أطراف ثالثة أو جهات ما لم تمنحوا موافقة صريحة أو يكن هناك التزام قانوني (مثل أمر قضائي).',
          },
        ],
      },
      {
        heading: '3. كيف نستخدم ملفات تعريف الارتباط (الكوكيز)؟',
        blocks: [
          {
            type: 'p',
            text: '"الكوكيز" هي ملفات نصية صغيرة تُحفظ على جهاز الكمبيوتر أو الجهاز المحمول الخاص بكم عند زيارة موقعنا. تُستخدم الكوكيز لضمان التشغيل السليم لموقعنا الإلكتروني، وتذكر تفضيلاتكم (مثل موافقة الكوكيز، واختيار اللغة)، وتحسين تجربة المستخدم.',
          },
          {
            type: 'p',
            text: 'يستخدم موقعنا فقط الكوكيز الضرورية (للوظائف التقنية، مثل `kendal-cookie-consent`) وكوكيز تحليلية تجمع إحصاءات مجهولة الهوية. لا يتم جمع أي بيانات شخصية مثل اسمكم أو عنوانكم أو معلومات تعريفية مشابهة عبر الكوكيز. تقبل معظم متصفحات الويب الحديثة (Chrome وSafari وFirefox وEdge وغيرها) الكوكيز تلقائياً، إلا أنه يمكنكم رفض أو تقييد الكوكيز بالكامل من إعدادات متصفحكم. حتى في حال رفضكم للكوكيز، يمكنكم الاستمرار في استخدام موقعنا دون أي مشاكل.',
          },
        ],
      },
      {
        heading: '4. حدود الخصوصية والمواقع الأخرى',
        blocks: [
          {
            type: 'p',
            text: 'قد يحتوي موقعنا أحياناً على روابط لشركائنا التجاريين أو منصات التواصل الاجتماعي. نود تذكيركم بأنه عند مغادرتكم لموقعنا والنقر على روابط طرف ثالث، فإنكم تخضعون لسياسات الخصوصية الخاصة بتلك المواقع الخارجية، وليس لسياسة Kendal Elektrik. لا نتحمل أي مسؤولية عن ممارسات جمع البيانات والخصوصية الخاصة بالمواقع الأخرى.',
          },
        ],
      },
      {
        heading: '5. أمن معلوماتكم',
        blocks: [
          {
            type: 'p',
            text: 'تتخذ Kendal Elektrik تدابير أمنية وفق المعايير الصناعية لحماية المعلومات والبيانات الموجودة في أنظمتها. موقعنا مشفّر بتقنية SSL (طبقة المقابس الآمنة)، مما يضمن سرية الاتصال بين متصفحكم وخوادمنا. وبما أنه لا يتم تبادل أي بيانات دفع أو مالية عبر موقعنا، فإن المخاطر الإضافية المرتبطة بذلك لا تنطبق.',
          },
        ],
      },
      {
        heading: '6. تقييد استخدام معلوماتكم والتصحيحات',
        blocks: [
          {
            type: 'p-email',
            before:
              'يحق لكم طلب حذف أو تحديث أو تصحيح المعلومات التي أرسلتموها إلينا عبر البريد الإلكتروني. يمكنكم إرسال طلباتكم لتغيير أو حذف بياناتكم الشخصية بالكامل إلى ',
            email: EMAIL,
            after:
              '. ستتم معالجة طلباتكم في أسرع وقت ممكن في إطار التزاماتنا بموجب قانون KVKK.',
          },
        ],
      },
      {
        heading: '7. موافقتكم والتغييرات في السياسة',
        blocks: [
          {
            type: 'p',
            text: 'باستخدامكم لموقعنا، فإنكم توافقون على أحكام سياسة الخصوصية وملفات تعريف الارتباط هذه. تحتفظ شركتنا بالحق في إجراء تعديلات على السياسة بما يتوافق مع التشريعات القانونية أو عملياتنا التجارية. تُعتبر التعديلات سارية المفعول اعتباراً من لحظة نشرها على موقعنا.',
          },
        ],
      },
      {
        heading: '8. شروط الإفصاح المنصوص عليها قانوناً',
        blocks: [
          {
            type: 'p',
            text: 'تحتفظ Kendal Elektrik بالحق (وتلتزم) بمشاركة البصمات الرقمية (سجلات الدخول، عناوين IP) مع الجهات القضائية المختصة عندما يكون ذلك مطلوباً صراحة بموجب القانون، أو عند التصرف بحسن نية للامتثال لأوامر قانونية صادرة عن المحاكم أو الجهات الرسمية، أو لمنع هجمات غير مصرح بها تستهدف أمن موقعنا وحقوق الشركة وممتلكاتها.',
          },
        ],
      },
    ],
  },
  es: {
    pageTitle: 'Política de Privacidad y Cookies',
    intro: {
      p1: 'En Kendal Elektrik Aydınlatma Elektronik İnş. San. Dış. Tic. A.Ş. ("la Empresa", "nosotros" o "nuestro"), otorgamos gran importancia a la protección de los derechos de privacidad de nuestros visitantes. En consecuencia, hemos preparado esta Política de Privacidad y Cookies.',
      before:
        'Nuestro objetivo es informarle sobre qué información se recopila cuando visita el sitio web www.kendalelektrik.com ("Sitio"), cómo y para qué fines utilizamos esta información, y bajo qué condiciones podríamos tener que compartirla con las autoridades oficiales. Si tiene alguna pregunta, póngase en contacto con nuestro Equipo de Atención al Cliente enviando un correo a ',
      mid: ' o llamando al +90 212 251 77 90.',
      after: '',
    },
    sections: [
      {
        heading: '1. ¿Qué Información Recopilamos?',
        blocks: [
          { type: 'h3', text: 'Datos de Tráfico y Registros de Actividad' },
          {
            type: 'p',
            text: 'Cuando visita nuestro sitio, como parte de nuestras obligaciones legales de seguridad (p. ej., la Ley N.º 5651), registramos automáticamente la siguiente información en nuestros servidores: (i) su dirección IP; (ii) la fecha y hora de su visita; y (iii) el tipo general de navegador y dispositivo que utiliza (denominados conjuntamente "Datos de Tráfico").',
          },
          { type: 'h3', text: 'Información de Contacto Personal' },
          {
            type: 'p',
            text: 'Nuestro sitio funciona íntegramente como un catálogo corporativo digital e interfaz promocional. No existen módulos de venta directa, pago con tarjeta de crédito, procesos de carrito de compra ni registro de usuario (panel "Mi Cuenta") en nuestro sitio. Por lo tanto, no se le solicita ingresar datos directamente durante su visita. Sin embargo, si se pone en contacto con nosotros llamando a nuestros números de teléfono o enviándonos un correo electrónico, el nombre, la información de contacto y el contenido del mensaje ("Información Personal") que comparte voluntariamente con nosotros pueden registrarse para responder a su solicitud.',
          },
        ],
      },
      {
        heading: '2. ¿Cómo Utilizamos la Información que Recopilamos?',
        blocks: [
          {
            type: 'p',
            text: 'La Información Personal que comparte con nosotros se utiliza únicamente para responder a sus solicitudes, contestar sus preguntas, proporcionar información sobre nuestros productos y mantener la comunicación corporativa. Los Datos de Tráfico recopilados automáticamente (IP, registros) se utilizan para garantizar la seguridad de nuestro sitio, realizar análisis estadísticos y anónimos de audiencia, y cumplir con nuestras obligaciones legales. Su información nunca se comparte con terceros u organizaciones a menos que haya dado su consentimiento explícito o exista una obligación legal (p. ej., orden judicial).',
          },
        ],
      },
      {
        heading: '3. ¿Cómo Utilizamos las Cookies?',
        blocks: [
          {
            type: 'p',
            text: 'Las "cookies" son pequeños archivos de texto que se guardan en su ordenador o dispositivo móvil cuando visita nuestro sitio. Las cookies se utilizan para el correcto funcionamiento de nuestro sitio web, para recordar sus preferencias (p. ej., consentimiento de cookies, elección de idioma) y para mejorar la experiencia del usuario.',
          },
          {
            type: 'p',
            text: 'Nuestro sitio utiliza únicamente cookies esenciales (para la funcionalidad técnica, p. ej., `kendal-cookie-consent`) y cookies analíticas que recopilan estadísticas anónimas. No se recopilan datos personales como su nombre, dirección o información identificativa similar a través de las cookies. La mayoría de los navegadores web modernos (Chrome, Safari, Firefox, Edge, etc.) aceptan cookies automáticamente, pero puede rechazar o restringir completamente las cookies desde la configuración de su navegador. Aunque rechace las cookies, puede seguir utilizando nuestro sitio sin ningún problema.',
          },
        ],
      },
      {
        heading: '4. Límites de la Privacidad y Enlaces Externos',
        blocks: [
          {
            type: 'p',
            text: 'Nuestro sitio puede contener ocasionalmente enlaces a nuestros socios comerciales o plataformas de redes sociales. Le recordamos que, al salir de nuestro sitio y hacer clic en enlaces de terceros, quedará sujeto a las políticas de privacidad de esos sitios externos, no a las de Kendal Elektrik. No aceptamos ninguna responsabilidad por las prácticas de recopilación de datos y privacidad de otros sitios web.',
          },
        ],
      },
      {
        heading: '5. Seguridad de su Información',
        blocks: [
          {
            type: 'p',
            text: 'Kendal Elektrik toma medidas de seguridad conforme a los estándares de la industria para proteger la información y los datos en sus sistemas. Nuestro sitio está cifrado con tecnología SSL (Secure Socket Layer), lo que garantiza la confidencialidad de la conexión entre su navegador y nuestros servidores. Dado que no se realiza ningún intercambio de datos de pago o financieros en nuestro sitio, los riesgos adicionales relacionados no son aplicables.',
          },
        ],
      },
      {
        heading: '6. Restricción y Corrección de su Información',
        blocks: [
          {
            type: 'p-email',
            before:
              'Tiene derecho a solicitar la eliminación, actualización o corrección de la información que nos ha enviado por correo electrónico. Puede remitir sus solicitudes para modificar o eliminar completamente sus datos personales a ',
            email: EMAIL,
            after:
              '. Sus solicitudes se procesarán lo antes posible dentro del alcance de nuestras obligaciones conforme a la Ley KVKK.',
          },
        ],
      },
      {
        heading: '7. Su Consentimiento y Cambios en la Política',
        blocks: [
          {
            type: 'p',
            text: 'Al utilizar nuestro sitio, usted acepta las disposiciones de esta Política de Privacidad y Cookies. Nuestra Empresa se reserva el derecho de realizar cambios en la política para cumplir con la legislación vigente o nuestros procesos comerciales. Los cambios se considerarán efectivos desde el momento en que se publiquen en nuestro sitio.',
          },
        ],
      },
      {
        heading: '8. Requisitos Legales de Divulgación',
        blocks: [
          {
            type: 'p',
            text: 'Kendal Elektrik se reserva (y está obligada a) el derecho de compartir huellas digitales (registros, IP) con las autoridades judiciales pertinentes cuando la ley lo exija expresamente, cuando actúe de buena fe para cumplir con órdenes legales de tribunales o autoridades oficiales, o para prevenir ataques no autorizados contra la seguridad de nuestro sitio y los derechos y bienes de la Empresa.',
          },
        ],
      },
    ],
  },
  de: {
    pageTitle: 'Datenschutz- und Cookie-Richtlinie',
    intro: {
      p1: 'Bei Kendal Elektrik Aydınlatma Elektronik İnş. San. Dış. Tic. A.Ş. ("Unternehmen", "wir" oder "unser") legen wir großen Wert auf den Schutz der Privatsphäre unserer Besucher. Dementsprechend haben wir diese Datenschutz- und Cookie-Richtlinie erstellt.',
      before:
        'Unser Ziel ist es, Sie darüber zu informieren, welche Informationen beim Besuch der Website www.kendalelektrik.com ("Website") erfasst werden, wie und zu welchen Zwecken wir diese Informationen verwenden und unter welchen Bedingungen wir sie möglicherweise an offizielle Behörden weitergeben müssen. Bei Fragen kontaktieren Sie bitte unser Kundenserviceteam per E-Mail an ',
      mid: ' oder telefonisch unter +90 212 251 77 90.',
      after: '',
    },
    sections: [
      {
        heading: '1. Welche Informationen Erfassen Wir?',
        blocks: [
          { type: 'h3', text: 'Verkehrsdaten und Protokolldateien' },
          {
            type: 'p',
            text: 'Wenn Sie unsere Website besuchen, erfassen wir im Rahmen unserer gesetzlichen Sicherheitsverpflichtungen (z. B. Gesetz Nr. 5651) automatisch folgende Informationen auf unseren Servern: (i) Ihre IP-Adresse; (ii) Datum und Uhrzeit Ihres Besuchs; und (iii) den allgemeinen Typ des von Ihnen verwendeten Browsers und Geräts (zusammen "Verkehrsdaten").',
          },
          { type: 'h3', text: 'Persönliche Kontaktinformationen' },
          {
            type: 'p',
            text: 'Unsere Website dient ausschließlich als digitaler Unternehmenskatalog und Werbeplattform. Es gibt keine Direktverkaufs-, Kreditkartenzahlungs-, Warenkorb- oder Benutzerregistrierungsmodule ("Mein Konto") auf unserer Website. Daher werden Sie während Ihres Besuchs nicht zur direkten Dateneingabe aufgefordert. Wenn Sie uns jedoch telefonisch oder per E-Mail kontaktieren, können der Name, die Kontaktinformationen und der Nachrichteninhalt ("Persönliche Informationen"), die Sie freiwillig mit uns teilen, zur Bearbeitung Ihrer Anfrage erfasst werden.',
          },
        ],
      },
      {
        heading: '2. Wie Verwenden Wir die Erfassten Informationen?',
        blocks: [
          {
            type: 'p',
            text: 'Die von Ihnen mit uns geteilten Persönlichen Informationen werden ausschließlich zur Beantwortung Ihrer Anfragen, zur Beantwortung Ihrer Fragen, zur Bereitstellung von Informationen über unsere Produkte und zur Aufrechterhaltung der Unternehmenskommunikation verwendet. Die automatisch erfassten Verkehrsdaten (IP, Protokolle) werden verwendet, um die Sicherheit unserer Website zu gewährleisten, statistische und anonyme Zielgruppenanalysen durchzuführen und unseren gesetzlichen Verpflichtungen nachzukommen. Ihre Informationen werden niemals an Dritte oder Organisationen weitergegeben, es sei denn, Sie haben ausdrücklich zugestimmt oder es besteht eine gesetzliche Verpflichtung (z. B. Gerichtsbeschluss).',
          },
        ],
      },
      {
        heading: '3. Wie Verwenden Wir Cookies?',
        blocks: [
          {
            type: 'p',
            text: '"Cookies" sind kleine Textdateien, die beim Besuch unserer Website auf Ihrem Computer oder Mobilgerät gespeichert werden. Cookies dienen der ordnungsgemäßen Funktion unserer Website, dem Speichern Ihrer Präferenzen (z. B. Cookie-Zustimmung, Sprachauswahl) und der Verbesserung der Nutzererfahrung.',
          },
          {
            type: 'p',
            text: 'Unsere Website verwendet nur essenzielle Cookies (für technische Funktionalität, z. B. `kendal-cookie-consent`) und analytische Cookies, die anonyme Statistiken erfassen. Über Cookies werden keine personenbezogenen Daten wie Ihr Name, Ihre Adresse oder ähnliche identifizierende Informationen erfasst. Die meisten modernen Webbrowser (Chrome, Safari, Firefox, Edge usw.) akzeptieren Cookies automatisch, Sie können Cookies jedoch in Ihren Browsereinstellungen vollständig ablehnen oder einschränken. Auch wenn Sie Cookies ablehnen, können Sie unsere Website weiterhin problemlos nutzen.',
          },
        ],
      },
      {
        heading: '4. Grenzen des Datenschutzes und Externe Links',
        blocks: [
          {
            type: 'p',
            text: 'Unsere Website kann gelegentlich Links zu unseren Geschäftspartnern oder Social-Media-Plattformen enthalten. Wir möchten Sie daran erinnern, dass Sie, wenn Sie unsere Website verlassen und auf Links Dritter klicken, den Datenschutzrichtlinien dieser externen Websites unterliegen, nicht denen von Kendal Elektrik. Wir übernehmen keine Verantwortung für die Datenerfassungs- und Datenschutzpraktiken anderer Websites.',
          },
        ],
      },
      {
        heading: '5. Ihre Informationssicherheit',
        blocks: [
          {
            type: 'p',
            text: 'Kendal Elektrik ergreift branchenübliche Sicherheitsmaßnahmen zum Schutz der Informationen und Daten in seinen Systemen. Unsere Website ist mit SSL-Technologie (Secure Socket Layer) verschlüsselt, wodurch die Vertraulichkeit der Verbindung zwischen Ihrem Browser und unseren Servern gewährleistet wird. Da auf unserer Website kein Zahlungs- oder Finanzdatenaustausch stattfindet, sind damit verbundene zusätzliche Risiken nicht relevant.',
          },
        ],
      },
      {
        heading: '6. Einschränkung und Berichtigung Ihrer Informationen',
        blocks: [
          {
            type: 'p-email',
            before:
              'Sie haben das Recht, die Löschung, Aktualisierung oder Berichtigung der uns per E-Mail übermittelten Informationen zu verlangen. Sie können Ihre Anfragen zur Änderung oder vollständigen Löschung Ihrer personenbezogenen Daten senden an ',
            email: EMAIL,
            after:
              '. Ihre Anfragen werden im Rahmen unserer KVKK-Verpflichtungen so schnell wie möglich bearbeitet.',
          },
        ],
      },
      {
        heading: '7. Ihre Zustimmung und Änderungen der Richtlinie',
        blocks: [
          {
            type: 'p',
            text: 'Durch die Nutzung unserer Website stimmen Sie den Bestimmungen dieser Datenschutz- und Cookie-Richtlinie zu. Unser Unternehmen behält sich das Recht vor, Änderungen an der Richtlinie vorzunehmen, um gesetzlichen Vorschriften oder unseren Geschäftsprozessen zu entsprechen. Änderungen gelten ab dem Zeitpunkt ihrer Veröffentlichung auf unserer Website als wirksam.',
          },
        ],
      },
      {
        heading: '8. Gesetzlich Vorgeschriebene Offenlegungspflichten',
        blocks: [
          {
            type: 'p',
            text: 'Kendal Elektrik behält sich das Recht vor (und ist dazu verpflichtet), digitale Spuren (Protokolle, IP) mit den zuständigen Justizbehörden zu teilen, wenn dies gesetzlich ausdrücklich vorgeschrieben ist, wenn nach Treu und Glauben gehandelt wird, um gerichtlichen oder behördlichen Anordnungen nachzukommen, oder um unbefugte Angriffe auf die Sicherheit unserer Website sowie die Rechte und das Eigentum des Unternehmens zu verhindern.',
          },
        ],
      },
    ],
  },
  zh: {
    pageTitle: '隐私与Cookie政策',
    intro: {
      p1: '在Kendal Elektrik Aydınlatma Elektronik İnş. San. Dış. Tic. A.Ş.（"本公司"或"我们"），我们高度重视保护访客的隐私权利。为此，我们制定了本隐私与Cookie政策。',
      before:
        '我们旨在告知您访问www.kendalelektrik.com网站（"本网站"）时收集了哪些信息、我们出于何种原因及目的使用这些信息，以及在何种情况下我们可能需要与官方机构共享这些信息。如有任何问题，请通过电子邮件联系我们的客户服务团队：',
      mid: '，或拨打电话：+90 212 251 77 90。',
      after: '',
    },
    sections: [
      {
        heading: '1. 我们在网站上收集哪些信息？',
        blocks: [
          { type: 'h3', text: '流量数据与日志记录' },
          {
            type: 'p',
            text: '当您访问我们的网站时，作为我们法定安全义务（如第5651号法律）的一部分，我们会在服务器上自动记录以下信息：(i) 您的IP地址；(ii) 您访问的日期和时间；(iii) 您所使用的浏览器和设备的一般类型（统称为"流量数据"）。',
          },
          { type: 'h3', text: '个人联系信息' },
          {
            type: 'p',
            text: '我们的网站完全作为数字企业目录和宣传界面运作。我们的网站上没有直接销售、信用卡支付模块、购物车流程或用户注册（"我的账户"面板）。因此，在您访问期间不会要求您直接输入数据。但是，如果您通过拨打我们的电话号码或发送电子邮件与我们联系，您自愿与我们分享的姓名、联系信息及留言内容（"个人信息"）可能会被记录下来，以便回复您的请求。',
          },
        ],
      },
      {
        heading: '2. 我们如何使用所收集的信息？',
        blocks: [
          {
            type: 'p',
            text: '您与我们分享的个人信息仅用于回复您的请求、回答您的问题、提供有关我们产品的信息以及维持企业沟通。自动收集的流量数据（IP、日志记录）用于确保我们网站的安全、进行统计性和匿名的访客分析，以及履行我们的法定义务。除非您明确同意或存在法律义务（如法院命令），否则您的信息绝不会与第三方或机构共享。',
          },
        ],
      },
      {
        heading: '3. 我们如何使用Cookie？',
        blocks: [
          {
            type: 'p',
            text: '"Cookie"是您访问我们网站时保存在您的计算机或移动设备上的小型文本文件。Cookie用于确保我们网站的正常运行、记住您的偏好设置（如Cookie同意状态、语言选择）以及改善用户体验。',
          },
          {
            type: 'p',
            text: '我们的网站仅使用必要的Cookie（用于技术功能，例如`kendal-cookie-consent`）以及收集匿名统计数据的分析性Cookie。Cookie不会收集您的姓名、地址或类似身份识别信息等个人数据。大多数现代网页浏览器（Chrome、Safari、Firefox、Edge等）会自动接受Cookie，但您可以在浏览器设置中完全拒绝或限制Cookie。即使您拒绝Cookie，也可以继续正常使用我们的网站。',
          },
        ],
      },
      {
        heading: '4. 隐私的限制与外部链接',
        blocks: [
          {
            type: 'p',
            text: '我们的网站有时可能包含指向业务合作伙伴或社交媒体平台的链接。我们提醒您，当您离开我们的网站并点击第三方链接时，您将受这些外部网站自身隐私政策的约束，而非Kendal Elektrik的政策。我们对其他网站的数据收集和隐私做法不承担任何责任。',
          },
        ],
      },
      {
        heading: '5. 您的信息安全',
        blocks: [
          {
            type: 'p',
            text: 'Kendal Elektrik采取符合行业标准的安全措施来保护其系统中的信息和数据。我们的网站采用SSL（安全套接层）技术加密，确保您的浏览器与我们服务器之间连接的机密性。由于我们的网站不进行任何支付或财务数据交换，因此相关的额外风险并不适用。',
          },
        ],
      },
      {
        heading: '6. 限制及更正您的信息',
        blocks: [
          {
            type: 'p-email',
            before:
              '您有权要求删除、更新或更正您通过电子邮件发送给我们的信息。您可以将更改或彻底删除您个人数据的请求发送至 ',
            email: EMAIL,
            after: '。您的请求将在我们KVKK法义务范围内尽快处理。',
          },
        ],
      },
      {
        heading: '7. 您的同意与政策变更',
        blocks: [
          {
            type: 'p',
            text: '使用我们的网站即表示您同意本隐私与Cookie政策的各项条款。本公司保留为遵守法律法规或业务流程需要而对本政策进行修改的权利。修改内容自在我们网站上发布之时起生效。',
          },
        ],
      },
      {
        heading: '8. 法律规定的披露要求',
        blocks: [
          {
            type: 'p',
            text: '在法律明确要求、为善意遵守法院或官方机构的法律命令，或为防止针对我们网站安全及公司权利和财产的未经授权的攻击时，Kendal Elektrik保留（并有义务）与相关司法机关共享数字足迹（日志、IP）的权利。',
          },
        ],
      },
    ],
  },
};
