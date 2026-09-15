'use client';

import { useState } from 'react';
import { Loader } from '@/components/loader/Loader';
import { AboutUs } from '@/components/sections/AboutUs';
import { CatalogCTA } from '@/components/sections/CatalogCTA';

import { CompanyStats } from '@/components/sections/CompanyStats';
import { CompanyVideo } from '@/components/sections/CompanyVideo';
import { GlobalPresence } from '@/components/sections/GlobalPresence';
import { Hero } from '@/components/sections/Hero';
import { NewsPreview } from '@/components/sections/NewsPreview';
import { NewsTicker } from '@/components/sections/NewsTicker';
import { OurBrands } from '@/components/sections/OurBrands';
import { HomeCustomBlocks } from '@/components/blocks/HomeCustomBlocks';
import { ApertureTransition } from '@/components/shared/ApertureTransition';

export function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="relative w-full">
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

      <div
        className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        <NewsTicker />
        <Hero />
        <HomeCustomBlocks slot="after-hero" />
        <AboutUs />
        <HomeCustomBlocks slot="after-about" />
        <OurBrands />
        <HomeCustomBlocks slot="after-brands" />

        <CompanyStats />
        <HomeCustomBlocks slot="after-stats" />
        <CatalogCTA />
        <HomeCustomBlocks slot="after-catalog-cta" />
        <CompanyVideo />
        <HomeCustomBlocks slot="after-video" />
        <GlobalPresence />
        <HomeCustomBlocks slot="after-global-presence" />
        <NewsPreview />
        <HomeCustomBlocks slot="after-news-preview" />
      </div>
    </main>
  );
}
