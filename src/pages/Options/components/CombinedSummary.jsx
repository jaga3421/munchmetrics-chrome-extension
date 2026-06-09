import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fmtInt, fmtINR } from '../../../helpers/format';

const COUNT_UP_DURATION = 5000;
const INTRO_HOLD = 700;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const CombinedSummary = ({
  year,
  total,
  orders,
  zomatoTotal,
  swiggyTotal,
  zomatoOrders,
  swiggyOrders,
  onCelebrate,
  onRevealDone,
}) => {
  const hasZomato = zomatoTotal > 0 || zomatoOrders > 0;
  const hasSwiggy = swiggyTotal > 0 || swiggyOrders > 0;
  const both = hasZomato && hasSwiggy;
  const empty = !hasZomato && !hasSwiggy;

  const zPct = total > 0 ? Math.round((zomatoTotal / total) * 100) : 0;
  const sPct = total > 0 ? 100 - zPct : 0;

  let descriptor;
  if (empty) descriptor = `nothing ordered in ${year} yet`;
  else if (both) descriptor = 'across both apps';
  else if (hasZomato) descriptor = 'on Zomato';
  else descriptor = 'on Swiggy';

  const [phase, setPhase] = useState('intro');
  const [displayed, setDisplayed] = useState(0);
  const [dots, setDots] = useState('');
  const doneRef = useRef(false);

  useEffect(() => {
    if (phase !== 'intro') return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % 4;
      setDots('.'.repeat(i));
    }, 180);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    const t = setTimeout(() => setPhase('counting'), INTRO_HOLD);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'counting') return;
    setDots('');
    if (!total) {
      setDisplayed(0);
      const t = setTimeout(() => {
        setPhase('done');
        if (!doneRef.current) {
          doneRef.current = true;
          onRevealDone?.();
        }
      }, 300);
      return () => clearTimeout(t);
    }
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNT_UP_DURATION);
      setDisplayed(Math.floor(total * easeOutCubic(t)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplayed(total);
        setPhase('done');
        onCelebrate?.();
        setTimeout(() => {
          if (!doneRef.current) {
            doneRef.current = true;
            onRevealDone?.();
          }
        }, 500);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, total, onCelebrate, onRevealDone]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative rounded-3xl bg-espresso-900 text-cream-50 px-7 sm:px-12 py-14 sm:py-20 overflow-hidden shadow-card min-h-[440px] flex flex-col justify-center"
    >
      <div className="relative z-20 text-center">
        <motion.p
          className="uppercase tracking-[0.18em] text-cream-50/60 text-[12px] font-semibold"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Your food spend in {year}
          <span className="text-cream-50/40 inline-block w-6 text-left">
            {phase === 'intro' ? dots : ''}
          </span>
        </motion.p>

        <div className="mt-4 flex flex-col items-center gap-y-3">
          <div
            className="font-display font-extrabold leading-none text-cream-50 tabular-nums"
            style={{ fontSize: 'clamp(64px, 10vw, 128px)' }}
          >
            {fmtINR(displayed)}
          </div>
          <motion.div
            className="text-cream-50/70 text-base sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'done' ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {fmtInt(orders)} orders · {descriptor}
          </motion.div>
        </div>

        {total > 0 && (
          <>
            <motion.div
              className="mt-9 mx-auto max-w-2xl h-3 rounded-full bg-cream-50/10 overflow-hidden flex"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: phase === 'done' ? 1 : 0,
                opacity: phase === 'done' ? 1 : 0,
              }}
              style={{ transformOrigin: 'left' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div
                className="h-full bg-zomato-500 transition-all"
                style={{ width: `${zPct}%` }}
              />
              <div
                className="h-full bg-swiggy-500 transition-all"
                style={{ width: `${sPct}%` }}
              />
            </motion.div>

            <motion.div
              className="mt-3 mx-auto max-w-2xl flex flex-wrap justify-between gap-y-1 text-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: phase === 'done' ? 1 : 0,
                y: phase === 'done' ? 0 : 8,
              }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-zomato-500" />
                <span className="text-cream-50/80">
                  Zomato {fmtINR(zomatoTotal)} · {zPct}%
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-swiggy-500" />
                <span className="text-cream-50/80">
                  Swiggy {fmtINR(swiggyTotal)} · {sPct}%
                </span>
              </span>
            </motion.div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default CombinedSummary;
