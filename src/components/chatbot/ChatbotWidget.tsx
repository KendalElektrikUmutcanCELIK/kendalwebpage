'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { CHATBOT_CONTEXTS, type ChatLink, MENU_BACK } from './chatbotContent';

interface Msg {
  id: string;
  role: 'bot' | 'user';
  text: string;
  links?: ChatLink[];
}

type AccentKey = 'main' | 'k2' | 'vanti' | 'global';

const ACCENTS: Record<
  AccentKey,
  { bg: string; hoverBg: string; text: string; glow: string }
> = {
  main: {
    bg: '#E3000F',
    hoverBg: '#B3000C',
    text: '#ffffff',
    glow: 'rgba(227,0,15,0.45)',
  },
  k2: {
    bg: '#f97316',
    hoverBg: '#ea580c',
    text: '#ffffff',
    glow: 'rgba(249,115,22,0.45)',
  },
  vanti: {
    bg: '#2563eb',
    hoverBg: '#1d4ed8',
    text: '#ffffff',
    glow: 'rgba(37,99,235,0.45)',
  },
  global: {
    bg: '#FFDA51',
    hoverBg: '#f0c93e',
    text: '#1c1917',
    glow: 'rgba(255,218,81,0.45)',
  },
};

const TYPING_DELAY_MS = 1500;

