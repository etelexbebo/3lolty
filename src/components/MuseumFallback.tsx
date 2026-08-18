import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GIFT, LOVE_REASONS, MEMORIES, MESSAGES, START_DATE } from "@/lib/constants";

/* ── Room labels ─────────────────────────────── */
const ROOMS = [
  { id: 0, label: "البداية" },
  { id: 1, label: "أول مرة" },
  { id: 2, label: "الذكريات" },
  { id: 3, label: "الرسائل" },
  { id: 4, label: "عداد الحب" },
  { id: 5, label: "النجوم" },
  { id: 6, label: "ممنوع الدخول إلا ليكي" },
  { id: 7, label: "هدية من loly" },
];

/* ── Shared styles ───────────────────────────── */
const AR: React.CSSProperties = { fontFamily: "'Noto Naskh Arabic', 'Amiri', serif", direction: "rtl" };
const EN: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const PINK = "hsl(337 65% 75%)";
const GLOW_TXT: React.CSSProperties = { textShadow: "0 0 20px rgba(255,182,193,0.7)" };

/* ── Background particles ────────────────────── */
const BG_PARTICLES = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top:  `${Math.random() * 100}%`,
  size: 1 + Math.random() * 2.5,
  dur:  `${5 + Math.random() * 7}s`,
  delay: `${-Math.random() * 10}s`,
  opacity: 0.15 + Math.random() * 0.4,
}));

const BG_STARS = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top:  `${Math.random() * 100}%`,
  size: Math.random() > 0.85 ? 2 : 1,
  dur: `${2 + Math.random() * 4}s`,
  delay: `${-Math.random() * 6}s`,
  opacity: 0.08 + Math.random() * 0.35,
}));

function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* deep glow */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, #2a0820 0%, #0a0005 65%)" }} />
      {/* static stars */}
      {BG_STARS.map(s => (
        <div key={s.id} className="absolute rounded-full bg-white animate-twinkle"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, opacity: s.opacity,
            animationDuration: s.dur, animationDelay: s.delay }} />
      ))}
      {/* drifting particles */}
      {BG_PARTICLES.map(p => (
        <div key={p.id} className="absolute rounded-full animate-particle"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size,
            background: PINK, opacity: p.opacity,
            animationDuration: p.dur, animationDelay: p.delay }} />
      ))}
    </div>
  );
}

/* ── Moon component ──────────────────────────── */
function Moon({ size = 80 }: { size?: number }) {
  return (
    <div className="animate-pulse-glow rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        width: size, height: size,
        background: "radial-gradient(circle at 35% 35%, rgba(255,182,193,0.9), rgba(255,120,160,0.4))",
        border: "1px solid rgba(255,182,193,0.6)",
        boxShadow: "0 0 30px 6px rgba(255,182,193,0.4)",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: size * 0.38,
        color: "#fff",
        fontStyle: "italic",
      }}>
      O
    </div>
  );
}

/* ── Section title ───────────────────────────── */
function SectionTitle({ text }: { text: string }) {
  return (
    <h2 className="animate-text-glow mb-6 text-center"
      style={{ ...AR, fontSize: "clamp(1.6rem, 5vw, 2.6rem)", color: PINK, fontWeight: 700 }}>
      {text}
    </h2>
  );
}

/* ════════════════════════════════════════════
   ROOM 0 — Intro
═════════════════════════════════════════════ */
function IntroRoom({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 h-full" style={{ paddingBottom: "env(safe-area-inset-bottom, 20px)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} className="mb-4">
        <div className="animate-text-glow" style={{ ...EN, fontSize: "clamp(3.5rem, 16vw, 8rem)", color: "#fff", lineHeight: 1.1, fontWeight: 300 }}>
          Ola
        </div>
        <div className="animate-text-glow" style={{ ...AR, fontSize: "clamp(3.5rem, 16vw, 8rem)", color: "#fff", lineHeight: 1.2 }}>
          علا
        </div>
      </motion.div>

      <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1.2 }}
        style={{ ...AR, fontSize: "clamp(1.1rem, 4.5vw, 1.6rem)", color: "rgba(255,182,193,0.9)",
          maxWidth: 480, lineHeight: 1.9, ...GLOW_TXT }}>
        في ناس كتير دخلوا حياتي.. بس انتي حياتي كلها
      </motion.p>

      <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 1 }}
        onClick={onEnter}
        data-testid="button-enter-museum"
        style={{
          marginTop: "clamp(2rem, 6vw, 3.5rem)",
          padding: "14px 36px",
          borderRadius: 999,
          background: "rgba(255,182,193,0.12)",
          border: "1.5px solid rgba(255,182,193,0.55)",
          color: PINK,
          fontSize: "clamp(1rem, 3.5vw, 1.25rem)",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 24px rgba(255,182,193,0.25)",
          minHeight: 54,
          minWidth: 180,
          ...AR,
        }}>
        ادخل المتحف ←
      </motion.button>
    </div>
  );
}

