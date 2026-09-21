import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DECK_META, SLIDES as SLIDE_CONTENT, BIBLIOGRAPHY, type ContentSlideData } from "./content";

const TOTAL_SLIDES = SLIDE_CONTENT.length + 2; // cover + content slides + bibliography

/* ─── SVG ICONS — Kyivan Rus motifs ─── */
type IconProps = { size?: number; color?: string; strokeWidth?: number };

function IconTryzub({ size = 40, color = "currentColor", strokeWidth = 1.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 44 L24 20" />
      <path d="M24 20 Q16 20 16 10 Q16 6 20 6 Q22 6 22 10 L22 22" />
      <path d="M24 20 Q32 20 32 10 Q32 6 28 6 Q26 6 26 10 L26 22" />
      <path d="M24 20 Q24 8 24 4" />
      <path d="M17 44 L31 44" strokeOpacity="0.7" />
      <path d="M19 39 L29 39" strokeOpacity="0.4" />
    </svg>
  );
}

function IconChronicle({ size = 40, color = "currentColor", strokeWidth = 1.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 12 Q18 8 8 9 L8 38 Q18 37 24 41 Q30 37 40 38 L40 9 Q30 8 24 12 Z" />
      <line x1="24" y1="12" x2="24" y2="41" strokeOpacity="0.4" />
      <path d="M12 16 L19 15" strokeOpacity="0.55" />
      <path d="M12 21 L19 20" strokeOpacity="0.55" />
      <path d="M12 26 L17 25.5" strokeOpacity="0.55" />
      <path d="M29 15 L36 16" strokeOpacity="0.55" />
      <path d="M29 20 L36 21" strokeOpacity="0.55" />
      <circle cx="24" cy="6" r="2.1" opacity="0.7" fill={color} stroke="none" />
    </svg>
  );
}

function IconShield({ size = 40, color = "currentColor", strokeWidth = 1.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6 L40 12 L40 24 Q40 36 24 42 Q8 36 8 24 L8 12 Z" />
      <path d="M24 12 L24 34" strokeOpacity="0.45" />
      <path d="M15 18 L33 18" strokeOpacity="0.45" />
    </svg>
  );
}

function IconSwordCross({ size = 40, color = "currentColor", strokeWidth = 1.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 10 L38 38" />
      <path d="M10 15 L15 10" />
      <path d="M33 38 L38 33" />
      <path d="M38 10 L10 38" />
      <path d="M38 15 L33 10" />
      <path d="M15 38 L10 33" />
      <circle cx="24" cy="24" r="3.4" fill={color} stroke="none" opacity="0.85" />
    </svg>
  );
}

function IconGateTower({ size = 40, color = "currentColor", strokeWidth = 1.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 44 L14 20 L24 8 L34 20 L34 44 Z" />
      <line x1="14" y1="30" x2="34" y2="30" strokeOpacity="0.4" />
      <path d="M19 44 Q19 34 24 34 Q29 34 29 44" strokeOpacity="0.8" />
      <line x1="10" y1="44" x2="38" y2="44" />
      <path d="M18 20 L18 15 M24 17 L24 11 M30 20 L30 15" strokeOpacity="0.5" />
    </svg>
  );
}

function IconDome({ size = 40, color = "currentColor", strokeWidth = 1.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4 L24 10" />
      <path d="M20 8 L28 8" />
      <path d="M16 22 Q16 10 24 10 Q32 10 32 22 Z" />
      <path d="M12 22 L36 22 L36 40 L12 40 Z" />
      <line x1="12" y1="30" x2="36" y2="30" strokeOpacity="0.4" />
      <rect x="20" y="32" width="8" height="8" strokeOpacity="0.7" />
      <line x1="8" y1="40" x2="40" y2="40" />
    </svg>
  );
}

function IconOath({ size = 40, color = "currentColor", strokeWidth = 1.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6 L24 30" />
      <path d="M15 13 L33 13" />
      <path d="M18 13 L14 22 Q14 27 19 27 Q24 27 24 22 L20 13" strokeOpacity="0.75" />
      <path d="M30 13 L26 22 Q26 27 31 27 Q36 27 36 22 L32 13" strokeOpacity="0.75" />
      <path d="M15 40 Q24 34 33 40" />
      <circle cx="24" cy="32" r="2" fill={color} stroke="none" opacity="0.8" />
    </svg>
  );
}

function IconBook({ size = 40, color = "currentColor", strokeWidth = 1.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 12 Q18 8 8 9 L8 38 Q18 37 24 41 Q30 37 40 38 L40 9 Q30 8 24 12 Z" />
      <line x1="24" y1="12" x2="24" y2="41" strokeOpacity="0.4" />
      <line x1="12" y1="15" x2="19" y2="14" strokeOpacity="0.4" />
      <line x1="12" y1="20" x2="19" y2="19" strokeOpacity="0.4" />
      <line x1="29" y1="14" x2="36" y2="15" strokeOpacity="0.4" />
      <line x1="29" y1="19" x2="36" y2="20" strokeOpacity="0.4" />
    </svg>
  );
}

/* ─── ORNAMENTAL MOTIFS ─── */
function toRoman(num: number): string {
  const table: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let n = num, out = "";
  for (const [v, s] of table) {
    while (n >= v) { out += s; n -= v; }
  }
  return out;
}

