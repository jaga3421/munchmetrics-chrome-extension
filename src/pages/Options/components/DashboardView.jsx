import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, RotateCcw } from 'lucide-react';
import CombinedSummary from './CombinedSummary';
import PlatformPanel from './PlatformPanel';
import GlobalParallax from './GlobalParallax';
import Footer from './Footer';
import ShareModal from './ShareModal';
import { fireConfetti } from './confetti';
import logoUrl from '../../../assets/img/logo.svg';
import {
  generateYearlyReview as generateZomatoReview,
  groupByYears as groupZomatoByYears,
} from '../../../helpers/zomato';
import {
  generateYearlyReview as generateSwiggyReview,
  groupByYears as groupSwiggyByYears,
} from '../../../helpers/swiggy';

const Logo = ({ small = false }) => (
  <div className="inline-flex items-center gap-2.5">
    <img
      src={logoUrl}
      alt="Munchmetrics"
      className={small ? 'h-9 w-9 rounded-lg' : 'h-11 w-11 rounded-xl'}
    />
    <span
      className={`font-brand font-bold tracking-tight leading-none ${
        small ? 'text-[22px]' : 'text-[30px]'
      }`}
    >
      <span className="text-espresso-900">Munch</span>
      <span className="text-swiggy-500">metrics</span>
    </span>
  </div>
);

const ConnectionPill = ({ brand, connected }) => {
  const dot = brand === 'zomato' ? 'bg-zomato-500' : 'bg-swiggy-500';
  const tone = connected
    ? brand === 'zomato'
      ? 'bg-zomato-50 text-zomato-700'
      : 'bg-swiggy-50 text-swiggy-700'
    : 'bg-cream-200 text-espresso-800/50';
  const label = brand === 'zomato' ? 'Zomato' : 'Swiggy';
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${tone}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label} {connected ? 'connected' : 'not connected'}
    </span>
  );
};

const IconButton = ({ Icon, label, onClick, accent = 'espresso' }) => {
  const tone =
    accent === 'danger'
      ? 'bg-zomato-50 text-zomato-700 hover:bg-zomato-100'
      : 'bg-espresso-900 text-cream-50 hover:bg-espresso-800';
  return (
    <div className="relative group">
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.94 }}
        aria-label={label}
        className={`w-10 h-10 rounded-full inline-flex items-center justify-center transition ${tone}`}
      >
        <Icon className="w-[18px] h-[18px]" strokeWidth={2.2} />
      </motion.button>
      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-md bg-espresso-900 text-cream-50 text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg z-50">
        {label}
      </span>
    </div>
  );
};

