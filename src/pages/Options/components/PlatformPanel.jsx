import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, Utensils, Store } from 'lucide-react';
import logoUrl from '../../../assets/img/logo.svg';
import {
  generateYearlyReview as zReview,
  groupOrdersByMonth as zMonths,
} from '../../../helpers/zomato';
import {
  generateYearlyReview as sReview,
  groupOrdersByMonth as sMonths,
} from '../../../helpers/swiggy';
import MetricsGrid from './MetricsGrid';
import MonthlyChart from './MonthlyChart';
import HourlyChart from './HourlyChart';
import TopList from './TopList';
import { fmtInt, fmtINR, orderCost } from '../../../helpers/format';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const Card = ({
  children,
  className = '',
  delay = 0,
  hover = true,
  inView = true,
}) => {
  const motionProps = inView
    ? {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
      }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
      };
  return (
    <motion.div
      {...motionProps}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      whileHover={
        hover
          ? { y: -3, boxShadow: '0 14px 36px -16px rgba(61,31,20,0.28)' }
          : undefined
      }
      className={`rounded-3xl bg-white shadow-card ${className}`}
    >
      {children}
    </motion.div>
  );
};

const StickyLogo = () => (
  <div className="inline-flex items-center gap-2.5">
    <img src={logoUrl} alt="Munchmetrics" className="h-9 w-9 rounded-lg" />
    <span className="font-brand font-bold tracking-tight leading-none text-[22px]">
      <span className="text-espresso-900">Munch</span>
      <span className="text-swiggy-500">metrics</span>
    </span>
  </div>
);

// Single shared layoutId. With DashboardView now rendering one PlatformPanel
// at a time inside AnimatePresence (mode="popLayout"), the exiting panel's
// underline and the entering panel's underline briefly coexist, so framer-
// motion can spring the bar across AND interpolate the brand color in one
// shot.
const TabPill = ({ active, brand, children, onClick }) => {
  const dot = brand === 'zomato' ? '#E23744' : '#FC8019';
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative inline-flex items-center gap-2.5 px-4 py-2.5 text-lg sm:text-xl font-bold transition outline-none"
    >
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: dot }} />
      <span
        className={
          active
            ? 'text-espresso-900'
            : 'text-espresso-800/50 hover:text-espresso-900'
        }
      >
        {children}
      </span>
      {active && (
        <motion.span
          layoutId="active-tab-underline"
          className="absolute -bottom-[13px] left-2 right-2 h-1 rounded-full"
          initial={false}
          animate={{ backgroundColor: dot }}
          transition={{
            layout: { type: 'spring', stiffness: 320, damping: 28 },
            backgroundColor: { duration: 0.35, ease: 'easeOut' },
          }}
        />
      )}
    </motion.button>
  );
};

const SectionTitle = ({ Icon, accent, children }) => (
  <h3 className="font-display font-bold text-xl text-espresso-900 inline-flex items-center gap-2.5">
    <span
      className="inline-flex items-center justify-center w-10 h-10 rounded-2xl"
      style={{ background: `${accent}1A` }}
    >
      <Icon className="w-6 h-6" strokeWidth={2.2} color={accent} />
    </span>
    {children}
  </h3>
);

