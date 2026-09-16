'use client';

import { useEffect, useState } from 'react';
import { getAssetPath } from '@/lib/basePath';

/**
 * Ürün slug'ları (slug-map.json'daki 4200 kaydın hepsi — kanonik olan da
 * olmayan da) artık burada hiç ayrı statik sayfa olarak üretilmiyor; sitenin
 * kendi linkleri zaten hep marka route'unu (brand/[brandName]/urunler/...)
 * kullanıyor. Sunucu (.htaccess/web.config), bilinen bir dosyaya karşılık
 * gelmeyen tek segmentli istekleri buraya rewrite ediyor; bu sayfa
 * tarayıcının adres çubuğundaki gerçek yolu okuyup tek bir ortak eşleşme
 * dosyasından (public/legacy-redirects.json, scripts/generate-legacy-
 * redirects.js ile build öncesi üretilir) doğru ürüne atlıyor.
 */
export default function UrunYonlendirmePage() {
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const slug = decodeURIComponent(
      window.location.pathname.replace(/^\/+|\/+$/g, ''),
    );

    fetch(getAssetPath('/legacy-redirects.json'))
      .then((res) => res.json())
      .then((map: Record<string, string>) => {
        const target = map[slug];
        if (target) {
          window.location.replace(target);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, []);

  if (!notFound) {
    return null;
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">Ürün bulunamadı</h1>
      <p className="text-neutral-500">
        Aradığınız ürün kaldırılmış veya taşınmış olabilir.
      </p>
      <a href={getAssetPath('/')} className="text-red-600 underline">
        Anasayfaya dön
      </a>
    </div>
  );
}
