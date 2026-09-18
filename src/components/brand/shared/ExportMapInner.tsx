'use client';

import { geoEquirectangular, geoGraticule, geoPath } from 'd3-geo';
import { type CSSProperties, useMemo, useState } from 'react';
import { feature } from 'topojson-client';
import {
  EXPORT_COUNTRIES,
  type ExportCountry,
  HQ,
} from '@/data/exportCountries';
import landTopology from '@/data/world-land-110m.json';
import type { Language } from '@/lib/i18n/LanguageProvider';
import type { LocalizedField } from '@/lib/i18n/localized';
import { resolveLocalized } from '@/lib/i18n/localized';

type Ring = [number, number][];
type PolygonGeom = { type: 'Polygon'; coordinates: Ring[] };
type MultiPolygonGeom = { type: 'MultiPolygon'; coordinates: Ring[][] };

const WIDTH = 980;
const HEIGHT = 480;
const ZOOM = 3.2;

const OCEAN_LABELS: {
  name: LocalizedField<string>;
  lon: number;
  lat: number;
}[] = [
  {
    name: {
      tr: 'ATLANTİK OKYANUSU',
      en: 'ATLANTIC OCEAN',
      ar: 'المحيط الأطلسي',
      es: 'OCÉANO ATLÁNTICO',
      de: 'ATLANTISCHER OZEAN',
      zh: '大西洋',
    },
    lon: -34,
    lat: 12,
  },
  {
    name: {
      tr: 'PASİFİK OKYANUSU',
      en: 'PACIFIC OCEAN',
      ar: 'المحيط الهادئ',
      es: 'OCÉANO PACÍFICO',
      de: 'PAZIFISCHER OZEAN',
      zh: '太平洋',
    },
    lon: -152,
    lat: 2,
  },
  {
    name: {
      tr: 'HİNT OKYANUSU',
      en: 'INDIAN OCEAN',
      ar: 'المحيط الهندي',
      es: 'OCÉANO ÍNDICO',
      de: 'INDISCHER OZEAN',
      zh: '印度洋',
    },
    lon: 72,
    lat: -28,
  },
];

function arcPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const bow = my - dist * 0.14;
  return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${bow.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}

interface ExportMapInnerProps {
  language: Language;
  accent: string;
  theme?: 'dark' | 'light';
}

