import { useState, useEffect, useRef, useCallback } from "react";
import { Router as WouterRouter, useLocation } from "wouter";
import logoImg from "@assets/photo_2025-11-01_00-16-56_1776460914972.jpg";
import albumCoverImg from "@assets/Без_названия22_20260125145126_1776462957592.jpg";
import loadingLogoImg from "@assets/photo_2025-11-01_00-16-56_1776461223690.jpg";
import introLogoImg from "@assets/1776461855769_1776461867188.png";
import vhsBgImg from "@assets/maxresdefault_1776459999648.jpg";
import pentacleImg from "@assets/Inverted_pentacle_bold.svg_1776460582291.png";
import albumHoverAudioUrl from "@assets/album-hover-track.mp3";
import cemeteryNightSceneImg from "@assets/ee0ffebe3f9d912bccceee12e233a0a1_1776468512643.jpg";
import horsemanNoBgImg from "@assets/horseman_no_bg.png";
import reaperNoBgImg from "@assets/reaper_no_bg.png";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const SOUNDCLOUD_URL = "https://on.soundcloud.com/iToqG4PCA3buDWX0oU";
const SPOTIFY_URL = "https://open.spotify.com/artist/2CXkBzvt6FRW4dcENy3n0J";
const ALBUM_SOUNDCLOUD_URL =
  "https://soundcloud.com/dj_anticrist_187off/silent-cemeteries-in-the-forest?si=656f0835debd42e6be2930ba1331cb3a&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing";
const ALBUM_STORY_TEXT =
  "When darkness takes root in the forests, the cemeteries no longer sleep. The old unclean spirits go hunting, and the hero sets out to fight them...";

const translations = {
  en: {
    clickToEnter: "CLICK TO ENTER",
    subtitle: "OFFICIAL WEBSITE ARTIST",
    aboutBtn: "About Me",
    aboutTitle: "About Me",
    bio1: "This is the official website of DJ_ANTICRIST_187 — producer of dirty and raw sound!",
    bio2: "Here dark creatures perish, keepers of tombs, and the king of necromancers prepares for the attack. The sound evokes in many a terrifying atmosphere of a graveyard, dark forces, and fear of the unclean!",
    bio3: "Prepare for battle and do not perish in the fight! Good luck, wanderer!",
    bio4: "Member of the NECROHILL SQUAD collective, where I and my colleagues forge this dirty and raw sound — as if forged deep within caves!",
    backBtn: "Back",
    footer: "DJ_ANTICRIST_187 / NECROHILL SQUAD / ALL RIGHTS RESERVED",
    present: "PRESENTS",
    musicPlatforms: "Music Platforms",
    soundcloud: "SoundCloud",
    spotify: "Spotify",
    pleaseWait: "Please Wait...",
  },
  ru: {
    clickToEnter: "НАЖМИТЕ ДЛЯ ВХОДА",
    subtitle: "OFFICIAL WEBSITE ARTIST",
    aboutBtn: "Обо мне",
    aboutTitle: "Обо мне",
    bio1: "Это официальный сайт с информацией о DJ_ANTICRIST_187, продюсера грязного и сырого звука!",
    bio2: "Здесь погибают тёмные существа, хранители гробниц и готовится к атаке царь некромантов. Звучание у многих вызывает жуткую атмосферу кладбища, тёмных сил и страх у нечисти!",
    bio3: "Готовься к бою и не погибни в сражении! Удачи, путник!",
    bio4: "Участник объединения NECROHILL SQUAD, где я со своими коллегами создаём данный грязный и сырой звук как в пещерах!",
    backBtn: "Назад",
    footer: "DJ_ANTICRIST_187 / NECROHILL SQUAD / ВСЕ ПРАВА ЗАЩИЩЕНЫ",
    present: "ПРЕДСТАВЛЯЕТ",
    musicPlatforms: "Music Platforms",
    soundcloud: "SoundCloud",
    spotify: "Spotify",
    pleaseWait: "Please Wait...",
  },
};

type Lang = "en" | "ru";

function useVHSAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const hissNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const init = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    return ctx;
  }, []);

  const playInsertSound = useCallback(() => {
    const ctx = init();
    const now = ctx.currentTime;
    const duration = 1.8;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      let sample = (Math.random() * 2 - 1) * 0.4;
      if (t < 0.08) sample += Math.sin(t * 200) * (1 - t / 0.08) * 0.6;
      if (t > 0.12 && t < 0.22) sample += Math.sin(t * 80) * 0.3;
      if (t > 0.25 && t < 0.4) sample += (Math.random() * 2 - 1) * 0.5;
      const env = t < 0.05 ? t / 0.05 : t > 1.5 ? (1.8 - t) / 0.3 : 1;
      data[i] = sample * env * 0.7;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.5;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.linearRampToValueAtTime(0.0, now + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(now);
    src.stop(now + duration);
  }, [init]);

  const playCassette = useCallback((): Promise<void> => {
    const ctx = init();
    const now = ctx.currentTime;
    const duration = 3.8;
    const sr = ctx.sampleRate;
    const bufferSize = sr * duration;
    const buffer = ctx.createBuffer(1, bufferSize, sr);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / sr;
      let s = 0;
      // mechanical click on insert
      if (t < 0.04) s += (Math.random() * 2 - 1) * (1 - t / 0.04) * 0.9;
      // brief crackle
      if (t > 0.05 && t < 0.15) s += (Math.random() * 2 - 1) * 0.25;
      // mechanism engaging - low thump
      if (t > 0.18 && t < 0.38) {
        const p = (t - 0.18) / 0.2;
        s += Math.sin(t * 55) * p * (1 - p) * 4 * 0.5;
        s += (Math.random() * 2 - 1) * 0.3;
      }
      // second click - lock in
      if (t > 0.42 && t < 0.48) s += (Math.random() * 2 - 1) * (1 - (t - 0.42) / 0.06) * 0.7;
      // motor spinning up hiss
      if (t > 0.5) {
        const ramp = Math.min(1, (t - 0.5) / 1.5);
        s += (Math.random() * 2 - 1) * 0.35 * ramp;
        s += Math.sin(t * 140) * 0.04 * ramp; // motor whir
      }
      // crackling on tape start
      if (t > 0.55 && t < 1.1) s += (Math.random() * 2 - 1) * 0.18 * Math.random();
      // fade out at end
      const env = t > duration - 0.4 ? (duration - t) / 0.4 : 1;
      data[i] = s * env * 0.75;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const lo = ctx.createBiquadFilter();
    lo.type = "lowpass";
    lo.frequency.value = 4000;
    const hi = ctx.createBiquadFilter();
    hi.type = "highpass";
    hi.frequency.value = 80;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.85, now);
    src.connect(lo);
    lo.connect(hi);
    hi.connect(gain);
    gain.connect(ctx.destination);
    src.start(now);
    src.stop(now + duration);

    return new Promise((resolve) => {
      src.onended = () => resolve();
    });
  }, [init]);

  const startHiss = useCallback(() => {
    const ctx = init();
    if (hissNodeRef.current) return;
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "highshelf";
    filter.frequency.value = 3000;
    filter.gain.value = -8;
    const filter2 = ctx.createBiquadFilter();
    filter2.type = "peaking";
    filter2.frequency.value = 800;
    filter2.gain.value = -4;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);
    src.connect(filter);
    filter.connect(filter2);
    filter2.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    hissNodeRef.current = src;
  }, [init]);

  return { playInsertSound, playCassette, startHiss };
}

