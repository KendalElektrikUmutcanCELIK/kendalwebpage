import {
  getAssetPath,
  getBrandExternalHref,
  getBrandUrunlerHref,
} from '@/lib/basePath';
import type { LocalizedField } from '@/lib/i18n/localized';

export interface ChatLink {
  label: LocalizedField<string>;
  href: string | LocalizedField<string>;
  external?: boolean;
}

export interface ChatNode {
  id: string;
  question: LocalizedField<string>;
  answer: LocalizedField<string>;
  links?: ChatLink[];
  followUps?: string[];
}

export interface ChatContext {
  greeting: LocalizedField<string>;
  rootTopicIds: string[];
  nodes: Record<string, ChatNode>;
}

export const MENU_BACK = {
  label: {
    tr: '⬅ Ana Menü',
    en: '⬅ Main Menu',
    ar: '⬅ القائمة الرئيسية',
    es: '⬅ Menú Principal',
    de: '⬅ Hauptmenü',
    zh: '⬅ 主菜单',
  },
  prompt: {
    tr: 'Başka bir konuda daha yardımcı olabilir miyim?',
    en: 'Anything else I can help you with?',
    ar: 'هل يمكنني مساعدتك في أمر آخر؟',
    es: '¿Puedo ayudarte con algo más?',
    de: 'Kann ich Ihnen noch bei etwas anderem helfen?',
    zh: '还有什么我可以帮您的吗？',
  },
};

// Shared across every context (main + all 3 brands) — same company, same
// switchboard, so this is defined once and reused by reference below
// instead of being retyped per context.
const CONTACT_NODE: ChatNode = {
  id: 'contact',
  question: {
    tr: '📞 Size nasıl ulaşabilirim?',
    en: '📞 How can I reach you?',
    ar: '📞 كيف يمكنني التواصل معكم؟',
    es: '📞 ¿Cómo puedo contactarlos?',
    de: '📞 Wie kann ich Sie erreichen?',
    zh: '📞 我该如何联系你们？',
  },
  answer: {
    tr: 'Bize şu kanallardan ulaşabilirsin:\n\n📞 İletişim Hattı: 0212 482 75 90\n📞 Satış Destek: 0850 259 41 41\n📞 Teknik Servis: 444 34 98\n✉️ info@kendalelektrik.com.tr\n📍 Adres: Selimpaşa Org. San. Böl. 5008 Sokak No:6 Silivri/İstanbul',
    en: 'You can reach us through:\n\n📞 Contact Line: 0212 482 75 90\n📞 Sales Support: 0850 259 41 41\n📞 Technical Service: 444 34 98\n✉️ info@kendalelektrik.com.tr\n📍 Address: Selimpaşa Org. San. Böl. 5008 Sokak No:6 Silivri/İstanbul, Türkiye',
    ar: 'يمكنك التواصل معنا عبر:\n\n📞 خط التواصل: 0212 482 75 90\n📞 دعم المبيعات: 0850 259 41 41\n📞 الخدمة الفنية: 444 34 98\n✉️ info@kendalelektrik.com.tr\n📍 العنوان: Selimpaşa Org. San. Böl. 5008 Sokak No:6 Silivri/إسطنبول، تركيا',
    es: 'Puede contactarnos a través de:\n\n📞 Línea de Contacto: 0212 482 75 90\n📞 Soporte de Ventas: 0850 259 41 41\n📞 Servicio Técnico: 444 34 98\n✉️ info@kendalelektrik.com.tr\n📍 Dirección: Selimpaşa Org. San. Böl. 5008 Sokak No:6 Silivri/Estambul, Turquía',
    de: 'Sie erreichen uns über:\n\n📞 Kontakt-Hotline: 0212 482 75 90\n📞 Vertriebssupport: 0850 259 41 41\n📞 Technischer Service: 444 34 98\n✉️ info@kendalelektrik.com.tr\n📍 Adresse: Selimpaşa Org. San. Böl. 5008 Sokak No:6 Silivri/Istanbul, Türkei',
    zh: '您可以通过以下方式联系我们：\n\n📞 客服热线：0212 482 75 90\n📞 销售支持：0850 259 41 41\n📞 技术服务：444 34 98\n✉️ info@kendalelektrik.com.tr\n📍 地址：Selimpaşa Org. San. Böl. 5008 Sokak No:6 Silivri/伊斯坦布尔，土耳其',
  },
  links: [
    {
      label: {
        tr: 'Haritada Aç →',
        en: 'Open in Maps →',
        ar: 'فتح في الخريطة ←',
        es: 'Abrir en el Mapa →',
        de: 'In der Karte Öffnen →',
        zh: '在地图中打开 →',
      },
      href: 'https://www.google.com/maps/place/Kendal+Elektrik+A.%C5%9E./@41.0699578,28.3202748,17z/data=!3m1!4b1!4m6!3m5!1s0x14b541f701f7e257:0xe2e0245245cd5b6f!8m2!3d41.0699539!4d28.3251457!16s%2Fg%2F11r35kq4hq',
      external: true,
    },
  ],
  followUps: [],
};

const CATALOG_NODE: ChatNode = {
  id: 'catalog',
  question: {
    tr: '📖 Ürün kataloğunuz var mı?',
    en: '📖 Do you have a product catalog?',
    ar: '📖 هل لديكم كتالوج للمنتجات؟',
    es: '📖 ¿Tienen un catálogo de productos?',
    de: '📖 Haben Sie einen Produktkatalog?',
    zh: '📖 你们有产品目录吗？',
  },
  answer: {
    tr: 'Evet! Tüm ürün ailemizi, teknik detayları ve yeni modellerimizi içeren güncel kataloğumuzu aşağıdaki bağlantıdan inceleyebilir veya PDF olarak indirebilirsin.',
    en: 'Yes! You can view or download our up-to-date catalog containing all our product families, technical details, and new models from the links below.',
    ar: 'نعم! يمكنك الاطلاع على كتالوجنا المحدث الذي يضم جميع عائلات منتجاتنا والتفاصيل الفنية والموديلات الجديدة، أو تنزيله بصيغة PDF من الرابط أدناه.',
    es: '¡Sí! Puede consultar o descargar nuestro catálogo actualizado con todas nuestras familias de productos, detalles técnicos y nuevos modelos desde el enlace de abajo.',
    de: 'Ja! Unseren aktuellen Katalog mit allen Produktfamilien, technischen Details und neuen Modellen können Sie über den folgenden Link ansehen oder als PDF herunterladen.',
    zh: '有的！您可以通过下方链接查看或下载我们最新的产品目录，其中包含所有产品系列、技术细节和新品型号。',
  },
  links: [
    {
      label: {
        tr: 'Kataloğu İncele 📥',
        en: 'Browse Catalog 📥',
        ar: 'استعرض الكتالوج 📥',
        es: 'Ver Catálogo 📥',
        de: 'Katalog Ansehen 📥',
        zh: '查看目录 📥',
      },
      href: {
        tr: getAssetPath('/kendal-elektrik-katalog-2026.pdf'),
        en: getAssetPath('/en-catalog.pdf'),
        ar: getAssetPath('/en-catalog.pdf'),
        es: getAssetPath('/en-catalog.pdf'),
        de: getAssetPath('/en-catalog.pdf'),
        zh: getAssetPath('/en-catalog.pdf'),
      },
      external: true,
    },
  ],
  followUps: ['contact'],
};

// ---------------------------------------------------------------------------
// Main site (Kendal Elektrik corporate) — unscoped, talks about the group.
// ---------------------------------------------------------------------------

const MAIN_GREETING = {
  tr: "Merhaba! 👋 Ben Kendal Elektrik'in dijital asistanıyım. Sana firmamız, markalarımız ve ürünlerimiz hakkında hazır bilgilerle yardımcı olabilirim. Neyi merak ediyorsun?",
  en: "Hi there! 👋 I'm Kendal Elektrik's digital assistant. I can help with ready-made info about our company, brands, and products. What would you like to know?",
  ar: 'مرحباً! 👋 أنا المساعد الرقمي لشركة كندال إلكتريك. يمكنني مساعدتك بمعلومات جاهزة عن شركتنا وعلاماتنا التجارية ومنتجاتنا. ماذا تريد أن تعرف؟',
  es: '¡Hola! 👋 Soy el asistente digital de Kendal Elektrik. Puedo ayudarte con información sobre nuestra empresa, marcas y productos. ¿Qué te gustaría saber?',
  de: 'Hallo! 👋 Ich bin der digitale Assistent von Kendal Elektrik. Ich kann Ihnen mit Informationen zu unserem Unternehmen, unseren Marken und Produkten helfen. Was möchten Sie wissen?',
  zh: '你好！👋 我是 Kendal Elektrik 的数字助手。我可以为您提供关于我们公司、品牌和产品的现成信息。您想了解什么？',
};

const MAIN_ROOT_TOPIC_IDS = [
  'catalog',
  'company',
  'brands',
  'products',
  'export',
  'projects',
  'retail',
  'certifications',
  'career',
  'contact',
];

