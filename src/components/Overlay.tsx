import React, { useEffect, useRef, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useMuseum } from '@/context/MuseumContext';
import { MESSAGES, asset } from '@/lib/constants';

function FinalRecordAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // reset on mount
  useEffect(() => {
    setReady(false);
    setPlaying(false);
    setProgress(0);
  }, []);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onCanPlay = () => setReady(true);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) return;
      setProgress(audio.currentTime / audio.duration);
    };

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime);

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTime);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (playing) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch {
      // ignore autoplay/play restrictions
    }
  };

  const seek = (pct: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration || Number.isNaN(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, pct * audio.duration));
    setProgress(pct);
  };

  const onBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seek(pct);
  };

  return (
    <div className="relative rounded-[22px] bg-[#150511] p-3 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/25 blur-sm" />
      <div className="relative flex items-center gap-3">
        <audio
          ref={audioRef}
          src={asset('memories/RECORD.aac')}
          preload="auto"
          playsInline
          onLoadedData={() => setReady(true)}
        />

        <button
          type="button"
          onClick={toggle}
          disabled={!ready}
          className="h-14 w-14 rounded-full bg-[#230817] border border-primary/30 shadow-[0_0_20px_rgba(255,182,193,0.25)] flex items-center justify-center text-primary text-xl disabled:opacity-40"
          aria-label={playing ? 'إيقاف' : 'تشغيل'}
        >
          {playing ? '⏸️' : '▶️'}
        </button>

        <div className="flex-1">
          <div className="text-primary/70 text-xs">{playing ? 'جارِي التشغيل...' : 'جاهز للتشغيل'}</div>

          <div
            className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden cursor-pointer"
            onClick={onBarClick}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <div className="h-full bg-[#FFB6C1]" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>

          <div className="mt-2 text-primary/55 text-[10px] text-right">
            اضغطي على الشريط للتقديم
          </div>
        </div>
      </div>
    </div>
  );
}


const ROOM_LABELS = [
  'المقدمة',
  'أول مرة',
  'الذكريات',
  'الرسائل',
  'عداد الحب',
  'النجوم',
  'الباب الأخير',
  'هدية من loly'
];

