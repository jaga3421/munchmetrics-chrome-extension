import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import logoUrl from '../../../assets/img/logo.svg';
import { fmtInt, fmtINR } from '../../../helpers/format';

const ShareCard = ({ cardRef, year, total, orders, zomatoTotal, swiggyTotal }) => {
  const zPct = total > 0 ? Math.round((zomatoTotal / total) * 100) : 0;
  const sPct = total > 0 ? 100 - zPct : 0;
  return (
    <div
      ref={cardRef}
      className="relative bg-espresso-900 text-cream-50 rounded-3xl px-10 py-12 overflow-hidden"
      style={{ width: 540 }}
    >
      <div
        aria-hidden
        className="absolute -right-8 -bottom-12 text-[200px] opacity-10 select-none leading-none"
      >
        🍔
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2.5">
          <img src={logoUrl} alt="" className="h-8 w-8 rounded-lg" />
          <span className="font-brand font-bold text-[20px] leading-none">
            <span className="text-cream-50">Munch</span>
            <span className="text-swiggy-500">metrics</span>
          </span>
        </div>

        <p className="mt-10 uppercase tracking-[0.18em] text-cream-50/60 text-[11px] font-semibold">
          My food spend in {year}
        </p>

        <div className="mt-3 font-display font-extrabold leading-none text-cream-50 tabular-nums text-[88px]">
          {fmtINR(total)}
        </div>

        <p className="mt-4 text-cream-50/70 text-base">
          {fmtInt(orders)} orders
        </p>

        {total > 0 && (
          <>
            <div className="mt-7 h-3 rounded-full bg-cream-50/10 overflow-hidden flex">
              <div
                className="h-full bg-zomato-500"
                style={{ width: `${zPct}%` }}
              />
              <div
                className="h-full bg-swiggy-500"
                style={{ width: `${sPct}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-zomato-500" />
                <span className="text-cream-50/80">
                  Zomato {zPct}%
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-swiggy-500" />
                <span className="text-cream-50/80">
                  Swiggy {sPct}%
                </span>
              </span>
            </div>
          </>
        )}

        <p className="mt-9 text-cream-50/50 text-[11px] tracking-wider">
          munchmetrics.app · year in review
        </p>
      </div>
    </div>
  );
};

const ShareModal = ({ open, onClose, year, total, orders, zomatoTotal, swiggyTotal }) => {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
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
          className="fixed inset-0 z-[80] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-espresso-900/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-5 max-h-full"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 26,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-cream-50 text-espresso-900 shadow-card inline-flex items-center justify-center hover:bg-white transition"
            >
              <X className="w-4 h-4" strokeWidth={2.4} />
            </button>

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
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
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