const MAIN_NODES: Record<string, ChatNode> = {
  company: {
    id: 'company',
    question: {
      tr: '🏭 Şirketiniz hakkında bilgi alabilir miyim?',
      en: '🏭 Can you tell me about your company?',
      ar: '🏭 هل يمكنني معرفة المزيد عن شركتكم؟',
      es: '🏭 ¿Puede contarme sobre su empresa?',
      de: '🏭 Können Sie mir etwas über Ihr Unternehmen erzählen?',
      zh: '🏭 能介绍一下你们公司吗？',
    },
    answer: {
      tr: "Kendal Elektrik, 1997'den bu yana aydınlatma ve elektrik ekipmanları üreten bir firmayız. İstanbul Silivri'deki 22.000 m² kapalı alanlı tesisimizde 350'den fazla çalışanla, yıllık 80 milyon+ ürün üretim kapasitesine ulaştık. Türkiye, Avrupa ve Orta Doğu'da filament ampul üreten tek üreticiyiz.",
      en: "Kendal Elektrik has been manufacturing lighting and electrical equipment since 1997. At our 22,000 m² facility in Silivri, Istanbul, with 350+ employees, we've reached an annual production capacity of 80 million+ units. We're the only manufacturer of filament bulbs in Turkey, Europe, and the Middle East.",
      ar: 'كندال إلكتريك شركة تُصنّع معدات الإضاءة والكهرباء منذ عام 1997. في منشأتنا التي تبلغ مساحتها 22,000 متر مربع في سيليفري بإسطنبول، وبأكثر من 350 موظفاً، وصلنا إلى طاقة إنتاجية سنوية تتجاوز 80 مليون وحدة. نحن الشركة الوحيدة التي تُنتج مصابيح الفتيل في تركيا وأوروبا والشرق الأوسط.',
      es: 'Kendal Elektrik fabrica equipos de iluminación y eléctricos desde 1997. En nuestra planta de 22.000 m² en Silivri, Estambul, con más de 350 empleados, hemos alcanzado una capacidad de producción anual de más de 80 millones de unidades. Somos el único fabricante de bombillas de filamento en Turquía, Europa y Oriente Medio.',
      de: 'Kendal Elektrik stellt seit 1997 Beleuchtungs- und Elektrogeräte her. In unserer 22.000 m² großen Anlage in Silivri, Istanbul, haben wir mit über 350 Mitarbeitern eine jährliche Produktionskapazität von über 80 Millionen Einheiten erreicht. Wir sind der einzige Hersteller von Filament-Glühbirnen in der Türkei, Europa und dem Nahen Osten.',
      zh: 'Kendal Elektrik 自1997年起生产照明及电气设备。在伊斯坦布尔希利夫里占地22,000平方米的工厂中，350多名员工创造了年产8000万件以上的生产能力。我们是土耳其、欧洲及中东地区唯一的灯丝灯泡制造商。',
    },
    followUps: ['certifications', 'export', 'contact'],
  },
  brands: {
    id: 'brands',
    question: {
      tr: '🏷️ Markalarınız nelerdir?',
      en: '🏷️ What brands do you have?',
      ar: '🏷️ ما هي علاماتكم التجارية؟',
      es: '🏷️ ¿Qué marcas tienen?',
      de: '🏷️ Welche Marken haben Sie?',
      zh: '🏷️ 你们有哪些品牌？',
    },
    answer: {
      tr: 'Kendal Elektrik çatısı altında 3 markamız var:\n\n🏔️ K2 — Profesyonel aydınlatma\n🌀 Vanti — Vantilatör\n💡 Global — Genel kullanım aydınlatma ürünleri\n\nHangisini merak ediyorsun?',
      en: 'We have 3 brands under Kendal Elektrik:\n\n🏔️ K2 — Professional lighting\n🌀 Vanti — Fans\n💡 Global — General-purpose lighting products\n\nWhich one would you like to know more about?',
      ar: 'لدينا 3 علامات تجارية تحت مظلة كندال إلكتريك:\n\n🏔️ K2 — إضاءة احترافية\n🌀 Vanti — مراوح\n💡 Global — منتجات إضاءة للاستخدام العام\n\nأيها تريد معرفة المزيد عنه؟',
      es: 'Tenemos 3 marcas bajo Kendal Elektrik:\n\n🏔️ K2 — Iluminación profesional\n🌀 Vanti — Ventiladores\n💡 Global — Productos de iluminación de uso general\n\n¿Sobre cuál te gustaría saber más?',
      de: 'Wir haben 3 Marken unter Kendal Elektrik:\n\n🏔️ K2 — Professionelle Beleuchtung\n🌀 Vanti — Ventilatoren\n💡 Global — Allzweck-Beleuchtungsprodukte\n\nÜber welche möchten Sie mehr erfahren?',
      zh: 'Kendal Elektrik 旗下有3个品牌：\n\n🏔️ K2 — 专业照明\n🌀 Vanti — 风扇\n💡 Global — 通用照明产品\n\n您想了解哪一个？',
    },
    followUps: ['brand_k2', 'brand_vanti', 'brand_global'],
  },
  brand_k2: {
    id: 'brand_k2',
    question: {
      tr: 'K2 hakkında bilgi alabilir miyim?',
      en: 'Can you tell me about K2?',
      ar: 'هل يمكنني معرفة المزيد عن K2؟',
      es: '¿Puede contarme sobre K2?',
      de: 'Können Sie mir etwas über K2 erzählen?',
      zh: '能介绍一下 K2 吗？',
    },
    answer: {
      tr: "K2, ismini dünyanın en zorlu ve prestijli dağlarından birinden alan, 'Aydınlatmanın Zirvesi' vizyonuyla hareket eden profesyonel markamızdır. Endüstriyel ve mimari projeleriniz için üst düzey kalite ve dayanıklılık sunan K2 çatısı altında; LED paneller, spotlar, projektörler, manyetik sistemler, solar armatürler ve dekoratif çözümler gibi pek çok profesyonel aydınlatma seçeneği yer almaktadır.",
      en: "K2 is our professional brand, named after one of the world's most challenging and prestigious mountains, driven by the vision of being 'The Summit of Lighting.' Offering top-level quality and durability for industrial and architectural projects, K2 features a wide selection of professional lighting solutions, including LED panels, spotlights, projectors, magnetic systems, solar fixtures, and decorative lighting.",
      ar: 'K2 هي علامتنا التجارية الاحترافية، المستمدة اسمها من أحد أصعب الجبال وأكثرها شهرة في العالم، وتعمل برؤية أن تكون "قمة الإضاءة". تقدّم K2 جودة ومتانة من الطراز الأول لمشاريعكم الصناعية والمعمارية، وتضم تشكيلة واسعة من حلول الإضاءة الاحترافية، منها ألواح LED، الكشافات، أجهزة العرض، الأنظمة المغناطيسية، الأجهزة الشمسية، والإضاءة الزخرفية.',
      es: 'K2 es nuestra marca profesional, cuyo nombre proviene de una de las montañas más desafiantes y prestigiosas del mundo, guiada por la visión de ser "La Cumbre de la Iluminación". Ofreciendo calidad y durabilidad de primer nivel para proyectos industriales y arquitectónicos, K2 cuenta con una amplia selección de soluciones de iluminación profesional, incluyendo paneles LED, focos, proyectores, sistemas magnéticos, luminarias solares e iluminación decorativa.',
      de: 'K2 ist unsere professionelle Marke, benannt nach einem der anspruchsvollsten und angesehensten Berge der Welt, mit der Vision, "Der Gipfel der Beleuchtung" zu sein. K2 bietet erstklassige Qualität und Langlebigkeit für Industrie- und Architekturprojekte und umfasst eine breite Auswahl professioneller Beleuchtungslösungen, darunter LED-Panels, Strahler, Projektoren, Magnetsysteme, Solarleuchten und dekorative Beleuchtung.',
      zh: 'K2 是我们的专业品牌，其名称源自世界上最具挑战性和最负盛名的山峰之一，秉承成为"照明之巅"的愿景。K2 为工业和建筑项目提供顶级品质与耐用性，产品线丰富，包括LED平板灯、射灯、投影仪、磁吸系统、太阳能灯具和装饰照明等专业照明解决方案。',
    },
    links: [
      {
        label: {
          tr: 'K2 Sitesini Ziyaret Et →',
          en: 'Visit K2 Site →',
          ar: 'زيارة موقع K2 ←',
          es: 'Visitar Sitio de K2 →',
          de: 'K2-Website Besuchen →',
          zh: '访问 K2 网站 →',
        },
        href: getBrandExternalHref('k2'),
        external: true,
      },
    ],
    followUps: ['brands', 'products'],
  },
  brand_vanti: {
    id: 'brand_vanti',
    question: {
      tr: 'Vanti hakkında bilgi alabilir miyim?',
      en: 'Can you tell me about Vanti?',
      ar: 'هل يمكنني معرفة المزيد عن Vanti؟',
      es: '¿Puede contarme sobre Vanti?',
      de: 'Können Sie mir etwas über Vanti erzählen?',
      zh: '能介绍一下 Vanti 吗？',
    },
    answer: {
      tr: 'Vanti, evler ve ofisler için akıllı LED aydınlatmalı tavan vantilatörleri, sanayi tipi ayaklı vantilatörler, duvar tipi ve taşınabilir fanlardan oluşan geniş bir ürün yelpazesi sunan serinletme markamız.',
      en: 'Vanti is our cooling brand, offering smart LED ceiling fans, industrial pedestal fans, wall-mounted and portable fans for homes and offices.',
      ar: 'Vanti هي علامتنا التجارية للتبريد، وتقدّم مراوح سقف ذكية بإضاءة LED، ومراوح صناعية واقفة، ومراوح جدارية ومحمولة للمنازل والمكاتب.',
      es: 'Vanti es nuestra marca de refrigeración, que ofrece ventiladores de techo inteligentes con LED, ventiladores industriales de pie, y ventiladores de pared y portátiles para hogares y oficinas.',
      de: 'Vanti ist unsere Kühlmarke und bietet intelligente LED-Deckenventilatoren, industrielle Standventilatoren sowie Wand- und tragbare Ventilatoren für Zuhause und Büro.',
      zh: 'Vanti 是我们的清凉品牌，为家庭和办公室提供智能LED吊扇、工业立式风扇、壁挂式及便携式风扇。',
    },
    links: [
      {
        label: {
          tr: 'Vanti Sitesini Ziyaret Et →',
          en: 'Visit Vanti Site →',
          ar: 'زيارة موقع Vanti ←',
          es: 'Visitar Sitio de Vanti →',
          de: 'Vanti-Website Besuchen →',
          zh: '访问 Vanti 网站 →',
        },
        href: getBrandExternalHref('vanti'),
        external: true,
      },
    ],
    followUps: ['brands', 'products'],
  },
  brand_global: {
    id: 'brand_global',
    question: {
      tr: 'Global hakkında bilgi alabilir miyim?',
      en: 'Can you tell me about Global?',
      ar: 'هل يمكنني معرفة المزيد عن Global؟',
      es: '¿Puede contarme sobre Global?',
      de: 'Können Sie mir etwas über Global erzählen?',
      zh: '能介绍一下 Global 吗？',
    },
    answer: {
      tr: 'Global, LED ampul, panel, şerit ve projektör gibi genel kullanım aydınlatma ürünlerini uygun fiyatlarla sunduğumuz markamız.',
      en: 'Global is our brand for general-purpose lighting products — LED bulbs, panels, strips, and projectors — at accessible prices.',
      ar: 'Global هي علامتنا لمنتجات الإضاءة العامة — مصابيح LED، الألواح، الأشرطة، وأجهزة العرض — بأسعار معقولة.',
      es: 'Global es nuestra marca de productos de iluminación de uso general —bombillas LED, paneles, tiras y proyectores— a precios accesibles.',
      de: 'Global ist unsere Marke für Allzweck-Beleuchtungsprodukte — LED-Lampen, Panels, Streifen und Projektoren — zu erschwinglichen Preisen.',
      zh: 'Global 是我们提供通用照明产品的品牌——LED灯泡、平板灯、灯带和投光灯——价格实惠。',
    },
    links: [
      {
        label: {
          tr: 'Global Sitesini Ziyaret Et →',
          en: 'Visit Global Site →',
          ar: 'زيارة موقع Global ←',
          es: 'Visitar Sitio de Global →',
          de: 'Global-Website Besuchen →',
          zh: '访问 Global 网站 →',
        },
        href: getBrandExternalHref('global'),
        external: true,
      },
    ],
    followUps: ['brands', 'products'],
  },
  products: {
    id: 'products',
    question: {
      tr: '💡 Hangi ürünleriniz var?',
      en: '💡 What products do you offer?',
      ar: '💡 ما هي منتجاتكم؟',
      es: '💡 ¿Qué productos ofrecen?',
      de: '💡 Welche Produkte bieten Sie an?',
      zh: '💡 你们提供哪些产品？',
    },
    answer: {
      tr: '1000+ farklı ürün çeşidimizle LED paneller, spotlar, ampuller, projektörler, dekoratif aplikler, magnet ray sistemleri, solar armatürler ve vantilatörler dahil geniş bir katalog sunuyoruz. Detaylı ürün kataloğunu markalarımızın kendi sitelerinde bulabilirsin.',
      en: "With 1000+ different products, we offer a wide catalog including LED panels, spotlights, bulbs, projectors, decorative wall lights, magnetic track systems, solar fixtures, and fans. You can browse the full catalog on each brand's own site.",
      ar: 'مع أكثر من 1000 منتج مختلف، نقدّم كتالوجاً واسعاً يشمل ألواح LED، الكشافات، المصابيح، أجهزة العرض، إضاءات الجدران الزخرفية، أنظمة السكك المغناطيسية، الأجهزة الشمسية، والمراوح. يمكنك تصفّح الكتالوج الكامل على موقع كل علامة تجارية.',
      es: 'Con más de 1000 productos diferentes, ofrecemos un amplio catálogo que incluye paneles LED, focos, bombillas, proyectores, apliques decorativos, sistemas de rieles magnéticos, luminarias solares y ventiladores. Puede consultar el catálogo completo en el sitio de cada marca.',
      de: 'Mit über 1000 verschiedenen Produkten bieten wir einen umfangreichen Katalog, darunter LED-Panels, Strahler, Lampen, Projektoren, dekorative Wandleuchten, Magnetschienensysteme, Solarleuchten und Ventilatoren. Den vollständigen Katalog finden Sie auf der jeweiligen Markenwebsite.',
      zh: '我们拥有1000多种不同产品，提供丰富的产品目录，包括LED平板灯、射灯、灯泡、投光灯、装饰壁灯、磁吸轨道系统、太阳能灯具和风扇。您可以在各品牌自己的网站上浏览完整目录。',
    },
    links: [
      {
        label: {
          tr: 'K2 Ürünleri →',
          en: 'K2 Products →',
          ar: 'منتجات K2 ←',
          es: 'Productos K2 →',
          de: 'K2-Produkte →',
          zh: 'K2 产品 →',
        },
        href: getBrandExternalHref('k2', '/urunler'),
        external: true,
      },
      {
        label: {
          tr: 'Vanti Ürünleri →',
          en: 'Vanti Products →',
          ar: 'منتجات Vanti ←',
          es: 'Productos Vanti →',
          de: 'Vanti-Produkte →',
          zh: 'Vanti 产品 →',
        },
        href: getBrandExternalHref('vanti', '/urunler'),
        external: true,
      },
      {
        label: {
          tr: 'Global Ürünleri →',
          en: 'Global Products →',
          ar: 'منتجات Global ←',
          es: 'Productos Global →',
          de: 'Global-Produkte →',
          zh: 'Global 产品 →',
        },
        href: getBrandExternalHref('global', '/urunler'),
        external: true,
      },
    ],
    followUps: ['catalog', 'brands'],
  },
  export: {
    id: 'export',
    question: {
      tr: '🌍 Kaç ülkeye ihracat yapıyorsunuz?',
      en: '🌍 How many countries do you export to?',
      ar: '🌍 إلى كم دولة تصدّرون؟',
      es: '🌍 ¿A cuántos países exportan?',
      de: '🌍 In wie viele Länder exportieren Sie?',
      zh: '🌍 你们出口到多少个国家？',
    },
    answer: {
      tr: "Türkiye merkezli üretim gücümüzle 4 kıtada 40 ülkeye ihracat yapıyoruz. Asya, Avrupa ve Afrika'da sektörün önde gelen oyuncularından biriyiz.",
      en: "With our Turkey-based manufacturing power, we export to 40 countries across 4 continents, and we're one of the leading players in the sector across Asia, Europe, and Africa.",
      ar: 'بفضل قوتنا الإنتاجية التي تتخذ من تركيا مقراً لها، نصدّر إلى 40 دولة في 4 قارات، ونحن أحد أبرز اللاعبين في القطاع في آسيا وأوروبا وأفريقيا.',
      es: 'Con nuestra potencia de producción con sede en Turquía, exportamos a 40 países en 4 continentes, y somos uno de los actores líderes del sector en Asia, Europa y África.',
      de: 'Mit unserer in der Türkei ansässigen Produktionskraft exportieren wir in 40 Länder auf 4 Kontinenten und sind einer der führenden Akteure der Branche in Asien, Europa und Afrika.',
      zh: '凭借立足土耳其的强大生产实力，我们出口到4大洲40个国家，是亚洲、欧洲和非洲行业内的领先企业之一。',
    },
    followUps: ['projects', 'company'],
  },
  projects: {
    id: 'projects',
    question: {
      tr: '🏗️ Referans projeleriniz nelerdir?',
      en: '🏗️ What are your reference projects?',
      ar: '🏗️ ما هي مشاريعكم المرجعية؟',
      es: '🏗️ ¿Cuáles son sus proyectos de referencia?',
      de: '🏗️ Was sind Ihre Referenzprojekte?',
      zh: '🏗️ 你们有哪些参考项目？',
    },
    answer: {
      tr: "Türkiye genelinde 43 referans projemiz arasında Volkswagen, Ducati, Levi's, Vitra, Triumph, Hard Rock Cafe, MEF Üniversitesi ve Borusan Oto'nun birçok şubesi yer alıyor. Ayrıca çok sayıda AVM projesinde de imzamız var.",
      en: "Among our 43 reference projects across Turkey are Volkswagen, Ducati, Levi's, Vitra, Triumph, Hard Rock Cafe, MEF University, and several Borusan Oto locations — plus numerous shopping mall projects.",
      ar: 'من بين مشاريعنا المرجعية الـ43 في جميع أنحاء تركيا: فولكس فاغن، دوكاتي، ليفايز، فيترا، ترايومف، هارد روك كافيه، جامعة MEF، والعديد من فروع بوروسان أوتو — بالإضافة إلى العديد من مشاريع مراكز التسوق.',
      es: 'Entre nuestros 43 proyectos de referencia en toda Turquía se encuentran Volkswagen, Ducati, Levi\'s, Vitra, Triumph, Hard Rock Cafe, la Universidad MEF y varias sucursales de Borusan Oto, además de numerosos proyectos de centros comerciales.',
      de: 'Zu unseren 43 Referenzprojekten in der ganzen Türkei zählen Volkswagen, Ducati, Levi\'s, Vitra, Triumph, Hard Rock Cafe, die MEF-Universität und mehrere Borusan-Oto-Standorte — sowie zahlreiche Einkaufszentrumsprojekte.',
      zh: '我们在土耳其各地的43个参考项目中，包括大众汽车、杜卡迪、Levi\'s、Vitra、凯旋、硬石咖啡厅、MEF大学以及多家 Borusan Oto 门店，此外还有众多购物中心项目。',
    },
    links: [
      {
        label: {
          tr: 'Tüm Projeleri Gör →',
          en: 'See All Projects →',
          ar: 'عرض جميع المشاريع ←',
          es: 'Ver Todos los Proyectos →',
          de: 'Alle Projekte Ansehen →',
          zh: '查看所有项目 →',
        },
        href: '/projeler',
      },
    ],
    followUps: ['retail'],
  },
  retail: {
    id: 'retail',
    question: {
      tr: '🛒 Hangi marketlerde ürünleriniz var?',
      en: '🛒 Which stores carry your products?',
      ar: '🛒 في أي المتاجر تتوفر منتجاتكم؟',
      es: '🛒 ¿En qué tiendas se encuentran sus productos?',
      de: '🛒 In welchen Geschäften gibt es Ihre Produkte?',
      zh: '🛒 哪些商店有你们的产品？',
    },
    answer: {
      tr: "Ürünlerimizi BİM, A101, Koçtaş, Türkiye Tarım Kredi Kooperatif Market, Bizim Toptan, Seç Market, Avansas ve ANPA Gross gibi Türkiye'nin önde gelen zincir marketlerinde bulabilirsin.",
      en: 'You can find our products at leading Turkish retail chains such as BİM, A101, Koçtaş, Türkiye Tarım Kredi Market, Bizim Toptan, Seç Market, Avansas, and ANPA Gross.',
      ar: 'يمكنك العثور على منتجاتنا في أبرز سلاسل المتاجر التركية مثل BİM وA101 وKoçtaş وTürkiye Tarım Kredi Market وBizim Toptan وSeç Market وAvansas وANPA Gross.',
      es: 'Puede encontrar nuestros productos en las principales cadenas minoristas turcas como BİM, A101, Koçtaş, Türkiye Tarım Kredi Market, Bizim Toptan, Seç Market, Avansas y ANPA Gross.',
      de: 'Unsere Produkte finden Sie bei führenden türkischen Handelsketten wie BİM, A101, Koçtaş, Türkiye Tarım Kredi Market, Bizim Toptan, Seç Market, Avansas und ANPA Gross.',
      zh: '您可以在土耳其主要连锁零售商找到我们的产品，如 BİM、A101、Koçtaş、Türkiye Tarım Kredi Market、Bizim Toptan、Seç Market、Avansas 和 ANPA Gross。',
    },
    followUps: ['projects'],
  },
  certifications: {
    id: 'certifications',
    question: {
      tr: '🏆 Sertifikalarınız nelerdir?',
      en: '🏆 What certifications do you have?',
      ar: '🏆 ما هي شهاداتكم؟',
      es: '🏆 ¿Qué certificaciones tienen?',
      de: '🏆 Welche Zertifikate haben Sie?',
      zh: '🏆 你们有哪些认证？',
    },
    answer: {
      tr: 'Kalitemizi ISO Yönetim Sistemi Sertifikaları, TSE Ürün Onay Sertifikaları, Yerli Malı Belgesi ve Türk Patent marka tescilleriyle belgeliyoruz. Ayrıca RBA (Responsible Business Alliance) uluslararası denetiminde 97/100 puan aldık.',
      en: 'We back our quality with ISO Management System Certificates, TSE Product Approval Certificates, a Domestic Product Certificate, and Turkish Patent trademark registrations. We also scored 97/100 in the RBA (Responsible Business Alliance) international audit.',
      ar: 'نوثّق جودتنا بشهادات نظام إدارة الآيزو، وشهادات اعتماد المنتج من TSE، وشهادة المنتج المحلي، وتسجيلات العلامة التجارية لدى Turk Patent. كما حصلنا على 97/100 في التدقيق الدولي لـ RBA (تحالف الأعمال المسؤولة).',
      es: 'Respaldamos nuestra calidad con certificados del sistema de gestión ISO, certificados de aprobación de producto TSE, un certificado de producto nacional y registros de marca en Turk Patent. También obtuvimos 97/100 en la auditoría internacional RBA (Responsible Business Alliance).',
      de: 'Wir untermauern unsere Qualität mit ISO-Managementsystem-Zertifikaten, TSE-Produktzulassungszertifikaten, einem Zertifikat für Inlandsprodukte und Markenregistrierungen bei Turk Patent. Zudem erzielten wir 97/100 Punkte bei der internationalen RBA-Prüfung (Responsible Business Alliance).',
      zh: '我们以ISO管理体系认证、TSE产品认证、本土产品证书以及Turk Patent商标注册来保证我们的品质。此外，我们在RBA（负责任商业联盟）国际审核中获得97/100分。',
    },
    followUps: ['company'],
  },
  career: {
    id: 'career',
    question: {
      tr: '💼 Kariyer fırsatlarınız var mı?',
      en: '💼 Do you have career opportunities?',
      ar: '💼 هل لديكم فرص وظيفية؟',
      es: '💼 ¿Tienen oportunidades laborales?',
      de: '💼 Haben Sie Karrieremöglichkeiten?',
      zh: '💼 你们有招聘机会吗？',
    },
    answer: {
      tr: 'Kendal Elektrik ailesine katılmak ister misin? Kariyer sayfamızda insan kaynakları politikamız, temel ilkelerimiz ve çalışan hakları politikamız hakkında bilgi bulabilirsin.',
      en: 'Interested in joining the Kendal Elektrik family? Our careers page covers our HR policy, core principles, and employee rights policy.',
      ar: 'هل ترغب في الانضمام إلى عائلة كندال إلكتريك؟ ستجد في صفحة الوظائف لدينا معلومات عن سياسة الموارد البشرية ومبادئنا الأساسية وسياسة حقوق الموظفين.',
      es: '¿Le interesa unirse a la familia Kendal Elektrik? Nuestra página de empleo incluye nuestra política de RR. HH., principios fundamentales y política de derechos de los empleados.',
      de: 'Möchten Sie Teil der Kendal-Elektrik-Familie werden? Unsere Karriereseite behandelt unsere Personalpolitik, Grundprinzipien und Richtlinie zu Mitarbeiterrechten.',
      zh: '有兴趣加入 Kendal Elektrik 大家庭吗？我们的招聘页面介绍了人力资源政策、核心原则和员工权益政策。',
    },
    links: [
      {
        label: {
          tr: 'Kariyer Sayfasına Git →',
          en: 'Go to Careers Page →',
          ar: 'الذهاب إلى صفحة الوظائف ←',
          es: 'Ir a la Página de Empleo →',
          de: 'Zur Karriereseite →',
          zh: '前往招聘页面 →',
        },
        href: '/kariyer',
      },
    ],
    followUps: ['company'],
  },
  contact: CONTACT_NODE,
  catalog: CATALOG_NODE,
};

