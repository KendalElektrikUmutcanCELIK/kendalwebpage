import {
  getAssetPath,
  getBrandExternalHref,
  getBrandUrunlerHref,
} from '@/lib/basePath';

export interface ChatLink {
  label: { tr: string; en: string };
  href: string | { tr: string; en: string };
  external?: boolean;
}

export interface ChatNode {
  id: string;
  question: { tr: string; en: string };
  answer: { tr: string; en: string };
  links?: ChatLink[];
  followUps?: string[];
}

export interface ChatContext {
  greeting: { tr: string; en: string };
  rootTopicIds: string[];
  nodes: Record<string, ChatNode>;
}

export const MENU_BACK = {
  label: { tr: '⬅ Ana Menü', en: '⬅ Main Menu' },
  prompt: {
    tr: 'Başka bir konuda daha yardımcı olabilir miyim?',
    en: 'Anything else I can help you with?',
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
  },
  answer: {
    tr: 'Bize şu kanallardan ulaşabilirsin:\n\n📞 İletişim Hattı: 0212 482 75 90\n📞 Satış Destek: 0850 259 41 41\n📞 Teknik Servis: 444 34 98\n✉️ info@kendalelektrik.com.tr\n📍 Adres: Selimpaşa Org. San. Böl. 5008 Sokak No:6 Silivri/İstanbul',
    en: 'You can reach us through:\n\n📞 Contact Line: 0212 482 75 90\n📞 Sales Support: 0850 259 41 41\n📞 Technical Service: 444 34 98\n✉️ info@kendalelektrik.com.tr\n📍 Address: Selimpaşa Org. San. Böl. 5008 Sokak No:6 Silivri/İstanbul, Türkiye',
  },
  links: [
    {
      label: { tr: 'Haritada Aç →', en: 'Open in Maps →' },
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
  },
  answer: {
    tr: 'Evet! Tüm ürün ailemizi, teknik detayları ve yeni modellerimizi içeren güncel kataloğumuzu aşağıdaki bağlantıdan inceleyebilir veya PDF olarak indirebilirsin.',
    en: 'Yes! You can view or download our up-to-date catalog containing all our product families, technical details, and new models from the links below.',
  },
  links: [
    {
      label: { tr: 'Kataloğu İncele 📥', en: 'Browse Catalog 📥' },
      href: {
        tr: getAssetPath('/kendal-elektrik-katalog-2026.pdf'),
        en: getAssetPath('/en-catalog.pdf'),
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
    },
    answer: {
      tr: "Kendal Elektrik, 1997'den bu yana aydınlatma ve elektrik ekipmanları üreten bir firmayız. İstanbul Silivri'deki 22.000 m² kapalı alanlı tesisimizde 350'den fazla çalışanla, yıllık 80 milyon+ ürün üretim kapasitesine ulaştık. Türkiye, Avrupa ve Orta Doğu'da filament ampul üreten tek üreticiyiz.",
      en: "Kendal Elektrik has been manufacturing lighting and electrical equipment since 1997. At our 22,000 m² facility in Silivri, Istanbul, with 350+ employees, we've reached an annual production capacity of 80 million+ units. We're the only manufacturer of filament bulbs in Turkey, Europe, and the Middle East.",
    },
    followUps: ['certifications', 'export', 'contact'],
  },
  brands: {
    id: 'brands',
    question: {
      tr: '🏷️ Markalarınız nelerdir?',
      en: '🏷️ What brands do you have?',
    },
    answer: {
      tr: 'Kendal Elektrik çatısı altında 3 markamız var:\n\n🏔️ K2 — Profesyonel aydınlatma\n🌀 Vanti — Vantilatör\n💡 Global — Genel kullanım aydınlatma ürünleri\n\nHangisini merak ediyorsun?',
      en: 'We have 3 brands under Kendal Elektrik:\n\n🏔️ K2 — Professional lighting\n🌀 Vanti — Fans\n💡 Global — General-purpose lighting products\n\nWhich one would you like to know more about?',
    },
    followUps: ['brand_k2', 'brand_vanti', 'brand_global'],
  },
  brand_k2: {
    id: 'brand_k2',
    question: {
      tr: 'K2 hakkında bilgi alabilir miyim?',
      en: 'Can you tell me about K2?',
    },
    answer: {
      tr: "K2, ismini dünyanın en zorlu ve prestijli dağlarından birinden alan, 'Aydınlatmanın Zirvesi' vizyonuyla hareket eden profesyonel markamızdır. Endüstriyel ve mimari projeleriniz için üst düzey kalite ve dayanıklılık sunan K2 çatısı altında; LED paneller, spotlar, projektörler, manyetik sistemler, solar armatürler ve dekoratif çözümler gibi pek çok profesyonel aydınlatma seçeneği yer almaktadır.",
      en: "K2 is our professional brand, named after one of the world's most challenging and prestigious mountains, driven by the vision of being 'The Summit of Lighting.' Offering top-level quality and durability for industrial and architectural projects, K2 features a wide selection of professional lighting solutions, including LED panels, spotlights, projectors, magnetic systems, solar fixtures, and decorative lighting.",
    },
    links: [
      {
        label: { tr: 'K2 Sitesini Ziyaret Et →', en: 'Visit K2 Site →' },
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
    },
    answer: {
      tr: 'Vanti, evler ve ofisler için akıllı LED aydınlatmalı tavan vantilatörleri, sanayi tipi ayaklı vantilatörler, duvar tipi ve taşınabilir fanlardan oluşan geniş bir ürün yelpazesi sunan serinletme markamız.',
      en: 'Vanti is our cooling brand, offering smart LED ceiling fans, industrial pedestal fans, wall-mounted and portable fans for homes and offices.',
    },
    links: [
      {
        label: { tr: 'Vanti Sitesini Ziyaret Et →', en: 'Visit Vanti Site →' },
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
    },
    answer: {
      tr: 'Global, LED ampul, panel, şerit ve projektör gibi genel kullanım aydınlatma ürünlerini uygun fiyatlarla sunduğumuz markamız.',
      en: 'Global is our brand for general-purpose lighting products — LED bulbs, panels, strips, and projectors — at accessible prices.',
    },
    links: [
      {
        label: {
          tr: 'Global Sitesini Ziyaret Et →',
          en: 'Visit Global Site →',
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
    },
    answer: {
      tr: '1000+ farklı ürün çeşidimizle LED paneller, spotlar, ampuller, projektörler, dekoratif aplikler, magnet ray sistemleri, solar armatürler ve vantilatörler dahil geniş bir katalog sunuyoruz. Detaylı ürün kataloğunu markalarımızın kendi sitelerinde bulabilirsin.',
      en: "With 1000+ different products, we offer a wide catalog including LED panels, spotlights, bulbs, projectors, decorative wall lights, magnetic track systems, solar fixtures, and fans. You can browse the full catalog on each brand's own site.",
    },
    links: [
      {
        label: { tr: 'K2 Ürünleri →', en: 'K2 Products →' },
        href: getBrandExternalHref('k2', '/urunler'),
        external: true,
      },
      {
        label: { tr: 'Vanti Ürünleri →', en: 'Vanti Products →' },
        href: getBrandExternalHref('vanti', '/urunler'),
        external: true,
      },
      {
        label: { tr: 'Global Ürünleri →', en: 'Global Products →' },
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
    },
    answer: {
      tr: "Türkiye merkezli üretim gücümüzle 4 kıtada 40 ülkeye ihracat yapıyoruz. Asya, Avrupa ve Afrika'da sektörün önde gelen oyuncularından biriyiz.",
      en: "With our Turkey-based manufacturing power, we export to 40 countries across 4 continents, and we're one of the leading players in the sector across Asia, Europe, and Africa.",
    },
    followUps: ['projects', 'company'],
  },
  projects: {
    id: 'projects',
    question: {
      tr: '🏗️ Referans projeleriniz nelerdir?',
      en: '🏗️ What are your reference projects?',
    },
    answer: {
      tr: "Türkiye genelinde 43 referans projemiz arasında Volkswagen, Ducati, Levi's, Vitra, Triumph, Hard Rock Cafe, MEF Üniversitesi ve Borusan Oto'nun birçok şubesi yer alıyor. Ayrıca çok sayıda AVM projesinde de imzamız var.",
      en: "Among our 43 reference projects across Turkey are Volkswagen, Ducati, Levi's, Vitra, Triumph, Hard Rock Cafe, MEF University, and several Borusan Oto locations — plus numerous shopping mall projects.",
    },
    links: [
      {
        label: { tr: 'Tüm Projeleri Gör →', en: 'See All Projects →' },
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
    },
    answer: {
      tr: "Ürünlerimizi BİM, A101, Koçtaş, Türkiye Tarım Kredi Kooperatif Market, Bizim Toptan, Seç Market, Avansas ve ANPA Gross gibi Türkiye'nin önde gelen zincir marketlerinde bulabilirsin.",
      en: 'You can find our products at leading Turkish retail chains such as BİM, A101, Koçtaş, Türkiye Tarım Kredi Market, Bizim Toptan, Seç Market, Avansas, and ANPA Gross.',
    },
    followUps: ['projects'],
  },
  certifications: {
    id: 'certifications',
    question: {
      tr: '🏆 Sertifikalarınız nelerdir?',
      en: '🏆 What certifications do you have?',
    },
    answer: {
      tr: 'Kalitemizi ISO Yönetim Sistemi Sertifikaları, TSE Ürün Onay Sertifikaları, Yerli Malı Belgesi ve Türk Patent marka tescilleriyle belgeliyoruz. Ayrıca RBA (Responsible Business Alliance) uluslararası denetiminde 97/100 puan aldık.',
      en: 'We back our quality with ISO Management System Certificates, TSE Product Approval Certificates, a Domestic Product Certificate, and Turkish Patent trademark registrations. We also scored 97/100 in the RBA (Responsible Business Alliance) international audit.',
    },
    followUps: ['company'],
  },
  career: {
    id: 'career',
    question: {
      tr: '💼 Kariyer fırsatlarınız var mı?',
      en: '💼 Do you have career opportunities?',
    },
    answer: {
      tr: 'Kendal Elektrik ailesine katılmak ister misin? Kariyer sayfamızda insan kaynakları politikamız, temel ilkelerimiz ve çalışan hakları politikamız hakkında bilgi bulabilirsin.',
      en: 'Interested in joining the Kendal Elektrik family? Our careers page covers our HR policy, core principles, and employee rights policy.',
    },
    links: [
      {
        label: { tr: 'Kariyer Sayfasına Git →', en: 'Go to Careers Page →' },
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
    },
    answer: {
      tr: "K2, ismini dağcıların zirveye ulaşması en zor ve prestijli dağlarından biri olan K2'den alıyor ve 'Karanlığı Aydınlatıyoruz' vizyonuyla hareket ediyor. Kendal Elektrik güvencesiyle üretilen K2, profesyonel LED teknolojisi, enerji verimliliği odaklı çözümleri ve dekoratif ürünleriyle Türkiye'nin en prestijli ve güvenilir aydınlatma markalarından biri.",
      en: "K2 takes its name from the mountain K2 — one of the most difficult and prestigious peaks for climbers to conquer — and operates with the vision to 'Illuminate the Darkness.' Backed by Kendal Elektrik's assurance, K2 stands out with professional LED technology, energy-efficient solutions, and decorative products, making it one of Turkey's most prestigious and trusted lighting brands.",
    },
    followUps: ['k2_categories', 'k2_trust'],
  },
  k2_categories: {
    id: 'k2_categories',
    question: {
      tr: '💡 Hangi ürün kategorileriniz var?',
      en: '💡 What product categories do you have?',
    },
    answer: {
      tr: "700'ü aşkın modelle geniş bir katalogumuz var. Öne çıkan kategoriler: Spotlar, LED Paneller, LED Ampuller, LED Aplikler, Armatürler, Magnet Ray Sistemleri, Projektörler, Trafolar, LED Flaman Ampuller, Masa Lambaları, LED Şeritler ve Solar Armatürler.",
      en: 'We have a wide catalog of 700+ models. Highlights include Spotlights, LED Panels, LED Bulbs, LED Wall Lights, Fixtures, Magnetic Track Systems, Projectors, Transformers, LED Filament Bulbs, Table Lamps, LED Strips and Solar Fixtures.',
    },
    links: [
      {
        label: { tr: 'Tüm Kategorileri Gör →', en: 'See All Categories →' },
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
    },
    answer: {
      tr: 'Evet — Solar Armatürler, Solar Sokak Armatürleri ve Solar Bahçe Armatürleri olmak üzere geniş bir solar aydınlatma serimiz var. Şebeke bağlantısı gerektirmeden, güneş enerjisiyle çalışan dış mekan aydınlatma çözümleri sunuyoruz.',
      en: 'Yes — we have a wide solar lighting range: Solar Fixtures, Solar Street Fixtures, and Solar Garden Fixtures. These are outdoor lighting solutions powered by solar energy with no need for a grid connection.',
    },
    followUps: ['k2_categories', 'k2_products'],
  },
  k2_magnet: {
    id: 'k2_magnet',
    question: {
      tr: '🧲 Magnet ray sistemleriniz nedir?',
      en: '🧲 What are your magnetic track systems?',
    },
    answer: {
      tr: "K2'nin magnet ray sistemleri, mağaza, ofis ve showroom aydınlatmasında esnek ve modüler kurulum imkanı sunan profesyonel aydınlatma çözümleri. Geniş bir magnet aksesuar ve armatür serisiyle projeye özel aydınlatma tasarımına olanak tanıyor.",
      en: "K2's magnetic track systems are professional lighting solutions offering flexible, modular installation for stores, offices, and showrooms. A wide range of magnetic accessories and fixtures allows project-specific lighting designs.",
    },
    followUps: ['k2_categories', 'k2_products'],
  },
  k2_trust: {
    id: 'k2_trust',
    question: {
      tr: '⭐ Müşteri memnuniyetiniz nasıl?',
      en: '⭐ How is your customer satisfaction?',
    },
    answer: {
      tr: "Profesyonel LED aydınlatmada sektörün zirvesindeki markalardan biriyiz — ortalama müşteri memnuniyetimiz 9.5/10, iade oranımız ise %0.5'in altında.",
      en: "We're one of the peak names in the industry for professional LED lighting — our average customer satisfaction is 9.5/10, with a return rate under 0.5%.",
    },
    followUps: ['k2_about', 'k2_export'],
  },
  k2_export: {
    id: 'k2_export',
    question: {
      tr: '🌍 K2 yurt dışına satılıyor mu?',
      en: '🌍 Is K2 sold internationally?',
    },
    answer: {
      tr: "K2'nin ışığı sınır tanımıyor — Kendal Elektrik'in Türkiye merkezli üretim gücüyle 4 kıtada 40 ülkeye ihracat yapıyoruz.",
      en: "K2's light knows no borders — through Kendal Elektrik's Turkey-based manufacturing power, we export to 40 countries across 4 continents.",
    },
    followUps: ['k2_trust'],
  },
  k2_products: {
    id: 'k2_products',
    question: {
      tr: '🛒 Ürün kataloğunu nereden inceleyebilirim?',
      en: '🛒 Where can I browse the product catalog?',
    },
    answer: {
      tr: 'Tüm K2 ürün kataloğunu, kategori ve filtrelerle birlikte aşağıdaki sayfadan inceleyebilirsin.',
      en: 'You can browse the full K2 product catalog, with categories and filters, on the page below.',
    },
    links: [
      {
        label: { tr: 'K2 Ürünlerini İncele →', en: 'Browse K2 Products →' },
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
    },
    answer: {
      tr: "Vanti, evler ve ofisler için serinliğin ve konforun tek adresi — Kendal Elektrik güvencesiyle üretilen, Türkiye'nin güvendiği serinlik markası. Akıllı LED aydınlatmalı tavan vantilatörlerinden sanayi tipi ayaklı vantilatörlere, duvar tipi ve taşınabilir fanlara kadar geniş bir ürün yelpazesi sunuyoruz.",
      en: "Vanti is the one-stop address for coolness and comfort in homes and offices — a cooling brand Turkey trusts, backed by Kendal Elektrik's assurance. We offer a wide range from smart LED ceiling fans to industrial pedestal fans, wall-mounted and portable fans.",
    },
    followUps: ['vanti_families', 'vanti_trust'],
  },
  vanti_families: {
    id: 'vanti_families',
    question: {
      tr: '🌬️ Hangi vantilatör tiplerini üretiyorsunuz?',
      en: '🌬️ What types of fans do you make?',
    },
    answer: {
      tr: "7 ürün ailemiz var:\n\n🏠 Tavan Vantilatörleri (akıllı LED aydınlatmalı dahil)\n🏭 Sanayi Tipi Vantilatörler\n🦵 Ayaklı Vantilatörler\n🧱 Duvar Tipi Vantilatörler\n🖥️ Masaüstü Fanlar\n🔋 Şarjlı El Vantilatörleri\n🚿 Banyo Aspiratörleri\n\nToplamda 50'yi aşkın modelimiz var.",
      en: 'We have 7 product families:\n\n🏠 Ceiling Fans (including smart LED-lit models)\n🏭 Industrial Fans\n🦵 Stand Fans\n🧱 Wall Fans\n🖥️ Desktop Fans\n🔋 Rechargeable Hand Fans\n🚿 Bathroom Extractor Fans\n\nOver 50 models in total.',
    },
    links: [
      {
        label: { tr: 'Tüm Ürünleri Gör →', en: 'See All Products →' },
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
    },
    answer: {
      tr: 'Vantilatörlerimiz geniş açılı salınım ve aerodinamik pervane yapısıyla havayı homojen dağıtır ve anında ferahlık sağlar. Bazı tavan vantilatörü modellerimiz ayrıca akıllı LED aydınlatma özelliğiyle geliyor.',
      en: 'Our fans distribute air evenly and provide instant freshness through wide-angle oscillation and an aerodynamic blade structure. Some of our ceiling fan models also come with smart LED lighting.',
    },
    followUps: ['vanti_families', 'vanti_energy'],
  },
  vanti_energy: {
    id: 'vanti_energy',
    question: {
      tr: '🍃 Enerji tasarrufu sağlıyor mu?',
      en: '🍃 Are your fans energy-saving?',
    },
    answer: {
      tr: 'Evet — Vanti serisi, düşük enerji tüketimiyle yüksek performans sunan çevre dostu bir tasarıma sahip. Yazın serin geçmesi için enerji faturana da iyi gelir.',
      en: 'Yes — the Vanti series has an eco-friendly design offering high performance with low energy consumption, keeping both your home and your energy bill cool through summer.',
    },
    followUps: ['vanti_smart'],
  },
  vanti_trust: {
    id: 'vanti_trust',
    question: {
      tr: '⭐ Müşteri memnuniyetiniz nasıl?',
      en: '⭐ How is your customer satisfaction?',
    },
    answer: {
      tr: "Türkiye'nin en çok tercih edilen vantilatör markalarından biriyiz — ortalama müşteri memnuniyetimiz 9.4/10, iade oranımız ise %0.5'in altında.",
      en: "We're among Turkey's most preferred fan brands — our average customer satisfaction is 9.4/10, with a return rate under 0.5%.",
    },
    followUps: ['vanti_about', 'vanti_export'],
  },
  vanti_export: {
    id: 'vanti_export',
    question: {
      tr: '🌍 Vanti yurt dışına satılıyor mu?',
      en: '🌍 Is Vanti sold internationally?',
    },
    answer: {
      tr: "Evet, Vanti'nin serinliği Türkiye'den dünyaya ihraç ediliyor — Kendal Elektrik'in ihracat ağıyla 4 kıtada 40 ülkeye ulaşıyoruz.",
      en: "Yes, Vanti's cooling is exported from Turkey to the world — through Kendal Elektrik's export network we reach 40 countries across 4 continents.",
    },
    followUps: ['vanti_trust'],
  },
  vanti_products: {
    id: 'vanti_products',
    question: {
      tr: '🛒 Ürün kataloğunu nereden inceleyebilirim?',
      en: '🛒 Where can I browse the product catalog?',
    },
    answer: {
      tr: 'Tüm Vanti ürün kataloğunu, kategori ve filtrelerle birlikte aşağıdaki sayfadan inceleyebilirsin.',
      en: 'You can browse the full Vanti product catalog, with categories and filters, on the page below.',
    },
    links: [
      {
        label: {
          tr: 'Vanti Ürünlerini İncele →',
          en: 'Browse Vanti Products →',
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
    },
    answer: {
      tr: "Global, kapsamlı aydınlatma çözümleri sunan ve Kendal Elektrik'in 29 yıllık üretim tecrübesiyle güçlenen markamız. LED ampul, panel, şerit ve projektör gibi genel kullanım aydınlatma ürünlerini uygun fiyatlarla sunuyoruz — aydınlatmada güvenilir bir isim.",
      en: "Global is our comprehensive lighting solutions brand, backed by Kendal Elektrik's 29 years of manufacturing experience. We offer general-purpose lighting products — LED bulbs, panels, strips, and projectors — at accessible prices. A trusted name in lighting.",
    },
    followUps: ['global_categories', 'global_trust'],
  },
  global_categories: {
    id: 'global_categories',
    question: {
      tr: '💡 Hangi ürün kategorileriniz var?',
      en: '💡 What product categories do you have?',
    },
    answer: {
      tr: 'Öne çıkan kategoriler: LED Ampuller, LED Paneller, Projektörler, Şerit LEDler (dış mekan dahil) ve Neon LEDler. Ev ve ofis kullanımına uygun, erişilebilir fiyatlı geniş bir katalog sunuyoruz.',
      en: 'Highlights include LED Bulbs, LED Panels, Projectors, LED Strips (including outdoor), and Neon LEDs. We offer a wide, accessibly priced catalog suited to home and office use.',
    },
    links: [
      {
        label: { tr: 'Tüm Kategorileri Gör →', en: 'See All Categories →' },
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
    },
    answer: {
      tr: "Türkiye genelinde 77 ilde yetkili bayimizle, Türkiye'nin her köşesine ışık taşıyan güçlü bir bayi ağımız var. En yakın yetkili bayiyi bulmak için bize ulaşabilirsin.",
      en: 'We have a powerful dealer network with authorized dealers in 77 provinces across Turkey, carrying light to every corner of the country. Reach out to us to find your nearest authorized dealer.',
    },
    followUps: ['contact'],
  },
  global_trust: {
    id: 'global_trust',
    question: {
      tr: '⭐ Müşteri memnuniyetiniz nasıl?',
      en: '⭐ How is your customer satisfaction?',
    },
    answer: {
      tr: "Aydınlatma markaları arasında sektörün güvendiği isimlerden biriyiz — ortalama müşteri memnuniyetimiz 9.6/10, iade oranımız ise %0.5'in altında.",
      en: "We're one of the trusted industry names among lighting brands — our average customer satisfaction is 9.6/10, with a return rate under 0.5%.",
    },
    followUps: ['global_about', 'global_future'],
  },
  global_future: {
    id: 'global_future',
    question: {
      tr: '🚀 Yeni nesil ürünleriniz var mı?',
      en: '🚀 Do you have next-generation products?',
    },
    answer: {
      tr: 'Geleceğin ışığını üretiyoruz — daha parlak, daha uzun ömürlü ve sınırları zorlayan yüksek teknolojili tasarımlarla katalogumuzu sürekli geliştiriyoruz.',
      en: "We're building the light of the future — continuously expanding our catalog with brighter, longer-lasting, boundary-pushing high-tech designs.",
    },
    followUps: ['global_categories'],
  },
  global_products: {
    id: 'global_products',
    question: {
      tr: '🛒 Ürün kataloğunu nereden inceleyebilirim?',
      en: '🛒 Where can I browse the product catalog?',
    },
    answer: {
      tr: 'Tüm Global ürün kataloğunu, kategori ve filtrelerle birlikte aşağıdaki sayfadan inceleyebilirsin.',
      en: 'You can browse the full Global product catalog, with categories and filters, on the page below.',
    },
    links: [
      {
        label: {
          tr: 'Global Ürünlerini İncele →',
          en: 'Browse Global Products →',
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
