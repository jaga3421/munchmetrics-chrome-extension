import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Heart } from 'lucide-react';

const STORAGE_KEY = 'munchmetricsRateNudgeDismissedAt';
const SHOW_AFTER_MS = 4000;
const SUPPRESS_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const REVIEW_URL =
  'https://chromewebstore.google.com/detail/munchmetrics-swiggy-zomat/amdjphnlghpmdcdacbbccoehejdonlef/reviews';

const isWithinWindow = (ts) =>
  typeof ts === 'number' && Date.now() - ts < SUPPRESS_WINDOW_MS;

const RateNudge = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  // Tracks whether we've finished reading the persisted dismissedAt value.
  // We don't want to start the show-timer until we know it's safe.
  const [hydrated, setHydrated] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(STORAGE_KEY, (res) => {
          if (!mountedRef.current) return;
          if (isWithinWindow(res?.[STORAGE_KEY])) setDismissed(true);
          setHydrated(true);
        });
      } else {
        const raw = window.localStorage?.getItem(STORAGE_KEY);
        const ts = raw ? Number(raw) : NaN;
        if (isWithinWindow(ts)) setDismissed(true);
        setHydrated(true);
      }
    } catch (_) {
      setHydrated(true);
    }
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || dismissed) return undefined;
    const t = setTimeout(() => {
      if (mountedRef.current) setShow(true);
    }, SHOW_AFTER_MS);
    return () => clearTimeout(t);
  }, [hydrated, dismissed]);

  const persistDismissed = () => {
    setShow(false);
    setDismissed(true);
    const ts = Date.now();
    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({ [STORAGE_KEY]: ts });
      } else {
        window.localStorage?.setItem(STORAGE_KEY, String(ts));
      }
    } catch (_) {}
  };

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          key="rate-nudge"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 300,
            zIndex: 2147483647,
          }}
          className="bg-white rounded-3xl shadow-card p-4 pr-4 border border-cream-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zomato-50 inline-flex items-center justify-center shrink-0">
              <Heart
                className="w-5 h-5"
                strokeWidth={2.2}
                color="#E23744"
                fill="#E23744"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-[15px] text-espresso-900 leading-tight">
                Liking Munchmetrics?
              </p>
              <p className="text-[13px] text-espresso-800/70 mt-0.5 leading-snug">
                A quick rating on the Chrome Web Store helps a ton.
              </p>
            </div>
            <button
              type="button"
              onClick={persistDismissed}
              aria-label="Dismiss"
              className="w-7 h-7 rounded-full inline-flex items-center justify-center text-espresso-800/40 hover:text-espresso-900 hover:bg-cream-100 transition shrink-0 -mt-1 -mr-1"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.4} />
            </button>
          </div>

          <motion.a
            href={REVIEW_URL}
            target="_blank"
            rel="noreferrer"
            onClick={persistDismissed}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="mt-3 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full bg-espresso-900 text-cream-50 text-[13px] font-semibold hover:bg-espresso-800 transition"
          >
            <Star className="w-4 h-4" strokeWidth={2.2} fill="currentColor" />
            Rate on Chrome Web Store
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RateNudge;