// ---------------------------------------------------------------------------
// K2 — professional lighting brand micro-site.
// Figures below (category product counts, families) are pulled from the
// live products.json catalog, not invented — re-check with the brand
// breakdown script (see chatbot memory) if the catalog changes materially.
// ---------------------------------------------------------------------------

const K2_GREETING = {
  tr: "Merhaba! 👋 Ben K2'nin dijital asistanıyım. Profesyonel aydınlatma markamız K2 hakkında sana yardımcı olabilirim. Neyi merak ediyorsun?",
  en: "Hi there! 👋 I'm K2's digital assistant. I can help with anything about our professional lighting brand K2. What would you like to know?",
  ar: 'مرحباً! 👋 أنا المساعد الرقمي لعلامة K2. يمكنني مساعدتك بأي شيء يتعلق بعلامتنا للإضاءة الاحترافية K2. ماذا تريد أن تعرف؟',
  es: '¡Hola! 👋 Soy el asistente digital de K2. Puedo ayudarte con todo lo relacionado con nuestra marca de iluminación profesional K2. ¿Qué te gustaría saber?',
  de: 'Hallo! 👋 Ich bin der digitale Assistent von K2. Ich helfe Ihnen gerne bei allen Fragen zu unserer professionellen Beleuchtungsmarke K2. Was möchten Sie wissen?',
  zh: '你好！👋 我是 K2 的数字助手。我可以为您解答关于我们专业照明品牌 K2 的任何问题。您想了解什么？',
};