/* ════════════════════════════════════════════
   ROOM 1 — أول مرة
═════════════════════════════════════════════ */
function Room1() {
  return (
    <div className="flex flex-col items-center justify-center px-5 h-full overflow-y-auto py-6"
      style={{ gap: "clamp(1.2rem, 4vw, 2.5rem)" }}>
      <SectionTitle text="أول مرة" />

      {/* image frame */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
        className="animate-float rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0"
        style={{
          width: "min(300px, 85vw)", height: "min(220px, 55vw)",
          background: "linear-gradient(135deg, #1a0510, #0d0008)",
          border: "1.5px solid rgba(255,182,193,0.35)",
          boxShadow: "0 0 35px rgba(255,182,193,0.18)",
        }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(255,182,193,0.07), transparent)" }} />
        <div style={{ ...AR, color: "rgba(255,182,193,0.35)", fontSize: "1.4rem" }}>صورة الذكرى</div>
      </motion.div>

      {/* story */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}
        className="max-w-lg w-full" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div dir="rtl" style={{ ...AR, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {[
            "أول مرة شفتها كانت لما دخلت على سيرفر لعبة كنا نلعب فيها Imposter",
            "بعدها زعلت منها وشتمتها وأنا متضايق",
            "وقتها ما كنت أعرف إنها رح تصير حياتي كلها",
          ].map((line, i) => (
            <p key={i} style={{ fontSize: "clamp(1rem, 3.8vw, 1.25rem)", color: "rgba(255,182,193,0.82)", lineHeight: 1.85,
              textAlign: "right", padding: "10px 16px",
              background: "rgba(255,182,193,0.05)", borderRadius: 12,
              borderRight: "2px solid rgba(255,182,193,0.25)" }}>
              {line}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════
   ROOM 2 — الذكريات
═════════════════════════════════════════════ */
function Room2() {
  const [selected, setSelected] = useState<number | null>(null);
  const mem = selected !== null ? MEMORIES[selected] : null;

  return (
    <div className="flex flex-col items-center px-5 h-full overflow-y-auto py-4"
      style={{ gap: "clamp(0.8rem, 2.5vw, 1.4rem)" }}>
      <SectionTitle text="الذكريات" />
      <Moon size={60} />

      {/* 2×3 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
        gap: "clamp(10px, 2.5vw, 16px)", width: "100%", maxWidth: 460 }}>
        {MEMORIES.map((m, i) => (
          <motion.button key={i}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            onClick={() => setSelected(i)}
            data-testid={`button-memory-${i}`}
            whileTap={{ scale: 0.95 }}
            style={{
              minHeight: 88, borderRadius: 16,
              background: "linear-gradient(135deg, #2a1025, #1a0815)",
              border: "1px solid rgba(255,182,193,0.38)",
              boxShadow: "0 0 14px rgba(255,182,193,0.1)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 5, cursor: "pointer", padding: "10px 8px",
            }}>
            <span style={{ fontSize: "1.7rem" }}>{m.emoji}</span>
            <span style={{ ...AR, fontSize: "clamp(0.78rem, 3vw, 0.92rem)",
              color: PINK, textAlign: "center", lineHeight: 1.4 }}>
              {m.title}
            </span>
            <span style={{ ...AR, fontSize: "0.7rem",
              color: "rgba(255,182,193,0.38)" }}>
              {m.date}
            </span>
          </motion.button>
        ))}
      </div>

      {/* ── Memory modal ── */}
      <AnimatePresence>
        {selected !== null && mem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ position: "fixed", inset: 0, zIndex: 1000,
              display: "flex", alignItems: "flex-end", justifyContent: "center",
              background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)" }}>

            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              dir="rtl"
              style={{
                width: "min(500px, 100vw)", maxHeight: "82vh", overflowY: "auto",
                background: "linear-gradient(168deg, #3d1428, #1e0d14)",
                border: "2px solid rgba(255,182,193,0.5)",
                borderRadius: "22px 22px 0 0",
                padding: `28px 22px calc(24px + env(safe-area-inset-bottom, 14px))`,
                boxShadow: "0 -10px 55px rgba(255,70,120,0.35)",
                position: "relative",
              }}>

              {/* handle */}
              <div onClick={() => setSelected(null)}
                style={{ position: "absolute", top: 10, left: "50%",
                  transform: "translateX(-50%)",
                  width: 44, height: 5, borderRadius: 3,
                  background: "rgba(255,182,193,0.35)", cursor: "pointer" }} />

              {/* photo or emoji */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.6 }}
                style={{ width: "100%", height: "min(200px, 48vw)", borderRadius: 14,
                  marginBottom: 18, overflow: "hidden", position: "relative",
                  background: "linear-gradient(135deg, #2d1020, #1a0910)",
                  border: "1.5px solid rgba(255,182,193,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* corner brackets */}
                {([
                  "top:10px;left:10px;border-width:2px 0 0 2px",
                  "top:10px;right:10px;border-width:2px 2px 0 0",
                  "bottom:10px;left:10px;border-width:0 0 2px 2px",
                  "bottom:10px;right:10px;border-width:0 2px 2px 0",
                ] as string[]).map((s, ci) => {
                  const props: Record<string, string | number> = { position: "absolute", width: 18, height: 18,
                    borderColor: "rgba(255,182,193,0.3)", borderStyle: "solid" };
                  s.split(";").forEach(p => { const [k, v] = p.split(":"); props[k] = v; });
                  return <div key={ci} style={props as any} />;
                })}
                {mem.photo
                  ? <img src={mem.photo} alt={mem.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} />
                  : <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      style={{ fontSize: "4rem" }}>
                      {mem.emoji}
                    </motion.span>
                }
              </motion.div>

              {/* title & date */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}>
                <h3 style={{ ...AR, color: PINK, fontSize: "clamp(1.25rem, 5vw, 1.6rem)",
                  margin: "0 0 4px", fontWeight: 700 }}>
                  {mem.title}
                </h3>
                <span style={{ ...AR, color: "rgba(255,182,193,0.4)", fontSize: "0.82rem" }}>
                  {mem.date}
                </span>
              </motion.div>

              {/* text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.8 }}
                style={{ ...AR, fontSize: "clamp(1rem, 4vw, 1.3rem)",
                  color: "rgba(255,182,193,0.88)", lineHeight: 2.1,
                  margin: "16px 0 0", textAlign: "right" }}>
                {mem.text}
              </motion.p>

              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.85, type: "spring" }}
                style={{ textAlign: "center", marginTop: 20, fontSize: "1.8rem",
                  color: "rgba(255,182,193,0.5)" }}>
                ❤
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════
   ROOM 3 — الرسائل  (Draggable Balls)
═════════════════════════════════════════════ */

const BALL_GRADIENTS = [
  "radial-gradient(circle at 30% 28%, #ffaec4 0%, #c03060 100%)",
  "radial-gradient(circle at 30% 28%, #ffc8d8 0%, #8e1a48 100%)",
  "radial-gradient(circle at 30% 28%, #ff8fb0 0%, #b02855 100%)",
  "radial-gradient(circle at 30% 28%, #ffd5e3 0%, #9a2248 100%)",
  "radial-gradient(circle at 30% 28%, #ff7898 0%, #c43568 100%)",
  "radial-gradient(circle at 30% 28%, #ffbcce 0%, #7d1840 100%)",
  "radial-gradient(circle at 30% 28%, #ff9cbf 0%, #a82050 100%)",
  "radial-gradient(circle at 30% 28%, #ffe0ea 0%, #b02e5c 100%)",
  "radial-gradient(circle at 30% 28%, #ff85a8 0%, #c84070 100%)",
  "radial-gradient(circle at 30% 28%, #ffcad8 0%, #881a42 100%)",
];

/* deterministic scatter so balls don't jump on re-render */
const BALL_INIT: Array<{ left: string; top: string; size: number }> = [
  { left: "8%",  top: "16%", size: 82 },
  { left: "54%", top: "9%",  size: 70 },
  { left: "74%", top: "22%", size: 76 },
  { left: "4%",  top: "44%", size: 88 },
  { left: "38%", top: "34%", size: 74 },
  { left: "66%", top: "45%", size: 80 },
  { left: "16%", top: "60%", size: 72 },
  { left: "58%", top: "57%", size: 86 },
  { left: "30%", top: "73%", size: 70 },
  { left: "74%", top: "67%", size: 76 },
];

function Room3() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>

      {/* header */}
      <div style={{ position: "absolute", top: 12, left: 0, right: 0, textAlign: "center",
        pointerEvents: "none", zIndex: 2 }}>
        <h2 style={{ ...AR, color: PINK, fontSize: "clamp(1.4rem, 5vw, 2rem)",
          margin: 0, textShadow: "0 0 20px rgba(255,182,193,0.7)", fontWeight: 700 }}>
          الرسائل
        </h2>
        <p style={{ ...AR, color: "rgba(255,182,193,0.38)", fontSize: "clamp(0.72rem, 2.5vw, 0.85rem)",
          margin: "3px 0 0" }}>
          حرّكي الكور ← اضغطي لتفتحي الرسالة
        </p>
      </div>

      {/* draggable balls */}
      {MESSAGES.map((msg, i) => (
        <motion.div key={i}
          drag
          dragConstraints={containerRef}
          dragElastic={0.18}
          dragMomentum={false}
          onTap={() => setSelected(i)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 16 }}
          whileDrag={{ scale: 1.18, zIndex: 50,
            boxShadow: "0 0 45px rgba(255,80,130,0.9), 0 8px 30px rgba(0,0,0,0.5)" }}
          whileTap={{ scale: 0.9 }}
          data-testid={`button-message-${i}`}
          style={{
            position: "absolute",
            left: BALL_INIT[i].left,
            top: BALL_INIT[i].top,
            width: BALL_INIT[i].size,
            height: BALL_INIT[i].size,
            borderRadius: "50%",
            background: BALL_GRADIENTS[i],
            boxShadow: "0 5px 22px rgba(180,40,80,0.55), inset 0 -7px 14px rgba(0,0,0,0.28), inset 0 5px 10px rgba(255,255,255,0.28)",
            cursor: "grab",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            userSelect: "none", touchAction: "none", zIndex: 10,
            gap: 2,
          }}>
          {/* sphere shine */}
          <div style={{ position: "absolute", top: "15%", left: "18%",
            width: "40%", height: "28%", borderRadius: "50%",
            background: "rgba(255,255,255,0.4)", filter: "blur(5px)",
            pointerEvents: "none" }} />
          <span style={{ fontSize: "1.25rem", pointerEvents: "none" }}>✉</span>
          <span style={{ ...AR, fontSize: "0.6rem", color: "rgba(255,255,255,0.65)",
            lineHeight: 1, pointerEvents: "none" }}>
            {msg.date.split(" ")[0]}
          </span>
        </motion.div>
      ))}

      {/* ── Message bottom-sheet modal ── */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ position: "fixed", inset: 0, zIndex: 1000,
              display: "flex", alignItems: "flex-end", justifyContent: "center",
              background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)" }}>

            {/* rising hearts */}
            {[...Array(8)].map((_, j) => (
              <motion.div key={j}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -700, opacity: [0, 0.65, 0] }}
                transition={{ duration: 3.8, delay: j * 0.35,
                  repeat: Infinity, repeatDelay: 0.5 }}
                style={{ position: "absolute", left: `${7 + j * 12}%`, bottom: "5%",
                  fontSize: "1.4rem", pointerEvents: "none", color: PINK }}>
                ❤
              </motion.div>
            ))}

            {/* card slides up */}
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220, delay: 0.06 }}
              onClick={e => e.stopPropagation()}
              dir="rtl"
              style={{
                width: "min(500px, 100vw)",
                maxHeight: "84vh", overflowY: "auto",
                background: "linear-gradient(168deg, #3d1428, #1e0d14)",
                border: "2px solid rgba(255,182,193,0.55)",
                borderRadius: "22px 22px 0 0",
                padding: `28px 22px calc(24px + env(safe-area-inset-bottom, 14px))`,
                boxShadow: "0 -10px 60px rgba(255,70,120,0.4), 0 -4px 24px rgba(255,182,193,0.18)",
                backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(255,182,193,0.04) 31px, rgba(255,182,193,0.04) 32px)",
                position: "relative",
              }}>

              {/* drag handle */}
              <div onClick={() => setSelected(null)}
                style={{ position: "absolute", top: 10, left: "50%",
                  transform: "translateX(-50%)",
                  width: 44, height: 5, borderRadius: 3,
                  background: "rgba(255,182,193,0.35)", cursor: "pointer" }} />

              {/* photo frame */}
              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.65 }}
                style={{ width: "100%", height: "min(190px, 44vw)",
                  borderRadius: 14, marginBottom: 18, position: "relative",
                  background: "linear-gradient(135deg, #2d1020, #1a0910)",
                  border: "1.5px solid rgba(255,182,193,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden" }}>
                {/* corner brackets */}
                {([
                  { top: 10, left: 10, bt: "2px 0 0 2px" },
                  { top: 10, right: 10, bt: "2px 2px 0 0" },
                  { bottom: 10, left: 10, bt: "0 0 2px 2px" },
                  { bottom: 10, right: 10, bt: "0 2px 2px 0" },
                ] as any[]).map((c, ci) => (
                  <div key={ci} style={{ position: "absolute", width: 18, height: 18,
                    borderColor: "rgba(255,182,193,0.35)", borderStyle: "solid",
                    borderWidth: c.bt, ...c }} />
                ))}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  style={{ fontSize: "3.5rem" }}>
                  🌙
                </motion.div>
              </motion.div>

              {/* date */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
                style={{ ...AR, color: "rgba(255,182,193,0.42)",
                  fontSize: "0.83rem", marginBottom: 14 }}>
                {MESSAGES[selected].date}
              </motion.div>

              {/* message */}
              <motion.p
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.9 }}
                style={{ ...AR, fontSize: "clamp(1.1rem, 4.5vw, 1.42rem)",
                  color: "rgba(255,182,193,0.92)", lineHeight: 2.2,
                  textAlign: "center", margin: 0 }}>
                "{MESSAGES[selected].text}"
              </motion.p>

              {/* heart */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
                style={{ textAlign: "center", marginTop: 22,
                  fontSize: "2rem", color: "rgba(255,182,193,0.55)" }}>
                ❤
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════
   ROOM 4 — عداد الحب
═════════════════════════════════════════════ */
function CounterCard({ value, label, testId, delay }:
  { value: number; label: string; testId: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.9 }}
      animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, type: "spring", stiffness: 220, damping: 18 },
        y: { delay, duration: 4.5, repeat: Infinity, ease: "easeInOut" },
      }}
      style={{
        flex: "1 1 clamp(88px, 22vw, 120px)", minWidth: 88, maxWidth: 130,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "clamp(10px, 2.5vw, 16px) 6px", borderRadius: 16,
        background: "linear-gradient(160deg, rgba(255,182,193,0.09), rgba(20,4,14,0.85))",
        border: "1px solid rgba(255,182,193,0.28)",
        boxShadow: "0 0 22px rgba(255,182,193,0.15), inset 0 0 18px rgba(255,182,193,0.05)",
      }}>
      <span style={{ display: "block", overflow: "hidden", height: "1.15em" }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={value}
            data-testid={testId}
            initial={{ y: "55%", opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "-55%", opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ ...EN, display: "block", fontSize: "clamp(1.9rem, 7.5vw, 3.1rem)",
              color: PINK, fontWeight: 300, lineHeight: 1.15,
              fontVariantNumeric: "tabular-nums" as any,
              textShadow: "0 0 22px rgba(255,182,193,0.65)" }}>
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <span style={{ ...AR, color: "rgba(255,182,193,0.6)",
        fontSize: "clamp(0.72rem, 2.6vw, 0.95rem)", marginTop: 6 }}>
        {label}
      </span>
    </motion.div>
  );
}

