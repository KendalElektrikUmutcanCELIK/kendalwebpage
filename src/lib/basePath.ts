export const isGithubPagesBuild =
  process.env.NEXT_PUBLIC_BUILD_MODE === 'ghpages';

export const getBasePath = () => {
  return isGithubPagesBuild ? '/kendalwebpage' : '';
};

export const getAssetPath = (path: string) => {
  const base = getBasePath();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

// cPanel/yerel'de marka alt alan adı zaten /brand/{marka} içine rewrite
// ediyor, göreli link yeterli; GH Pages'te alt alan adı olmadığı için mutlak
// /brand/{marka}/... yolu şart.
export const getBrandHomeHref = (brand: string) =>
  isGithubPagesBuild ? `/brand/${brand}` : '/';

export const getBrandUrunlerHref = (brand: string) =>
  isGithubPagesBuild ? `/brand/${brand}/urunler` : '/urunler';

// Cross-origin link to a brand's own site, for use from OUTSIDE that brand
// (e.g. the main www site linking out to k2.kendalelektrik.com). Unlike
// getBrandHomeHref/getBrandUrunlerHref above, this never resolves to a
// same-host relative path.
export const getBrandExternalHref = (brand: string, path = '') => {
  if (process.env.NODE_ENV !== 'production') {
    return `http://${brand}.localhost:3000${path}`;
  }
  if (isGithubPagesBuild) {
    return `${getBasePath()}/brand/${brand}${path}`;
  }
  return `https://${brand}.kendalelektrik.com${path}`;
};