const K2_ROOT_TOPIC_IDS = [
  'catalog',
  'k2_about',
  'k2_categories',
  'k2_solar',
  'k2_magnet',
  'k2_trust',
  'k2_export',
  'k2_products',
  'contact',
];

const K2_NODES: Record<string, ChatNode> = {
  k2_about: {
    id: 'k2_about',
    question: {
      tr: '🏔️ K2 hakkında bilgi verir misin?',
      en: '🏔️ Can you tell me about K2?',
      ar: '🏔️ هل يمكنك إخباري عن K2؟',
      es: '🏔️ ¿Puedes contarme sobre K2?',
      de: '🏔️ Kannst du mir etwas über K2 erzählen?',
      zh: '🏔️ 能介绍一下 K2 吗？',
    },
    answer: {
      tr: "K2, ismini dağcıların zirveye ulaşması en zor ve prestijli dağlarından biri olan K2'den alıyor ve 'Karanlığı Aydınlatıyoruz' vizyonuyla hareket ediyor. Kendal Elektrik güvencesiyle üretilen K2, profesyonel LED teknolojisi, enerji verimliliği odaklı çözümleri ve dekoratif ürünleriyle Türkiye'nin en prestijli ve güvenilir aydınlatma markalarından biri.",
      en: "K2 takes its name from the mountain K2 — one of the most difficult and prestigious peaks for climbers to conquer — and operates with the vision to 'Illuminate the Darkness.' Backed by Kendal Elektrik's assurance, K2 stands out with professional LED technology, energy-efficient solutions, and decorative products, making it one of Turkey's most prestigious and trusted lighting brands.",
      ar: 'تستمد K2 اسمها من جبل K2 — أحد أصعب وأشهر القمم التي يتسلقها المتسلقون — وتعمل برؤية "نُضيء الظلام". وبضمان كندال إلكتريك، تتميز K2 بتقنية LED الاحترافية، والحلول الموجهة نحو كفاءة الطاقة، والمنتجات الزخرفية، مما يجعلها واحدة من أكثر علامات الإضاءة شهرة وموثوقية في تركيا.',
      es: 'K2 toma su nombre de la montaña K2 — una de las cumbres más difíciles y prestigiosas para los alpinistas — y opera con la visión de "Iluminar la Oscuridad". Respaldada por la garantía de Kendal Elektrik, K2 destaca por su tecnología LED profesional, soluciones orientadas a la eficiencia energética y productos decorativos, siendo una de las marcas de iluminación más prestigiosas y confiables de Turquía.',
      de: 'K2 trägt den Namen des Berges K2 — einer der schwierigsten und angesehensten Gipfel für Bergsteiger — und verfolgt die Vision, "die Dunkelheit zu erhellen". Mit der Garantie von Kendal Elektrik überzeugt K2 durch professionelle LED-Technologie, energieeffiziente Lösungen und dekorative Produkte und zählt zu den angesehensten und vertrauenswürdigsten Beleuchtungsmarken der Türkei.',
      zh: 'K2 的名字取自 K2 峰——登山者眼中最难攀登、最负盛名的山峰之一，秉承"照亮黑暗"的愿景。在 Kendal Elektrik 的品质保证下，K2 以专业LED技术、节能解决方案和装饰性产品脱颖而出，成为土耳其最负盛名、最值得信赖的照明品牌之一。',
    },
    followUps: ['k2_categories', 'k2_trust'],
  },
  k2_categories: {
    id: 'k2_categories',
    question: {
      tr: '💡 Hangi ürün kategorileriniz var?',
      en: '💡 What product categories do you have?',
      ar: '💡 ما هي فئات منتجاتكم؟',
      es: '💡 ¿Qué categorías de productos tienen?',
      de: '💡 Welche Produktkategorien haben Sie?',
      zh: '💡 你们有哪些产品分类？',
    },
    answer: {
      tr: "700'ü aşkın modelle geniş bir katalogumuz var. Öne çıkan kategoriler: Spotlar, LED Paneller, LED Ampuller, LED Aplikler, Armatürler, Magnet Ray Sistemleri, Projektörler, Trafolar, LED Flaman Ampuller, Masa Lambaları, LED Şeritler ve Solar Armatürler.",
      en: 'We have a wide catalog of 700+ models. Highlights include Spotlights, LED Panels, LED Bulbs, LED Wall Lights, Fixtures, Magnetic Track Systems, Projectors, Transformers, LED Filament Bulbs, Table Lamps, LED Strips and Solar Fixtures.',
      ar: 'لدينا كتالوج واسع يضم أكثر من 700 موديل. أبرز الفئات: الكشافات، ألواح LED، مصابيح LED، إضاءات الجدران LED، الأجهزة، أنظمة السكك المغناطيسية، أجهزة العرض، المحولات، مصابيح LED ذات الفتيل، مصابيح الطاولة، أشرطة LED، والأجهزة الشمسية.',
      es: 'Tenemos un amplio catálogo de más de 700 modelos. Destacan: Focos, Paneles LED, Bombillas LED, Apliques LED, Luminarias, Sistemas de Rieles Magnéticos, Proyectores, Transformadores, Bombillas LED de Filamento, Lámparas de Mesa, Tiras LED y Luminarias Solares.',
      de: 'Wir haben einen umfangreichen Katalog mit über 700 Modellen. Highlights sind Strahler, LED-Panels, LED-Lampen, LED-Wandleuchten, Leuchten, Magnetschienensysteme, Projektoren, Transformatoren, LED-Filament-Lampen, Tischlampen, LED-Streifen und Solarleuchten.',
      zh: '我们拥有700多款型号的丰富产品目录。主要类别包括：射灯、LED平板灯、LED灯泡、LED壁灯、灯具、磁吸轨道系统、投光灯、变压器、LED灯丝灯泡、台灯、LED灯带和太阳能灯具。',
    },
    links: [
      {
        label: {
          tr: 'Tüm Kategorileri Gör →',
          en: 'See All Categories →',
          ar: 'عرض جميع الفئات ←',
          es: 'Ver Todas las Categorías →',
          de: 'Alle Kategorien Ansehen →',
          zh: '查看所有分类 →',
        },
        href: getBrandUrunlerHref('k2'),
      },
    ],
    followUps: ['k2_solar', 'k2_magnet'],
  },
  k2_solar: {
    id: 'k2_solar',
    question: {
      tr: '☀️ Solar (güneş enerjili) ürünleriniz var mı?',
      en: '☀️ Do you have solar-powered products?',
      ar: '☀️ هل لديكم منتجات تعمل بالطاقة الشمسية؟',
      es: '☀️ ¿Tienen productos que funcionan con energía solar?',
      de: '☀️ Haben Sie solarbetriebene Produkte?',
      zh: '☀️ 你们有太阳能产品吗？',
    },
    answer: {
      tr: 'Evet — Solar Armatürler, Solar Sokak Armatürleri ve Solar Bahçe Armatürleri olmak üzere geniş bir solar aydınlatma serimiz var. Şebeke bağlantısı gerektirmeden, güneş enerjisiyle çalışan dış mekan aydınlatma çözümleri sunuyoruz.',
      en: 'Yes — we have a wide solar lighting range: Solar Fixtures, Solar Street Fixtures, and Solar Garden Fixtures. These are outdoor lighting solutions powered by solar energy with no need for a grid connection.',
      ar: 'نعم — لدينا تشكيلة واسعة من إضاءة الطاقة الشمسية: الأجهزة الشمسية، إضاءة الشوارع الشمسية، وإضاءة الحدائق الشمسية. هذه حلول إضاءة خارجية تعمل بالطاقة الشمسية دون الحاجة لاتصال بالشبكة الكهربائية.',
      es: 'Sí — tenemos una amplia gama de iluminación solar: Luminarias Solares, Luminarias Solares para Calles y Luminarias Solares para Jardines. Son soluciones de iluminación exterior alimentadas por energía solar sin necesidad de conexión a la red.',
      de: 'Ja — wir haben ein breites Solarbeleuchtungssortiment: Solarleuchten, Solar-Straßenleuchten und Solar-Gartenleuchten. Dies sind Außenbeleuchtungslösungen, die mit Solarenergie betrieben werden, ohne Netzanschluss zu benötigen.',
      zh: '有的——我们拥有丰富的太阳能照明系列：太阳能灯具、太阳能路灯和太阳能庭院灯。这些都是无需接入电网、依靠太阳能供电的户外照明解决方案。',
    },
    followUps: ['k2_categories', 'k2_products'],
  },
  k2_magnet: {
    id: 'k2_magnet',
    question: {
      tr: '🧲 Magnet ray sistemleriniz nedir?',
      en: '🧲 What are your magnetic track systems?',
      ar: '🧲 ما هي أنظمة السكك المغناطيسية لديكم؟',
      es: '🧲 ¿Qué son sus sistemas de rieles magnéticos?',
      de: '🧲 Was sind Ihre Magnetschienensysteme?',
      zh: '🧲 你们的磁吸轨道系统是什么？',
    },
    answer: {
      tr: "K2'nin magnet ray sistemleri, mağaza, ofis ve showroom aydınlatmasında esnek ve modüler kurulum imkanı sunan profesyonel aydınlatma çözümleri. Geniş bir magnet aksesuar ve armatür serisiyle projeye özel aydınlatma tasarımına olanak tanıyor.",
      en: "K2's magnetic track systems are professional lighting solutions offering flexible, modular installation for stores, offices, and showrooms. A wide range of magnetic accessories and fixtures allows project-specific lighting designs.",
      ar: 'أنظمة السكك المغناطيسية من K2 هي حلول إضاءة احترافية توفّر تركيباً مرناً ومعيارياً للمتاجر والمكاتب وصالات العرض. وتتيح تشكيلة واسعة من الملحقات والأجهزة المغناطيسية تصميم إضاءة خاص بكل مشروع.',
      es: 'Los sistemas de rieles magnéticos de K2 son soluciones de iluminación profesional que ofrecen una instalación flexible y modular para tiendas, oficinas y salas de exposición. Una amplia gama de accesorios y luminarias magnéticas permite diseños de iluminación específicos para cada proyecto.',
      de: 'Die Magnetschienensysteme von K2 sind professionelle Beleuchtungslösungen mit flexibler, modularer Installation für Geschäfte, Büros und Showrooms. Ein breites Sortiment an Magnetzubehör und Leuchten ermöglicht projektspezifische Beleuchtungsdesigns.',
      zh: 'K2 的磁吸轨道系统是专为商店、办公室和展厅设计的专业照明解决方案，安装灵活、模块化。丰富的磁吸配件和灯具系列可实现项目定制化的照明设计。',
    },
    followUps: ['k2_categories', 'k2_products'],
  },
  k2_trust: {
    id: 'k2_trust',
    question: {
      tr: '⭐ Müşteri memnuniyetiniz nasıl?',
      en: '⭐ How is your customer satisfaction?',
      ar: '⭐ ما مدى رضا عملائكم؟',
      es: '⭐ ¿Cómo es su satisfacción del cliente?',
      de: '⭐ Wie ist Ihre Kundenzufriedenheit?',
      zh: '⭐ 你们的客户满意度如何？',
    },
    answer: {
      tr: "Profesyonel LED aydınlatmada sektörün zirvesindeki markalardan biriyiz — ortalama müşteri memnuniyetimiz 9.5/10, iade oranımız ise %0.5'in altında.",
      en: "We're one of the peak names in the industry for professional LED lighting — our average customer satisfaction is 9.5/10, with a return rate under 0.5%.",
      ar: 'نحن من أبرز الأسماء في قطاع إضاءة LED الاحترافية — متوسط رضا عملائنا 9.5/10، ونسبة الإرجاع لدينا أقل من 0.5%.',
      es: 'Somos una de las marcas líderes del sector en iluminación LED profesional — nuestra satisfacción media del cliente es 9.5/10, con una tasa de devolución inferior al 0.5%.',
      de: 'Wir sind eine der führenden Marken der Branche im Bereich professionelle LED-Beleuchtung — unsere durchschnittliche Kundenzufriedenheit liegt bei 9,5/10, mit einer Rücklaufquote unter 0,5 %.',
      zh: '我们是专业LED照明行业的顶尖品牌之一——平均客户满意度达9.5/10，退货率低于0.5%。',
    },
    followUps: ['k2_about', 'k2_export'],
  },
  k2_export: {
    id: 'k2_export',
    question: {
      tr: '🌍 K2 yurt dışına satılıyor mu?',
      en: '🌍 Is K2 sold internationally?',
      ar: '🌍 هل تُباع K2 دولياً؟',
      es: '🌍 ¿Se vende K2 internacionalmente?',
      de: '🌍 Wird K2 international verkauft?',
      zh: '🌍 K2 在海外销售吗？',
    },
    answer: {
      tr: "K2'nin ışığı sınır tanımıyor — Kendal Elektrik'in Türkiye merkezli üretim gücüyle 4 kıtada 40 ülkeye ihracat yapıyoruz.",
      en: "K2's light knows no borders — through Kendal Elektrik's Turkey-based manufacturing power, we export to 40 countries across 4 continents.",
      ar: 'ضوء K2 لا يعرف حدوداً — من خلال قوة كندال إلكتريك الإنتاجية التي تتخذ من تركيا مقراً لها، نصدّر إلى 40 دولة في 4 قارات.',
      es: 'La luz de K2 no conoce fronteras — a través de la potencia de producción de Kendal Elektrik con sede en Turquía, exportamos a 40 países en 4 continentes.',
      de: 'Das Licht von K2 kennt keine Grenzen — über die in der Türkei ansässige Produktionskraft von Kendal Elektrik exportieren wir in 40 Länder auf 4 Kontinenten.',
      zh: 'K2 的光芒无国界——凭借 Kendal Elektrik 立足土耳其的强大生产实力，我们出口到4大洲40个国家。',
    },
    followUps: ['k2_trust'],
  },
  k2_products: {
    id: 'k2_products',
    question: {
      tr: '🛒 Ürün kataloğunu nereden inceleyebilirim?',
      en: '🛒 Where can I browse the product catalog?',
      ar: '🛒 أين يمكنني تصفّح كتالوج المنتجات؟',
      es: '🛒 ¿Dónde puedo consultar el catálogo de productos?',
      de: '🛒 Wo kann ich den Produktkatalog ansehen?',
      zh: '🛒 在哪里可以浏览产品目录？',
    },
    answer: {
      tr: 'Tüm K2 ürün kataloğunu, kategori ve filtrelerle birlikte aşağıdaki sayfadan inceleyebilirsin.',
      en: 'You can browse the full K2 product catalog, with categories and filters, on the page below.',
      ar: 'يمكنك تصفّح كتالوج منتجات K2 كاملاً، مع الفئات والفلاتر، من الصفحة أدناه.',
      es: 'Puede consultar el catálogo completo de productos K2, con categorías y filtros, en la página de abajo.',
      de: 'Den vollständigen K2-Produktkatalog mit Kategorien und Filtern finden Sie auf der folgenden Seite.',
      zh: '您可以在下方页面浏览完整的 K2 产品目录，包含分类和筛选功能。',
    },
    links: [
      {
        label: {
          tr: 'K2 Ürünlerini İncele →',
          en: 'Browse K2 Products →',
          ar: 'تصفّح منتجات K2 ←',
          es: 'Ver Productos K2 →',
          de: 'K2-Produkte Ansehen →',
          zh: '浏览 K2 产品 →',
        },
        href: getBrandUrunlerHref('k2'),
      },
    ],
    followUps: ['k2_categories', 'catalog'],
  },
  contact: CONTACT_NODE,
  catalog: CATALOG_NODE,
};