function Room4() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - START_DATE;
      setTime({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div dir="rtl"
      className="flex flex-col items-center justify-center h-full text-center px-4 overflow-y-auto py-6">
      <SectionTitle text="عداد الحب" />

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ ...AR, color: "rgba(255,182,193,0.55)", fontSize: "clamp(0.9rem, 3.2vw, 1.15rem)",
          marginBottom: "clamp(0.8rem, 3vw, 1.4rem)" }}>
        عرفتك منذ
      </motion.p>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: "clamp(8px, 2.5vw, 14px)", width: "100%", maxWidth: 520 }}>
        <CounterCard value={time.days}    label="يوم"    testId="text-days-counter"    delay={0.45} />
        <CounterCard value={time.hours}   label="ساعة"   testId="text-hours-counter"   delay={0.55} />
        <CounterCard value={time.minutes} label="دقيقة" testId="text-minutes-counter" delay={0.65} />
        <CounterCard value={time.seconds} label="ثانية" testId="text-seconds-counter" delay={0.75} />
      </div>

      <motion.div
        animate={{ scale: [1, 1.22, 1, 1.14, 1], opacity: [0.75, 1, 0.8, 0.95, 0.75] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)", color: "rgba(255,182,193,0.8)",
          marginTop: "clamp(0.8rem, 3vw, 1.4rem)" }}>
        ❤
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        style={{ ...AR, color: "rgba(255,182,193,0.38)", fontSize: "clamp(0.78rem, 2.8vw, 0.95rem)",
          marginTop: "clamp(1rem, 3.5vw, 1.6rem)", borderTop: "1px solid rgba(255,182,193,0.15)",
          paddingTop: "0.9rem", maxWidth: 340 }}>
        بدأت في 27 فبراير 2026 — 9:33 مساءً
      </motion.p>
    </div>
  );
}