function VHSCanvas({ opacity = 1, dense = true, zIndex = 5 }: { opacity?: number; dense?: boolean; zIndex?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return;
      frameRef.current++;
      ctx.clearRect(0, 0, w, h);

      if (dense) {
        const imageData = ctx.createImageData(w, h);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = Math.random() * 200 | 0;
          d[i] = v; d[i + 1] = v; d[i + 2] = v;
          d[i + 3] = Math.random() > 0.5 ? 255 : 180;
        }
        ctx.putImageData(imageData, 0, 0);
        const numLines = 2 + Math.floor(Math.random() * 3);
        for (let l = 0; l < numLines; l++) {
          const y = Math.random() * h;
          const lineH = 1 + Math.random() * 4;
          ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.25})`;
          ctx.fillRect(0, y, w, lineH);
        }
        if (Math.random() > 0.85) {
          const glitchY = Math.random() * h;
          const glitchH = 2 + Math.random() * 8;
          ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.4})`;
          ctx.fillRect(0, glitchY, w * (0.3 + Math.random() * 0.7), glitchH);
        }
      } else {
        const imageData = ctx.createImageData(w, h);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = Math.random() * 100 | 0;
          d[i] = v; d[i + 1] = v; d[i + 2] = v;
          d[i + 3] = Math.random() > 0.6 ? 70 : 25;
        }
        ctx.putImageData(imageData, 0, 0);
        const numLines = 1 + Math.floor(Math.random() * 3);
        for (let l = 0; l < numLines; l++) {
          const y = Math.random() * h;
          const lh = 1 + Math.random() * 3;
          ctx.fillStyle = `rgba(255,255,255,${0.06 + Math.random() * 0.12})`;
          ctx.fillRect(0, y, w, lh);
        }
        if (Math.random() > 0.7) {
          const numGlitch = 1 + Math.floor(Math.random() * 3);
          for (let g = 0; g < numGlitch; g++) {
            const gy = Math.random() * h;
            const gh = 1 + Math.random() * 5;
            const gx = (Math.random() - 0.5) * 60;
            const gw = w * (0.2 + Math.random() * 0.5);
            ctx.fillStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.09})`;
            ctx.fillRect(gx, gy, gw, gh);
          }
        }
        if (frameRef.current % 6 === 0 && Math.random() > 0.5) {
          const bandY = Math.random() * h;
          const bandH = 4 + Math.random() * 20;
          const shift = (Math.random() - 0.5) * 30;
          ctx.save();
          ctx.globalCompositeOperation = "source-over";
          const slice = ctx.getImageData(0, bandY, w, bandH);
          ctx.clearRect(0, bandY, w, bandH);
          ctx.putImageData(slice, shift, bandY);
          ctx.restore();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [dense]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex,
        opacity,
        mixBlendMode: "screen",
      }}
    />
  );
}

function VHSEffectOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `url(${vhsBgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        pointerEvents: "none",
        zIndex: 95,
        mixBlendMode: "screen",
        animation: "vhsEffectFlicker 0.18s steps(2) infinite",
      }}
    />
  );
}

function LoadingOverlay({ lang, url, onDone }: { lang: Lang; url: string; onDone: () => void }) {
  const t = translations[lang];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
      window.open(url, "_blank");
    }, 2200);
    return () => clearTimeout(timer);
  }, [onDone, url]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.93)",
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        animation: "fadeIn 0.3s ease forwards",
      }}
    >
      <img
        src={pentacleImg}
        alt="Pentacle"
        style={{
          width: "clamp(100px, 14vw, 160px)",
          height: "clamp(100px, 14vw, 160px)",
          objectFit: "contain",
          filter: "invert(1)",
          mixBlendMode: "screen",
          animation: "spinRecord 2s linear infinite",
        }}
      />
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
          letterSpacing: ".45em",
          color: "rgba(255,255,255,0.85)",
          textShadow: "0 0 16px rgba(255,255,255,0.5)",
          animation: "fadeIn 0.6s ease 0.3s both",
        }}
      >
        {t.pleaseWait}
      </div>
    </div>
  );
}