// ---------------------------------------------------------------------------
// Vanti — cooling / fan brand micro-site.
// Family counts come from substring-matching model/name against the same
// query terms VantiProductFamilies.tsx itself uses, so they track the page.
// ---------------------------------------------------------------------------

const VANTI_GREETING = {
  tr: "Merhaba! 👋 Ben Vanti'nin dijital asistanıyım. Serinlik markamız Vanti hakkında sana yardımcı olabilirim. Neyi merak ediyorsun?",
  en: "Hi there! 👋 I'm Vanti's digital assistant. I can help with anything about our cooling brand Vanti. What would you like to know?",
  ar: 'مرحباً! 👋 أنا المساعد الرقمي لعلامة Vanti. يمكنني مساعدتك بأي شيء يتعلق بعلامتنا للتبريد Vanti. ماذا تريد أن تعرف؟',
  es: '¡Hola! 👋 Soy el asistente digital de Vanti. Puedo ayudarte con todo lo relacionado con nuestra marca de refrigeración Vanti. ¿Qué te gustaría saber?',
  de: 'Hallo! 👋 Ich bin der digitale Assistent von Vanti. Ich helfe Ihnen gerne bei allen Fragen zu unserer Kühlmarke Vanti. Was möchten Sie wissen?',
  zh: '你好！👋 我是 Vanti 的数字助手。我可以为您解答关于我们清凉品牌 Vanti 的任何问题。您想了解什么？',
};

