import type { Language } from '@/lib/i18n/LanguageProvider';

export type KVKKBlock =
  | { type: 'p'; text: string }
  | { type: 'p-email'; before: string; email: string; after: string }
  | { type: 'kv-list'; items: { label: string; value: string }[] }
  | { type: 'bullet-list'; items: { bold?: string; text: string }[] };

export interface KVKKSection {
  heading: string;
  blocks: KVKKBlock[];
}

export interface KVKKPageContent {
  pageTitle: string;
  sections: KVKKSection[];
}

const EMAIL = 'info@kendalelektrik.com.tr';
const ADDRESS_TR = 'Şahkulu Mahallesi Büyükhendek cad. No 28 Beyoğlu/İstanbul';
const ADDRESS_INTL =
  'Şahkulu Mahallesi Büyükhendek cad. No 28 Beyoğlu/Istanbul';

export const KVKK_CONTENT: Record<Language, KVKKPageContent> = {
  tr: {
    pageTitle: 'KVKK Aydınlatma Metni',
    sections: [
      {
        heading: '1. GİRİŞ',
        blocks: [
          {
            type: 'p',
            text: 'Kişisel verilerinizin güvenliği ve korunması hususu Kendal Elektrik Aydınlatma Elektronik İnşaat Sanayi ve Dış Ticaret A.Ş (“Şirket/Şirketimiz”) olarak önceliklerimiz arasındadır. Bu bilinçle, Şirket olarak ürün ve hizmetlerimizden faydalanan kişiler dahil, Şirket ile ilişkili tüm şahıslara ait her türlü kişisel verilerin 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVK Kanunu”)’na uygun olarak işlenerek muhafaza edilmesine büyük önem vermekteyiz.',
          },
          {
            type: 'p',
            text: 'Bu doğrultuda, KVK Kanunu’nda tanımlı şekli ile “Veri Sorumlusu” sıfatıyla, Şirketimiz tarafından kişisel veri sahiplerine; kişisel verilerinin hangi amaçla işleneceği, işlenen verilerin kimlere ve hangi amaçla aktarılabileceği, kişisel veri toplamanın yöntemi ve hukuki sebebi ile sahip olunan haklara ilişkin bu bilgilendirmeyi sunarız.',
          },
        ],
      },
      {
        heading: '2. VERİ SORUMLUSUNUN KİMLİĞİ',
        blocks: [
          {
            type: 'p',
            text: 'KVK Kanunu uyarınca “Veri Sorumlusu” olan Kendal Elektrik Aydınlatma Elektronik İnşaat Sanayi ve Dış Ticaret A.Ş’nin Kurumsal Kimlik Bilgileri şu şekildedir:',
          },
          {
            type: 'kv-list',
            items: [
              { label: 'Ticaret Sicil No', value: '453321, İstanbul' },
              { label: 'Mersis No', value: '05440605937900001' },
              { label: 'Vergi Dairesi', value: 'Beyoğlu Vergi Dairesi' },
              { label: 'Vergi Numarası', value: '5440659379' },
              { label: 'Merkez Adresi', value: ADDRESS_TR },
              { label: 'Telefon', value: '0212 251 77 90' },
              { label: 'İnternet Sitesi', value: 'www.kendalelektrik.com' },
              { label: 'Eposta Adresi', value: EMAIL },
            ],
          },
        ],
      },
      {
        heading:
          '3. İŞLENEN KİŞİSEL VERİLERİNİZ, İŞLENME AMAÇLARI VE HUKUKİ SEBEBİ',
        blocks: [
          {
            type: 'p',
            text: 'İnternet sitemiz (www.kendalelektrik.com) tamamen kurumsal tanıtım ve dijital katalog amacı taşımakta olup, sitemiz üzerinden herhangi bir e-ticaret satışı yapılmamakta, kredi kartı bilgisi toplanmamakta ve kullanıcı hesabı oluşturulmamaktadır.',
          },
          {
            type: 'p',
            text: 'Bu çerçevede işlenen kişisel verileriniz ve hukuki sebepleri aşağıdadır:',
          },
          {
            type: 'bullet-list',
            items: [
              {
                bold: 'İşlem Güvenliği Verileri (IP Adresi, Erişim Tarih/Saat, Tarayıcı Bilgileri):',
                text: '5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun uyarınca yasal yükümlülüklerimizi yerine getirmek (KVK Kanunu m. 5/2-ç) ve bilgi güvenliği süreçlerinin yürütülmesi (KVK Kanunu m. 5/2-f) amacıyla işlenmektedir.',
              },
              {
                bold: 'İletişim Verileri (Ad, Soyad, E-posta, Telefon, Mesaj İçeriği):',
                text: `Sitemizde yer alan e-posta adreslerimiz (${EMAIL} vb.) veya iletişim numaralarımız üzerinden bizimle kendi inisiyatifinizle iletişime geçmeniz halinde; talep ve şikayetlerin takibi, iletişim faaliyetlerinin yürütülmesi amaçlarıyla bir hakkın tesisi, kullanılması veya korunması (KVK Kanunu m. 5/2-e) ve ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati (KVK Kanunu m. 5/2-f) hukuki sebeplerine dayalı olarak işlenmektedir.`,
              },
            ],
          },
        ],
      },
      {
        heading: '4. KİŞİSEL VERİ TOPLAMANIN YÖNTEMİ',
        blocks: [
          {
            type: 'p',
            text: 'Kişisel verileriniz, internet sitemizi ziyaretiniz esnasında otomatik yöntemlerle (çerezler ve sunucu log kayıtları aracılığıyla) ve tarafımıza e-posta veya telefon yoluyla doğrudan ulaşmanız halinde kısmen otomatik veya otomatik olmayan yöntemlerle toplanmaktadır. Sitemizde form doldurma veya veri girişi yapılan herhangi bir üyelik/satın alma modülü bulunmamaktadır.',
          },
        ],
      },
      {
        heading:
          '5. KİŞİSEL VERİLERİN KİMLERE VE HANGİ AMAÇLA AKTARILABİLECEĞİ',
        blocks: [
          {
            type: 'p',
            text: 'İnternet sitemiz üzerinden toplanan işlem güvenliği verileriniz (log kayıtları) ve bizimle paylaştığınız iletişim bilgileriniz, kural olarak herhangi bir üçüncü kişi ile paylaşılmamaktadır. Ancak, yasal bir uyuşmazlık durumunda hukuki süreçlerin yürütülmesi ve kanuni yükümlülüklerin yerine getirilmesi amaçlarıyla (KVK Kanunu m. 8/2-a) sadece yetkili kamu kurum ve kuruluşları (Mahkemeler, Savcılıklar vb.) ile paylaşılabilecektir. Verileriniz, yasal mevzuata uygun olmayan hiçbir amaçla yurt içine veya yurt dışına aktarılmamaktadır.',
          },
        ],
      },
      {
        heading:
          '6. KİŞİSEL VERİ SAHİBİNİN KVK KANUNU’NUN 11. MADDESİNDEKİ HAKLARI',
        blocks: [
          {
            type: 'p',
            text: 'Kişisel veri sahipleri, KVK Kanunu Madde 11 uyarınca;',
          },
          {
            type: 'bullet-list',
            items: [
              { text: 'Kişisel verilerinin işlenip işlenmediğini öğrenme,' },
              { text: 'İşlenmişse buna ilişkin bilgi talep etme,' },
              {
                text: 'İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,',
              },
              {
                text: 'Eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme,',
              },
              {
                text: 'KVK Kanunu’nun 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,',
              },
              {
                text: 'İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhine bir sonucun ortaya çıkmasına itiraz etme,',
              },
              {
                text: 'Kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme haklarına sahiptir.',
              },
            ],
          },
          {
            type: 'p-email',
            before: `Belirtilen haklarınızı kullanmak için taleplerinizi kimliğinizi tespit edici gerekli bilgiler ile birlikte ${ADDRESS_TR} adresine noter kanalıyla gönderebilir veya `,
            email: EMAIL,
            after:
              ' adresine iletebilirsiniz. Şirketimiz talebin niteliğine göre talebi en geç otuz gün içinde ücretsiz olarak sonuçlandıracaktır.',
          },
        ],
      },
    ],
  },
  en: {
    pageTitle: 'KVKK Illumination Text',
    sections: [
      {
        heading: '1. INTRODUCTION',
        blocks: [
          {
            type: 'p',
            text: 'The security and protection of your personal data is among our priorities as Kendal Elektrik Aydınlatma Elektronik İnşaat Sanayi ve Dış Ticaret A.Ş ("Company/Our Company"). With this awareness, we attach great importance to the processing and preservation of all personal data belonging to individuals associated with the Company in accordance with the Personal Data Protection Law No. 6698 ("KVKK Law").',
          },
          {
            type: 'p',
            text: 'In this direction, acting as the "Data Controller" under the KVKK Law, we present this information text regarding the purposes for which your personal data is processed, to whom and for what purposes it may be transferred, the methods and legal grounds of data collection, and your rights as a data subject.',
          },
        ],
      },
      {
        heading: '2. IDENTITY OF THE DATA CONTROLLER',
        blocks: [
          {
            type: 'p',
            text: 'The corporate identity information of Kendal Elektrik, which is the "Data Controller" pursuant to the KVKK Law, is as follows:',
          },
          {
            type: 'kv-list',
            items: [
              { label: 'Trade Registry No', value: '453321, Istanbul' },
              { label: 'Mersis No', value: '05440605937900001' },
              { label: 'Tax Office', value: 'Beyoğlu Tax Office' },
              { label: 'Tax Number', value: '5440659379' },
              { label: 'Headquarters Address', value: ADDRESS_INTL },
              { label: 'Phone', value: '+90 212 251 77 90' },
              { label: 'Website', value: 'www.kendalelektrik.com' },
              { label: 'Email Address', value: EMAIL },
            ],
          },
        ],
      },
      {
        heading: '3. PROCESSED PERSONAL DATA, PURPOSES AND LEGAL GROUNDS',
        blocks: [
          {
            type: 'p',
            text: 'Our website (www.kendalelektrik.com) serves entirely as a corporate showcase and digital catalog. We do not conduct e-commerce, collect credit card information, or offer user account registrations on our site.',
          },
          {
            type: 'p',
            text: 'Within this framework, your processed personal data and their legal grounds are as follows:',
          },
          {
            type: 'bullet-list',
            items: [
              {
                bold: 'Transaction Security Data (IP Address, Access Date/Time, Browser Info):',
                text: 'Processed automatically to fulfill our legal obligations under Law No. 5651 (KVKK Art. 5/2-ç) and to ensure information security processes (KVKK Art. 5/2-f).',
              },
              {
                bold: 'Contact Data (Name, Surname, E-mail, Phone, Message Content):',
                text: `If you contact us voluntarily via the email addresses (e.g., ${EMAIL}) or phone numbers provided on our site, your data is processed for following up on requests/complaints and maintaining communication, based on the legal grounds of establishing, using, or protecting a right (KVKK Art. 5/2-e) and our legitimate interests (KVKK Art. 5/2-f).`,
              },
            ],
          },
        ],
      },
      {
        heading: '4. METHOD OF COLLECTING PERSONAL DATA',
        blocks: [
          {
            type: 'p',
            text: 'Your personal data is collected through automatic methods (cookies and server log records) during your visit to our website, and through partially automatic or non-automatic methods if you contact us directly via e-mail or phone. There are no membership or purchase modules on our site that require form filling or data entry.',
          },
        ],
      },
      {
        heading: '5. TRANSFER OF PERSONAL DATA',
        blocks: [
          {
            type: 'p',
            text: 'As a rule, your transaction security data (log records) collected via our website and the contact information you share with us are not shared with any third party. However, in the event of a legal dispute, it may be shared solely with authorized public institutions (Courts, Prosecutors, etc.) to carry out legal processes and fulfill statutory obligations (KVKK Art. 8/2-a). Your data is not transferred domestically or abroad for any non-compliant commercial purpose.',
          },
        ],
      },
      {
        heading:
          '6. RIGHTS OF THE DATA SUBJECT UNDER ARTICLE 11 OF THE KVKK LAW',
        blocks: [
          {
            type: 'p',
            text: 'Pursuant to Article 11 of the KVKK Law, personal data owners have the right to:',
          },
          {
            type: 'bullet-list',
            items: [
              { text: 'Learn whether their personal data is being processed,' },
              {
                text: 'Request information if their personal data has been processed,',
              },
              {
                text: 'Learn the purpose of processing and whether it is being used accordingly,',
              },
              {
                text: 'Request the correction of incomplete or inaccurately processed data,',
              },
              {
                text: 'Request the deletion or destruction of personal data under the conditions set forth in Article 7,',
              },
              {
                text: 'Object to a negative outcome resulting solely from the analysis of processed data by automated systems,',
              },
              {
                text: 'Request compensation for damages incurred due to unlawful processing.',
              },
            ],
          },
          {
            type: 'p-email',
            before: `To exercise these rights, you may send your written request along with documents identifying your identity to the address ${ADDRESS_INTL} via a notary public, or email it to `,
            email: EMAIL,
            after:
              '. Our company will resolve your request free of charge within thirty days at the latest, depending on its nature.',
          },
        ],
      },
    ],
  },
  ar: {
    pageTitle: 'نص التوضيح الخاص بحماية البيانات الشخصية (KVKK)',
    sections: [
      {
        heading: '1. مقدمة',
        blocks: [
          {
            type: 'p',
            text: 'يُعد أمن بياناتكم الشخصية وحمايتها من أولوياتنا كشركة Kendal Elektrik Aydınlatma Elektronik İnşaat Sanayi ve Dış Ticaret A.Ş ("الشركة/شركتنا"). وانطلاقاً من هذا الوعي، نولي أهمية كبيرة لمعالجة وحفظ جميع البيانات الشخصية الخاصة بالأشخاص المرتبطين بالشركة وفقاً لقانون حماية البيانات الشخصية رقم 6698 ("قانون KVKK").',
          },
          {
            type: 'p',
            text: 'وفي هذا الإطار، وبصفتنا "المسؤول عن معالجة البيانات" بموجب قانون KVKK، نقدم لكم نص التوضيح هذا بشأن الأغراض التي تُعالَج من أجلها بياناتكم الشخصية، والجهات التي قد تُنقل إليها هذه البيانات وأغراض ذلك، وطريقة جمع البيانات وأساسها القانوني، والحقوق التي تتمتعون بها كأصحاب بيانات.',
          },
        ],
      },
      {
        heading: '2. هوية المسؤول عن معالجة البيانات',
        blocks: [
          {
            type: 'p',
            text: 'فيما يلي معلومات الهوية المؤسسية لشركة Kendal Elektrik، التي تُعدّ "المسؤول عن معالجة البيانات" بموجب قانون KVKK:',
          },
          {
            type: 'kv-list',
            items: [
              { label: 'رقم السجل التجاري', value: '453321، إسطنبول' },
              { label: 'رقم Mersis', value: '05440605937900001' },
              { label: 'دائرة الضرائب', value: 'دائرة ضرائب بي أوغلو' },
              { label: 'الرقم الضريبي', value: '5440659379' },
              { label: 'عنوان المقر الرئيسي', value: ADDRESS_INTL },
              { label: 'الهاتف', value: '+90 212 251 77 90' },
              { label: 'الموقع الإلكتروني', value: 'www.kendalelektrik.com' },
              { label: 'البريد الإلكتروني', value: EMAIL },
            ],
          },
        ],
      },
      {
        heading:
          '3. البيانات الشخصية التي تتم معالجتها وأغراض المعالجة وأساسها القانوني',
        blocks: [
          {
            type: 'p',
            text: 'يخدم موقعنا الإلكتروني (www.kendalelektrik.com) بالكامل كواجهة عرض مؤسسية وكتالوج رقمي. نحن لا نقوم بأي تجارة إلكترونية، ولا نجمع معلومات بطاقات الائتمان، ولا نوفر تسجيل حسابات مستخدمين على موقعنا.',
          },
          {
            type: 'p',
            text: 'وفي هذا الإطار، فإن بياناتكم الشخصية التي تتم معالجتها وأسسها القانونية هي كالتالي:',
          },
          {
            type: 'bullet-list',
            items: [
              {
                bold: 'بيانات أمن المعاملات (عنوان IP، تاريخ/وقت الوصول، معلومات المتصفح):',
                text: 'تتم معالجتها تلقائياً للوفاء بالتزاماتنا القانونية بموجب القانون رقم 5651 (المادة 5/2-ج من قانون KVKK) ولضمان سير عمليات أمن المعلومات (المادة 5/2-و من قانون KVKK).',
              },
              {
                bold: 'بيانات الاتصال (الاسم، اللقب، البريد الإلكتروني، الهاتف، محتوى الرسالة):',
                text: `في حال تواصلتم معنا طوعياً عبر عناوين البريد الإلكتروني (مثل ${EMAIL}) أو أرقام الهاتف المتوفرة على موقعنا، تتم معالجة بياناتكم لمتابعة الطلبات/الشكاوى والحفاظ على التواصل، استناداً إلى أساس تأسيس حق أو استخدامه أو حمايته (المادة 5/2-هـ من قانون KVKK) والمصلحة المشروعة لشركتنا (المادة 5/2-و من قانون KVKK).`,
              },
            ],
          },
        ],
      },
      {
        heading: '4. طريقة جمع البيانات الشخصية',
        blocks: [
          {
            type: 'p',
            text: 'تُجمع بياناتكم الشخصية من خلال وسائل تلقائية (ملفات تعريف الارتباط وسجلات الخادم) أثناء زيارتكم لموقعنا الإلكتروني، ومن خلال وسائل شبه تلقائية أو غير تلقائية في حال تواصلتم معنا مباشرة عبر البريد الإلكتروني أو الهاتف. لا توجد على موقعنا أي وحدات عضوية أو شراء تتطلب تعبئة نماذج أو إدخال بيانات.',
          },
        ],
      },
      {
        heading: '5. الجهات التي قد تُنقل إليها البيانات الشخصية وأغراض ذلك',
        blocks: [
          {
            type: 'p',
            text: 'كقاعدة عامة، لا تتم مشاركة بيانات أمن المعاملات الخاصة بكم (سجلات الدخول) التي يتم جمعها عبر موقعنا الإلكتروني، ولا معلومات الاتصال التي تشاركونها معنا، مع أي طرف ثالث. ومع ذلك، في حال وجود نزاع قانوني، يجوز مشاركتها حصرياً مع المؤسسات العامة المخولة (المحاكم، النيابات العامة، إلخ) لتنفيذ الإجراءات القانونية والوفاء بالالتزامات القانونية (المادة 8/2-أ من قانون KVKK). لا تُنقل بياناتكم داخل البلاد أو خارجها لأي غرض تجاري غير متوافق مع الأنظمة.',
          },
        ],
      },
      {
        heading: '6. حقوق صاحب البيانات الشخصية بموجب المادة 11 من قانون KVKK',
        blocks: [
          {
            type: 'p',
            text: 'بموجب المادة 11 من قانون KVKK، يحق لأصحاب البيانات الشخصية ما يلي:',
          },
          {
            type: 'bullet-list',
            items: [
              {
                text: 'معرفة ما إذا كانت بياناتهم الشخصية تتم معالجتها أم لا،',
              },
              { text: 'طلب معلومات في حال معالجة بياناتهم الشخصية،' },
              {
                text: 'معرفة الغرض من المعالجة ومدى استخدامها بما يتوافق مع هذا الغرض،',
              },
              { text: 'طلب تصحيح البيانات التي عولجت بشكل ناقص أو غير صحيح،' },
              {
                text: 'طلب حذف أو إتلاف البيانات الشخصية وفقاً للشروط المنصوص عليها في المادة 7،',
              },
              {
                text: 'الاعتراض على أي نتيجة سلبية تنشأ حصراً عن تحليل البيانات المعالجة عبر أنظمة آلية،',
              },
              {
                text: 'طلب التعويض عن الأضرار الناتجة عن المعالجة غير القانونية.',
              },
            ],
          },
          {
            type: 'p-email',
            before: `لممارسة هذه الحقوق، يمكنكم إرسال طلبكم الكتابي مع المستندات المثبتة لهويتكم إلى العنوان ${ADDRESS_INTL} عبر كاتب العدل، أو إرساله عبر البريد الإلكتروني إلى `,
            email: EMAIL,
            after:
              '. ستقوم شركتنا بالرد على طلبكم مجاناً في غضون ثلاثين يوماً على الأكثر، وفقاً لطبيعة الطلب.',
          },
        ],
      },
    ],
  },
  es: {
    pageTitle: 'Texto Informativo de Protección de Datos Personales (KVKK)',
    sections: [
      {
        heading: '1. INTRODUCCIÓN',
        blocks: [
          {
            type: 'p',
            text: 'La seguridad y protección de sus datos personales es una de nuestras prioridades como Kendal Elektrik Aydınlatma Elektronik İnşaat Sanayi ve Dış Ticaret A.Ş ("la Empresa/Nuestra Empresa"). Con esta conciencia, otorgamos gran importancia al tratamiento y conservación de todos los datos personales pertenecientes a las personas relacionadas con la Empresa, de conformidad con la Ley de Protección de Datos Personales N.º 6698 ("Ley KVKK").',
          },
          {
            type: 'p',
            text: 'En este sentido, actuando como "Responsable del Tratamiento" conforme a la Ley KVKK, presentamos este texto informativo relativo a los fines para los que se tratan sus datos personales, a quién y con qué fines pueden transferirse, los métodos y fundamentos legales de la recopilación de datos, y sus derechos como titular de los datos.',
          },
        ],
      },
      {
        heading: '2. IDENTIDAD DEL RESPONSABLE DEL TRATAMIENTO',
        blocks: [
          {
            type: 'p',
            text: 'La información de identidad corporativa de Kendal Elektrik, que actúa como "Responsable del Tratamiento" conforme a la Ley KVKK, es la siguiente:',
          },
          {
            type: 'kv-list',
            items: [
              { label: 'N.º de Registro Mercantil', value: '453321, Estambul' },
              { label: 'N.º Mersis', value: '05440605937900001' },
              {
                label: 'Oficina Tributaria',
                value: 'Oficina Tributaria de Beyoğlu',
              },
              { label: 'Número de Identificación Fiscal', value: '5440659379' },
              { label: 'Dirección de la Sede', value: ADDRESS_INTL },
              { label: 'Teléfono', value: '+90 212 251 77 90' },
              { label: 'Sitio Web', value: 'www.kendalelektrik.com' },
              { label: 'Correo Electrónico', value: EMAIL },
            ],
          },
        ],
      },
      {
        heading: '3. DATOS PERSONALES TRATADOS, FINES Y FUNDAMENTOS LEGALES',
        blocks: [
          {
            type: 'p',
            text: 'Nuestro sitio web (www.kendalelektrik.com) tiene una finalidad exclusivamente corporativa y de catálogo digital. No realizamos comercio electrónico, no recopilamos información de tarjetas de crédito ni ofrecemos registro de cuentas de usuario en nuestro sitio.',
          },
          {
            type: 'p',
            text: 'En este marco, sus datos personales tratados y sus fundamentos legales son los siguientes:',
          },
          {
            type: 'bullet-list',
            items: [
              {
                bold: 'Datos de Seguridad de Transacciones (Dirección IP, Fecha/Hora de Acceso, Información del Navegador):',
                text: 'Se tratan automáticamente para cumplir con nuestras obligaciones legales conforme a la Ley N.º 5651 (Art. 5/2-ç de la Ley KVKK) y para garantizar los procesos de seguridad de la información (Art. 5/2-f de la Ley KVKK).',
              },
              {
                bold: 'Datos de Contacto (Nombre, Apellido, Correo Electrónico, Teléfono, Contenido del Mensaje):',
                text: `Si se pone en contacto con nosotros voluntariamente a través de las direcciones de correo electrónico (p. ej., ${EMAIL}) o los números de teléfono que figuran en nuestro sitio, sus datos se tratan para dar seguimiento a solicitudes/quejas y mantener la comunicación, sobre la base del establecimiento, ejercicio o defensa de un derecho (Art. 5/2-e de la Ley KVKK) y nuestro interés legítimo (Art. 5/2-f de la Ley KVKK).`,
              },
            ],
          },
        ],
      },
      {
        heading: '4. MÉTODO DE RECOPILACIÓN DE DATOS PERSONALES',
        blocks: [
          {
            type: 'p',
            text: 'Sus datos personales se recopilan mediante métodos automáticos (cookies y registros del servidor) durante su visita a nuestro sitio web, y mediante métodos parcialmente automáticos o no automáticos si se pone en contacto con nosotros directamente por correo electrónico o teléfono. No existen módulos de membresía o compra en nuestro sitio que requieran completar formularios o introducir datos.',
          },
        ],
      },
      {
        heading: '5. TRANSFERENCIA DE DATOS PERSONALES',
        blocks: [
          {
            type: 'p',
            text: 'Como norma general, sus datos de seguridad de transacciones (registros de acceso) recopilados a través de nuestro sitio web y la información de contacto que comparte con nosotros no se comparten con terceros. Sin embargo, en caso de disputa legal, podrán compartirse exclusivamente con instituciones públicas autorizadas (Tribunales, Fiscalías, etc.) para llevar a cabo procesos legales y cumplir con obligaciones legales (Art. 8/2-a de la Ley KVKK). Sus datos no se transfieren dentro o fuera del país con fines comerciales no conformes.',
          },
        ],
      },
      {
        heading:
          '6. DERECHOS DEL TITULAR DE LOS DATOS SEGÚN EL ARTÍCULO 11 DE LA LEY KVKK',
        blocks: [
          {
            type: 'p',
            text: 'De conformidad con el Artículo 11 de la Ley KVKK, los titulares de datos personales tienen derecho a:',
          },
          {
            type: 'bullet-list',
            items: [
              {
                text: 'Conocer si sus datos personales están siendo tratados,',
              },
              {
                text: 'Solicitar información si sus datos personales han sido tratados,',
              },
              {
                text: 'Conocer el propósito del tratamiento y si se utiliza conforme a dicho propósito,',
              },
              {
                text: 'Solicitar la corrección de datos tratados de forma incompleta o incorrecta,',
              },
              {
                text: 'Solicitar la eliminación o destrucción de los datos personales bajo las condiciones establecidas en el Artículo 7,',
              },
              {
                text: 'Oponerse a un resultado negativo derivado exclusivamente del análisis de los datos tratados mediante sistemas automatizados,',
              },
              {
                text: 'Solicitar una indemnización por los daños sufridos debido al tratamiento ilícito.',
              },
            ],
          },
          {
            type: 'p-email',
            before: `Para ejercer estos derechos, puede enviar su solicitud por escrito junto con los documentos que acrediten su identidad a la dirección ${ADDRESS_INTL} a través de notario, o remitirla por correo electrónico a `,
            email: EMAIL,
            after:
              '. Nuestra empresa resolverá su solicitud de forma gratuita en un plazo máximo de treinta días, según su naturaleza.',
          },
        ],
      },
    ],
  },
  de: {
    pageTitle: 'KVKK-Datenschutzhinweis',
    sections: [
      {
        heading: '1. EINLEITUNG',
        blocks: [
          {
            type: 'p',
            text: 'Die Sicherheit und der Schutz Ihrer personenbezogenen Daten gehören zu unseren Prioritäten als Kendal Elektrik Aydınlatma Elektronik İnşaat Sanayi ve Dış Ticaret A.Ş ("Unternehmen/Unser Unternehmen"). In diesem Bewusstsein legen wir großen Wert auf die Verarbeitung und Aufbewahrung aller personenbezogenen Daten von Personen, die mit dem Unternehmen in Verbindung stehen, in Übereinstimmung mit dem türkischen Gesetz zum Schutz personenbezogener Daten Nr. 6698 ("KVKK-Gesetz").',
          },
          {
            type: 'p',
            text: 'In diesem Sinne legen wir Ihnen als "Verantwortlicher" gemäß dem KVKK-Gesetz diesen Informationstext vor, der die Zwecke der Verarbeitung Ihrer personenbezogenen Daten, an wen und zu welchen Zwecken diese übermittelt werden können, die Methoden und Rechtsgrundlagen der Datenerhebung sowie Ihre Rechte als betroffene Person erläutert.',
          },
        ],
      },
      {
        heading: '2. IDENTITÄT DES VERANTWORTLICHEN',
        blocks: [
          {
            type: 'p',
            text: 'Die Unternehmensidentität von Kendal Elektrik, das gemäß dem KVKK-Gesetz als "Verantwortlicher" fungiert, lautet wie folgt:',
          },
          {
            type: 'kv-list',
            items: [
              { label: 'Handelsregisternummer', value: '453321, Istanbul' },
              { label: 'Mersis-Nr.', value: '05440605937900001' },
              { label: 'Finanzamt', value: 'Finanzamt Beyoğlu' },
              { label: 'Steuernummer', value: '5440659379' },
              { label: 'Hauptsitzadresse', value: ADDRESS_INTL },
              { label: 'Telefon', value: '+90 212 251 77 90' },
              { label: 'Webseite', value: 'www.kendalelektrik.com' },
              { label: 'E-Mail-Adresse', value: EMAIL },
            ],
          },
        ],
      },
      {
        heading:
          '3. VERARBEITETE PERSONENBEZOGENE DATEN, ZWECKE UND RECHTSGRUNDLAGEN',
        blocks: [
          {
            type: 'p',
            text: 'Unsere Website (www.kendalelektrik.com) dient ausschließlich als Unternehmenspräsentation und digitaler Katalog. Wir betreiben keinen E-Commerce, erfassen keine Kreditkarteninformationen und bieten keine Benutzerkontoregistrierung auf unserer Website an.',
          },
          {
            type: 'p',
            text: 'In diesem Rahmen sind Ihre verarbeiteten personenbezogenen Daten und deren Rechtsgrundlagen wie folgt:',
          },
          {
            type: 'bullet-list',
            items: [
              {
                bold: 'Transaktionssicherheitsdaten (IP-Adresse, Zugriffsdatum/-zeit, Browserinformationen):',
                text: 'Werden automatisch verarbeitet, um unseren gesetzlichen Verpflichtungen gemäß Gesetz Nr. 5651 (KVKK Art. 5/2-ç) nachzukommen und Informationssicherheitsprozesse zu gewährleisten (KVKK Art. 5/2-f).',
              },
              {
                bold: 'Kontaktdaten (Name, Nachname, E-Mail, Telefon, Nachrichteninhalt):',
                text: `Wenn Sie uns freiwillig über die auf unserer Website angegebenen E-Mail-Adressen (z. B. ${EMAIL}) oder Telefonnummern kontaktieren, werden Ihre Daten zur Bearbeitung von Anfragen/Beschwerden und zur Aufrechterhaltung der Kommunikation verarbeitet, gestützt auf die Geltendmachung, Ausübung oder Verteidigung eines Rechts (KVKK Art. 5/2-e) und unser berechtigtes Interesse (KVKK Art. 5/2-f).`,
              },
            ],
          },
        ],
      },
      {
        heading: '4. METHODE DER ERHEBUNG PERSONENBEZOGENER DATEN',
        blocks: [
          {
            type: 'p',
            text: 'Ihre personenbezogenen Daten werden während Ihres Besuchs auf unserer Website durch automatische Methoden (Cookies und Server-Protokolle) sowie bei direkter Kontaktaufnahme per E-Mail oder Telefon durch teilweise automatische oder nicht automatische Methoden erhoben. Auf unserer Website gibt es keine Mitgliedschafts- oder Kaufmodule, die eine Formularausfüllung oder Dateneingabe erfordern.',
          },
        ],
      },
      {
        heading: '5. ÜBERMITTLUNG PERSONENBEZOGENER DATEN',
        blocks: [
          {
            type: 'p',
            text: 'In der Regel werden Ihre über unsere Website erfassten Transaktionssicherheitsdaten (Protokolle) sowie die von Ihnen mit uns geteilten Kontaktinformationen nicht an Dritte weitergegeben. Im Falle eines Rechtsstreits können sie jedoch ausschließlich an befugte öffentliche Stellen (Gerichte, Staatsanwaltschaften usw.) weitergegeben werden, um rechtliche Verfahren durchzuführen und gesetzliche Verpflichtungen zu erfüllen (KVKK Art. 8/2-a). Ihre Daten werden für keinen nicht konformen kommerziellen Zweck im In- oder Ausland übermittelt.',
          },
        ],
      },
      {
        heading:
          '6. RECHTE DER BETROFFENEN PERSON GEMÄSS ARTIKEL 11 DES KVKK-GESETZES',
        blocks: [
          {
            type: 'p',
            text: 'Gemäß Artikel 11 des KVKK-Gesetzes haben die Inhaber personenbezogener Daten das Recht:',
          },
          {
            type: 'bullet-list',
            items: [
              {
                text: 'Zu erfahren, ob ihre personenbezogenen Daten verarbeitet werden,',
              },
              { text: 'Bei Verarbeitung Auskunft darüber zu verlangen,' },
              {
                text: 'Den Zweck der Verarbeitung zu erfahren und ob die Daten entsprechend diesem Zweck verwendet werden,',
              },
              {
                text: 'Die Berichtigung unvollständig oder fehlerhaft verarbeiteter Daten zu verlangen,',
              },
              {
                text: 'Die Löschung oder Vernichtung personenbezogener Daten unter den in Artikel 7 festgelegten Bedingungen zu verlangen,',
              },
              {
                text: 'Einem ausschließlich durch automatisierte Systeme erzielten, für sie nachteiligen Analyseergebnis zu widersprechen,',
              },
              {
                text: 'Bei unrechtmäßiger Verarbeitung Schadensersatz zu verlangen.',
              },
            ],
          },
          {
            type: 'p-email',
            before: `Um diese Rechte auszuüben, können Sie Ihren schriftlichen Antrag zusammen mit Dokumenten zur Identitätsfeststellung per Notar an die Adresse ${ADDRESS_INTL} senden oder per E-Mail an `,
            email: EMAIL,
            after:
              ' übermitteln. Unser Unternehmen wird Ihren Antrag je nach Art kostenlos innerhalb von spätestens dreißig Tagen bearbeiten.',
          },
        ],
      },
    ],
  },
  zh: {
    pageTitle: 'KVKK个人信息保护告知书',
    sections: [
      {
        heading: '1. 引言',
        blocks: [
          {
            type: 'p',
            text: '作为Kendal Elektrik Aydınlatma Elektronik İnşaat Sanayi ve Dış Ticaret A.Ş（"本公司"），保护您个人数据的安全是我们的首要任务之一。基于这一意识，我们高度重视按照第6698号《个人数据保护法》（"KVKK法"）的规定，对与本公司相关的所有个人的各类个人数据进行处理和保存。',
          },
          {
            type: 'p',
            text: '为此，本公司作为KVKK法所定义的"数据控制者"，特提供本说明文本，向您说明您的个人数据将出于何种目的被处理、可能向谁及出于何种目的转移、数据收集的方式和法律依据，以及您作为数据主体所享有的权利。',
          },
        ],
      },
      {
        heading: '2. 数据控制者身份信息',
        blocks: [
          {
            type: 'p',
            text: '根据KVKK法作为"数据控制者"的Kendal Elektrik公司信息如下：',
          },
          {
            type: 'kv-list',
            items: [
              { label: '商业注册号', value: '453321，伊斯坦布尔' },
              { label: 'Mersis编号', value: '05440605937900001' },
              { label: '税务局', value: '贝伊奥卢税务局' },
              { label: '税号', value: '5440659379' },
              { label: '总部地址', value: ADDRESS_INTL },
              { label: '电话', value: '+90 212 251 77 90' },
              { label: '网站', value: 'www.kendalelektrik.com' },
              { label: '电子邮箱', value: EMAIL },
            ],
          },
        ],
      },
      {
        heading: '3. 所处理的个人数据、处理目的及法律依据',
        blocks: [
          {
            type: 'p',
            text: '我们的网站（www.kendalelektrik.com）完全作为企业展示和数字产品目录使用。我们不在网站上开展电子商务、不收集信用卡信息，也不提供用户账户注册功能。',
          },
          {
            type: 'p',
            text: '在此框架下，我们处理的您的个人数据及其法律依据如下：',
          },
          {
            type: 'bullet-list',
            items: [
              {
                bold: '交易安全数据（IP地址、访问日期/时间、浏览器信息）：',
                text: '根据第5651号法律（KVKK法第5/2-ç条）为履行我们的法定义务，以及为保障信息安全流程（KVKK法第5/2-f条）而自动处理。',
              },
              {
                bold: '联系数据（姓名、姓氏、电子邮箱、电话、留言内容）：',
                text: `如果您通过我们网站提供的电子邮箱（如${EMAIL}）或电话号码主动与我们联系，您的数据将基于权利的设立、行使或保护（KVKK法第5/2-e条）以及本公司的合法利益（KVKK法第5/2-f条）而被处理，用于跟进请求/投诉及维持沟通。`,
              },
            ],
          },
        ],
      },
      {
        heading: '4. 个人数据收集方式',
        blocks: [
          {
            type: 'p',
            text: '您的个人数据通过自动方式（Cookie和服务器日志记录）在您访问我们网站期间被收集，或在您通过电子邮件或电话直接联系我们时，通过部分自动或非自动方式被收集。我们网站上没有需要填写表单或输入数据的会员或购买模块。',
          },
        ],
      },
      {
        heading: '5. 个人数据的接收方及转移目的',
        blocks: [
          {
            type: 'p',
            text: '原则上，通过我们网站收集的交易安全数据（日志记录）以及您与我们分享的联系信息不会与任何第三方共享。但在发生法律纠纷时，为执行法律程序和履行法定义务（KVKK法第8/2-a条），这些数据可能仅与有权的公共机构（法院、检察机关等）共享。您的数据不会因任何不合规的商业目的而在境内或境外转移。',
          },
        ],
      },
      {
        heading: '6. 依据KVKK法第11条数据主体享有的权利',
        blocks: [
          { type: 'p', text: '根据KVKK法第11条，个人数据所有者有权：' },
          {
            type: 'bullet-list',
            items: [
              { text: '了解其个人数据是否被处理，' },
              { text: '在数据被处理的情况下要求获取相关信息，' },
              { text: '了解处理目的及数据是否按该目的被使用，' },
              { text: '要求更正不完整或不准确处理的数据，' },
              { text: '根据第7条规定的条件要求删除或销毁个人数据，' },
              {
                text: '对仅通过自动化系统分析个人数据所得出的不利结果提出异议，',
              },
              { text: '因违法处理而遭受损失时要求赔偿。' },
            ],
          },
          {
            type: 'p-email',
            before: `如需行使上述权利，您可将附有身份证明文件的书面申请通过公证人寄送至地址：${ADDRESS_INTL}，或发送电子邮件至 `,
            email: EMAIL,
            after: '。本公司将根据申请性质，在最迟三十日内免费处理您的申请。',
          },
        ],
      },
    ],
  },
};
