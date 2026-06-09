import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoUrl from '../../../assets/img/logo.svg';
import Footer from './Footer';

// Subtle entrance choreography.
//
// Parent stages reveal in order: logo -> headline -> cards -> banner -> taglines.
// staggerChildren picks the rhythm; each item picks its own motion (slide,
// fade, scale) so the whole thing feels orchestrated, not mechanical.

const stageEase = [0.22, 1, 0.36, 1]; // soft easeOutQuint

const stageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.05,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: stageEase },
  },
};

const logoVariant = {
  hidden: { opacity: 0, y: -14, scale: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 18 },
  },
};

const popIn = {
  hidden: { opacity: 0, scale: 0.6, rotate: -6 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 320, damping: 16, delay: 0.35 },
  },
};

const cardRow = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const cardZomato = {
  hidden: { opacity: 0, y: 36, x: -14 },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.55, ease: stageEase },
  },
};

const cardSwiggy = {
  hidden: { opacity: 0, y: 36, x: 14 },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.55, ease: stageEase },
  },
};

const Logo = () => (
  <motion.div
    variants={logoVariant}
    className="inline-flex items-center gap-2.5 rounded-full pl-2 pr-6 py-1.5 shadow-card"
    style={{ background: '#ff847c' }}
  >
    <img src={logoUrl} alt="Munchmetrics" className="h-11 w-11 rounded-lg" />
    <span className="font-brand font-bold text-[30px] tracking-tight leading-none text-white">
      Munch<span className="font-extrabold">metrics</span>
    </span>
  </motion.div>
);

const CHECKING_LINES = {
  zomato: [
    'Knocking on Zomato...',
    'Reading the receipts...',
    'Counting the biryanis...',
  ],
  swiggy: [
    'Knocking on Swiggy...',
    'Flipping through the orders...',
    'Counting the late-night cravings...',
  ],
};

const CheckingState = ({ brand }) => {
  const lines = CHECKING_LINES[brand] || CHECKING_LINES.zomato;
  const accent = brand === 'zomato' ? '#E23744' : '#FC8019';
  const trackBg = brand === 'zomato' ? 'bg-zomato-50' : 'bg-swiggy-50';
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % lines.length),
      1400
    );
    return () => clearInterval(id);
  }, [lines.length]);

  return (
    <div
      className={`flex items-center gap-3 rounded-full px-4 py-3 ${trackBg}`}
    >
      <div className="relative w-5 h-5 shrink-0">
        <div
          className="absolute inset-0 rounded-full border-2 border-espresso-800/10"
        />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: accent }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={lines[idx]}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="text-sm font-medium text-espresso-800/80"
        >
          {lines[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const PlatformCard = ({
  title,
  tagline,
  blurb,
  href,
  loggedIn,
  brand,
  checking,
}) => {
  const isZomato = brand === 'zomato';
  const titleColor = isZomato ? 'text-zomato-500' : 'text-swiggy-500';
  const tintBg = isZomato ? 'bg-zomato-50' : 'bg-swiggy-50';
  const ctaBg = isZomato
    ? 'bg-zomato-500 hover:bg-zomato-600'
    : 'bg-swiggy-500 hover:bg-swiggy-600';

  return (
    <motion.div
      variants={isZomato ? cardZomato : cardSwiggy}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.55, ease: stageEase }}
      className="bg-white rounded-3xl shadow-card overflow-hidden flex flex-col"
    >
      <div className={`px-6 pt-6 pb-5 ${tintBg}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              className={`font-display font-extrabold text-3xl ${titleColor}`}
            >
              {title}
            </h2>
            <p className="text-espresso-800/70 text-sm mt-0.5">{tagline}</p>
          </div>
          {isZomato && (
            <div className="text-right shrink-0">
              <div className={`font-display font-bold text-lg ${titleColor}`}>
                Lifetime
              </div>
              <div className="text-espresso-800/60 text-xs italic">
                Careful :)
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-5 flex-1 flex flex-col justify-between gap-5">
        <p className="text-espresso-800 text-[15px] leading-relaxed">{blurb}</p>
        {checking ? (
          <CheckingState brand={brand} />
        ) : loggedIn ? (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-3 text-sm font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            You're in. Your {title} orders are ready.
          </div>
        ) : (
          <motion.a
            href={href}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${ctaBg} text-white font-semibold rounded-full py-3 text-center text-[15px] inline-flex items-center justify-center gap-2 transition shadow-pop`}
          >
            Log in to {title}
            <span aria-hidden>↗</span>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

const StatusBanner = ({
  zomatoLoggedIn,
  swiggyLoggedIn,
  checking,
  fetching,
  onSeeStory,
  onRecheck,
}) => {
  if (checking) {
    return (
      <div className="rounded-3xl bg-white shadow-card p-5 flex items-center gap-4">
        <div className="w-9 h-9 rounded-full border-2 border-espresso-800/10 border-t-zomato-500 animate-spin" />
        <p className="text-espresso-800/80">Setting the table...</p>
      </div>
    );
  }

  const noneLoggedIn = !zomatoLoggedIn && !swiggyLoggedIn;
  const bothLoggedIn = zomatoLoggedIn && swiggyLoggedIn;
  const oneLoggedIn = !noneLoggedIn && !bothLoggedIn;

  let title;
  let body;
  let icon;
  if (noneLoggedIn) {
    icon = '🪑';
    title = "Table for one, but nobody's shown up";
    body =
      'Log in to Zomato and Swiggy in the cards above, then swing back here.';
  } else if (oneLoggedIn) {
    icon = '🍳';
    const which = zomatoLoggedIn ? 'Zomato' : 'Swiggy';
    const other = zomatoLoggedIn ? 'Swiggy' : 'Zomato';
    title = `${which} is in. ${other} is still on the way.`;
    body = `You can already see your ${which} story. Log in to ${other} too for the full picture across both apps.`;
  } else {
    icon = '🎉';
    title = 'Both apps are in. Time to eat.';
    body =
      'Your full food story is ready. Hit the button to see where every rupee went.';
  }

  return (
    <div className="rounded-3xl bg-white shadow-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
      <div className="text-3xl shrink-0">{icon}</div>
      <div className="flex-1">
        <h3 className="font-display font-bold text-xl text-espresso-900">
          {title}
        </h3>
        <p className="text-espresso-800/70 text-[15px] mt-1">{body}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRecheck}
          className="px-5 py-3 rounded-full text-sm font-semibold text-espresso-800 bg-cream-200 hover:bg-cream-300 transition"
        >
          ↻ Check again
        </motion.button>
        <motion.button
          type="button"
          whileHover={!noneLoggedIn && !fetching ? { y: -2 } : undefined}
          whileTap={!noneLoggedIn && !fetching ? { scale: 0.96 } : undefined}
          disabled={noneLoggedIn || fetching}
          onClick={onSeeStory}
          className={`px-6 py-3 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 transition ${
            noneLoggedIn || fetching
              ? 'bg-cream-200 text-espresso-800/40 cursor-not-allowed'
              : 'bg-espresso-900 text-cream-50 hover:bg-espresso-800 shadow-pop'
          }`}
        >
          {fetching ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-cream-50/30 border-t-cream-50 animate-spin" />
              Plating up your story...
            </>
          ) : (
            <>See my food story →</>
          )}
        </motion.button>
      </div>
    </div>
  );
};