const VANTI_ROOT_TOPIC_IDS = [
  'catalog',
  'vanti_about',
  'vanti_families',
  'vanti_smart',
  'vanti_energy',
  'vanti_trust',
  'vanti_export',
  'vanti_products',
  'contact',
];

const VANTI_NODES: Record<string, ChatNode> = {
  vanti_about: {
    id: 'vanti_about',
    question: {
      tr: '🌀 Vanti hakkında bilgi verir misin?',
      en: '🌀 Can you tell me about Vanti?',
      ar: '🌀 هل يمكنك إخباري عن Vanti؟',
      es: '🌀 ¿Puedes contarme sobre Vanti?',
      de: '🌀 Kannst du mir etwas über Vanti erzählen?',
      zh: '🌀 能介绍一下 Vanti 吗？',
    },
    answer: {
      tr: "Vanti, evler ve ofisler için serinliğin ve konforun tek adresi — Kendal Elektrik güvencesiyle üretilen, Türkiye'nin güvendiği serinlik markası. Akıllı LED aydınlatmalı tavan vantilatörlerinden sanayi tipi ayaklı vantilatörlere, duvar tipi ve taşınabilir fanlara kadar geniş bir ürün yelpazesi sunuyoruz.",
      en: "Vanti is the one-stop address for coolness and comfort in homes and offices — a cooling brand Turkey trusts, backed by Kendal Elektrik's assurance. We offer a wide range from smart LED ceiling fans to industrial pedestal fans, wall-mounted and portable fans.",
      ar: 'Vanti هي الوجهة الأولى للانتعاش والراحة في المنازل والمكاتب — علامة تبريد تثق بها تركيا، وبضمان كندال إلكتريك. نقدّم تشكيلة واسعة من مراوح السقف الذكية بإضاءة LED إلى المراوح الصناعية الواقفة والمراوح الجدارية والمحمولة.',
      es: 'Vanti es la dirección única para el frescor y el confort en hogares y oficinas — una marca de refrigeración en la que confía Turquía, respaldada por la garantía de Kendal Elektrik. Ofrecemos una amplia gama, desde ventiladores de techo inteligentes con LED hasta ventiladores industriales de pie, de pared y portátiles.',
      de: 'Vanti ist die einzige Adresse für Kühle und Komfort in Zuhause und Büro — eine Kühlmarke, der die Türkei vertraut, mit der Garantie von Kendal Elektrik. Wir bieten ein breites Sortiment von intelligenten LED-Deckenventilatoren bis hin zu industriellen Standventilatoren, Wand- und tragbaren Ventilatoren.',
      zh: 'Vanti 是家庭和办公室清凉与舒适的唯一之选——土耳其信赖的清凉品牌，由 Kendal Elektrik 提供品质保证。我们提供从智能LED吊扇到工业立式风扇、壁挂式及便携式风扇的丰富产品线。',
    },
    followUps: ['vanti_families', 'vanti_trust'],
  },
  vanti_families: {
    id: 'vanti_families',
    question: {
      tr: '🌬️ Hangi vantilatör tiplerini üretiyorsunuz?',
      en: '🌬️ What types of fans do you make?',
      ar: '🌬️ ما هي أنواع المراوح التي تصنعونها؟',
      es: '🌬️ ¿Qué tipos de ventiladores fabrican?',
      de: '🌬️ Welche Ventilatortypen stellen Sie her?',
      zh: '🌬️ 你们生产哪些类型的风扇？',
    },
    answer: {
      tr: "7 ürün ailemiz var:\n\n🏠 Tavan Vantilatörleri (akıllı LED aydınlatmalı dahil)\n🏭 Sanayi Tipi Vantilatörler\n🦵 Ayaklı Vantilatörler\n🧱 Duvar Tipi Vantilatörler\n🖥️ Masaüstü Fanlar\n🔋 Şarjlı El Vantilatörleri\n🚿 Banyo Aspiratörleri\n\nToplamda 50'yi aşkın modelimiz var.",
      en: 'We have 7 product families:\n\n🏠 Ceiling Fans (including smart LED-lit models)\n🏭 Industrial Fans\n🦵 Stand Fans\n🧱 Wall Fans\n🖥️ Desktop Fans\n🔋 Rechargeable Hand Fans\n🚿 Bathroom Extractor Fans\n\nOver 50 models in total.',
      ar: 'لدينا 7 عائلات منتجات:\n\n🏠 مراوح السقف (بما فيها الموديلات ذات إضاءة LED الذكية)\n🏭 مراوح صناعية\n🦵 مراوح واقفة\n🧱 مراوح حائط\n🖥️ مراوح مكتبية\n🔋 مراوح يدوية قابلة للشحن\n🚿 شفاطات الحمام\n\nأكثر من 50 موديلاً إجمالاً.',
      es: 'Tenemos 7 familias de productos:\n\n🏠 Ventiladores de Techo (incluidos modelos con LED inteligente)\n🏭 Ventiladores Industriales\n🦵 Ventiladores de Pie\n🧱 Ventiladores de Pared\n🖥️ Ventiladores de Escritorio\n🔋 Ventiladores de Mano Recargables\n🚿 Extractores de Baño\n\nMás de 50 modelos en total.',
      de: 'Wir haben 7 Produktfamilien:\n\n🏠 Deckenventilatoren (auch mit intelligenter LED-Beleuchtung)\n🏭 Industrieventilatoren\n🦵 Standventilatoren\n🧱 Wandventilatoren\n🖥️ Tischventilatoren\n🔋 Akku-Handventilatoren\n🚿 Bad-Lüfter\n\nInsgesamt über 50 Modelle.',
      zh: '我们拥有7大产品系列：\n\n🏠 吊扇（包括智能LED灯吊扇）\n🏭 工业风扇\n🦵 落地扇\n🧱 壁扇\n🖥️ 桌面风扇\n🔋 充电式手持风扇\n🚿 浴室排气扇\n\n总计超过50款型号。',
    },
    links: [
      {
        label: {
          tr: 'Tüm Ürünleri Gör →',
          en: 'See All Products →',
          ar: 'عرض جميع المنتجات ←',
          es: 'Ver Todos los Productos →',
          de: 'Alle Produkte Ansehen →',
          zh: '查看所有产品 →',
        },
        href: getBrandUrunlerHref('vanti'),
      },
    ],
    followUps: ['vanti_smart', 'vanti_products'],
  },
  vanti_smart: {
    id: 'vanti_smart',
    question: {
      tr: '❄️ Akıllı soğutma teknolojiniz nedir?',
      en: '❄️ What is your smart cooling technology?',
      ar: '❄️ ما هي تقنية التبريد الذكي لديكم؟',
      es: '❄️ ¿Qué es su tecnología de enfriamiento inteligente?',
      de: '❄️ Was ist Ihre intelligente Kühltechnologie?',
      zh: '❄️ 你们的智能降温技术是什么？',
    },
    answer: {
      tr: 'Vantilatörlerimiz geniş açılı salınım ve aerodinamik pervane yapısıyla havayı homojen dağıtır ve anında ferahlık sağlar. Bazı tavan vantilatörü modellerimiz ayrıca akıllı LED aydınlatma özelliğiyle geliyor.',
      en: 'Our fans distribute air evenly and provide instant freshness through wide-angle oscillation and an aerodynamic blade structure. Some of our ceiling fan models also come with smart LED lighting.',
      ar: 'توزّع مراوحنا الهواء بشكل متجانس وتوفر انتعاشاً فورياً بفضل الدوران واسع الزاوية وهيكل الريش الانسيابي. كما تأتي بعض موديلات مراوح السقف بميزة إضاءة LED ذكية.',
      es: 'Nuestros ventiladores distribuyen el aire de manera uniforme y proporcionan frescor instantáneo gracias a la oscilación de gran ángulo y la estructura aerodinámica de las aspas. Algunos modelos de ventiladores de techo también incluyen iluminación LED inteligente.',
      de: 'Unsere Ventilatoren verteilen die Luft gleichmäßig und sorgen dank Weitwinkel-Schwenkung und aerodynamischer Flügelstruktur für sofortige Frische. Einige Deckenventilator-Modelle verfügen zudem über intelligente LED-Beleuchtung.',
      zh: '我们的风扇凭借广角摆动和空气动力学叶片结构，均匀分配气流，带来即时清凉。部分吊扇型号还配备智能LED照明功能。',
    },
    followUps: ['vanti_families', 'vanti_energy'],
  },
  vanti_energy: {
    id: 'vanti_energy',
    question: {
      tr: '🍃 Enerji tasarrufu sağlıyor mu?',
      en: '🍃 Are your fans energy-saving?',
      ar: '🍃 هل توفّر الطاقة؟',
      es: '🍃 ¿Sus ventiladores ahorran energía?',
      de: '🍃 Sind Ihre Ventilatoren energiesparend?',
      zh: '🍃 你们的风扇节能吗？',
    },
    answer: {
      tr: 'Evet — Vanti serisi, düşük enerji tüketimiyle yüksek performans sunan çevre dostu bir tasarıma sahip. Yazın serin geçmesi için enerji faturana da iyi gelir.',
      en: 'Yes — the Vanti series has an eco-friendly design offering high performance with low energy consumption, keeping both your home and your energy bill cool through summer.',
      ar: 'نعم — تتميز سلسلة Vanti بتصميم صديق للبيئة يقدّم أداءً عالياً باستهلاك منخفض للطاقة، مما يبقي منزلك وفاتورة الطاقة باردين طوال الصيف.',
      es: 'Sí — la serie Vanti tiene un diseño ecológico que ofrece un alto rendimiento con bajo consumo energético, manteniendo fresco tanto su hogar como su factura de energía durante el verano.',
      de: 'Ja — die Vanti-Serie verfügt über ein umweltfreundliches Design mit hoher Leistung bei niedrigem Energieverbrauch und hält so sowohl Ihr Zuhause als auch Ihre Stromrechnung im Sommer kühl.',
      zh: '是的——Vanti 系列采用环保设计，在低能耗的同时提供高性能，让您的家和电费账单在整个夏天都保持"清凉"。',
    },
    followUps: ['vanti_smart'],
  },
  vanti_trust: {
    id: 'vanti_trust',
    question: {
      tr: '⭐ Müşteri memnuniyetiniz nasıl?',
      en: '⭐ How is your customer satisfaction?',
      ar: '⭐ ما مدى رضا عملائكم؟',
      es: '⭐ ¿Cómo es su satisfacción del cliente?',
      de: '⭐ Wie ist Ihre Kundenzufriedenheit?',
      zh: '⭐ 你们的客户满意度如何？',
    },
    answer: {
      tr: "Türkiye'nin en çok tercih edilen vantilatör markalarından biriyiz — ortalama müşteri memnuniyetimiz 9.4/10, iade oranımız ise %0.5'in altında.",
      en: "We're among Turkey's most preferred fan brands — our average customer satisfaction is 9.4/10, with a return rate under 0.5%.",
      ar: 'نحن من بين أكثر علامات المراوح تفضيلاً في تركيا — متوسط رضا عملائنا 9.4/10، ونسبة الإرجاع لدينا أقل من 0.5%.',
      es: 'Estamos entre las marcas de ventiladores más preferidas de Turquía — nuestra satisfacción media del cliente es 9.4/10, con una tasa de devolución inferior al 0.5%.',
      de: 'Wir gehören zu den bevorzugten Ventilatormarken der Türkei — unsere durchschnittliche Kundenzufriedenheit liegt bei 9,4/10, mit einer Rücklaufquote unter 0,5 %.',
      zh: '我们是土耳其最受青睐的风扇品牌之一——平均客户满意度达9.4/10，退货率低于0.5%。',
    },
    followUps: ['vanti_about', 'vanti_export'],
  },
  vanti_export: {
    id: 'vanti_export',
    question: {
      tr: '🌍 Vanti yurt dışına satılıyor mu?',
      en: '🌍 Is Vanti sold internationally?',
      ar: '🌍 هل تُباع Vanti دولياً؟',
      es: '🌍 ¿Se vende Vanti internacionalmente?',
      de: '🌍 Wird Vanti international verkauft?',
      zh: '🌍 Vanti 在海外销售吗？',
    },
    answer: {
      tr: "Evet, Vanti'nin serinliği Türkiye'den dünyaya ihraç ediliyor — Kendal Elektrik'in ihracat ağıyla 4 kıtada 40 ülkeye ulaşıyoruz.",
      en: "Yes, Vanti's cooling is exported from Turkey to the world — through Kendal Elektrik's export network we reach 40 countries across 4 continents.",
      ar: 'نعم، انتعاش Vanti يُصدَّر من تركيا إلى العالم — من خلال شبكة تصدير كندال إلكتريك نصل إلى 40 دولة في 4 قارات.',
      es: 'Sí, el frescor de Vanti se exporta desde Turquía al mundo — a través de la red de exportación de Kendal Elektrik llegamos a 40 países en 4 continentes.',
      de: 'Ja, die Kühle von Vanti wird von der Türkei aus in die Welt exportiert — über das Exportnetzwerk von Kendal Elektrik erreichen wir 40 Länder auf 4 Kontinenten.',
      zh: '是的，Vanti 的清凉从土耳其出口到全世界——通过 Kendal Elektrik 的出口网络，我们覆盖4大洲40个国家。',
    },
    followUps: ['vanti_trust'],
  },
  vanti_products: {
    id: 'vanti_products',
    question: {
      tr: '🛒 Ürün kataloğunu nereden inceleyebilirim?',
      en: '🛒 Where can I browse the product catalog?',
      ar: '🛒 أين يمكنني تصفّح كتالوج المنتجات؟',
      es: '🛒 ¿Dónde puedo consultar el catálogo de productos?',
      de: '🛒 Wo kann ich den Produktkatalog ansehen?',
      zh: '🛒 在哪里可以浏览产品目录？',
    },
    answer: {
      tr: 'Tüm Vanti ürün kataloğunu, kategori ve filtrelerle birlikte aşağıdaki sayfadan inceleyebilirsin.',
      en: 'You can browse the full Vanti product catalog, with categories and filters, on the page below.',
      ar: 'يمكنك تصفّح كتالوج منتجات Vanti كاملاً، مع الفئات والفلاتر، من الصفحة أدناه.',
      es: 'Puede consultar el catálogo completo de productos Vanti, con categorías y filtros, en la página de abajo.',
      de: 'Den vollständigen Vanti-Produktkatalog mit Kategorien und Filtern finden Sie auf der folgenden Seite.',
      zh: '您可以在下方页面浏览完整的 Vanti 产品目录，包含分类和筛选功能。',
    },
    links: [
      {
        label: {
          tr: 'Vanti Ürünlerini İncele →',
          en: 'Browse Vanti Products →',
          ar: 'تصفّح منتجات Vanti ←',
          es: 'Ver Productos Vanti →',
          de: 'Vanti-Produkte Ansehen →',
          zh: '浏览 Vanti 产品 →',
        },
        href: getBrandUrunlerHref('vanti'),
      },
    ],
    followUps: ['vanti_families', 'catalog'],
  },
  contact: CONTACT_NODE,
  catalog: CATALOG_NODE,
};

