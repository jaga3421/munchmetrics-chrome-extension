import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import logoUrl from '../../../assets/img/logo.svg';
import { fmtInt, fmtINR } from '../../../helpers/format';

// Renders the visual that gets snapshotted. Fixed CSS pixel sizing so the
// downloaded image is consistent regardless of where the modal sits on screen.
const ShareCard = ({
  cardRef,
  year,
  total,
  orders,
  zomatoTotal,
  swiggyTotal,
}) => {
  const hasZomato = zomatoTotal > 0;
  const hasSwiggy = swiggyTotal > 0;
  const zPct = total > 0 ? Math.round((zomatoTotal / total) * 100) : 0;
  const sPct = total > 0 ? 100 - zPct : 0;

  return (
    <div
      ref={cardRef}
      className="relative bg-espresso-900 text-cream-50 rounded-3xl px-10 py-10 overflow-hidden"
      style={{ width: 520 }}
    >
      {/* Soft brand-color orbs as background texture */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(252, 128, 25, 0.35), transparent)',
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(226, 55, 68, 0.22), transparent)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2.5">
          <img src={logoUrl} alt="" className="h-8 w-8 rounded-lg" />
          <span className="font-brand font-bold text-[20px] leading-none">
            <span className="text-cream-50">Munch</span>
            <span className="text-swiggy-500">metrics</span>
          </span>
        </div>

        <p className="mt-9 uppercase tracking-[0.18em] text-cream-50/55 text-[11px] font-semibold">
          My food spend in {year}
        </p>

        <div
          className="mt-3 font-display font-extrabold leading-none text-cream-50 tabular-nums"
          style={{ fontSize: 88 }}
        >
          {fmtINR(total)}
        </div>

        <p className="mt-3 text-cream-50/70 text-[15px]">
          {fmtInt(orders)} orders
        </p>

        {total > 0 && (
          <div className="w-full mt-8">
            <div className="h-3 rounded-full bg-cream-50/10 overflow-hidden flex">
              <div
                className="h-full bg-zomato-500"
                style={{ width: `${zPct}%` }}
              />
              <div
                className="h-full bg-swiggy-500"
                style={{ width: `${sPct}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-center gap-6 text-sm">
              {hasZomato && (
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-zomato-500" />
                  <span className="text-cream-50/80">
                    Zomato {fmtINR(zomatoTotal)} · {zPct}%
                  </span>
                </span>
              )}
              {hasSwiggy && (
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-swiggy-500" />
                  <span className="text-cream-50/80">
                    Swiggy {fmtINR(swiggyTotal)} · {sPct}%
                  </span>
                </span>
              )}
            </div>
          </div>
        )}

        <p className="mt-10 text-cream-50/40 text-[11px] tracking-[0.15em] uppercase">
          munchmetrics · year in review
        </p>
      </div>
    </div>
  );
};

const ShareModal = ({
  open,
  onClose,
  year,
  total,
  orders,
  zomatoTotal,
  swiggyTotal,
}) => {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `munchmetrics-${year}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('share download failed', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Two-layer overlay: a frosted blur pane underneath, then a solid
              tinted scrim above it so the page behind genuinely dims AND
              defocuses instead of just going slightly hazy. */}
          <motion.div
            className="absolute inset-0 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="absolute inset-0 bg-espresso-900"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-5 w-full max-w-[560px] max-h-[calc(100vh-3rem)] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          >
            <div className="w-full flex justify-end">
              <motion.button
                type="button"
                onClick={onClose}
                aria-label="Close"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                className="w-10 h-10 rounded-full bg-cream-50 text-espresso-900 shadow-card inline-flex items-center justify-center hover:bg-white transition"
              >
                <X className="w-[18px] h-[18px]" strokeWidth={2.4} />
              </motion.button>
            </div>

            <ShareCard
              cardRef={cardRef}
              year={year}
              total={total}
              orders={orders}
              zomatoTotal={zomatoTotal}
              swiggyTotal={swiggyTotal}
            />

            <motion.button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              whileHover={!downloading ? { y: -2 } : undefined}
              whileTap={!downloading ? { scale: 0.97 } : undefined}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-espresso-900 text-cream-50 text-sm font-semibold shadow-pop hover:bg-espresso-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {downloading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-cream-50/30 border-t-cream-50 animate-spin" />
                  Plating up...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" strokeWidth={2.2} />
                  Download as image
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
