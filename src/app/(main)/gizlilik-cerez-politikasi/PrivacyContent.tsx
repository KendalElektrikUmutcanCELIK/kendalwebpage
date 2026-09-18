'use client';

import React from 'react';
import { PRIVACY_CONTENT, type PrivacyBlock } from '@/data/privacyContent';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const EMAIL = 'info@kendalelektrik.com.tr';

function renderBlock(block: PrivacyBlock, idx: number) {
  switch (block.type) {
    case 'h3':
      return (
        <h3 className="text-xl font-medium mb-2 text-white/80 mt-4" key={idx}>
          {block.text}
        </h3>
      );
    case 'p':
      return (
        <p className="text-gray-300 leading-relaxed mb-10" key={idx}>
          {block.text}
        </p>
      );
    case 'p-email':
      return (
        <p className="text-gray-300 leading-relaxed mb-10" key={idx}>
          {block.before}
          <strong>{block.email}</strong>
          {block.after}
        </p>
      );
    default:
      return null;
  }
}

export const PrivacyContent = () => {
  const { language } = useLanguage();
  const content = PRIVACY_CONTENT[language];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
        <div className="prose prose-invert prose-red max-w-none text-justify">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-[var(--brand-red)]">
            {content.pageTitle}
          </h1>
          <p className="text-gray-300 leading-relaxed mb-6">
            {content.intro.p1}
          </p>
          <p className="text-gray-300 leading-relaxed mb-10">
            {content.intro.before}
            <a
              href={`mailto:${EMAIL}`}
              className="text-[var(--brand-red)] hover:underline"
            >
              {EMAIL}
            </a>
            {content.intro.mid}
            {content.intro.after}
          </p>

          {content.sections.map((section) => (
            <React.Fragment key={section.heading}>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                {section.heading}
              </h2>
              {section.blocks.map((block, idx) => renderBlock(block, idx))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