/* ════════════════════════════════════════════
   ROOM 5 — النجوم
═════════════════════════════════════════════ */

const STAR_POSITIONS = Array.from({ length: LOVE_REASONS.length }, (_, i) => ({
  left:  `${5 + Math.random() * 85}%`,
  top:   `${5 + Math.random() * 62}%`,
  delay: `${-Math.random() * 5}s`,
  dur:   `${2.5 + Math.random() * 3}s`,
  size:  8 + Math.floor(Math.random() * 10),
}));

function Room5() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="relative h-full overflow-hidden">
      {/* hint */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ delay: 0.8 }}
        style={{ ...AR, position: "absolute", top: 16, left: 0, right: 0,
          textAlign: "center", color: PINK, fontSize: "0.9rem", pointerEvents: "none", zIndex: 1 }}>
        النجوم — اضغطي على نجمة
      </motion.p>

      {/* clickable stars */}
      {LOVE_REASONS.map((reason, i) => {
        const s = STAR_POSITIONS[i];
        return (
          <motion.button key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
            onClick={() => setSelected(selected === i ? null : i)}
            data-testid={`button-star-${i}`}
            className="animate-twinkle"
            style={{
              position: "absolute",
              left: s.left, top: s.top,
              width: s.size + 20, height: s.size + 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "none", border: "none", cursor: "pointer",
              animationDuration: s.dur, animationDelay: s.delay,
            }}>
            <div style={{
              width: s.size, height: s.size, borderRadius: "50%",
              background: selected === i ? "#fff" : "rgba(255,255,255,0.7)",
              boxShadow: selected === i
                ? `0 0 ${s.size * 3}px ${s.size}px rgba(255,182,193,0.8)`
                : `0 0 ${s.size}px rgba(255,255,255,0.4)`,
              transition: "all 0.3s",
            }} />
          </motion.button>
        );
      })}

      {/* reason bubble */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setSelected(null)}
            style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex",
              alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", padding: 24 }}>
            <motion.div onClick={e => e.stopPropagation()}
              style={{ width: "min(380px, 88vw)", background: "rgba(10,0,5,0.95)",
                border: "1.5px solid rgba(255,182,193,0.5)", borderRadius: 20,
                padding: "32px 24px", boxShadow: "0 0 50px rgba(255,182,193,0.3)",
                textAlign: "center" }}>
              <div className="animate-text-glow" style={{ fontSize: "2.5rem", marginBottom: 16, color: PINK }}>✦</div>
              <p style={{ ...AR, fontSize: "clamp(1.1rem, 4.5vw, 1.4rem)",
                color: "rgba(255,182,193,0.92)", lineHeight: 2, margin: 0 }}>
                {LOVE_REASONS[selected]}
              </p>
              <button onClick={() => setSelected(null)}
                style={{ marginTop: 22, ...AR, background: "none", border: "none",
                  color: "rgba(255,182,193,0.4)", fontSize: "0.9rem", cursor: "pointer",
                  minHeight: 44, padding: "0 16px" }}>
                أغلق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════
   ROOM 6 — الغرفة الأخيرة