function VHSIntro({ onDone, lang }: { onDone: () => void; lang: Lang }) {
  const [phase, setPhase] = useState<"static" | "logo" | "fading">("static");
  const t = translations[lang];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 400);
    const t2 = setTimeout(() => setPhase("fading"), 3000);
    const t3 = setTimeout(() => onDone(), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        opacity: phase === "fading" ? 0 : 1,
        transition: phase === "fading" ? "opacity 0.8s ease" : "none",
      }}
    >
      <VHSCanvas opacity={1} dense={true} zIndex={210} />
      <div className="tracking-line" style={{ zIndex: 215 }} />

      {phase === "logo" && (
        <div
          style={{
            position: "relative",
            zIndex: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            animation: "pageIn 0.5s ease forwards",
          }}
        >
          <img
            src={introLogoImg}
            alt="DJ Anticrist 187"
            style={{
              width: "clamp(180px, 28vw, 300px)",
              height: "clamp(180px, 28vw, 300px)",
              objectFit: "contain",
              mixBlendMode: "screen",
              filter: "grayscale(1) brightness(2) contrast(100)",
            }}
          />
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(0.85rem, 2vw, 1.2rem)",
              letterSpacing: ".7em",
              color: "rgba(255,255,255,1)",
              textShadow: "0 0 12px rgba(255,255,255,.8), 0 0 28px rgba(255,255,255,.4)",
            }}
          >
            {t.present}
          </div>
        </div>
      )}
    </div>
  );
}

function Logo() {
  return (
    <img
      src={logoImg}
      alt="DJ Anticrist 187 Logo"
      style={{
        position: "fixed",
        top: "10px",
        right: "12px",
        width: "clamp(56px, 6vw, 80px)",
        height: "clamp(56px, 6vw, 80px)",
        objectFit: "contain",
        opacity: 0.9,
        zIndex: 50,
        pointerEvents: "none",
        mixBlendMode: "screen",
        filter: "brightness(0.88) contrast(7)",
      }}
    />
  );
}

function PlayBlinker() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="play-indicator"
      style={{
        position: "fixed",
        top: "16px",
        left: "22px",
        zIndex: 55,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.1s ease",
        pointerEvents: "none",
      }}
    >
      ▶ PLAY
    </div>
  );
}

function TranslateButton({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="btn-glow"
      style={{
        position: "fixed",
        bottom: "18px",
        left: "22px",
        padding: "6px 18px",
        background: "rgba(0,0,0,.65)",
        border: "1px solid rgba(255,255,255,.35)",
        color: "#fff",
        fontFamily: "'Cinzel', serif",
        letterSpacing: ".2em",
        cursor: "pointer",
        fontSize: "0.75rem",
        zIndex: 60,
      }}
    >
      {lang === "en" ? "RU" : "EN"}
    </button>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: "center",
        padding: "10px 20px",
        fontFamily: "'Cinzel', serif",
        fontSize: "0.58rem",
        letterSpacing: ".3em",
        color: "rgba(255,255,255,.3)",
        zIndex: 50,
        pointerEvents: "none",
        background: "linear-gradient(transparent, rgba(0,0,0,.55))",
      }}
    >
      {translations[lang].footer}
    </div>
  );
}

function PageShell({ children, lang }: { children: React.ReactNode; lang: Lang }) {
  return (
    <>
      <VHSEffectOverlay />
      <VHSCanvas opacity={0.18} dense={false} zIndex={96} />
      <div className="vignette crt-lines" style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }} />
      <Footer lang={lang} />
      {children}
    </>
  );
}