function CornerMedallion({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const rotate = { tl: 0, tr: 90, bl: 270, br: 180 }[corner];
  const pos: React.CSSProperties = {
    tl: { top: "2px", left: "2px" },
    tr: { top: "2px", right: "2px" },
    bl: { bottom: "2px", left: "2px" },
    br: { bottom: "2px", right: "2px" },
  }[corner];
  return (
    <svg
      width="40" height="40" viewBox="0 0 40 40" fill="none"
      style={{ position: "absolute", zIndex: 23, transform: `rotate(${rotate}deg)`, ...pos }}
    >
      <circle cx="14" cy="14" r="6.5" stroke="var(--gold)" strokeWidth="1.2" opacity="0.75" />
      <circle cx="14" cy="14" r="2.4" fill="var(--burgundy)" opacity="0.8" />
      <path d="M14 3 L14 7.5 M14 20.5 L14 25 M3 14 L7.5 14 M20.5 14 L25 14" stroke="var(--gold)" strokeWidth="1" opacity="0.55" />
      <path d="M7 7 L10.2 10.2 M17.8 17.8 L21 21" stroke="var(--gold)" strokeWidth="0.9" opacity="0.4" />
      <path d="M6 6 Q6 20 20 20" stroke="var(--burgundy)" strokeWidth="1" opacity="0.4" fill="none" />
    </svg>
  );
}

function ManuscriptFrame() {
  return (
    <div className="ms-frame">
      <div className="ring-outer" />
      <div className="ring-inner" />
      <div className="chain-top" />
      <div className="chain-bottom" />
      <div className="chain-left" />
      <div className="chain-right" />
      <CornerMedallion corner="tl" />
      <CornerMedallion corner="tr" />
      <CornerMedallion corner="bl" />
      <CornerMedallion corner="br" />
    </div>
  );
}

function SlideWatermark({ n }: { n: number }) {
  return (
    <div className="slide-watermark" style={{ right: "-40px", bottom: "-60px" }}>
      <IconTryzub size={360} color="currentColor" strokeWidth={0.6} />
      <span
        className="font-cinzel absolute"
        style={{ top: "40px", left: "70px", fontSize: "2.4rem", fontWeight: 700, letterSpacing: "0.02em" }}
      >
        {toRoman(n)}
      </span>
    </div>
  );
}

/* ─── CASTLE-IN-FOG BACKDROP ─── */
function CastleScene() {
  return (
    <div className="castle-scene" aria-hidden="true">
      <svg viewBox="0 0 1600 500" preserveAspectRatio="xMidYMax slice" className="castle-silhouette">
        <path d="M0 500 L0 330 L40 330 L40 300 L70 300 L70 330 L110 330 L110 260
          L130 260 L130 230 L110 230 L110 200 L150 200 L150 230 L130 230 L130 260
          L170 260 L170 330 L230 330 L230 260 L210 260 L210 180 L230 180 L230 150
          L250 150 L250 180 L270 180 L270 260 L250 260 L250 330
          L340 330 L340 220 L320 220 L320 150 L300 150 L300 120 L330 120 L330 90
          L350 90 L350 120 L380 120 L380 150 L360 150 L360 220 L340 220 L340 260
          L420 260 L420 330 L520 330 L520 200 L500 200 L500 130 L480 130 L480 100
          L460 100 L460 70 L480 70 L480 40 L500 40 L500 70 L520 70 L520 100
          L540 100 L540 130 L560 130 L560 200 L540 200 L540 330
          L640 330 L640 240 L620 240 L620 190 L640 190 L640 160 L660 160 L660 190
          L680 190 L680 240 L660 240 L660 330
          L760 330 L760 260 L740 260 L740 210 L760 210 L760 180 L780 180 L780 210
          L800 210 L800 260 L780 260 L780 330
          L900 330 L900 240 L880 240 L880 180 L900 180 L900 150 L920 150 L920 180
          L940 180 L940 240 L920 240 L920 330
          L1040 330 L1040 260 L1020 260 L1020 210 L1040 210 L1040 180 L1060 180
          L1060 210 L1080 210 L1080 260 L1060 260 L1060 330
          L1160 330 L1160 200 L1140 200 L1140 130 L1120 130 L1120 100 L1100 100
          L1100 70 L1120 70 L1120 40 L1140 40 L1140 70 L1160 70 L1160 100
          L1180 100 L1180 130 L1200 130 L1200 200 L1180 200 L1180 330
          L1300 330 L1300 260 L1280 260 L1280 200 L1260 200 L1260 180 L1280 180
          L1280 150 L1300 150 L1300 180 L1320 180 L1320 200 L1300 200 L1300 260
          L1340 260 L1340 330
          L1420 330 L1420 250 L1400 250 L1400 190 L1420 190 L1420 160 L1440 160
          L1440 190 L1460 190 L1460 250 L1440 250 L1440 330
          L1600 330 L1600 500 Z" fill="var(--castle-ink)" />
      </svg>
      <div className="torch-glow left" />
      <div className="torch-glow right" />
      <div className="castle-fog fog-1" />
      <div className="castle-fog fog-2" />
      <div className="castle-fog fog-3" />
      <div className="castle-fog fog-top" />
      {EMBER_SEEDS.map((e, i) => (
        <div
          key={i}
          className="ember-particle"
          style={{
            left: `${e.left}%`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            ["--drift" as string]: `${e.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

const EMBER_SEEDS = [
  { left: 6, duration: 9, delay: 0, drift: 24 },
  { left: 14, duration: 12, delay: 2.5, drift: -18 },
  { left: 22, duration: 10, delay: 5, drift: 20 },
  { left: 80, duration: 11, delay: 1.5, drift: -22 },
  { left: 88, duration: 9.5, delay: 4, drift: 16 },
  { left: 94, duration: 13, delay: 6.5, drift: -14 },
];

function OrnateRule() {
  return (
    <div className="flex items-center gap-3" style={{ margin: "2px 0" }}>
      <div style={{ height: "1px", flex: 1, background: "rgba(36,23,8,0.22)" }} />
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 0 L11 5 L16 8 L11 11 L8 16 L5 11 L0 8 L5 5 Z" fill="var(--gold)" opacity="0.85" />
        <circle cx="8" cy="8" r="1.6" fill="var(--burgundy)" />
      </svg>
      <div style={{ height: "1px", flex: 1, background: "rgba(36,23,8,0.22)" }} />
    </div>
  );
}

function SealBadge({ n, label }: { n?: number; label?: string }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 relative"
      style={{
        width: "34px", height: "34px", borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, var(--burgundy-light), var(--burgundy) 65%)",
        border: "1px solid var(--gold)",
        boxShadow: "0 1px 3px rgba(36,23,8,0.45), inset 0 0 0 3px rgba(217,173,92,0.18)",
      }}
    >
      <span className="font-display" style={{ color: "var(--gold-light)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.02em" }}>
        {label ?? (n !== undefined ? toRoman(n) : "")}
      </span>
    </div>
  );
}

/* ─── LAYOUT PRIMITIVES ─── */
function SlideWrapper({ children, className = "", texture = "", n }: { children: React.ReactNode; className?: string; texture?: string; n: number }) {
  return (
    <div
      className={`slide-enter relative w-full h-full overflow-hidden paper-texture ${texture} ${className}`}
    >
      <SlideWatermark n={n} />
      <ManuscriptFrame />
      {children}
    </div>
  );
}

function SlideNum({ n }: { n: number }) {
  return (
    <span className="font-mono text-xs tracking-widest" style={{ color: "var(--ink-muted)" }}>
      {String(n).padStart(2, "0")} / {String(TOTAL_SLIDES).padStart(2, "0")}
    </span>
  );
}

function TopBar({ label, n }: { label: string; n: number }) {
  return (
    <div
      className="absolute left-8 right-8 flex items-center justify-between px-4 py-2.5 z-20 reveal reveal-d0"
      style={{ top: "22px", borderBottom: "1px solid rgba(36,23,8,0.18)" }}
    >
      <div className="flex items-center gap-2.5">
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
          <path d="M7 0 L9.5 4.5 L14 7 L9.5 9.5 L7 14 L4.5 9.5 L0 7 L4.5 4.5 Z" fill="var(--burgundy)" opacity="0.75" />
        </svg>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--ink-muted)", letterSpacing: "0.12em" }}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <SlideNum n={n} />
        <SealBadge n={n} />
      </div>
    </div>
  );
}

function BottomBar({ left, right }: { left: string; right?: string }) {
  return (
    <div
      className="absolute left-8 right-8 flex items-stretch z-20 reveal reveal-d0"
      style={{ bottom: "22px", height: "32px", borderTop: "1px solid rgba(36,23,8,0.18)" }}
    >
      <div
        className="flex items-center justify-center gap-2 px-6 flex-shrink-0"
        style={{ background: "var(--burgundy)", minWidth: "120px" }}
      >
        <svg width="10" height="10" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
          <path d="M7 0 L9.5 4.5 L14 7 L9.5 9.5 L7 14 L4.5 9.5 L0 7 L4.5 4.5 Z" fill="var(--gold)" />
        </svg>
        <span className="font-mono text-xs text-white tracking-widest">{left}</span>
      </div>
      <div className="flex items-center px-6 flex-1">
        <span className="font-mono text-xs" style={{ color: "var(--ink-muted)" }}>{right}</span>
      </div>
    </div>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-6 reveal reveal-d0">
      <svg width="10" height="10" viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
        <path d="M5 0 L6.7 3.3 L10 5 L6.7 6.7 L5 10 L3.3 6.7 L0 5 L3.3 3.3 Z" fill="var(--burgundy)" />
      </svg>
      <div style={{ width: "22px", height: "1.5px", background: "var(--gold)" }} />
      <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--burgundy)", letterSpacing: "0.14em" }}>
        {children}
      </span>
    </div>
  );
}

/* ─── DROP CAP ─── */
function DropCap({ letter, size = 46 }: { letter: string; size?: number }) {
  return (
    <span
      className="font-display flex items-center justify-center flex-shrink-0 scale-in reveal-d1"
      style={{
        width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.6}px`,
        color: "var(--gold-light)", fontWeight: 700, lineHeight: 1,
        background: "radial-gradient(circle at 32% 28%, var(--burgundy-light), var(--burgundy) 70%)",
        border: "1px solid var(--gold)",
        boxShadow: "inset 0 0 0 3px rgba(217,173,92,0.14), 0 2px 6px rgba(36,23,8,0.35)",
      }}
    >
      {letter}
    </span>
  );
}

/* ─── MINI INFO BLOCK (seal tag) ─── */
function InfoBlock({ tag, title, text, delayClass = "" }: { tag: string; title: string; text: string; delayClass?: string }) {
  return (
    <div
      className={`relative flex flex-col gap-1.5 pl-4 pr-3 py-3 reveal ${delayClass}`}
      style={{
        background: "linear-gradient(115deg, rgba(217,173,92,0.09), rgba(217,173,92,0.02))",
        border: "1px solid rgba(179,129,47,0.35)",
        borderLeft: "3px solid var(--burgundy)",
      }}
    >
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: "-7px", right: "10px", width: "16px", height: "16px", borderRadius: "50%",
          background: "var(--burgundy)", border: "1px solid var(--gold)",
        }}
      >
        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--gold-light)" }} />
      </div>
      <span className="font-mono text-xs uppercase" style={{ color: "var(--burgundy)", letterSpacing: "0.09em", fontSize: "0.62rem" }}>
        {tag}
      </span>
      <span className="font-display" style={{ color: "var(--ink)", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.15 }}>
        {title}
      </span>
      <p className="font-body leading-snug" style={{ fontSize: "0.72rem", color: "var(--ink-muted)" }}>
        {text}
      </p>
    </div>
  );
}

const DELAYS = ["reveal-d0", "reveal-d1", "reveal-d2", "reveal-d3", "reveal-d4", "reveal-d5", "reveal-d6"];
function delayFor(i: number) {
  return DELAYS[Math.min(i, DELAYS.length - 1)];
}

/* ══════════════════════════════════════════
   SLIDE 1 — COVER
══════════════════════════════════════════ */
function Slide1() {
  return (
    <SlideWrapper texture="paper-cover" n={1}>
      <div className="absolute top-0 right-0 bottom-0" style={{ width: "38%", background: "var(--ink)", zIndex: 0 }} />
      <div className="absolute top-0 bottom-0" style={{ left: "62%", width: "1px", background: "repeating-linear-gradient(180deg, rgba(201,149,74,0.5) 0 6px, transparent 6px 14px)", zIndex: 4 }} />

      <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-between pt-12 pb-10 pl-14 pr-8" style={{ width: "62%", zIndex: 3 }}>
        <SectionTag>{DECK_META.kicker}</SectionTag>

        <div className="flex-1 flex flex-col justify-center pr-6">
          <div className="font-mono text-xs mb-4 reveal reveal-d0" style={{ color: "var(--ink-muted)", letterSpacing: "0.08em" }}>
            {DECK_META.overline}
          </div>

          <div className="flex items-start gap-1 mb-1 reveal reveal-d1">
            <span
              className="font-display"
              style={{
                fontSize: "clamp(3.4rem, 7vw, 5.2rem)", lineHeight: 0.8, color: "var(--burgundy)",
                fontWeight: 700, marginTop: "-0.06em",
              }}
            >
              {DECK_META.titleLine1.charAt(0)}
            </span>
            <div className="flex flex-col">
              <h1 className="font-display leading-tight mb-1" style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)", color: "var(--ink)", letterSpacing: "-0.02em", fontWeight: 700 }}>
                {DECK_META.titleLine1.slice(1)}
              </h1>
              <h1 className="font-display italic leading-tight" style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)", color: "var(--burgundy)", letterSpacing: "-0.02em", fontWeight: 600 }}>
                {DECK_META.titleLine2}
              </h1>
            </div>
          </div>
          <h1 className="font-display leading-tight mb-6 reveal reveal-d2" style={{ fontSize: "clamp(1.1rem, 2.1vw, 1.6rem)", color: "var(--ink)", letterSpacing: "-0.015em", fontWeight: 700 }}>
            {DECK_META.titleLine3}
          </h1>

          <div className="reveal reveal-d2">
            <OrnateRule />
          </div>

          <p className="font-body mt-5 leading-relaxed reveal reveal-d3" style={{ fontSize: "0.9rem", color: "var(--ink-muted)", maxWidth: "460px" }}>
            {DECK_META.intro}
          </p>

          <div className="flex gap-2 mt-6">
            {DECK_META.tags.map((item, i) => (
              <div key={item.label} className={`flex flex-col reveal ${delayFor(i + 4)}`} style={{ border: "1px solid rgba(26,22,18,0.15)" }}>
                <div className="px-3 py-1 font-mono text-xs" style={{ background: "var(--burgundy)", color: "white", letterSpacing: "0.06em" }}>
                  {item.year}
                </div>
                <div className="px-3 py-1.5 font-body text-xs" style={{ color: "var(--ink-muted)" }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-6 reveal reveal-d6">
          <div className="font-mono text-xs" style={{ color: "rgba(26,22,18,0.3)", letterSpacing: "0.06em" }}>
            {DECK_META.footer}
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center gap-8" style={{ width: "38%", zIndex: 2 }}>
        <div className="relative flex items-center justify-center scale-in reveal-d1">
          <svg width="132" height="132" viewBox="0 0 132 132" className="slow-spin" style={{ position: "absolute" }}>
            <circle cx="66" cy="66" r="62" fill="none" stroke="rgba(201,149,74,0.3)" strokeWidth="1" strokeDasharray="1 7" />
          </svg>
          <svg width="118" height="118" viewBox="0 0 118 118" className="emblem-glow" style={{ position: "absolute" }}>
            <circle cx="59" cy="59" r="56" fill="none" stroke="rgba(201,149,74,0.35)" strokeWidth="1" />
            <circle cx="59" cy="59" r="49" fill="none" stroke="rgba(201,149,74,0.22)" strokeWidth="1" />
          </svg>
          <IconTryzub size={64} color="var(--gold)" strokeWidth={1.1} />
        </div>
        <div className="flex items-center gap-7">
          {[IconDome, IconShield, IconChronicle, IconOath].map((Ico, i) => (
            <div key={i} className={`scale-in ${delayFor(i + 2)}`}>
              <Ico size={36} color="rgba(245,240,232,0.55)" strokeWidth={1} />
            </div>
          ))}
        </div>
        <span className="font-mono text-xs reveal reveal-d6" style={{ color: "rgba(245,240,232,0.42)", letterSpacing: "0.14em" }}>
          РУСЬ · КІН. ХІ – ПОЧ. ХІІ СТ.
        </span>
      </div>
    </SlideWrapper>
  );
}

/* ══════════════════════════════════════════
   SLIDE 2 — TRIUMVIRATE (three seat cards)
══════════════════════════════════════════ */
function SeatCard({ icon: Icon, tag, title, text, delayClass }: { icon: (p: IconProps) => React.ReactElement; tag: string; title: string; text: string; delayClass: string }) {
  return (
    <div
      className={`relative flex flex-col gap-3 flex-1 px-5 pt-6 pb-5 reveal ${delayClass}`}
      style={{
        background: "linear-gradient(165deg, rgba(217,173,92,0.1), rgba(217,173,92,0.02))",
        border: "1px solid rgba(179,129,47,0.35)",
        borderTop: "3px solid var(--burgundy)",
      }}
    >
      <div className="flex items-center justify-center" style={{ width: "48px", height: "48px", margin: "0 auto" }}>
        <Icon size={44} color="var(--burgundy)" strokeWidth={1} />
      </div>
      <div className="text-center">
        <span className="font-mono text-xs uppercase" style={{ color: "var(--gold)", letterSpacing: "0.12em", fontSize: "0.62rem" }}>{tag}</span>
        <h3 className="font-display" style={{ fontSize: "1.05rem", color: "var(--ink)", fontWeight: 700, marginTop: "4px" }}>{title}</h3>
      </div>
      <div style={{ height: "1px", background: "rgba(36,23,8,0.15)" }} />
      <p className="font-body leading-relaxed text-center" style={{ fontSize: "0.76rem", color: "var(--ink-muted)" }}>{text}</p>
    </div>
  );
}

function Slide2Triumvirate({ data, n }: { data: ContentSlideData; n: number }) {
  const seats = data.infoBlocks ?? [];
  const seatIcons = [IconGateTower, IconShield, IconDome];
  return (
    <SlideWrapper n={n}>
      <TopBar label={data.topLabel} n={n} />
      <div className="absolute flex flex-col gap-5 overflow-hidden" style={{ top: "78px", left: "48px", right: "48px", bottom: "62px" }}>
        <div>
          <SectionTag>{data.kicker}</SectionTag>
          <div className="flex items-center gap-3 mb-3">
            <DropCap letter={data.title.charAt(0)} size={40} />
            <h2 className="font-display reveal reveal-d1" style={{ fontSize: "clamp(1.2rem, 2vw, 1.7rem)", color: "var(--ink)", fontWeight: 700, letterSpacing: "-0.01em" }}>
              {data.title.slice(1)}
            </h2>
          </div>
          <p className="font-body leading-relaxed reveal reveal-d2" style={{ fontSize: "0.8rem", color: "var(--ink-muted)", maxWidth: "820px" }}>
            {data.paragraphs[0]}
          </p>
        </div>

        <div className="flex gap-5 flex-1 min-h-0">
          {seats.map((seat, i) => (
            <SeatCard key={seat.title} icon={seatIcons[i % seatIcons.length]} tag={seat.tag} title={seat.title} text={seat.text} delayClass={delayFor(i + 3)} />
          ))}
        </div>

        {data.paragraphs[1] && (
          <p className="font-body leading-relaxed reveal reveal-d6" style={{ fontSize: "0.78rem", color: "var(--ink-muted)", fontStyle: "italic", maxWidth: "820px" }}>
            {data.paragraphs[1]}
          </p>
        )}
      </div>
      <BottomBar left="ПУНКТ 1" right={data.footerRight} />
    </SlideWrapper>
  );
}

/* ══════════════════════════════════════════
   SLIDE 3 — CRISIS (three visual turning points)
══════════════════════════════════════════ */
const CRISIS_MOMENTS = [
  {
    year: "1068",
    tag: "Половецька загроза",
    title: "Поразка на Альті",
    text: "Об’єднане військо Ярославичів зазнало розгрому. Кияни втратили довіру до Ізяслава й вигнали його з міста.",
    outcome: "Повстання киян і втеча Ізяслава",
    image: "/images/battle-alta-1068.jpg",
    imageAlt: "Мініатюра Радзивіллівського літопису із зображенням битви на річці Альті",
    sourceLabel: "Радзивіллівський літопис · public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Radzvill_chronicle_battle.jpg",
    imagePosition: "center 58%",
  },
  {
    year: "1073",
    tag: "Розпад тріумвірату",
    title: "Переворот у Києві",
    text: "Святослав і Всеволод усунули старшого брата. Київський престол став нагородою у династичній боротьбі.",
    outcome: "Кінець братнього союзу",
    image: "/images/golden-gate-kyiv.jpg",
    imageAlt: "Золоті ворота в Києві",
    sourceLabel: "Золоті ворота · George Chernilevsky · public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Golden_Gate_Kiev_2018_G1.jpg",
    imagePosition: "center 52%",
  },
  {
    year: "1078",
    tag: "Міжкнязівська війна",
    title: "Нежатина Нива",
    text: "У бою загинули Ізяслав і Борис Вячеславич. Усобиця довела, що старий порядок успадкування більше не стримує князів.",
    outcome: "Потреба нових правил спадкування",
    image: "/images/nezhatina-niva-1078.jpg",
    imageAlt: "Мініатюра Радзивіллівського літопису про битву на Нежатиній Ниві",
    sourceLabel: "Радзивіллівський літопис · public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Radzivill_chronicle_231.jpg",
    imagePosition: "center 66%",
  },
] as const;

function CrisisMoment({ moment, delayClass }: { moment: (typeof CRISIS_MOMENTS)[number]; delayClass: string }) {
  return (
    <article
      className={`crisis-moment reveal ${delayClass}`}
      style={{ background: "linear-gradient(165deg, rgba(255,250,235,0.72), rgba(217,173,92,0.08))" }}
    >
      <figure className="crisis-photo">
        <img src={moment.image} alt={moment.imageAlt} style={{ objectPosition: moment.imagePosition }} />
        <div className="crisis-photo-shade" aria-hidden="true" />
        <span className="crisis-year font-display">{moment.year}</span>
        <a href={moment.sourceUrl} target="_blank" rel="noreferrer" className="crisis-source">
          {moment.sourceLabel}
        </a>
      </figure>
      <div className="crisis-copy">
        <span className="font-mono crisis-tag">{moment.tag}</span>
        <h3 className="font-display">{moment.title}</h3>
        <p className="font-body">{moment.text}</p>
        <div className="crisis-outcome">
          <span className="font-mono">Наслідок</span>
          <strong className="font-body">{moment.outcome}</strong>
        </div>
      </div>
    </article>
  );
}

function Slide3Crisis({ data, n }: { data: ContentSlideData; n: number }) {
  return (
    <SlideWrapper n={n}>
      <TopBar label={data.topLabel} n={n} />
      <div className="absolute flex flex-col overflow-hidden" style={{ top: "78px", left: "48px", right: "48px", bottom: "62px" }}>
        <SectionTag>{data.kicker}</SectionTag>
        <div className="flex items-end justify-between gap-8 mb-5">
          <div className="flex items-center gap-3">
          <DropCap letter={data.title.charAt(0)} size={40} />
          <h2 className="font-display reveal reveal-d1" style={{ fontSize: "clamp(1.2rem, 2vw, 1.7rem)", color: "var(--ink)", fontWeight: 700, letterSpacing: "-0.01em" }}>
            {data.title.slice(1)}
          </h2>
          </div>
          <p className="font-body reveal reveal-d2" style={{ width: "330px", fontSize: "0.76rem", lineHeight: 1.5, color: "var(--ink-muted)", borderLeft: "2px solid var(--burgundy)", paddingLeft: "14px" }}>
            За десять років спільна влада братів перетворилася на боротьбу за Київ і відкрила шлях тривалій роздробленості.
          </p>
        </div>

        <div className="crisis-grid flex-1 min-h-0">
          {CRISIS_MOMENTS.map((moment, i) => (
            <CrisisMoment key={moment.year} moment={moment} delayClass={delayFor(i + 2)} />
          ))}
        </div>
      </div>
      <BottomBar left="ПУНКТ 1" right={data.footerRight} />
    </SlideWrapper>
  );
}

/* ══════════════════════════════════════════
   SLIDE 4 — CONGRESSES (vertical ladder)
══════════════════════════════════════════ */
function Slide4Congresses({ data, n }: { data: ContentSlideData; n: number }) {
  const items = data.list ?? [];
  const ib = data.infoBlocks?.[0];
  return (
    <SlideWrapper n={n}>
      <TopBar label={data.topLabel} n={n} />
      <div className="absolute flex gap-8 overflow-hidden" style={{ top: "78px", left: "48px", right: "48px", bottom: "62px" }}>
        <div className="flex-1 flex flex-col min-w-0">
          <SectionTag>{data.kicker}</SectionTag>
          <div className="flex items-center gap-3 mb-3">
            <DropCap letter={data.title.charAt(0)} size={40} />
            <h2 className="font-display reveal reveal-d1" style={{ fontSize: "clamp(1.2rem, 2vw, 1.7rem)", color: "var(--ink)", fontWeight: 700, letterSpacing: "-0.01em" }}>
              {data.title.slice(1)}
            </h2>
          </div>
          <p className="font-body leading-relaxed mb-5 reveal reveal-d2" style={{ fontSize: "0.82rem", color: "var(--ink-muted)", maxWidth: "600px" }}>
            {data.paragraphs[0]}
          </p>

          <div className="flex flex-col gap-0 flex-1 min-h-0">
            {items.map((item, i) => {
              const [term, year] = item.term.split("·").map((s) => s.trim());
              return (
                <div key={i} className={`relative flex gap-4 py-3 reveal ${delayFor(i + 3)}`} style={{ borderBottom: i < items.length - 1 ? "1px dashed rgba(36,23,8,0.18)" : "none" }}>
                  <SealBadge label={year ?? String(i + 1)} />
                  <div className="flex-1 min-w-0">
                    <div className="font-display" style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--ink)" }}>{term}</div>
                    <p className="font-body leading-relaxed mt-1" style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {ib && (
          <div className="flex-shrink-0 flex items-center" style={{ width: "220px" }}>
            <InfoBlock tag={ib.tag} title={ib.title} text={ib.text} delayClass="reveal-d6" />
          </div>
        )}
      </div>
      <BottomBar left="ПУНКТ 1" right={data.footerRight} />
    </SlideWrapper>
  );
}

/* ══════════════════════════════════════════
   SLIDE 5 — LIUBECH (single-focus, pull-quote)
══════════════════════════════════════════ */
function Slide5Liubech({ data, n }: { data: ContentSlideData; n: number }) {
  const ib = data.infoBlocks ?? [];
  return (
    <SlideWrapper n={n}>
      <TopBar label={data.topLabel} n={n} />
      <div className="absolute flex flex-col overflow-hidden" style={{ top: "78px", left: "48px", right: "48px", bottom: "62px" }}>
        <SectionTag>{data.kicker}</SectionTag>
        <div className="flex items-center gap-3 mb-3">
          <DropCap letter={data.title.charAt(0)} size={40} />
          <h2 className="font-display reveal reveal-d1" style={{ fontSize: "clamp(1.2rem, 2vw, 1.7rem)", color: "var(--ink)", fontWeight: 700, letterSpacing: "-0.01em" }}>
            {data.title.slice(1)}
          </h2>
        </div>

        <div className="flex-1 flex gap-8 min-h-0">
          <div className="flex-1 flex flex-col justify-center gap-3 min-w-0">
            <p className="font-body leading-relaxed reveal reveal-d2" style={{ fontSize: "0.8rem", color: "var(--ink-muted)", maxWidth: "480px" }}>
              {data.paragraphs[0]}
            </p>
            <p className="font-body leading-relaxed reveal reveal-d4" style={{ fontSize: "0.8rem", color: "var(--ink-muted)", maxWidth: "480px" }}>
              {data.paragraphs[2]}
            </p>
          </div>

          <div className="flex-shrink-0 flex flex-col items-center justify-center gap-3 reveal reveal-d3" style={{ width: "340px" }}>
            <IconOath size={34} color="var(--gold)" strokeWidth={1} />
            <blockquote
              className="font-display italic text-center"
              style={{
                fontSize: "1.5rem", lineHeight: 1.25, color: "var(--burgundy)", fontWeight: 700,
                padding: "8px 18px", borderTop: "1px solid var(--gold)", borderBottom: "1px solid var(--gold)",
              }}
            >
              «Кожен хай тримає отчину свою»
            </blockquote>
            <span className="font-mono text-xs" style={{ color: "var(--ink-muted)", letterSpacing: "0.1em" }}>ЛЮБЕЧ, 1097</span>
          </div>
        </div>

        <div className="flex gap-4 mt-2">
          {ib.map((item, i) => (
            <div key={item.title} className="flex-1">
              <InfoBlock tag={item.tag} title={item.title} text={item.text} delayClass={delayFor(i + 5)} />
            </div>
          ))}
        </div>
      </div>
      <BottomBar left="ПУНКТ 1" right={data.footerRight} />
    </SlideWrapper>
  );
}

/* ══════════════════════════════════════════
   BIBLIOGRAPHY SLIDE
══════════════════════════════════════════ */
function BibliographySlide({ n }: { n: number }) {
  const half = Math.ceil(BIBLIOGRAPHY.length / 2);
  const left = BIBLIOGRAPHY.slice(0, half);
  const right = BIBLIOGRAPHY.slice(half);
  return (
    <SlideWrapper texture="paper-biblio" n={n}>
      <TopBar label="Джерела та література" n={n} />
      <div className="absolute flex flex-col" style={{ top: "78px", left: "48px", right: "48px", bottom: "62px" }}>
        <div className="flex items-center gap-3 mb-5 reveal reveal-d1">
          <IconChronicle size={30} color="var(--burgundy)" strokeWidth={1} />
          <h2 className="font-display" style={{ fontSize: "1.3rem", color: "var(--ink)", fontWeight: 700 }}>
            Джерела та література
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-x-10 flex-1 overflow-hidden">
          <ul className="flex flex-col gap-2.5">
            {left.map((it, i) => (
              <li key={i} className={`font-body leading-snug flex gap-2 reveal ${delayFor(Math.min(i, 5) + 1)}`} style={{ fontSize: "0.73rem", color: "var(--ink-muted)" }}>
                <span className="font-mono" style={{ color: "var(--burgundy)", flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2.5">
            {right.map((it, i) => (
              <li key={i} className={`font-body leading-snug flex gap-2 reveal ${delayFor(Math.min(i, 5) + 1)}`} style={{ fontSize: "0.73rem", color: "var(--ink-muted)" }}>
                <span className="font-mono" style={{ color: "var(--burgundy)", flexShrink: 0 }}>{String(i + 1 + left.length).padStart(2, "0")}</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <BottomBar left="ПУНКТ 1" right={DECK_META.footer} />
    </SlideWrapper>
  );
}


/* ══════════════════════════════════════════
   APP SHELL
══════════════════════════════════════════ */
function NavBtn({ onClick, disabled, children, label }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; label: string }) {
  return (
    <button
      className="nav-arrow"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        width: "44px", height: "44px",
        background: disabled ? "transparent" : "var(--ivory)",
        border: `1px solid ${disabled ? "rgba(245,240,232,0.15)" : "rgba(245,240,232,0.35)"}`,
        color: disabled ? "rgba(245,240,232,0.2)" : "var(--ivory)",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit", fontSize: "1rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}
    >
      <span style={{ color: disabled ? "rgba(245,240,232,0.2)" : "var(--ink)" }}>{children}</span>
    </button>
  );
}

const SLIDE_LABELS = [DECK_META.navLabel, ...SLIDE_CONTENT.map((s) => s.navLabel), "Джерела"];

function renderSlide(index: number) {
  if (index === 0) return <Slide1 />;
  if (index === TOTAL_SLIDES - 1) return <BibliographySlide n={index + 1} />;
  const data: ContentSlideData = SLIDE_CONTENT[index - 1];
  const n = index + 1;
  switch (data.id) {
    case "triumvirate":
      return <Slide2Triumvirate data={data} n={n} />;
    case "crisis":
      return <Slide3Crisis data={data} n={n} />;
    case "congresses":
      return <Slide4Congresses data={data} n={n} />;
    case "liubech":
      return <Slide5Liubech data={data} n={n} />;
    default:
      return <Slide2Triumvirate data={data} n={n} />;
  }
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [key, setKey] = useState(0);
  const [stageScale, setStageScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const presentationRef = useRef<HTMLElement>(null);
  const stageRegionRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback((i: number) => {
    if (i < 0 || i >= TOTAL_SLIDES) return;
    setCurrent(i);
    setKey((k) => k + 1);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await presentationRef.current?.requestFullscreen();
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goTo(current - 1);
      if (event.key === "ArrowRight") goTo(current + 1);
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(TOTAL_SLIDES - 1);
      if (event.key.toLowerCase() === "f") void toggleFullscreen();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, goTo, toggleFullscreen]);

  useLayoutEffect(() => {
    const region = stageRegionRef.current;
    if (!region) return;

    const measure = () => {
      const nextScale = Math.min(region.clientWidth / 1280, region.clientHeight / 720, 1);
      setStageScale(Math.max(nextScale, 0.1));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(region);
    window.visualViewport?.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, []);

  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    goTo(deltaX < 0 ? current + 1 : current - 1);
  };

  return (
    <main ref={presentationRef} className="presentation-app">
      <CastleScene />
      <header className="deck-header">
        <div className="deck-identity">
          <div>
            <span>{DECK_META.courseLabel}</span>
            <strong>{DECK_META.deckTitle}</strong>
          </div>
        </div>
        <div className="deck-progress" aria-label={`Слайд ${current + 1} із ${TOTAL_SLIDES}`}>
          <span>{String(current + 1).padStart(2, "0")} / {String(TOTAL_SLIDES).padStart(2, "0")}</span>
          <div aria-hidden="true">
            <i style={{ width: `${((current + 1) / TOTAL_SLIDES) * 100}%` }} />
          </div>
        </div>
      </header>

      <div className="presentation-workspace">
        <div
          ref={stageRegionRef}
          className="presentation-stage-region"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="presentation-stage-frame"
            style={{ width: `${1280 * stageScale}px`, height: `${720 * stageScale}px` }}
          >
            <div
              className="presentation-stage"
              style={{ transform: `scale(${stageScale})` }}
              role="group"
              aria-roledescription="слайд"
              aria-label={`${current + 1} з ${TOTAL_SLIDES}: ${SLIDE_LABELS[current]}`}
            >
              <div key={key} className="w-full h-full">
                {renderSlide(current)}
              </div>
            </div>
          </div>
        </div>

        <nav className="presentation-controls flex items-center gap-3" aria-label="Навігація презентацією">
          <NavBtn onClick={() => goTo(current - 1)} disabled={current === 0} label="Попередній слайд">←</NavBtn>

          <div className="flex items-center slide-dots">
            {SLIDE_LABELS.map((_, i) => (
              <button
                key={i}
                className="slide-dot"
                onClick={() => goTo(i)}
                title={SLIDE_LABELS[i]}
                aria-label={`Перейти до слайда ${i + 1}: ${SLIDE_LABELS[i]}`}
                aria-current={i === current ? "page" : undefined}
              >
                <span className={i === current ? "active" : ""} />
              </button>
            ))}
          </div>

          <NavBtn onClick={() => goTo(current + 1)} disabled={current === TOTAL_SLIDES - 1} label="Наступний слайд">→</NavBtn>

          <span className="current-slide-label">
            {SLIDE_LABELS[current]}
          </span>

          <button className="bibliography-jump" onClick={() => goTo(TOTAL_SLIDES - 1)}>
            Джерела
          </button>

          <button
            type="button"
            className="fullscreen-toggle"
            onClick={() => void toggleFullscreen()}
            aria-label={isFullscreen ? "Вийти з повноекранного режиму" : "Відкрити презентацію на весь екран"}
            title={isFullscreen ? "Вийти з повноекранного режиму" : "На весь екран (F)"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {isFullscreen ? (
                <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
              ) : (
                <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
              )}
            </svg>
            <span>{isFullscreen ? "Вийти" : "На весь екран"}</span>
          </button>
        </nav>
      </div>

      <footer className="site-credit">
        <span>← → для навігації · свайп на сенсорному екрані</span>
        <span>{DECK_META.deckTitle} · Семінарське заняття з історії України</span>
      </footer>
    </main>
  );
}