export const ChatbotWidget = () => {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'tr';

  const [accentKey, setAccentKey] = useState<AccentKey>('main');
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [bannerLiftPx, setBannerLiftPx] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const idRef = useRef(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const nextId = () => `m${++idRef.current}`;

  // Re-runs on every client-side route change (not just mount) so the
  // GH Pages path-based case (/brand/k2/... with no subdomain) stays
  // correct when navigating between brand pages without a full reload.
  // The hostname-based subdomain case always gets a full page load on
  // brand switches, so it naturally re-evaluates too.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is a trigger-only dep — the effect re-reads window.location.pathname itself rather than using the hook value directly.
  useEffect(() => {
    const host = window.location.hostname;
    if (host.startsWith('k2')) setAccentKey('k2');
    else if (host.startsWith('vanti')) setAccentKey('vanti');
    else if (host.startsWith('global')) setAccentKey('global');
    else {
      const match = window.location.pathname.match(
        /\/brand\/(k2|vanti|global)(?:\/|$)/,
      );
      setAccentKey(match ? (match[1] as AccentKey) : 'main');
    }
  }, [pathname]);

  useEffect(() => {
    const updateBannerLift = () => {
      const el = document.querySelector<HTMLElement>('[data-cookie-banner]');
      setBannerLiftPx(el ? el.getBoundingClientRect().height : 0);
    };
    updateBannerLift();
    window.addEventListener('kendal-cookie-consent-changed', updateBannerLift);
    window.addEventListener('resize', updateBannerLift);
    return () => {
      window.removeEventListener(
        'kendal-cookie-consent-changed',
        updateBannerLift,
      );
      window.removeEventListener('resize', updateBannerLift);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, currentOptions]);

  const accent = ACCENTS[accentKey];
  const context = CHATBOT_CONTEXTS[accentKey];
  // Main site pages are dark (black bg) so the panel reads better light;
  // brand pages are light (zinc-50 bg) so the panel stays dark for contrast.
  const isLightPanel = accentKey === 'main';
  const panel = isLightPanel
    ? {
        bg: 'bg-white/98',
        border: 'border-black/10',
        title: 'text-zinc-900',
        subtitle: 'text-zinc-500',
        closeBtn: 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900',
        botBubble: 'border-zinc-200 bg-zinc-100 text-zinc-800',
        typingDot: 'bg-zinc-400',
        chipsRowBg: 'border-black/10 bg-zinc-50',
        chipBase: 'border-zinc-300 text-zinc-700 hover:border-zinc-400',
        chipMenu:
          'border-zinc-300 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900',
        link: 'text-zinc-900 decoration-zinc-400 hover:decoration-zinc-900',
        chipResetBorder: 'rgba(0,0,0,0.18)',
      }
    : {
        bg: 'bg-[#0a0a0a]/97',
        border: 'border-white/10',
        title: 'text-white',
        subtitle: 'text-white/50',
        closeBtn: 'text-white/50 hover:bg-white/10 hover:text-white',
        botBubble: 'border-white/10 bg-white/[0.06] text-white/90',
        typingDot: 'bg-white/60',
        chipsRowBg: 'border-white/10 bg-white/[0.02]',
        chipBase: 'border-white/15 text-white/85 hover:border-white/30',
        chipMenu:
          'border-white/15 text-white/60 hover:border-white/30 hover:text-white',
        link: 'text-white decoration-white/30 hover:decoration-white',
        chipResetBorder: 'rgba(255,255,255,0.15)',
      };

  const openWidget = () => {
    if (!hasMounted) {
      setMessages([
        { id: nextId(), role: 'bot', text: context.greeting[lang] },
      ]);
      setCurrentOptions(context.rootTopicIds);
      setHasMounted(true);
    }
    setIsOpen(true);
  };

  const toggleWidget = () => {
    if (isOpen) setIsOpen(false);
    else openWidget();
  };

  const selectTopic = (id: string) => {
    if (isTyping) return;

    if (id === 'menu') {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'user', text: MENU_BACK.label[lang] },
      ]);
      setCurrentOptions([]);
      setIsTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: 'bot', text: MENU_BACK.prompt[lang] },
        ]);
        setIsTyping(false);
        setCurrentOptions(context.rootTopicIds);
      }, TYPING_DELAY_MS);
      return;
    }

    const node = context.nodes[id];
    if (!node) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'user', text: node.question[lang] },
    ]);
    setCurrentOptions([]);
    setIsTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'bot',
          text: node.answer[lang],
          links: node.links,
        },
      ]);
      setIsTyping(false);
      setCurrentOptions([...(node.followUps || []), 'menu']);
    }, TYPING_DELAY_MS);
  };

  // Button sits `gap` above the cookie banner (when present) or the
  // viewport edge; the panel then sits the same `gap` above the button.
  const gap = 16;
  const buttonBottom = bannerLiftPx > 0 ? bannerLiftPx + gap : 20;
  const panelBottom = buttonBottom + 56 + gap; // 56 = button height (h-14)

  const chipLabel = (id: string) =>
    id === 'menu' ? MENU_BACK.label[lang] : context.nodes[id]?.question[lang];

  return (
    <>
      <button
        type="button"
        onClick={toggleWidget}
        aria-label={
          isOpen
            ? lang === 'tr'
              ? 'Sohbeti kapat'
              : 'Close chat'
            : lang === 'tr'
              ? 'Sohbeti aç'
              : 'Open chat'
        }
        aria-expanded={isOpen}
        className={`chatbot-launcher-pop fixed left-4 sm:left-5 md:left-6 z-40 flex h-14 shrink-0 items-center rounded-full shadow-lg transition-[bottom,transform,width] duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
          isOpen
            ? 'w-14 justify-center'
            : 'w-14 justify-center px-0 sm:w-auto sm:justify-start sm:gap-2.5 sm:px-5'
        }`}
        style={{
          bottom: buttonBottom,
          backgroundColor: accent.bg,
          color: accent.text,
          boxShadow: `0 8px 28px ${accent.glow}`,
        }}
      >
        {isOpen ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            className="h-6 w-6 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6l12 12M18 6L6 18"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-6 w-6 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h8M8 14h5M21 12a8.96 8.96 0 01-1.05 4.22L21 21l-5-1.2A9 9 0 1121 12z"
            />
          </svg>
        )}
        {!isOpen && (
          <span className="hidden whitespace-nowrap text-sm font-semibold sm:inline">
            {lang === 'tr' ? 'Kendal Asistan' : 'Kendal Assistant'}
          </span>
        )}
      </button>

      {hasMounted && (
        <div
          role="dialog"
          aria-label={lang === 'tr' ? 'Kendal Asistan' : 'Kendal Assistant'}
          className={`fixed left-3 right-3 sm:left-5 sm:right-auto md:left-6 z-40 flex h-[58vh] max-h-[420px] w-auto flex-col overflow-hidden rounded-2xl border ${panel.border} ${panel.bg} shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-[bottom,opacity,transform] duration-300 ease-out sm:h-[460px] sm:max-h-[calc(100vh-220px)] sm:w-[380px] ${
            isOpen
              ? 'translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none translate-y-3 scale-[0.98] opacity-0'
          }`}
          style={{ bottom: panelBottom }}
        >
          <div
            className={`flex shrink-0 items-center gap-3 border-b ${panel.border} px-4 py-3`}
            style={{
              background: `linear-gradient(135deg, ${accent.bg}22, transparent)`,
            }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: accent.bg, color: accent.text }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h8M8 14h5M21 12a8.96 8.96 0 01-1.05 4.22L21 21l-5-1.2A9 9 0 1121 12z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-semibold ${panel.title}`}>
                {lang === 'tr' ? 'Kendal Asistan' : 'Kendal Assistant'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
              className={`shrink-0 rounded-full p-1.5 transition-colors ${panel.closeBtn}`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
          </div>

          <div
            ref={scrollRef}
            data-lenis-prevent
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chatbot-msg-in flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-sm text-white'
                      : `rounded-bl-sm border ${panel.botBubble}`
                  }`}
                  style={
                    m.role === 'user'
                      ? { backgroundColor: accent.bg, color: accent.text }
                      : undefined
                  }
                >
                  {m.text}
                  {m.links && m.links.length > 0 && (
                    <div className="mt-2.5 flex flex-col gap-1.5">
                      {m.links.map((l) => {
                        const resolvedHref =
                          typeof l.href === 'string' ? l.href : l.href[lang];
                        return l.external ? (
                          <a
                            key={resolvedHref}
                            href={resolvedHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs font-semibold underline underline-offset-2 transition-colors ${panel.link}`}
                          >
                            {l.label[lang]}
                          </a>
                        ) : (
                          <Link
                            key={resolvedHref}
                            href={resolvedHref}
                            className={`text-xs font-semibold underline underline-offset-2 transition-colors ${panel.link}`}
                          >
                            {l.label[lang]}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-msg-in flex justify-start">
                <div
                  className={`flex items-center gap-1 rounded-2xl rounded-bl-sm border px-4 py-3 ${panel.botBubble}`}
                >
                  <span
                    className={`chatbot-typing-dot h-1.5 w-1.5 rounded-full ${panel.typingDot}`}
                  />
                  <span
                    className={`chatbot-typing-dot h-1.5 w-1.5 rounded-full ${panel.typingDot}`}
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className={`chatbot-typing-dot h-1.5 w-1.5 rounded-full ${panel.typingDot}`}
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              </div>
            )}
          </div>

          {currentOptions.length > 0 && (
            <div
              data-lenis-prevent
              className={`max-h-[38%] shrink-0 overflow-y-auto border-t px-3 py-3 ${panel.chipsRowBg}`}
            >
              <div className="flex flex-wrap gap-1.5">
                {currentOptions.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectTopic(id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      id === 'menu' ? panel.chipMenu : panel.chipBase
                    }`}
                    onMouseEnter={(e) => {
                      if (id !== 'menu')
                        e.currentTarget.style.borderColor = accent.bg;
                    }}
                    onMouseLeave={(e) => {
                      if (id !== 'menu')
                        e.currentTarget.style.borderColor =
                          panel.chipResetBorder;
                    }}
                  >
                    {chipLabel(id)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
