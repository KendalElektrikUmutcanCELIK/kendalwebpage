'use client';

import React from 'react';
import { KVKK_CONTENT, type KVKKBlock } from '@/data/kvkkContent';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

function renderBlock(block: KVKKBlock, idx: number) {
  switch (block.type) {
    case 'p':
      return (
        <p className="mb-4" key={idx}>
          {block.text}
        </p>
      );
    case 'p-email':
      return (
        <p className="mb-4" key={idx}>
          {block.before}
          <strong>{block.email}</strong>
          {block.after}
        </p>
      );
    case 'kv-list':
      return (
        <ul className="list-none space-y-2 mb-6" key={idx}>
          {block.items.map((item) => (
            <li key={item.label}>
              <strong>{item.label}:</strong> {item.value}
            </li>
          ))}
        </ul>
      );
    case 'bullet-list':
      return (
        <ul className="list-disc pl-6 space-y-2 mb-6" key={idx}>
          {block.items.map((item, i) => (
            <li key={i}>
              {item.bold && <strong>{item.bold}</strong>}
              {item.bold ? ` ${item.text}` : item.text}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export const KVKKContent = () => {
  const { language } = useLanguage();
  const content = KVKK_CONTENT[language];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
        <div className="prose prose-invert prose-red max-w-none text-justify">
          <h1 className="text-3xl md:text-5xl font-bold mb-10 text-center text-[var(--brand-red)]">
            {content.pageTitle}
          </h1>

          <div className="text-gray-300 leading-relaxed">
            {content.sections.map((section) => (
              <React.Fragment key={section.heading}>
                <h2 className="text-2xl font-semibold text-white mb-4 mt-8">
                  {section.heading}
                </h2>
                {section.blocks.map((block, idx) => renderBlock(block, idx))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