const PlatformPanel = ({
  brand,
  tab,
  switchTab,
  ordersByYear,
  allOrders,
  showYearPicker,
  emptyMessage,
  isStuck = false,
  onYearChange,
}) => {
  const reviewFn = brand === 'zomato' ? zReview : sReview;
  const monthsFn = brand === 'zomato' ? zMonths : sMonths;
  const accent = brand === 'zomato' ? 'zomato' : 'swiggy';
  const accentHex = brand === 'zomato' ? '#E23744' : '#FC8019';
  const yearActiveBg = brand === 'zomato' ? 'bg-zomato-500' : 'bg-swiggy-500';

  const dataYears = Object.keys(ordersByYear || {}).sort(
    (a, b) => Number(b) - Number(a)
  );
  const currentYear = new Date().getFullYear().toString();
  const years = showYearPicker
    ? Array.from(new Set([currentYear, ...dataYears])).sort(
        (a, b) => Number(b) - Number(a)
      )
    : dataYears;
  const initialYear = showYearPicker
    ? currentYear
    : dataYears[0] || currentYear;

  const [selectedYear, setSelectedYear] = useState(initialYear);
  useEffect(() => setSelectedYear(initialYear), [initialYear]);

  const yearOrders = ordersByYear?.[selectedYear] || [];
  const review = useMemo(() => {
    try {
      return yearOrders.length ? reviewFn(yearOrders) : null;
    } catch (_) {
      return null;
    }
  }, [yearOrders, reviewFn]);

  const monthBuckets = useMemo(
    () => (yearOrders.length ? monthsFn(yearOrders) : []),
    [yearOrders, monthsFn]
  );

  const hourly24 = useMemo(() => {
    const buckets = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      count: 0,
    }));
    yearOrders.forEach((o) => {
      const slot = o?.orderDate?.timeSlot;
      if (typeof slot === 'number' && slot >= 0 && slot < 24) {
        buckets[slot].count += 1;
      }
    });
    return buckets;
  }, [yearOrders]);

  const noOrdersThisYear = yearOrders.length === 0;
  const hasAnyOrders = (allOrders?.length || 0) > 0;

  const monthlyData = monthBuckets.map((bucket, i) => {
    const cost = bucket.reduce((acc, o) => acc + orderCost(o), 0);
    return {
      month: MONTH_NAMES[i],
      cost: Math.round(cost),
      orders: bucket.length,
    };
  });

  const dishes = (review?.top_dishes || []).slice(0, 8);
  const restaurants = (review?.top_restaurants || []).slice(0, 8).map((r) => {
    if (r?.resInfo) return { name: r.resInfo.name || 'Unknown', count: r.count };
    if (Array.isArray(r)) return { name: r[0] || 'Unknown', count: r[1] };
    return { name: r?.name || 'Unknown', count: r?.count || 0 };
  });

  const yearLabel = selectedYear;
  const avg = review
    ? Math.round(Number(review.average_order_cost) || 0)
    : 0;

  // ONE sticky wrapper. Tabs row + (optional) year picker + metrics row stack
  // inside it at their natural flow positions, no individual top: needed.
  // All rows share the same vertical rhythm via py-6 / space-y-6.
  const stickyHeader = (
    // The outer wrapper spans 100vw (broken out of its max-width parent with a
    // negative-margin calc) so the background, border, and shadow run full
    // viewport width. The inner div re-applies the max-width and the same
    // px-6 / sm:px-10 gutter the rest of the page uses, so the content stays
    // pixel-aligned with the cards above and below it - no horizontal jerk.
    <div
      className={`sticky top-0 z-30 bg-cream-100 transition-shadow duration-300 ${
        isStuck
          ? 'border-b border-espresso-900/10 shadow-[0_10px_30px_-18px_rgba(61,31,20,0.25)]'
          : ''
      }`}
      style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-6 pb-6 space-y-6">
        <div className="flex items-center gap-3 flex-wrap pb-3 border-b border-espresso-900/10">
          <AnimatePresence>
            {isStuck && (
              <motion.div
                key="stuck-logo"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <StickyLogo />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-4 ml-auto">
            <TabPill
              brand="zomato"
active={tab === 'zomato'}
              onClick={switchTab('zomato')}
            >
              Zomato
            </TabPill>
            <TabPill
              brand="swiggy"
active={tab === 'swiggy'}
              onClick={switchTab('swiggy')}
            >
              Swiggy
            </TabPill>
          </div>
        </div>

        {showYearPicker && hasAnyOrders && years.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-espresso-800/50">
              Pick a year
            </span>
            {years.map((y) => {
              const isCurrent = y === currentYear;
              const active = y === selectedYear;
              return (
                <motion.button
                  key={y}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setSelectedYear(y);
                    onYearChange?.();
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    active
                      ? `${yearActiveBg} text-white shadow-pop`
                      : 'bg-white text-espresso-900 hover:bg-cream-200'
                  }`}
                >
                  {y}
                  {isCurrent && (
                    <span className={active ? 'opacity-90' : 'opacity-60'}>
                      {' '}
                      · now
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        {hasAnyOrders && !noOrdersThisYear && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 items-stretch">
            <Card
              className="lg:col-span-2 p-5 flex flex-col justify-between min-h-[160px] col-span-2"
              delay={0.05}
              hover={false}
              inView={false}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-espresso-800/50">
                You spent · {yearLabel}
              </p>
              <div
                className="font-display font-extrabold leading-[0.95] tabular-nums"
                style={{
                  color: accentHex,
                  fontSize: 'clamp(36px, 4vw, 52px)',
                }}
              >
                {fmtINR(review?.total_cost_spent || 0)}
              </div>
              <p className="text-espresso-800/70 text-sm">
                {fmtInt(review?.total_orders || 0)} orders · {fmtINR(avg)} avg
                per order
              </p>
            </Card>
            <MetricsGrid review={review} startDelay={0.12} />
          </div>
        )}
      </div>
    </div>
  );

  const loginUrl =
    brand === 'zomato'
      ? 'https://www.zomato.com/login'
      : 'https://www.swiggy.com/auth';
  const brandName = brand === 'zomato' ? 'Zomato' : 'Swiggy';

  return (
    <div className="space-y-6">
      {stickyHeader}

      {!hasAnyOrders ? (
        <div className="rounded-3xl bg-white shadow-card p-10 text-center">
          <p className="text-espresso-800/70 max-w-md mx-auto">
            {emptyMessage}
          </p>
          <a
            href={loginUrl}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-full text-white font-semibold shadow-pop hover:opacity-90 transition ${yearActiveBg}`}
          >
            Log in to {brandName}
            <span aria-hidden>↗</span>
          </a>
        </div>
      ) : noOrdersThisYear ? (
        <Card className="p-10 text-center" delay={0.1}>
          <div className="text-4xl mb-3">🍽️</div>
          <h3 className="font-display font-bold text-2xl text-espresso-900">
            Nothing on the table in {yearLabel}
          </h3>
          <p className="text-espresso-800/60 mt-2 text-sm max-w-md mx-auto">
            No orders this year yet. Pick another year above to see how that
            one tasted.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-6" delay={0.35}>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <SectionTitle Icon={TrendingUp} accent={accentHex}>
                  How it added up
                </SectionTitle>
                <p className="text-xs text-espresso-800/60">
                  Monthly · {yearLabel}
                </p>
              </div>
              <MonthlyChart data={monthlyData} accent={accentHex} />
            </Card>
            <Card className="p-6" delay={0.4}>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <SectionTitle Icon={Clock} accent={accentHex}>
                  Peak hunger hours
                </SectionTitle>
                <p className="text-xs text-espresso-800/60">
                  Orders by hour · {yearLabel}
                </p>
              </div>
              <HourlyChart data={hourly24} accent={accentHex} />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-6" delay={0.5}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <SectionTitle Icon={Utensils} accent={accentHex}>
                  Most loved dishes
                </SectionTitle>
                <p className="text-xs text-espresso-800/60">Top 8</p>
              </div>
              <TopList items={dishes} accent={accentHex} />
            </Card>
            <Card className="p-6" delay={0.55}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <SectionTitle Icon={Store} accent={accentHex}>
                  Go-to restaurants
                </SectionTitle>
                <p className="text-xs text-espresso-800/60">Top 8</p>
              </div>
              <TopList items={restaurants} accent={accentHex} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default PlatformPanel;