═════════════════════════════════════════════ */
function Room6() {
  const [opened, setOpened] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => setShowMsg(true), 700);
  };

  const hearts = Array.from({ length: 10 }, (_, i) => ({
    id: i, left: `${8 + Math.random() * 82}%`,
    dur: `${4 + Math.random() * 4}s`, delay: `${-Math.random() * 6}s`,
  }));

  if (showMsg) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
        className="relative h-full overflow-y-auto"
        style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 20px) + 80px)` }}>
        {/* glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,182,193,0.12), transparent)" }} />
        {/* rising hearts */}
        {hearts.map(h => (
          <div key={h.id} className="absolute pointer-events-none"
            style={{ left: h.left, bottom: 0, fontSize: "1.3rem",
              animation: `float-up-heart ${h.dur} ease-in-out infinite`,
              animationDelay: h.delay, color: "rgba(255,182,193,0.4)" }}>
            ❤
          </div>
        ))}

        <div dir="rtl" style={{ position: "relative", zIndex: 1, maxWidth: 560,
          margin: "0 auto", padding: "clamp(2rem, 6vw, 4rem) 20px 0" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.4 }}
            className="animate-text-glow"
            style={{ ...AR, fontSize: "clamp(1.8rem, 8vw, 3.5rem)", color: PINK,
              textAlign: "center", marginBottom: "clamp(1.5rem, 5vw, 3rem)", fontWeight: 700 }}>
            ليكي انتي... علا 💗
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 2 }}
            style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
            {[
              "من أول يوم شفتك فيه، ما كنت أعرف إن هاد اللقاء رح يغير حياتي كلها. كنت بس بنت دخلت سيرفر، وأنا شتمتك بدون ما أعرفك... ولو رجعت للوراء، كنت رح أعتذر قبل ما تحكيني.",
              "في كل مرة حكيتينا، كنت أحس إن في شي مختلف. مش بس كلام، في روح. في دفا. في شي ما لقيته عند حدا تاني.",
              "خفت أخسرك مرات كتير. وكل مرة، كنت أتذكر إنك أهم شي عندي.",
              "مش عارف شو بكرا رح يجيب، بس عارف شي واحد: انتِ مش بس بنت بحبها. انتِ السبب اللي بخليني أصحى الصبح وأبتسم. انتِ حياتي.",
            ].map((para, i) => (
              <p key={i} style={{ ...AR, fontSize: "clamp(1rem, 4vw, 1.25rem)",
                color: "rgba(255,182,193,0.88)", lineHeight: 2.1,
                textAlign: "right", margin: 0 }}>
                {para}
              </p>
            ))}
            <p className="animate-text-glow"
              style={{ ...AR, fontSize: "clamp(1.5rem, 6vw, 2.2rem)", color: PINK,
                textAlign: "center", marginTop: "1.5rem", fontWeight: 700 }}>
              بحبك يا علا. 💗
            </p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <SectionTitle text="ممنوع الدخول إلا ليكي" />

      {/* door */}
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}>
        <motion.button
          animate={opened ? { rotateY: 85, opacity: 0 } : {}}
          transition={{ duration: 0.7 }}
          onClick={!opened ? handleOpen : undefined}
          data-testid="button-open-door"
          style={{
            width: "min(200px, 52vw)", height: "min(300px, 75vw)",
            background: "linear-gradient(180deg, #2e1020, #150510)",
            border: "2px solid rgba(255,182,193,0.65)",
            borderRadius: "50% 50% 4px 4px / 30% 30% 4px 4px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 12, cursor: "pointer", position: "relative", overflow: "hidden",
            boxShadow: "0 0 50px rgba(255,182,193,0.35), inset 0 0 30px rgba(255,182,193,0.08)",
          }}
          className="animate-pulse-glow">
          <div style={{ position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 40%, rgba(255,182,193,0.12), transparent)" }} />
          <span style={{ fontSize: "2.5rem" }}>🔒</span>
          <div dir="rtl" style={{ ...AR, fontSize: "clamp(0.75rem, 3vw, 0.95rem)",
            color: "rgba(255,182,193,0.85)", textAlign: "center", padding: "0 12px", lineHeight: 1.7 }}>
            ممنوع الدخول<br />إلا ليكي
          </div>
          {/* door knob */}
          <div style={{ position: "absolute", right: 18, top: "55%",
            width: 12, height: 12, borderRadius: "50%",
            background: PINK, boxShadow: "0 0 10px rgba(255,182,193,0.7)" }} />
        </motion.button>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        dir="rtl" style={{ ...AR, color: "rgba(255,182,193,0.45)", fontSize: "1rem",
          marginTop: 24, textAlign: "center" }}>
        هل أنتِ هي؟
      </motion.p>
    </div>
  );
}

/* ════════════════════════════════════════════
   ROOM 7 — هدية من loly
═════════════════════════════════════════════ */
function Room7() {
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <div dir="rtl" className="flex flex-col items-center h-full overflow-y-auto px-4"
      style={{ gap: "clamp(0.8rem, 3vw, 1.4rem)",
        paddingTop: "clamp(1.2rem, 4vw, 2rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 20px) + 24px)" }}>
      <SectionTitle text={GIFT.title} />

      <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{ ...AR, ...GLOW_TXT, fontSize: "clamp(1rem, 3.6vw, 1.3rem)",
          color: "rgba(255,182,193,0.9)", lineHeight: 2, textAlign: "center",
          maxWidth: "min(520px, 92vw)", padding: "clamp(10px, 3vw, 16px) clamp(12px, 4vw, 20px)",
          background: "rgba(255,182,193,0.06)", borderRadius: 16,
          border: "1px solid rgba(255,182,193,0.18)", margin: 0, flexShrink: 0 }}>
        {GIFT.note}
      </motion.p>

      <motion.figure initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center",
          gap: "clamp(10px, 2.5vw, 16px)", width: "100%", maxWidth: "min(460px, 92vw)",
          margin: 0, flexShrink: 0 }}>
        <div className="animate-float"
          style={{ position: "relative", width: "100%", height: "clamp(180px, 38vh, 320px)",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            borderRadius: 18, background: "linear-gradient(135deg, #1f0a18, #0d0008)",
            border: "1.5px solid rgba(255,182,193,0.35)",
            boxShadow: "0 0 30px rgba(255,182,193,0.18)" }}>
          {photoOk ? (
            <img src={GIFT.photo} alt={GIFT.photoTitle}
              onError={() => setPhotoOk(false)}
              style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 16 }} />
          ) : (
            <div style={{ ...AR, display: "flex", flexDirection: "column", alignItems: "center",
              gap: 8, color: "rgba(255,182,193,0.45)", fontSize: "clamp(0.8rem, 3vw, 1rem)",
              textAlign: "center", padding: "0 16px" }}>
              <span style={{ fontSize: "2.4rem" }}>🖼️</span>
              <span>{GIFT.placeholder}</span>
            </div>
          )}
        </div>

        <figcaption style={{ ...AR, fontSize: "clamp(0.92rem, 3.2vw, 1.15rem)",
          color: "rgba(255,182,193,0.85)", lineHeight: 1.95, textAlign: "center",
          padding: "clamp(10px, 3vw, 16px) clamp(12px, 4vw, 18px)",
          background: "rgba(255,182,193,0.05)", borderRadius: 16,
          border: "1px solid rgba(255,182,193,0.16)" }}>
          {GIFT.caption}
        </figcaption>
      </motion.figure>
    </div>
  );
}

/* ════════════════════════════════════════════
   Main export
═════════════════════════════════════════════ */
export default function MuseumFallback() {
  const [currentRoom, setCurrentRoom] = useState(0);

  const goNext = useCallback(() => setCurrentRoom(r => Math.min(r + 1, ROOMS.length - 1)), []);
  const goPrev = useCallback(() => setCurrentRoom(r => Math.max(r - 1, 0)), []);

  const roomContent = [
    <IntroRoom key={0} onEnter={goNext} />,
    <Room1 key={1} />,
    <Room2 key={2} />,
    <Room3 key={3} />,
    <Room4 key={4} />,
    <Room5 key={5} />,
    <Room6 key={6} />,
    <Room7 key={7} />,
  ];

  const showNextBtn = currentRoom > 0 && currentRoom < ROOMS.length - 1;

  return (
    <div style={{
      position: "fixed", inset: 0, overflow: "hidden",
      paddingTop: "env(safe-area-inset-top, 0px)",
      display: "flex", alignItems: "stretch", justifyContent: "center",
    }}>
      <Background />

      {/* ── responsive content column (phone → tablet → desktop) ── */}
      <div style={{
        position: "relative",
        width: "100%", maxWidth: 720,
        height: "100%",
        zIndex: 1, overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        <AnimatePresence mode="wait">
          <motion.div key={currentRoom}
            initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute", inset: 0,
              paddingBottom: showNextBtn ? 80 : "env(safe-area-inset-bottom, 0px)",
              overflow: "hidden",
            }}>
            {roomContent[currentRoom]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom gradient fade (visual only, no pointer events) ── */}
      <AnimatePresence>
        {showNextBtn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, height: 90,
              background: "linear-gradient(to top, rgba(10,0,5,1) 40%, transparent)",
              pointerEvents: "none", zIndex: 997,
            }} />
        )}
      </AnimatePresence>

      {/* ── Next-room button — standalone fixed, no pointer-events issue ── */}
      <AnimatePresence>
        {showNextBtn && (
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={goNext}
            data-testid="button-next-room"
            style={{
              position: "fixed",
              bottom: "calc(env(safe-area-inset-bottom, 14px) + 10px)",
              left: "50%", transform: "translateX(-50%)",
              zIndex: 999,
              ...AR,
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 26px", borderRadius: 999,
              background: "rgba(10,0,5,0.75)",
              border: "1px solid rgba(255,182,193,0.45)",
              color: PINK, fontSize: "0.95rem", cursor: "pointer",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 0 18px rgba(255,182,193,0.22)",
              minHeight: 44, minWidth: 130,
              whiteSpace: "nowrap",
            }}>
            <span>الغرفة التالية</span>
            <span style={{ fontFamily: "system-ui" }}>↓</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Side navigation dots ── */}
      <div style={{ position: "fixed", right: "env(safe-area-inset-right, 0px)",
        top: "50%", transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 10,
        zIndex: 400, paddingRight: 14 }}>
        {ROOMS.map((r, i) => (
          <button key={r.id}
            onClick={() => setCurrentRoom(i)}
            data-testid={`button-nav-room-${i}`}
            title={r.label}
            style={{
              width: 10, height: 10, borderRadius: "50%",
              border: "1.5px solid rgba(255,182,193,0.6)",
              background: currentRoom === i ? PINK : "transparent",
              boxShadow: currentRoom === i ? "0 0 10px rgba(255,182,193,0.8)" : "none",
              transform: currentRoom === i ? "scale(1.5)" : "scale(1)",
              transition: "all 0.3s", cursor: "pointer",
              padding: 0,
              /* increase touch area */
              margin: 2,
            }} />
        ))}
      </div>

      {/* ── Room label (top-left) ── */}
      {currentRoom > 0 && (
        <motion.div key={currentRoom}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }}
          style={{ position: "fixed", top: "calc(env(safe-area-inset-top, 0px) + 16px)",
            left: 16, zIndex: 400, pointerEvents: "none",
            ...AR, color: PINK, fontSize: "0.85rem" }}>
          {ROOMS[currentRoom].label}
        </motion.div>
      )}
    </div>
  );
}