const Overlay = () => {
  const { currentRoom, setCurrentRoom, activeModal, setActiveModal, modalContent, setModalContent } = useMuseum();
  const [showFinalRecord, setShowFinalRecord] = useState(false);
  const messagePosition = modalContent?.position ?? Math.max((modalContent?.index || 1) - 1, 0);

  const openMessageAt = (position: number) => {
    const nextMessage = MESSAGES[position];
    if (!nextMessage) return;

    setModalContent({
      ...nextMessage,
      position,
      index: position + 1,
      total: MESSAGES.length,
    });
    setActiveModal('message');
  };

  useEffect(() => {
    if (activeModal !== 'final') {
      setShowFinalRecord(false);
    }
  }, [activeModal]);

  return (
    <>
      <div className="absolute left-0 right-0 top-3 px-2 z-50 pointer-events-auto">
        <div className="mx-auto flex max-w-full min-w-0 overflow-x-auto flex-nowrap items-center justify-start gap-1 rounded-full border border-primary/25 bg-[#090005]/90 px-2 py-1.5 backdrop-blur-xl shadow-[0_0_40px_rgba(255,182,193,0.15)]">
          {ROOM_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setCurrentRoom(i)}
              className={`min-w-[48px] rounded-full px-1.5 py-1 text-[9px] sm:text-[10px] font-serif transition-all duration-300 whitespace-nowrap ${
                currentRoom === i
                  ? 'bg-primary text-[#12030b] shadow-[0_0_10px_rgba(255,182,193,0.85)]'
                  : 'bg-white/10 text-primary hover:bg-primary/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {currentRoom > 0 && activeModal !== 'final' && (
        <div className="absolute bottom-3 left-1/2 z-50 flex flex-wrap justify-center gap-2 -translate-x-1/2 px-2">
          <button
            onClick={() => setCurrentRoom(currentRoom - 1)}
            className="w-full sm:w-auto rounded-full bg-white/10 px-2 py-1.5 text-[10px] sm:text-[11px] font-serif text-primary transition-all duration-300 hover:bg-white/20"
          >
            الغرفة السابقة
          </button>
          {currentRoom < ROOM_LABELS.length - 1 && (
            <button
              onClick={() => setCurrentRoom(currentRoom + 1)}
              className="w-full sm:w-auto rounded-full bg-[#FFB6C1]/90 px-2 py-1.5 text-[10px] sm:text-[11px] font-serif text-[#12030b] shadow-[0_0_16px_rgba(255,182,193,0.7)] transition-all duration-300 hover:bg-[#FFB6C1]"
            >
              الغرفة التالية
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'memory' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-[100] flex items-center justify-center p-8 bg-black/92 backdrop-blur-xl"
            onClick={() => setActiveModal(null)}
          >
            <div 
              dir="rtl"
              className="relative w-full max-w-[92vw] bg-[#12030b]/95 border border-primary/25 p-3 rounded-[24px] shadow-[0_0_20px_rgba(255,182,193,0.12)] flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-2 right-2 text-primary/50 hover:text-primary text-sm"
              >
                ✕
              </button>
              
              <div className="w-full mb-3 rounded-[22px] border border-primary/20 bg-[#0d0410]/90 p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-2xl">
                  {modalContent?.emoji || '❤'}
                </div>
                <div className="text-primary/60 text-[10px] uppercase tracking-[0.15em]">
                  ذكرى {modalContent?.index || ''}
                </div>
                <h3 className="mt-1 text-base font-serif text-white leading-tight">
                  {modalContent?.title || `ذكرى ${modalContent?.index || ''}`}
                </h3>
                <p className="mt-1 text-primary/55 text-[10px] leading-relaxed">
                  {modalContent?.date}
                </p>
                <p className="mt-3 border-t border-primary/10 px-2 pt-3 text-primary/70 text-xs leading-relaxed">
                  {modalContent?.text}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeModal === 'message' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/92 backdrop-blur-xl"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              dir="rtl"
              initial={{ opacity: 0, y: 32, rotateX: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, rotateX: 8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 170, damping: 20 }}
              className="relative w-full max-w-[420px] bg-[#150510]/95 border border-primary/30 p-3 rounded-[24px] shadow-[0_0_32px_rgba(255,182,193,0.24)]"
              onClick={e => e.stopPropagation()}
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 18px, rgba(255,182,193,0.05) 18px, rgba(255,182,193,0.05) 19px)'
              }}
            >
              <div className="absolute top-3 left-3 text-primary/40 font-serif text-[9px]">
                {modalContent?.date}
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-2 right-2 text-primary/50 hover:text-primary text-sm"
              >
                ✕
              </button>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={messagePosition}
                  initial={{ opacity: 0, x: 24, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -24, filter: 'blur(6px)' }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="flex flex-col gap-2 pt-5"
                >
                  <div className="text-center font-serif text-primary/65 text-[10px] tracking-[0.18em]">
                    رسالة {String(modalContent?.index || 1).padStart(2, '0')}
                  </div>
                  <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-[26px] border border-primary/40 bg-[#0d0410] p-1.5 shadow-[0_0_28px_rgba(255,182,193,0.24)] sm:h-48">
                    <div className="pointer-events-none absolute inset-2 rounded-[21px] border border-white/15" />
                    <div className="pointer-events-none absolute inset-0 rounded-[26px] shadow-[inset_0_0_22px_rgba(255,182,193,0.12)]" />
                    {modalContent?.photo ? (
                      <img
                        src={modalContent?.photo}
                        alt={modalContent?.photoTitle || 'صورة الرسالة'}
                        className="h-full w-full rounded-[20px] object-cover"
                        style={{ objectFit: 'contain', objectPosition: 'center' }}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-primary/50">
                        <div className="text-3xl">🖼️</div>
                        <div className="text-[10px]">{modalContent?.photoTitle || 'أضف صورة هنا'}</div>
                      </div>
                    )}
                  </div>

                  <div className="text-center text-sm text-white font-serif leading-tight">
                    {modalContent?.photoTitle || 'صورة الرسالة'}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.28 }}
                    className="mt-2 rounded-[18px] border border-primary/15 bg-black/18 px-3 py-4 text-center font-serif text-xs leading-relaxed text-primary shadow-[inset_0_0_18px_rgba(255,182,193,0.04)]"
                  >
                    {modalContent?.text}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <button
                  type="button"
                  disabled={messagePosition <= 0}
                  onClick={() => openMessageAt(messagePosition - 1)}
                  className="rounded-full bg-white/10 px-3 py-2 text-[10px] font-serif text-primary transition-all duration-200 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  السابقة
                </button>
                <div className="min-w-[70px] text-center text-[9px] font-serif tracking-[0.16em] text-primary/60">
                  {modalContent?.index || 1} / {modalContent?.total || MESSAGES.length}
                </div>
                <button
                  type="button"
                  disabled={messagePosition >= MESSAGES.length - 1}
                  onClick={() => openMessageAt(messagePosition + 1)}
                  className="rounded-full bg-[#FFB6C1]/90 px-3 py-2 text-[10px] font-serif text-[#12030b] transition-all duration-200 hover:bg-[#FFB6C1] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  التالية
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeModal === 'final' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-[200] bg-[#050003] flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-radial-gradient from-primary/10 to-transparent opacity-60 pointer-events-none" />
            
            <div dir="rtl" className="w-full max-w-[92vw] relative z-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-xl sm:text-2xl font-serif text-primary mb-5 text-center drop-shadow-[0_0_15px_rgba(255,182,193,0.6)]"
              >
                آخر مفاجأة لكِ
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 1.2 }}
                className="space-y-3 text-xs sm:text-sm text-primary/85 font-serif leading-relaxed text-center"
              >
                {!showFinalRecord ? (

                  <>
                    <p className="text-xs sm:text-sm">
                      اضغطي على الزر لعرض المفاجأة النهائية. هذا القسم جاهز لتسجيلك النهائي.
                    </p>
                    <button
                      onClick={() => setShowFinalRecord(true)}
                      className="mx-auto rounded-full bg-[#FFB6C1]/95 px-4 py-2 text-xs sm:text-sm font-serif text-[#12030b] shadow-[0_0_18px_rgba(255,182,193,0.65)] transition-all duration-300 hover:bg-[#ffc4d1]"
                    >
                      فتح المفاجأة
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                      <div className="mx-auto w-full max-w-[92vw] sm:max-w-[320px] rounded-[24px] border border-primary/20 bg-[#12030b]/95 p-3 shadow-[0_0_18px_rgba(255,182,193,0.15)]">
                      <div className="flex items-center justify-between text-primary/60 text-[11px] sm:text-xs mb-3">
                        <span>تسجيل صوتي خاص</span>
                        <span className="italic">00:36</span>
                      </div>

                      <FinalRecordAudio />

                      <button
                        onClick={() => setShowFinalRecord(false)}
                        className="mt-3 w-full rounded-full bg-white/10 px-2 py-1.5 text-xs text-primary transition-all duration-300 hover:bg-white/15"
                      >
                        العودة
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Overlay;