function AlbumCard({
  expanded,
  onToggle,
  onSoundCloudOpen,
}: {
  expanded: boolean;
  onToggle: () => void;
  onSoundCloudOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(albumHoverAudioUrl);
    audioRef.current.preload = "auto";
    audioRef.current.volume = 0.7;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!expanded) return;
    return () => {
      if (audioRef.current) {
        audioRef.current.loop = false;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [expanded]);

  const handleEnter = () => {
    setHovered(true);
    if (audioRef.current) {
      audioRef.current.loop = expanded;
      audioRef.current.volume = expanded ? 0.28 : 0.7;
      if (!expanded) audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    setHovered(false);
    if (expanded) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
    }
    onToggle();
  };

  return (
    <>
      {expanded && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 15,
            pointerEvents: "none",
            overflow: "hidden",
            animation: "fadeIn 0.65s ease forwards",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              background: `
                linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.5)),
                radial-gradient(circle at 50% 8%, rgba(255,255,255,.12), transparent 42%),
                url(${cemeteryNightSceneImg}) center/cover no-repeat
              `,
              filter: "grayscale(1) brightness(0.82) contrast(1.55) saturate(0)",
            }}
          />
          <img
            src={horsemanNoBgImg}
            alt="Hero on horse"
            style={{
              position: "absolute",
              zIndex: 2,
              left: "2vw",
              bottom: "-13vh",
              width: "clamp(230px, 30vw, 430px)",
              maxHeight: "82vh",
              objectFit: "contain",
              opacity: 0.78,
              filter: "grayscale(1) brightness(0.86) contrast(1.65) drop-shadow(0 0 28px rgba(255,255,255,.18))",
            }}
          />
          <img
            src={reaperNoBgImg}
            alt="Reaper"
            style={{
              position: "absolute",
              zIndex: 2,
              right: "5vw",
              bottom: "-11vh",
              width: "clamp(180px, 22vw, 340px)",
              maxHeight: "76vh",
              objectFit: "contain",
              opacity: 0.78,
              filter: "grayscale(1) brightness(0.82) contrast(1.9) drop-shadow(0 0 32px rgba(255,255,255,.14))",
            }}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: expanded ? "row" : "column",
          alignItems: expanded ? "flex-start" : "center",
          gap: expanded ? "34px" : 0,
          marginTop: expanded ? 0 : "28px",
          position: expanded ? "fixed" : "relative",
          top: expanded ? "72px" : "auto",
          left: expanded ? "64px" : "auto",
          zIndex: expanded ? 70 : "auto",
          transition: "all 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
      <div
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: "relative",
          width: expanded ? "clamp(260px, 30vw, 380px)" : "clamp(110px, 17vw, 170px)",
          height: expanded ? "clamp(260px, 30vw, 380px)" : "clamp(110px, 17vw, 170px)",
          cursor: "pointer",
          border: "1px solid rgba(255,255,255,0.15)",
          overflow: "hidden",
          boxShadow: expanded
            ? "0 0 34px rgba(255,255,255,0.14), 0 0 90px rgba(0,0,0,0.9)"
            : "none",
          transition: "width 0.55s cubic-bezier(0.22, 1, 0.36, 1), height 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease",
        }}
      >
        <img
          src={albumCoverImg}
          alt="Silent Cemeteries In The Forest"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "grayscale(0.3) contrast(1.1)",
            transition: "filter 0.4s ease",
          }}
        />
      </div>
      {hovered && !expanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "9px",
            marginTop: "13px",
            width: "min(280px, 72vw)",
            animation: "pageIn 0.3s ease forwards",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(0.55rem, 1.1vw, 0.72rem)",
              letterSpacing: ".3em",
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              textTransform: "uppercase",
              textShadow: "0 0 12px rgba(255,255,255,0.5)",
              lineHeight: 1.6,
            }}
          >
            SILENT CEMETERIES IN THE FOREST
          </div>
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "rgba(255,255,255,0.35)",
            }}
          />
          <div
            style={{
              fontFamily: "'UnifrakturMaguntia', serif",
              fontSize: "clamp(0.9rem, 1.8vw, 1.15rem)",
              letterSpacing: ".2em",
              color: "rgba(255,255,255,0.75)",
              textAlign: "center",
              textShadow: "0 0 10px rgba(255,255,255,0.3)",
            }}
          >
            DJ_ANTICRIST_187
          </div>
        </div>
      )}
      {expanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "13px",
            alignItems: "center",
            animation: "pageIn 0.55s ease forwards",
            width: "calc(100vw - min(30vw, 380px) - 160px)",
            maxWidth: "820px",
            minWidth: "460px",
            marginTop: "86px",
            padding: "0",
            background: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(1rem, 2.1vw, 1.75rem)",
              letterSpacing: ".28em",
              color: "rgba(255,255,255,0.94)",
              textTransform: "uppercase",
              textShadow: "0 0 14px rgba(255,255,255,0.5), 3px 3px 0 #000",
              lineHeight: 1.45,
              textAlign: "center",
              width: "100%",
            }}
          >
            SILENT CEMETERIES IN THE FOREST
          </div>
          <div
            style={{
              width: "92px",
              height: "1px",
              background: "rgba(255,255,255,0.35)",
              alignSelf: "center",
            }}
          />
          <div
            style={{
              fontFamily: "'UnifrakturMaguntia', serif",
              fontSize: "clamp(1.35rem, 3vw, 2.35rem)",
              letterSpacing: ".18em",
              color: "rgba(255,255,255,0.82)",
              textShadow: "0 0 12px rgba(255,255,255,0.35), 3px 3px 0 #000",
              textAlign: "center",
              width: "100%",
            }}
          >
            DJ_ANTICRIST_187
          </div>
          <p
            style={{
              marginTop: "8px",
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(0.92rem, 1.45vw, 1.22rem)",
              letterSpacing: ".12em",
              lineHeight: 2.05,
              color: "rgba(255,255,255,0.86)",
              textShadow: "0 0 12px rgba(0,0,0,1), 2px 2px 0 rgba(0,0,0,.8)",
              textAlign: "center",
              width: "100%",
            }}
          >
            {ALBUM_STORY_TEXT}
          </p>
          <button
            className="btn-glow"
            onClick={(event) => {
              event.stopPropagation();
              onSoundCloudOpen();
            }}
            style={{
              marginTop: "16px",
              padding: "11px 24px",
              background: "rgba(0,0,0,.58)",
              border: "1px solid rgba(255,255,255,.35)",
              color: "#fff",
              fontFamily: "'UnifrakturMaguntia', serif",
              letterSpacing: ".18em",
              cursor: "pointer",
              fontSize: "1.05rem",
              textShadow: "0 0 8px rgba(255,255,255,0.35)",
              alignSelf: "center",
            }}
          >
            Listen full in SoundCloud
          </button>
        </div>
      )}
      </div>
    </>
  );
}