// ---------------------------------------------------------------------------
// Global — general-purpose / value lighting brand micro-site. Unlike K2 and
// Vanti (which export via ExportMap), Global's page instead highlights a
// domestic 77-province dealer network (DealerMap) — reflected below.
// ---------------------------------------------------------------------------

const GLOBAL_GREETING = {
  tr: "Merhaba! 👋 Ben Global'in dijital asistanıyım. Aydınlatma markamız Global hakkında sana yardımcı olabilirim. Neyi merak ediyorsun?",
  en: "Hi there! 👋 I'm Global's digital assistant. I can help with anything about our lighting brand Global. What would you like to know?",
  ar: 'مرحباً! 👋 أنا المساعد الرقمي لعلامة Global. يمكنني مساعدتك بأي شيء يتعلق بعلامتنا للإضاءة Global. ماذا تريد أن تعرف؟',
  es: '¡Hola! 👋 Soy el asistente digital de Global. Puedo ayudarte con todo lo relacionado con nuestra marca de iluminación Global. ¿Qué te gustaría saber?',
  de: 'Hallo! 👋 Ich bin der digitale Assistent von Global. Ich helfe Ihnen gerne bei allen Fragen zu unserer Beleuchtungsmarke Global. Was möchten Sie wissen?',
  zh: '你好！👋 我是 Global 的数字助手。我可以为您解答关于我们照明品牌 Global 的任何问题。您想了解什么？',
};

const GLOBAL_ROOT_TOPIC_IDS = [
  'catalog',
  'global_about',
  'global_categories',
  'global_dealers',
  'global_trust',
  'global_future',
  'global_products',
  'contact',
];