export default function ExportMapInner({
  language,
  accent,
  theme = 'dark',
}: ExportMapInnerProps) {
  const isDark = theme === 'dark';
  const containerClass = isDark
    ? 'bg-black/55 backdrop-blur-xl border-white/10'
    : 'bg-white/70 backdrop-blur-xl border-white/50';
  const [activeId, setActiveId] = useState<string | null>(null);

  const projection = useMemo(() => {
    const topology = landTopology as any;
    const geo = feature(topology, topology.objects.land);
    return geoEquirectangular().fitSize([WIDTH, HEIGHT], geo);
  }, []);

  const landPath = useMemo(() => {
    const topology = landTopology as any;
    const geo = feature(topology, topology.objects.land);
    const pathGenerator = geoPath(projection);
    return pathGenerator(geo) || '';
  }, [projection]);

  const graticulePath = useMemo(() => {
    const pathGenerator = geoPath(projection);
    return pathGenerator(geoGraticule().step([20, 20])()) || '';
  }, [projection]);

  const allPins: ExportCountry[] = useMemo(() => [HQ, ...EXPORT_COUNTRIES], []);
  const active = allPins.find((c) => c.id === activeId);
  const [originX, originY] = active
    ? projection([active.lon, active.lat]) || [WIDTH / 2, HEIGHT / 2]
    : [WIDTH / 2, HEIGHT / 2];
  const transformOrigin = `${(originX / WIDTH) * 100}% ${(originY / HEIGHT) * 100}%`;
  const [hqX, hqY] = projection([HQ.lon, HQ.lat]) || [0, 0];

  const toggle = (id: string) => setActiveId((cur) => (cur === id ? null : id));

  return (
    <div className="w-full" style={{ '--accent': accent } as CSSProperties}>
      <div
        className={`relative w-full overflow-hidden rounded-[2rem] border ${containerClass}`}
      >
        <div
          style={{
            transform: `scale(${active ? ZOOM : 1})`,
            transformOrigin,
            transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-auto block drop-shadow-sm"
            role="img"
            aria-label="Export reach map"
          >
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDark ? '#3f3f46' : '#e2e8f0'} />
                <stop
                  offset="100%"
                  stopColor={isDark ? '#18181b' : '#f8fafc'}
                />
              </linearGradient>

              <filter
                id="landShadow"
                x="-10%"
                y="-10%"
                width="120%"
                height="120%"
              >
                <feDropShadow
                  dx="2"
                  dy="6"
                  stdDeviation="4"
                  floodColor={isDark ? '#000000' : '#94a3b8'}
                  floodOpacity={isDark ? '0.6' : '0.3'}
                />
              </filter>

              <radialGradient id="oceanGrad" cx="35%" cy="30%" r="85%">
                <stop offset="0%" stopColor={isDark ? '#123244' : '#e6f4fa'} />
                <stop
                  offset="100%"
                  stopColor={isDark ? '#050f16' : '#cfe9f3'}
                />
              </radialGradient>
            </defs>

            <rect
              x={0}
              y={0}
              width={WIDTH}
              height={HEIGHT}
              fill="url(#oceanGrad)"
            />
            <path
              d={graticulePath}
              fill="none"
              stroke={isDark ? '#ffffff' : '#0f172a'}
              strokeWidth={0.4}
              opacity={isDark ? 0.06 : 0.07}
            />

            <path
              d={landPath}
              fill="url(#landGrad)"
              stroke={isDark ? '#52525b' : '#ffffff'}
              strokeWidth={0.8}
              filter="url(#landShadow)"
              className="transition-all duration-500"
            />

            {OCEAN_LABELS.map((o) => {
              const [x, y] = projection([o.lon, o.lat]) || [0, 0];
              return (
                <text
                  key={o.name.tr}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={600}
                  letterSpacing="0.15em"
                  fill={isDark ? '#ffffff' : '#0f172a'}
                  opacity={isDark ? 0.28 : 0.22}
                  className="select-none pointer-events-none uppercase"
                  style={{ fontStyle: 'italic' }}
                >
                  {resolveLocalized(o.name, language)}
                </text>
              );
            })}

            {EXPORT_COUNTRIES.map((c) => {
              const [x, y] = projection([c.lon, c.lat]) || [0, 0];
              return (
                <path
                  key={`arc-${c.id}`}
                  d={arcPath(hqX, hqY, x, y)}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={0.6}
                  strokeDasharray="2 3"
                  opacity={isDark ? 0.4 : 0.6}
                  filter="url(#glow)"
                />
              );
            })}

            {allPins.map((c) => {
              const [x, y] = projection([c.lon, c.lat]) || [0, 0];
              const isActive = activeId === c.id;
              const isHQ = c.id === HQ.id;
              return (
                <g
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className="cursor-pointer"
                  aria-label={resolveLocalized(c.name, language)}
                >
                  <circle cx={x} cy={y} r={9} fill="transparent" />
                  {!isHQ && (
                    <circle
                      cx={x}
                      cy={y}
                      r={7}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth={0.75}
                      opacity={0.4}
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHQ ? 5.5 : isActive ? 4.5 : 3.5}
                    fill={
                      isActive || isHQ
                        ? isDark
                          ? '#ffffff'
                          : 'var(--accent)'
                        : 'var(--accent)'
                    }
                    stroke="var(--accent)"
                    strokeWidth={isActive || isHQ ? 2 : 0}
                    filter={isActive || isHQ ? 'url(#glow)' : undefined}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {active && (
          <div
            className="absolute z-10 px-4 py-2.5 rounded-xl bg-white text-zinc-900 shadow-2xl flex items-center gap-2 whitespace-nowrap animate-[k2-pop_.25s_ease-out_forwards]"
            style={{
              left: `${(originX / WIDTH) * 100}%`,
              top: `${(originY / HEIGHT) * 100}%`,
            }}
          >
            <span className="text-lg leading-none">{active.flag}</span>
            <span className="text-sm font-bold">
              {resolveLocalized(active.name, language)}
            </span>
            <button
              type="button"
              aria-label="close"
              onClick={(e) => {
                e.stopPropagation();
                setActiveId(null);
              }}
              className="ml-1 w-5 h-5 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 text-xs cursor-pointer"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