function HomePage({ lang, onNavigate }: { lang: Lang; onNavigate: (path: string) => void }) {
  const t = translations[lang];
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null);
  const [albumExpanded, setAlbumExpanded] = useState(false);

  const handleOverlayDone = useCallback(() => {
    setOverlayUrl(null);
  }, []);

  return (
    <PageShell lang={lang}>
      {overlayUrl && <LoadingOverlay lang={lang} url={overlayUrl} onDone={handleOverlayDone} />}
      <div
        style={{
          height: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.72)),
              url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat
            `,
            filter: "grayscale(1) brightness(0.85) contrast(2.2)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 20,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="glitch-title"
            style={{
              fontSize: "clamp(2.8rem, 9vw, 8rem)",
              letterSpacing: ".12em",
              color: "#fff",
              fontFamily: "'UnifrakturMaguntia', serif",
              fontWeight: 400,
              textShadow:
                "0 0 6px rgba(255,255,255,.4), 0 0 18px rgba(180,180,255,.5), 0 0 30px rgba(180,180,255,.3), 3px 3px 0 #000, -2px -2px 0 #000",
              lineHeight: 1.1,
              opacity: albumExpanded ? 0 : 1,
              pointerEvents: albumExpanded ? "none" : "auto",
              transition: "opacity 0.35s ease",
            }}
          >
            DJ_Anticrist_187
          </div>

          <div
            style={{
              marginTop: "14px",
              fontSize: "0.85rem",
              letterSpacing: ".45em",
              opacity: 0.65,
              color: "#fff",
              fontFamily: "'Cinzel', serif",
              display: albumExpanded ? "none" : "block",
            }}
          >
            {t.subtitle}
          </div>

          <AlbumCard
            expanded={albumExpanded}
            onToggle={() => setAlbumExpanded((value) => !value)}
            onSoundCloudOpen={() => setOverlayUrl(ALBUM_SOUNDCLOUD_URL)}
          />

          {!albumExpanded && (
            <>
          <button
            className="btn-glow"
            onClick={() => onNavigate("/about")}
            style={{
              marginTop: "32px",
              padding: "12px 32px",
              background: "rgba(0,0,0,.55)",
              border: "1px solid rgba(255,255,255,.35)",
              color: "#fff",
              fontFamily: "'UnifrakturMaguntia', serif",
              letterSpacing: ".2em",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
          >
            {t.aboutBtn}
          </button>

          <div
            style={{
              marginTop: "28px",
              fontSize: "0.72rem",
              letterSpacing: ".4em",
              color: "rgba(255,255,255,.5)",
              fontFamily: "'Cinzel', serif",
              textTransform: "uppercase",
            }}
          >
            {t.musicPlatforms}
          </div>

          <div style={{ marginTop: "10px", display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              className="btn-glow"
              onClick={() => setOverlayUrl(SOUNDCLOUD_URL)}
              style={{
                padding: "11px 26px",
                background: "rgba(0,0,0,.55)",
                border: "1px solid rgba(255,255,255,.35)",
                color: "#fff",
                fontFamily: "'UnifrakturMaguntia', serif",
                letterSpacing: ".2em",
                cursor: "pointer",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor" style={{ opacity: 0.85 }}>
                <path d="M1.4 19.5c0 2.5 2 4.5 4.5 4.5h17c2.2 0 4-1.8 4-4s-1.8-4-4-4c-.2 0-.4 0-.6.1C22 13.2 19.4 11 16.3 11c-1.2 0-2.3.3-3.3.9V19.5H1.4zm0 0c0-2 1.6-3.6 3.6-3.6.5 0 1 .1 1.4.3C7 14 8.9 13 11 13c.4 0 .8 0 1.2.1V19.5H1.4z"/>
                <path d="M12.2 12.1V23h1.2V12.5c-.4-.2-.8-.4-1.2-.4zm2.4-.5V23h1.2V11.3c-.4.1-.8.2-1.2.3zm2.4.9V23h1.2V12c-.4 0-.8 0-1.2.1zm2.4.8V23h1.2V13c-.4-.2-.8-.3-1.2-.3z"/>
              </svg>
              {t.soundcloud}
            </button>

            <button
              className="btn-glow"
              onClick={() => setOverlayUrl(SPOTIFY_URL)}
              style={{
                padding: "11px 26px",
                background: "rgba(0,0,0,.55)",
                border: "1px solid rgba(255,255,255,.35)",
                color: "#fff",
                fontFamily: "'UnifrakturMaguntia', serif",
                letterSpacing: ".2em",
                cursor: "pointer",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.85 }}>
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.5 17.3c-.22.36-.68.47-1.04.25-2.84-1.74-6.42-2.13-10.63-1.17-.4.09-.8-.16-.89-.57-.09-.4.16-.8.57-.89 4.61-1.05 8.57-.6 11.75 1.34.36.22.47.68.24 1.04zm1.47-3.27c-.27.44-.85.58-1.3.31-3.26-2-8.23-2.58-12.08-1.41-.5.15-1.02-.14-1.17-.63-.15-.5.14-1.02.63-1.17 4.4-1.34 9.87-.69 13.61 1.6.44.27.58.85.31 1.3zm.13-3.4C15.28 8.38 9.1 8.16 5.54 9.27c-.6.18-1.23-.16-1.41-.75-.18-.6.16-1.23.75-1.41 4.13-1.26 10.99-1 15.33 1.54.55.33.73 1.04.4 1.58-.33.54-1.03.72-1.57.4z"/>
              </svg>
              {t.spotify}
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function AboutPage({ lang, onNavigate }: { lang: Lang; onNavigate: (path: string) => void }) {
  const t = translations[lang];

  return (
    <PageShell lang={lang}>
      <div
        style={{
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          paddingTop: "80px",
          paddingBottom: "70px",
        }}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: `
              linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.85)),
              url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat
            `,
            filter: "grayscale(1) brightness(0.7) contrast(2.1)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 20,
            textAlign: "center",
            maxWidth: "640px",
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="glitch-title"
            style={{
              fontSize: "clamp(2rem, 7vw, 5rem)",
              letterSpacing: ".12em",
              color: "#fff",
              fontFamily: "'UnifrakturMaguntia', serif",
              fontWeight: 400,
              textShadow:
                "0 0 6px rgba(255,255,255,.4), 0 0 18px rgba(180,180,255,.5), 0 0 30px rgba(180,180,255,.3), 3px 3px 0 #000, -2px -2px 0 #000",
              lineHeight: 1.1,
              marginBottom: "36px",
            }}
          >
            {t.aboutTitle}
          </div>

          <div
            style={{
              width: "100%",
              border: "1px solid rgba(255,255,255,.18)",
              padding: "2rem",
              background: "rgba(0,0,0,.7)",
            }}
          >
            {[t.bio1, t.bio2, t.bio3, t.bio4].map((text, i, arr) => (
              <p
                key={i}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: ".82rem",
                  letterSpacing: ".12em",
                  lineHeight: 1.95,
                  color: "rgba(255,255,255,.82)",
                  marginBottom: i < arr.length - 1 ? "1.1rem" : 0,
                  textAlign: "left",
                }}
              >
                {text}
              </p>
            ))}
          </div>

          <button
            className="btn-glow"
            onClick={() => onNavigate("/")}
            style={{
              marginTop: "32px",
              padding: "10px 28px",
              background: "rgba(0,0,0,.55)",
              border: "1px solid rgba(255,255,255,.35)",
              color: "#fff",
              fontFamily: "'UnifrakturMaguntia', serif",
              letterSpacing: ".2em",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {t.backBtn}
          </button>
        </div>
      </div>
    </PageShell>
  );
}

function AppRoutes({ lang }: { lang: Lang }) {
  const [location, setLocation] = useLocation();
  const [displayedPath, setDisplayedPath] = useState(location);
  const [exiting, setExiting] = useState(false);
  const pendingRef = useRef<string | null>(null);

  const navigate = useCallback((path: string) => {
    if (path === displayedPath) return;
    pendingRef.current = path;
    setExiting(true);
    setTimeout(() => {
      setDisplayedPath(path);
      setLocation(path);
      setExiting(false);
      pendingRef.current = null;
    }, 350);
  }, [displayedPath, setLocation]);

  return (
    <div
      className={exiting ? "page-exit" : "page-enter"}
      key={displayedPath}
      style={{ height: "100%" }}
    >
      {displayedPath === "/" || displayedPath === "" ? (
        <HomePage lang={lang} onNavigate={navigate} />
      ) : (
        <AboutPage lang={lang} onNavigate={navigate} />
      )}
    </div>
  );
}

function App() {
  const [introPlayed, setIntroPlayed] = useState(false);
  const [started, setStarted] = useState(false);
  const [cassettePlaying, setCassettePlaying] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const { playInsertSound, playCassette, startHiss } = useVHSAudio();

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "en" ? "ru" : "en"));
  }, []);

  const handleStart = useCallback(() => {
    setCassettePlaying(true);
    playCassette().then(() => {
      setCassettePlaying(false);
      setStarted(true);
      playInsertSound();
      setTimeout(() => startHiss(), 400);
    });
  }, [playCassette, playInsertSound, startHiss]);

  const handleIntroDone = useCallback(() => {
    setIntroPlayed(true);
    startHiss();
  }, [startHiss]);

  // Pure black screen during cassette playback
  if (cassettePlaying) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          zIndex: 999,
        }}
      />
    );
  }

  if (!started) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 999,
        }}
        onClick={handleStart}
      >
        <VHSCanvas opacity={0.35} dense={false} zIndex={5} />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.75rem",
            letterSpacing: ".5em",
            animation: "fadeIn 1.5s ease forwards",
          }}
        >
          {translations[lang].clickToEnter}
        </div>
      </div>
    );
  }

  return (
    <>
      {!introPlayed && <VHSIntro onDone={handleIntroDone} lang={lang} />}
      <div
        style={{
          opacity: introPlayed ? 1 : 0,
          transition: "opacity 0.6s ease",
          height: "100%",
        }}
      >
        <Logo />
        <PlayBlinker />
        <TranslateButton lang={lang} onToggle={toggleLang} />
        <WouterRouter base={BASE}>
          <AppRoutes lang={lang} />
        </WouterRouter>
      </div>
    </>
  );
}

export default App;