const GLOBAL_NODES: Record<string, ChatNode> = {
  global_about: {
    id: 'global_about',
    question: {
      tr: '💡 Global hakkında bilgi verir misin?',
      en: '💡 Can you tell me about Global?',
      ar: '💡 هل يمكنك إخباري عن Global؟',
      es: '💡 ¿Puedes contarme sobre Global?',
      de: '💡 Kannst du mir etwas über Global erzählen?',
      zh: '💡 能介绍一下 Global 吗？',
    },
    answer: {
      tr: "Global, kapsamlı aydınlatma çözümleri sunan ve Kendal Elektrik'in 29 yıllık üretim tecrübesiyle güçlenen markamız. LED ampul, panel, şerit ve projektör gibi genel kullanım aydınlatma ürünlerini uygun fiyatlarla sunuyoruz — aydınlatmada güvenilir bir isim.",
      en: "Global is our comprehensive lighting solutions brand, backed by Kendal Elektrik's 29 years of manufacturing experience. We offer general-purpose lighting products — LED bulbs, panels, strips, and projectors — at accessible prices. A trusted name in lighting.",
      ar: 'Global هي علامتنا للحلول الشاملة للإضاءة، المدعومة بخبرة 29 عاماً في الإنتاج لدى كندال إلكتريك. نقدّم منتجات إضاءة للاستخدام العام — مصابيح LED، الألواح، الأشرطة، وأجهزة العرض — بأسعار معقولة. اسم موثوق في عالم الإضاءة.',
      es: 'Global es nuestra marca de soluciones integrales de iluminación, respaldada por 29 años de experiencia en fabricación de Kendal Elektrik. Ofrecemos productos de iluminación de uso general —bombillas LED, paneles, tiras y proyectores— a precios accesibles. Un nombre confiable en iluminación.',
      de: 'Global ist unsere Marke für umfassende Beleuchtungslösungen, gestützt auf 29 Jahre Produktionserfahrung von Kendal Elektrik. Wir bieten Allzweck-Beleuchtungsprodukte — LED-Lampen, Panels, Streifen und Projektoren — zu erschwinglichen Preisen. Ein vertrauenswürdiger Name in der Beleuchtung.',
      zh: 'Global 是我们提供全方位照明解决方案的品牌，依托 Kendal Elektrik 29年的生产经验。我们提供通用照明产品——LED灯泡、平板灯、灯带和投光灯——价格实惠，是照明领域值得信赖的名字。',
    },
    followUps: ['global_categories', 'global_trust'],
  },
  global_categories: {
    id: 'global_categories',
    question: {
      tr: '💡 Hangi ürün kategorileriniz var?',
      en: '💡 What product categories do you have?',
      ar: '💡 ما هي فئات منتجاتكم؟',
      es: '💡 ¿Qué categorías de productos tienen?',
      de: '💡 Welche Produktkategorien haben Sie?',
      zh: '💡 你们有哪些产品分类？',
    },
    answer: {
      tr: 'Öne çıkan kategoriler: LED Ampuller, LED Paneller, Projektörler, Şerit LEDler (dış mekan dahil) ve Neon LEDler. Ev ve ofis kullanımına uygun, erişilebilir fiyatlı geniş bir katalog sunuyoruz.',
      en: 'Highlights include LED Bulbs, LED Panels, Projectors, LED Strips (including outdoor), and Neon LEDs. We offer a wide, accessibly priced catalog suited to home and office use.',
      ar: 'أبرز الفئات: مصابيح LED، ألواح LED، أجهزة العرض، أشرطة LED (بما فيها الخارجية)، وأضواء LED النيون. نقدّم كتالوجاً واسعاً بأسعار معقولة يناسب الاستخدام المنزلي والمكتبي.',
      es: 'Destacan: Bombillas LED, Paneles LED, Proyectores, Tiras LED (incluidas exteriores) y LEDs Neón. Ofrecemos un catálogo amplio y a precios accesibles, adecuado para uso doméstico y de oficina.',
      de: 'Highlights sind LED-Lampen, LED-Panels, Projektoren, LED-Streifen (auch für den Außenbereich) und Neon-LEDs. Wir bieten einen umfangreichen, erschwinglichen Katalog für Heim- und Bürogebrauch.',
      zh: '主要类别包括：LED灯泡、LED平板灯、投光灯、LED灯带（含户外款）和霓虹LED灯。我们提供丰富且价格实惠的产品目录，适合家庭和办公使用。',
    },
    links: [
      {
        label: {
          tr: 'Tüm Kategorileri Gör →',
          en: 'See All Categories →',
          ar: 'عرض جميع الفئات ←',
          es: 'Ver Todas las Categorías →',
          de: 'Alle Kategorien Ansehen →',
          zh: '查看所有分类 →',
        },
        href: getBrandUrunlerHref('global'),
      },
    ],
    followUps: ['global_dealers', 'global_products'],
  },
  global_dealers: {
    id: 'global_dealers',
    question: {
      tr: '🏪 Nerede satın alabilirim?',
      en: '🏪 Where can I buy Global products?',
      ar: '🏪 من أين يمكنني الشراء؟',
      es: '🏪 ¿Dónde puedo comprar productos Global?',
      de: '🏪 Wo kann ich Global-Produkte kaufen?',
      zh: '🏪 我在哪里可以购买 Global 产品？',
    },
    answer: {
      tr: "Türkiye genelinde 77 ilde yetkili bayimizle, Türkiye'nin her köşesine ışık taşıyan güçlü bir bayi ağımız var. En yakın yetkili bayiyi bulmak için bize ulaşabilirsin.",
      en: 'We have a powerful dealer network with authorized dealers in 77 provinces across Turkey, carrying light to every corner of the country. Reach out to us to find your nearest authorized dealer.',
      ar: 'لدينا شبكة موزعين قوية بموزعين معتمدين في 77 ولاية في جميع أنحاء تركيا، تحمل الضوء إلى كل ركن من البلاد. تواصل معنا للعثور على أقرب موزع معتمد.',
      es: 'Contamos con una potente red de distribuidores con distribuidores autorizados en 77 provincias de toda Turquía, llevando luz a cada rincón del país. Contáctenos para encontrar su distribuidor autorizado más cercano.',
      de: 'Wir verfügen über ein starkes Händlernetzwerk mit autorisierten Händlern in 77 Provinzen der Türkei, das Licht in jeden Winkel des Landes bringt. Kontaktieren Sie uns, um Ihren nächstgelegenen autorisierten Händler zu finden.',
      zh: '我们在土耳其77个省份拥有强大的授权经销商网络，将光明带到全国每个角落。请联系我们以找到离您最近的授权经销商。',
    },
    followUps: ['contact'],
  },
  global_trust: {
    id: 'global_trust',
    question: {
      tr: '⭐ Müşteri memnuniyetiniz nasıl?',
      en: '⭐ How is your customer satisfaction?',
      ar: '⭐ ما مدى رضا عملائكم؟',
      es: '⭐ ¿Cómo es su satisfacción del cliente?',
      de: '⭐ Wie ist Ihre Kundenzufriedenheit?',
      zh: '⭐ 你们的客户满意度如何？',
    },
    answer: {
      tr: "Aydınlatma markaları arasında sektörün güvendiği isimlerden biriyiz — ortalama müşteri memnuniyetimiz 9.6/10, iade oranımız ise %0.5'in altında.",
      en: "We're one of the trusted industry names among lighting brands — our average customer satisfaction is 9.6/10, with a return rate under 0.5%.",
      ar: 'نحن من الأسماء الموثوقة في القطاع بين علامات الإضاءة — متوسط رضا عملائنا 9.6/10، ونسبة الإرجاع لدينا أقل من 0.5%.',
      es: 'Somos uno de los nombres de confianza del sector entre las marcas de iluminación — nuestra satisfacción media del cliente es 9.6/10, con una tasa de devolución inferior al 0.5%.',
      de: 'Wir gehören zu den vertrauenswürdigen Namen der Branche unter den Beleuchtungsmarken — unsere durchschnittliche Kundenzufriedenheit liegt bei 9,6/10, mit einer Rücklaufquote unter 0,5 %.',
      zh: '在照明品牌中，我们是行业信赖的名字之一——平均客户满意度达9.6/10，退货率低于0.5%。',
    },
    followUps: ['global_about', 'global_future'],
  },
  global_future: {
    id: 'global_future',
    question: {
      tr: '🚀 Yeni nesil ürünleriniz var mı?',
      en: '🚀 Do you have next-generation products?',
      ar: '🚀 هل لديكم منتجات من الجيل الجديد؟',
      es: '🚀 ¿Tienen productos de nueva generación?',
      de: '🚀 Haben Sie Produkte der nächsten Generation?',
      zh: '🚀 你们有新一代产品吗？',
    },
    answer: {
      tr: 'Geleceğin ışığını üretiyoruz — daha parlak, daha uzun ömürlü ve sınırları zorlayan yüksek teknolojili tasarımlarla katalogumuzu sürekli geliştiriyoruz.',
      en: "We're building the light of the future — continuously expanding our catalog with brighter, longer-lasting, boundary-pushing high-tech designs.",
      ar: 'نحن نصنع ضوء المستقبل — نوسّع كتالوجنا باستمرار بتصاميم عالية التقنية أكثر سطوعاً وطول عمر وتتجاوز الحدود.',
      es: 'Estamos construyendo la luz del futuro — ampliando continuamente nuestro catálogo con diseños de alta tecnología más brillantes, duraderos y que superan los límites.',
      de: 'Wir bauen das Licht der Zukunft — wir erweitern unseren Katalog kontinuierlich um hellere, langlebigere und grenzüberschreitende Hightech-Designs.',
      zh: '我们正在打造未来之光——不断以更明亮、更持久、突破极限的高科技设计扩充我们的产品目录。',
    },
    followUps: ['global_categories'],
  },
  global_products: {
    id: 'global_products',
    question: {
      tr: '🛒 Ürün kataloğunu nereden inceleyebilirim?',
      en: '🛒 Where can I browse the product catalog?',
      ar: '🛒 أين يمكنني تصفّح كتالوج المنتجات؟',
      es: '🛒 ¿Dónde puedo consultar el catálogo de productos?',
      de: '🛒 Wo kann ich den Produktkatalog ansehen?',
      zh: '🛒 在哪里可以浏览产品目录？',
    },
    answer: {
      tr: 'Tüm Global ürün kataloğunu, kategori ve filtrelerle birlikte aşağıdaki sayfadan inceleyebilirsin.',
      en: 'You can browse the full Global product catalog, with categories and filters, on the page below.',
      ar: 'يمكنك تصفّح كتالوج منتجات Global كاملاً، مع الفئات والفلاتر، من الصفحة أدناه.',
      es: 'Puede consultar el catálogo completo de productos Global, con categorías y filtros, en la página de abajo.',
      de: 'Den vollständigen Global-Produktkatalog mit Kategorien und Filtern finden Sie auf der folgenden Seite.',
      zh: '您可以在下方页面浏览完整的 Global 产品目录，包含分类和筛选功能。',
    },
    links: [
      {
        label: {
          tr: 'Global Ürünlerini İncele →',
          en: 'Browse Global Products →',
          ar: 'تصفّح منتجات Global ←',
          es: 'Ver Productos Global →',
          de: 'Global-Produkte Ansehen →',
          zh: '浏览 Global 产品 →',
        },
        href: getBrandUrunlerHref('global'),
      },
    ],
    followUps: ['global_categories', 'catalog'],
  },
  contact: CONTACT_NODE,
  catalog: CATALOG_NODE,
};

export const CHATBOT_CONTEXTS: Record<
  'main' | 'k2' | 'vanti' | 'global',
  ChatContext
> = {
  main: {
    greeting: MAIN_GREETING,
    rootTopicIds: MAIN_ROOT_TOPIC_IDS,
    nodes: MAIN_NODES,
  },
  k2: {
    greeting: K2_GREETING,
    rootTopicIds: K2_ROOT_TOPIC_IDS,
    nodes: K2_NODES,
  },
  vanti: {
    greeting: VANTI_GREETING,
    rootTopicIds: VANTI_ROOT_TOPIC_IDS,
    nodes: VANTI_NODES,
  },
  global: {
    greeting: GLOBAL_GREETING,
    rootTopicIds: GLOBAL_ROOT_TOPIC_IDS,
    nodes: GLOBAL_NODES,
  },
};