const DashboardView = ({
  zomatoOrders,
  swiggyOrders,
  zomatoLoggedIn,
  swiggyLoggedIn,
  onReset,
}) => {
  const zomatoByYear = useMemo(
    () => (zomatoOrders?.length ? groupZomatoByYears(zomatoOrders) : {}),
    [zomatoOrders]
  );
  const swiggyByYear = useMemo(
    () => (swiggyOrders?.length ? groupSwiggyByYears(swiggyOrders) : {}),
    [swiggyOrders]
  );

  const currentYear = String(new Date().getFullYear());

  const zomatoThisYearOrders = useMemo(
    () => zomatoByYear?.[currentYear] || [],
    [zomatoByYear, currentYear]
  );
  const swiggyThisYearOrders = useMemo(
    () => swiggyByYear?.[currentYear] || [],
    [swiggyByYear, currentYear]
  );

  const zomatoThisYear = useMemo(
    () =>
      zomatoThisYearOrders.length
        ? generateZomatoReview(zomatoThisYearOrders)
        : null,
    [zomatoThisYearOrders]
  );
  const swiggyThisYear = useMemo(
    () =>
      swiggyThisYearOrders.length
        ? generateSwiggyReview(swiggyThisYearOrders)
        : null,
    [swiggyThisYearOrders]
  );

  const defaultTab = zomatoOrders?.length ? 'zomato' : 'swiggy';
  const [tab, setTab] = useState(defaultTab);
  const [revealed, setRevealed] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const confettiCanvasRef = useRef(null);
  const pendingScrollY = useRef(null);

  // Single source of truth for "is the panel sticky bar pinned at the top?".
  // One sentinel + one IntersectionObserver shared across both PlatformPanels,
  // so the stuck-logo never flickers when switching tabs.
  const stickySentinelRef = useRef(null);
  const [isStuck, setIsStuck] = useState(false);
  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [revealed]);

  // Smooth-scroll past the sentinel so the sticky bar is fully pinned AND the
  // in-bar Munchmetrics logo shows. Scrolling exactly to the sentinel leaves
  // it still intersecting the viewport (IntersectionObserver reports stuck =
  // false), so we add a small overshoot. requestAnimationFrame defers the
  // measurement to after the React re-render that selectedYear triggered.
  const scrollToStickyTop = useCallback(() => {
    requestAnimationFrame(() => {
      const sentinel = stickySentinelRef.current;
      if (!sentinel) return;
      const rect = sentinel.getBoundingClientRect();
      const target = window.scrollY + rect.top + 8;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  }, []);

  // After tab change re-paint, restore the scroll the user was at. Using
  // useLayoutEffect so the restore happens before the browser paints the
  // intermediate state.
  useLayoutEffect(() => {
    if (pendingScrollY.current != null) {
      window.scrollTo(0, pendingScrollY.current);
      pendingScrollY.current = null;
    }
  }, [tab]);

  const handleCelebrate = useCallback(() => {
    fireConfetti(confettiCanvasRef.current, {
      particles: 220,
      originY: 0.35,
    });
  }, []);
  const handleRevealDone = useCallback(() => setRevealed(true), []);

  const switchTab = useCallback(
    (next) => (e) => {
      if (e) e.preventDefault();
      if (next === tab) return;
      pendingScrollY.current = window.scrollY;
      setTab(next);
    },
    [tab]
  );

  const zomatoTotal = zomatoThisYear?.total_cost_spent || 0;
  const swiggyTotal = swiggyThisYear?.total_cost_spent || 0;
  const combinedTotal = zomatoTotal + swiggyTotal;
  const combinedOrders =
    (zomatoThisYear?.total_orders || 0) +
    (swiggyThisYear?.total_orders || 0);

  return (
    <div className="relative min-h-screen bg-cream-100 text-espresso-900 flex flex-col">
      <GlobalParallax />

      {/* Page-wide confetti overlay - fires from CombinedSummary */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 w-screen h-screen pointer-events-none z-[60]"
      />

      <div className="relative z-10 flex flex-col flex-grow min-h-0">
        <header className="w-full px-6 sm:px-10 py-5 flex items-center justify-between gap-6">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-1.5">
              <ConnectionPill brand="zomato" connected={zomatoLoggedIn} />
              <ConnectionPill brand="swiggy" connected={swiggyLoggedIn} />
            </div>
            <IconButton
              Icon={Share2}
              label="Share"
              onClick={() => setShareOpen(true)}
            />
            <IconButton
              Icon={RotateCcw}
              label="Start over"
              onClick={onReset}
              accent="danger"
            />
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto w-full px-6 sm:px-10 pb-28 flex-grow">
          <CombinedSummary
            year={currentYear}
            total={combinedTotal}
            orders={combinedOrders}
            zomatoTotal={zomatoTotal}
            swiggyTotal={swiggyTotal}
            zomatoOrders={zomatoThisYear?.total_orders || 0}
            swiggyOrders={swiggyThisYear?.total_orders || 0}
            onCelebrate={handleCelebrate}
            onRevealDone={handleRevealDone}
          />

          <AnimatePresence>
            {revealed && (
              <motion.div
                key="rest"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {/* Shared sentinel - when this scrolls out of view, the panel
                    sticky bar has pinned and the in-bar logo should fade in. */}
                <div
                  ref={stickySentinelRef}
                  aria-hidden
                  style={{ height: 1 }}
                />
                {/* AnimatePresence with mode="popLayout" briefly keeps both
                    panels in the DOM during a tab switch, so the shared
                    layoutId on the active-tab underline can spring between
                    the old and new positions (and interpolate the brand
                    color along the way). */}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <PlatformPanel
                      brand={tab}
                      tab={tab}
                      switchTab={switchTab}
                      isStuck={isStuck}
                      onYearChange={scrollToStickyTop}
                      ordersByYear={
                        tab === 'zomato' ? zomatoByYear : swiggyByYear
                      }
                      allOrders={
                        (tab === 'zomato' ? zomatoOrders : swiggyOrders) || []
                      }
                      showYearPicker={tab === 'zomato'}
                      emptyMessage={
                        tab === 'zomato'
                          ? 'No Zomato data yet. Sign in over there, then re-open Munchmetrics to see your full order history.'
                          : "No Swiggy data yet. Sign in over there, then re-open Munchmetrics to see this year's orders."
                      }
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        year={currentYear}
        total={combinedTotal}
        orders={combinedOrders}
        zomatoTotal={zomatoTotal}
        swiggyTotal={swiggyTotal}
      />
    </div>
  );
};

export default DashboardView;
