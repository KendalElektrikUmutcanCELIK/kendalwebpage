'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  getCategoryGroupForCategory,
  type Product,
  type ProductListItem,
} from '@/data/products';
import { getAssetPath } from '@/lib/basePath';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { resolveLocalized } from '@/lib/i18n/localized';
import ProductCompareModal from '../ProductCompareModal';
import { CategoryCard } from './CategoryCard';
import { CompareTray } from './CompareTray';
import { FiltersPanelContent, type FilterTab } from './FiltersPanelContent';
import {
  getBaseModelKey,
  getProductCardUrl,
  getVisiblePages,
  MAX_COMPARE,
} from './helpers';
import { ProductCard } from './ProductCard';

interface CategoryFirstShowcaseProps {
  products: ProductListItem[];
  brandName: string;
  isBrandScoped?: boolean;
}

export default function CategoryFirstShowcase({
  products,
  brandName,
  isBrandScoped = false,
}: CategoryFirstShowcaseProps) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBrandRoute = pathname.includes('/brand/');

  const { t, language } = useLanguage();
  const showcaseTexts = (t as any).brand_pages?.showcase || {
    product_count: 'Ürün',
    back_to_categories: 'Kategorilere Dön',
    products_found: 'adet ürün bulundu.',
    view: 'İncele',
    model: 'Model:',
    search_placeholder: 'Ürün adı veya model kodu ile arayın...',
    search_placeholder_mobile: 'Ürün veya model ara...',
    search_results_title: 'Arama Sonuçları',
    search_for: 'için',
    search_no_results_title: 'Sonuç Bulunamadı',
    search_no_results_desc:
      'Aradığınız kriterlere uygun ürün bulamadık. Lütfen farklı kelimelerle tekrar deneyin.',
  };

  const isK2 = brandName === 'k2';
  const isGlobal = brandName === 'global';

  const compareTexts = (t as any).brand_pages?.compare || {
    add: 'Karşılaştır',
    added: 'Eklendi',
    max_reached: 'En fazla 3 ürün karşılaştırabilirsiniz',
    tray_hint: 'Bu kategoriden karşılaştırmak için 2-3 ürün seçin',
    compare_button: 'Karşılaştır',
    clear: 'Temizle',
    modal_title: 'Ürün Karşılaştırma',
    view: 'İncele',
    model: 'Model:',
    no_value: '—',
    loading: 'Yükleniyor...',
    comparing_count: 'ürün karşılaştırılıyor',
  };

  const urlGroup = searchParams?.get('group') || null;
  const urlCategory = searchParams?.get('category') || null;
  const urlPage = parseInt(searchParams?.get('page') || '1', 10) || 1;
  const urlQuery = searchParams?.get('q') || '';

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [selectedGroup, setSelectedGroup] = useState<string | null>(urlGroup);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    urlCategory,
  );
  const [currentPage, setCurrentPage] = useState<number>(urlPage);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  // Pending debounced URL update from typing in the search box (see
  // handleSearchChange below) — any other call to updateUrl (category
  // click, clear button, pagination) must cancel it first, otherwise it
  // can fire later and stomp the URL with a stale search term.
  const searchUrlTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    const group = searchParams?.get('group') || null;
    const cat = searchParams?.get('category') || null;
    const page = parseInt(searchParams?.get('page') || '1', 10) || 1;
    const q = searchParams?.get('q') || '';

    setSelectedGroup(group);
    setSelectedCategory(cat);
    setCurrentPage(page);
    setSearchQuery(q);
  }, [searchParams]);

  const updateUrl = (
    group: string | null,
    cat: string | null,
    page: number,
    query: string,
  ) => {
    if (searchUrlTimeoutRef.current) {
      clearTimeout(searchUrlTimeoutRef.current);
      searchUrlTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (group) params.set('group', group);
      else params.delete('group');

      if (cat) params.set('category', cat);
      else params.delete('category');

      if (page > 1) params.set('page', page.toString());
      else params.delete('page');

      if (query) params.set('q', query);
      else params.delete('q');

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const itemsPerPage = 15;

  const categoriesData = useMemo(() => {
    const cats = new Map<
      string,
      {
        count: number;
        sampleImage: string;
        uniqueModels: Set<string>;
        enName?: string;
      }
    >();

    products.forEach((p) => {
      if (p.category?.tr && p.category.tr.length > 0) {
        const topCat = p.category.tr[0];
        const baseModel = (p.name.tr || '').split(' ')[0];

        if (!cats.has(topCat)) {
          cats.set(topCat, {
            count: 1,
            sampleImage: p.image,
            uniqueModels: new Set([baseModel]),
            enName: p.category.en?.[0],
          });
        } else {
          const existing = cats.get(topCat)!;
          if (!existing.uniqueModels.has(baseModel)) {
            existing.uniqueModels.add(baseModel);
            existing.count += 1;
          }
          if (!existing.enName && p.category.en?.[0]) {
            existing.enName = p.category.en[0];
          }

          if (topCat === 'LED Flaman Ampul') {
            existing.sampleImage = 'urunler/kes498.webp';
          }

          cats.set(topCat, existing);
        }
      }
    });

    const collator = new Intl.Collator(language === 'en' ? 'en' : 'tr', {
      sensitivity: 'base',
    });
    return Array.from(cats.entries())
      .map(([name, data]) => ({
        name,
        displayName: language === 'en' && data.enName ? data.enName : name,
        count: data.count,
        sampleImage: data.sampleImage,
      }))
      .sort((a, b) => collator.compare(a.displayName, b.displayName));
  }, [products, language]);

  const isK2Grouped = isK2 && isBrandScoped;

  const { ungroupedCategories, groupCards } = useMemo(() => {
    if (!isK2Grouped)
      return {
        ungroupedCategories: categoriesData,
        groupCards: [] as {
          key: string;
          displayName: string;
          sampleImage: string;
          members: typeof categoriesData;
        }[],
      };

    const map = new Map<
      string,
      {
        def: ReturnType<typeof getCategoryGroupForCategory>;
        members: typeof categoriesData;
      }
    >();
    const ungrouped: typeof categoriesData = [];

    for (const cat of categoriesData) {
      const def = getCategoryGroupForCategory(cat.name, brandName);
      if (!def) {
        ungrouped.push(cat);
        continue;
      }
      if (!map.has(def.key)) map.set(def.key, { def, members: [] });
      map.get(def.key)!.members.push(cat);
    }

    const collator = new Intl.Collator(language === 'en' ? 'en' : 'tr', {
      sensitivity: 'base',
    });
    const groupCards = Array.from(map.values())
      .filter((g) => g.members.length > 0)
      .map(({ def, members }) => ({
        key: def!.key,
        displayName: language === 'en' ? def!.name.en : def!.name.tr,
        sampleImage: members[0].sampleImage,
        members,
      }))
      .sort((a, b) => collator.compare(a.displayName, b.displayName));

    return { ungroupedCategories: ungrouped, groupCards };
  }, [categoriesData, isK2Grouped, brandName, language]);

  const topLevelCards = useMemo(() => {
    const collator = new Intl.Collator(language === 'en' ? 'en' : 'tr', {
      sensitivity: 'base',
    });
    return [
      ...ungroupedCategories.map((cat) => ({
        type: 'category' as const,
        key: cat.name,
        displayName: cat.displayName,
        sampleImage: cat.sampleImage,
        cat,
      })),
      ...groupCards.map((group) => ({
        type: 'group' as const,
        key: group.key,
        displayName: group.displayName,
        sampleImage: group.sampleImage,
        group,
      })),
    ].sort((a, b) => collator.compare(a.displayName, b.displayName));
  }, [ungroupedCategories, groupCards, language]);

  const topLevelCount = isK2Grouped
    ? ungroupedCategories.length + groupCards.length
    : categoriesData.length;
  const activeCategory =
    selectedCategory ||
    (topLevelCount === 1 && !isK2Grouped ? categoriesData[0].name : null);
  const showBackButton = categoriesData.length > 1;
  const activeGroup = isK2Grouped
    ? groupCards.find((g) => g.key === selectedGroup) || null
    : null;
  const isSearching = searchQuery.trim().length > 0;
  const inGroupCategoryList =
    isK2Grouped && !!selectedGroup && !activeCategory && !isSearching;
  const inTopLevel = !selectedGroup && !activeCategory && !isSearching;

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Every product's `attributes` (the bulk of products.json) is
  // intentionally NOT part of this component's `products` prop — see
  // toProductListItem() in products.ts. It's only needed here, for the ≤3
  // compared items, once the compare modal is actually opened. It's served
  // as a plain static asset (public/product-attributes.json, generated by
  // scripts/generate-product-attributes.js at build time) and fetched
  // on-demand rather than imported as a JS module — a dynamic import()
  // still gets bundled into an eagerly-loaded <script async> chunk on every
  // page visit in this static-export setup, which would defeat the point.
  const [attributesById, setAttributesById] = useState<Record<
    string,
    Product['attributes']
  > | null>(null);

  useEffect(() => {
    if (!isCompareOpen || attributesById) return;
    let cancelled = false;
    fetch(getAssetPath('/product-attributes.json'))
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAttributesById(data);
      });
    return () => {
      cancelled = true;
    };
  }, [isCompareOpen, attributesById]);

  const toggleCompare = (product: ProductListItem) => {
    setCompareIds((prev) => {
      if (prev.includes(product.id))
        return prev.filter((id) => id !== product.id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, product.id];
    });
  };

  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  const compareItems = useMemo(() => {
    return compareIds
      .map((id) => productById.get(id))
      .filter((p): p is ProductListItem => !!p)
      .map((product) => ({
        product,
        url: getProductCardUrl(product, brandName, isBrandRoute),
        attributes: attributesById?.[product.id],
      }));
  }, [compareIds, productById, brandName, isBrandRoute, attributesById]);

  const [selectedCasings, setSelectedCasings] = useState<string[]>([]);
  const [selectedWatts, setSelectedWatts] = useState<string[]>([]);
  const [selectedSockets, setSelectedSockets] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [casingSearchQuery, setCasingSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('casings');

  const availableFilters = useMemo(() => {
    if (!activeCategory) return { casings: [], watts: [], sockets: [] };
    const categoryProducts = products.filter(
      (p) => p.category?.tr && p.category.tr[0] === activeCategory,
    );

    const casings = new Set<string>();
    const watts = new Set<string>();
    const sockets = new Set<string>();

    categoryProducts.forEach((p) => {
      if (p.variantOptions?.casing) casings.add(p.variantOptions.casing);
      if (p.variantOptions?.watt) watts.add(p.variantOptions.watt);
      if (p.variantOptions?.socket) sockets.add(p.variantOptions.socket);
    });

    return {
      casings: Array.from(casings).sort(),
      watts: Array.from(watts).sort((a, b) => parseInt(a) - parseInt(b)),
      sockets: Array.from(sockets).sort(),
    };
  }, [products, activeCategory]);

  useEffect(() => {
    if (availableFilters[activeFilterTab].length <= 1) {
      if (availableFilters.casings.length > 1) setActiveFilterTab('casings');
      else if (availableFilters.watts.length > 1) setActiveFilterTab('watts');
      else if (availableFilters.sockets.length > 1)
        setActiveFilterTab('sockets');
    }
  }, [availableFilters, activeFilterTab]);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return [];
    const categoryProducts = products.filter(
      (p) => p.category?.tr && p.category.tr[0] === activeCategory,
    );

    const uniqueGroups = new Map<
      string,
      { product: ProductListItem; variants: ProductListItem[] }
    >();
    for (const p of categoryProducts) {
      const baseModel = getBaseModelKey(p.name.tr);
      if (!uniqueGroups.has(baseModel)) {
        uniqueGroups.set(baseModel, { product: p, variants: [p] });
      } else {
        uniqueGroups.get(baseModel)!.variants.push(p);
      }
    }

    let groups = Array.from(uniqueGroups.values());

    if (selectedCasings.length > 0) {
      groups = groups.filter((g) =>
        g.variants.some(
          (v) =>
            v.variantOptions?.casing &&
            selectedCasings.includes(v.variantOptions.casing),
        ),
      );
    }
    if (selectedWatts.length > 0) {
      groups = groups.filter((g) =>
        g.variants.some(
          (v) =>
            v.variantOptions?.watt &&
            selectedWatts.includes(v.variantOptions.watt),
        ),
      );
    }
    if (selectedSockets.length > 0) {
      groups = groups.filter((g) =>
        g.variants.some(
          (v) =>
            v.variantOptions?.socket &&
            selectedSockets.includes(v.variantOptions.socket),
        ),
      );
    }

    const collator = new Intl.Collator(language === 'en' ? 'en' : 'tr', {
      sensitivity: 'base',
      numeric: true,
    });
    const sortKey = (p: ProductListItem) => {
      const name = resolveLocalized(p.name, language) || '';
      const withoutModel = name.split(' ').slice(1).join(' ').trim();
      return withoutModel || name;
    };
    groups.sort(
      (a, b) =>
        collator.compare(sortKey(a.product), sortKey(b.product)) ||
        collator.compare(a.product.name.tr, b.product.name.tr),
    );

    return groups;
  }, [
    products,
    activeCategory,
    selectedCasings,
    selectedWatts,
    selectedSockets,
    language,
  ]);

  const searchedProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();

    const uniqueGroups = new Map<
      string,
      { product: ProductListItem; variants: ProductListItem[] }
    >();

    for (const p of products) {
      const model = (p.model || '').toLowerCase();
      const name = (p.name?.tr || '').toLowerCase();

      if (model.includes(query) || name.includes(query)) {
        const baseModel = getBaseModelKey(p.name?.tr || '');
        if (!uniqueGroups.has(baseModel)) {
          uniqueGroups.set(baseModel, { product: p, variants: [p] });
        } else {
          uniqueGroups.get(baseModel)!.variants.push(p);
        }
      }
    }

    return Array.from(uniqueGroups.values());
  }, [products, searchQuery]);

  const currentViewProducts = isSearching ? searchedProducts : filteredProducts;

  const totalPages = Math.ceil(currentViewProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = currentViewProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleCategoryClick = (cat: string) => {
    const group = isK2Grouped
      ? getCategoryGroupForCategory(cat, brandName)?.key || null
      : null;
    setSelectedGroup(group);
    setSelectedCategory(cat);
    setCurrentPage(1);
    setSearchQuery('');
    setSelectedCasings([]);
    setSelectedWatts([]);
    setSelectedSockets([]);
    setCompareIds([]);
    updateUrl(group, cat, 1, '');
  };

  const handleGroupClick = (groupKey: string) => {
    setSelectedGroup(groupKey);
    setSelectedCategory(null);
    setCurrentPage(1);
    setSearchQuery('');
    setSelectedCasings([]);
    setSelectedWatts([]);
    setSelectedSockets([]);
    setCompareIds([]);
    updateUrl(groupKey, null, 1, '');
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
    setSelectedCategory(null);
    setCurrentPage(1);
    setSearchQuery('');
    setSelectedCasings([]);
    setSelectedWatts([]);
    setSelectedSockets([]);
    setCompareIds([]);
    updateUrl(null, null, 1, '');
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
    setSearchQuery('');
    setSelectedCasings([]);
    setSelectedWatts([]);
    setSelectedSockets([]);
    setCompareIds([]);
    updateUrl(selectedGroup, null, 1, '');
  };

  // Typing updates local state immediately (so the input never drops
  // keystrokes), but the URL sync is debounced — updating it on every
  // keystroke would fire router.replace() dozens of times per second,
  // whose resulting searchParams change re-triggers the effect above that
  // reads search state back OUT of the URL, racing the next keystroke and
  // making fast typing look like it only accepts one letter at a time.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setCurrentPage(1);
    if (searchUrlTimeoutRef.current) clearTimeout(searchUrlTimeoutRef.current);
    searchUrlTimeoutRef.current = setTimeout(() => {
      updateUrl(selectedGroup, selectedCategory, 1, val);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (searchUrlTimeoutRef.current)
        clearTimeout(searchUrlTimeoutRef.current);
    };
  }, []);

  const hasAnyFilterOptions =
    availableFilters.casings.length > 1 ||
    availableFilters.watts.length > 1 ||
    availableFilters.sockets.length > 1;
  const selectedFilterCount =
    selectedCasings.length + selectedWatts.length + selectedSockets.length;

  const filtersPanelProps = {
    t,
    isK2,
    availableFilters,
    activeFilterTab,
    setActiveFilterTab,
    selectedCasings,
    setSelectedCasings,
    selectedWatts,
    setSelectedWatts,
    selectedSockets,
    setSelectedSockets,
    casingSearchQuery,
    setCasingSearchQuery,
    setCurrentPage,
    onClose: () => setIsFiltersOpen(false),
  };

  return (
    <section className="pt-4 pb-12 px-2 sm:px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="sticky top-20 md:top-24 z-30 mb-12 pb-8 relative animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative max-w-3xl mx-auto group">
            <div
              className={`absolute -inset-1 rounded-full opacity-0 group-focus-within:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none ${isK2 ? 'bg-orange-400/25' : brandName === 'vanti' ? 'bg-blue-400/25' : 'bg-amber-300/30'}`}
            />
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
              <svg
                className={`h-6 w-6 transition-transform duration-500 group-focus-within:scale-110 ${isK2 ? 'text-orange-400 group-focus-within:text-orange-600' : brandName === 'vanti' ? 'text-blue-400 group-focus-within:text-blue-600' : 'text-[#FFDA51]/80 group-focus-within:text-amber-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={
                showcaseTexts.search_placeholder_mobile ||
                showcaseTexts.search_placeholder
              }
              className={`sm:hidden relative z-10 w-full pl-12 pr-16 py-3.5 rounded-full border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-4 transition-all duration-300 text-sm hover:bg-white/85 focus:bg-white
                ${
                  isK2
                    ? 'focus:border-orange-500 focus:ring-orange-500/20'
                    : brandName === 'vanti'
                      ? 'focus:border-blue-500 focus:ring-blue-500/20'
                      : 'focus:border-amber-400 focus:ring-[#FFDA51]/30'
                }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={showcaseTexts.search_placeholder}
              className={`hidden sm:block relative z-10 w-full pl-14 pr-24 py-5 rounded-full border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-4 transition-all duration-300 text-lg hover:bg-white/85 focus:bg-white
                ${
                  isK2
                    ? 'focus:border-orange-500 focus:ring-orange-500/20'
                    : brandName === 'vanti'
                      ? 'focus:border-blue-500 focus:ring-blue-500/20'
                      : 'focus:border-amber-400 focus:ring-[#FFDA51]/30'
                }`}
            />

            {/* Clear Button Container */}
            <div className="absolute inset-y-0 right-0 pr-5 flex items-center gap-2 z-10">
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                    updateUrl(selectedGroup, selectedCategory, 1, '');
                  }}
                  className="flex items-center text-zinc-400 hover:text-zinc-700 transition-colors bg-white/50 hover:bg-white/80 p-1.5 rounded-full backdrop-blur-sm"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {inTopLevel && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-5">
              {topLevelCards.map((item, i) => (
                <CategoryCard
                  key={item.key}
                  alt={item.displayName}
                  displayName={item.displayName}
                  sampleImage={item.sampleImage}
                  index={i}
                  brandName={brandName}
                  onClick={() =>
                    item.type === 'category'
                      ? handleCategoryClick(item.cat.name)
                      : handleGroupClick(item.group.key)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {inGroupCategoryList && activeGroup && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="mb-8">
              <button
                onClick={handleBackToGroups}
                className={`flex items-center text-sm font-medium transition-colors mb-4 group ${isK2 ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <svg
                  className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                {showcaseTexts.back_to_categories}
              </button>
              <h2
                className={`text-3xl md:text-4xl font-bold ${isK2 ? 'text-white' : 'text-zinc-900'}`}
              >
                {activeGroup.displayName}
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-5">
              {activeGroup.members.map((cat, i) => (
                <CategoryCard
                  key={cat.name}
                  alt={cat.name}
                  displayName={cat.displayName}
                  sampleImage={cat.sampleImage}
                  index={i}
                  brandName={brandName}
                  onClick={() => handleCategoryClick(cat.name)}
                />
              ))}
            </div>
          </div>
        )}

        {(activeCategory || isSearching) && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 relative">
              <div>
                {!isSearching && showBackButton && (
                  <button
                    onClick={handleBack}
                    className={`flex items-center text-sm font-medium transition-colors mb-4 group ${isK2 ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                  >
                    <svg
                      className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    {showcaseTexts.back_to_categories}
                  </button>
                )}
                <h2
                  className={`text-3xl md:text-4xl font-bold tracking-tight ${isK2 ? 'text-white' : 'text-zinc-900'}`}
                >
                  {isSearching
                    ? showcaseTexts.search_results_title
                    : categoriesData.find((c) => c.name === activeCategory)
                        ?.displayName || activeCategory}
                </h2>
                <p className="mt-1.5 text-sm text-zinc-400 font-medium">
                  {currentViewProducts.length}{' '}
                  {showcaseTexts.product_count.toLowerCase()}
                  {isSearching && searchQuery && (
                    <>
                      {' '}
                      {showcaseTexts.search_for} &ldquo;{searchQuery}&rdquo;
                    </>
                  )}
                </p>
              </div>

              {!isSearching && hasAnyFilterOptions && (
                <div className="animate-in fade-in duration-700 relative sm:static">
                  <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className={`group flex items-center gap-2.5 px-5 py-3 rounded-full font-bold text-sm transition-all duration-300 border shadow-sm ${
                      isFiltersOpen
                        ? isK2
                          ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/25'
                          : 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25'
                        : 'bg-white/90 backdrop-blur-md text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:-translate-y-0.5 hover:shadow-md'
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${isFiltersOpen ? 'rotate-180 text-white' : 'text-zinc-500'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    {(t as any).brand_pages?.showcase?.filters || 'Filtrele'}
                    {selectedFilterCount > 0 && (
                      <span
                        className={`min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] flex items-center justify-center ${
                          isFiltersOpen
                            ? 'bg-white/25 text-white'
                            : isK2
                              ? 'bg-orange-100 text-orange-600'
                              : brandName === 'vanti'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {selectedFilterCount}
                      </span>
                    )}
                  </button>

                  {isFiltersOpen && (
                    <>
                      <div className="hidden sm:block absolute top-full left-0 sm:left-auto sm:right-0 mt-3 z-[100] bg-white/95 backdrop-blur-2xl rounded-[1.75rem] w-max min-w-[300px] max-w-md max-h-[80vh] flex-col shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] border border-zinc-100 ring-1 ring-black/[0.02] animate-in slide-in-from-top-3 fade-in zoom-in-95 duration-200 overflow-hidden pointer-events-auto">
                        <FiltersPanelContent {...filtersPanelProps} />
                      </div>

                      {mounted &&
                        typeof window !== 'undefined' &&
                        createPortal(
                          <div className="fixed inset-0 z-[100] flex items-center justify-center sm:hidden">
                            <div
                              className="fixed inset-0 bg-zinc-900/10 backdrop-blur-[2px] animate-in fade-in duration-200"
                              onClick={() => setIsFiltersOpen(false)}
                            ></div>
                            <div className="relative z-10 bg-white/95 backdrop-blur-2xl rounded-[1.75rem] w-[calc(100vw-2rem)] max-h-[85vh] flex flex-col shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] border border-zinc-100 ring-1 ring-black/[0.02] animate-in fade-in zoom-in-95 duration-200 overflow-hidden pointer-events-auto">
                              <FiltersPanelContent {...filtersPanelProps} />
                            </div>
                          </div>,
                          document.body,
                        )}
                    </>
                  )}
                </div>
              )}
            </div>

            {currentViewProducts.length === 0 && isSearching ? (
              <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-zinc-100 shadow-sm animate-in fade-in duration-500">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${isK2 ? 'bg-orange-50 text-orange-400' : brandName === 'vanti' ? 'bg-blue-50 text-blue-400' : 'bg-zinc-50 text-zinc-400'}`}
                >
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-3">
                  {showcaseTexts.search_no_results_title}
                </h3>
                <p className="text-zinc-500 text-lg max-w-md mx-auto">
                  {showcaseTexts.search_no_results_desc}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-6">
                {displayedProducts.map((group, i) => {
                  const product = group.product;
                  const canCompare = !!(
                    isBrandScoped &&
                    activeCategory &&
                    !isSearching
                  );
                  const isCompared = compareIds.includes(product.id);
                  const isCompareMaxed =
                    compareIds.length >= MAX_COMPARE && !isCompared;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      language={language}
                      brandName={brandName}
                      isBrandRoute={isBrandRoute}
                      isK2={isK2}
                      isGlobal={isGlobal}
                      showcaseTexts={showcaseTexts}
                      canCompare={canCompare}
                      isCompared={isCompared}
                      isCompareMaxed={isCompareMaxed}
                      compareTexts={compareTexts}
                      onToggleCompare={toggleCompare}
                      index={i}
                    />
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                {getVisiblePages(currentPage, totalPages).map((pageNum, i) => {
                  if (pageNum === '...') {
                    return (
                      <span
                        key={`ellipsis-${i}`}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(pageNum as number);
                        updateUrl(
                          selectedGroup,
                          selectedCategory,
                          pageNum as number,
                          searchQuery,
                        );
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? isK2
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110'
                            : brandName === 'vanti'
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                              : 'bg-[#FFDA51] text-zinc-900 shadow-lg shadow-[#FFDA51]/30 scale-110'
                          : 'bg-white text-zinc-600 hover:bg-zinc-100 hover:-translate-y-0.5 border border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {mounted &&
        typeof window !== 'undefined' &&
        isBrandScoped &&
        compareItems.length > 0 &&
        createPortal(
          <CompareTray
            compareItems={compareItems}
            language={language}
            isK2={isK2}
            brandName={brandName}
            compareTexts={compareTexts}
            onToggleCompare={toggleCompare}
            onClear={() => setCompareIds([])}
            onOpenCompare={() => setIsCompareOpen(true)}
          />,
          document.body,
        )}

      {isCompareOpen && compareItems.length >= 2 && (
        <ProductCompareModal
          items={compareItems}
          language={language}
          brandName={brandName}
          texts={compareTexts}
          onClose={() => setIsCompareOpen(false)}
          onRemove={(id) =>
            setCompareIds((prev) => prev.filter((cid) => cid !== id))
          }
        />
      )}
    </section>
  );
}