const Welcome = (props) => {
  return (
    <div className="relative min-h-screen bg-cream-100 flex flex-col">
      <motion.div
        variants={stageVariants}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-4xl px-6 py-10 sm:py-16 pb-28 flex-grow"
      >
        <motion.div variants={fadeUp} className="flex justify-center mb-10">
          <Logo />
        </motion.div>

        <motion.div variants={fadeUp} className="text-center mb-10">
          <h1 className="font-display font-extrabold text-espresso-900 text-4xl sm:text-5xl leading-[1.05]">
            Where did your <br className="hidden sm:block" />
            food money{' '}
            <motion.span
              variants={popIn}
              initial="hidden"
              animate="show"
              className="text-zomato-500 inline-block"
            >
              actually
            </motion.span>{' '}
            go?
          </h1>
        </motion.div>

        <motion.div
          variants={cardRow}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6"
        >
          <PlatformCard
            brand="zomato"
            title="Zomato"
            tagline="Lifetime order history"
            blurb="We read your full order history, year by year."
            href="https://www.zomato.com/login"
            loggedIn={props.zomatoLoggedIn}
            checking={props.checking}
          />
          <PlatformCard
            brand="swiggy"
            title="Swiggy"
            tagline="This year's orders"
            blurb="We pull this year's orders. Older ones are off the menu."
            href="https://www.swiggy.com/auth"
            loggedIn={props.swiggyLoggedIn}
            checking={props.checking}
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <StatusBanner
            checking={props.checking}
            fetching={props.fetching}
            zomatoLoggedIn={props.zomatoLoggedIn}
            swiggyLoggedIn={props.swiggyLoggedIn}
            onRecheck={props.onRecheck}
            onSeeStory={props.onSeeStory}
          />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-espresso-800/70 mt-10 text-[15px] sm:text-base max-w-xl mx-auto leading-relaxed text-center"
        >
          Plug in Zomato and Swiggy and we'll turn your year of takeout into a
          proper food story - total spend, top cravings, peak hunger hours, and
          the dish you order way too often.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-center text-espresso-900 font-medium text-xs mt-6"
        >
          Everything runs locally in your browser. Your orders never leave your
          machine.
        </motion.p>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Welcome;
