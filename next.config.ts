import type { NextConfig } from 'next';

// Bu proje statik export olarak üretiliyor ve iki farklı statik barındırma
// hedefi var:
//  - GitHub Pages: geliştirme sürecinde yöneticinin önizleyebilmesi için,
//    repo adı alt dizin olduğundan basePath/assetPrefix gerekiyor.
//  - cPanel (kendalelektrik.com): gerçek üretim ortamı, kök dizine
//    yükleniyor, basePath OLMAMALI.
// `next build` varsayılan olarak cPanel hedefini üretir. GitHub Pages
// build'i NEXT_PUBLIC_BUILD_MODE=ghpages ile tetiklenir (bkz.
// .github/workflows/nextjs.yml). NEXT_PUBLIC_ öneki şart: basePath.ts bu
// değeri "use client" bileşenlerinde de okuyor, öneksiz bir env değişkeni
// tarayıcı paketine hiç dahil edilmez.
const isGithubPagesBuild = process.env.NEXT_PUBLIC_BUILD_MODE === 'ghpages';

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 70, 75, 80, 100],
    // Prod build'de zaten `output: "export"` yüzünden Next'in image
    // optimizer'ı hiç çalışmıyor (aşağıdaki unoptimized:true bunu netleştiriyor).
    // Bunu dev sunucusunda da açık tutuyoruz ki `next dev` prod ile aynı şekilde
    // davransın: aksi halde dev'de her yeni boyut/kırılım noktası ilk istekte
    // anlık (senkron) transcode edilir — özellikle mobil genişlikte yeni bir
    // görsel boyutu ilk kez istendiğinde görsel bir-iki saniye boş görünür,
    // sonra kalıcı olarak "gerçek" bir bug gibi rapor edilir.
    unoptimized: true,
  },
  // Güvenlik başlıkları (CSP, HSTS, X-Frame-Options vb.) burada tanımlanmıyor:
  // `output: "export"` ile statik export modunda Next.js'in `headers()`
  // konfigürasyonu hiçbir zaman uygulanmaz (ne GitHub Pages'te ne de
  // cPanel'de). Bu başlıklar artık public/.htaccess üzerinden, Apache
  // tarafından cPanel'de sunuluyor.
  ...(process.env.NODE_ENV === 'production'
    ? {
        output: 'export',
        trailingSlash: true,
        ...(isGithubPagesBuild
          ? {
              basePath: '/kendalwebpage',
              assetPrefix: '/kendalwebpage',
            }
          : {}),
      }
    : {}),
  devIndicators: false,
};

export default nextConfig;
