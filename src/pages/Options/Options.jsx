import React, { useEffect, useState, useCallback } from 'react';
import './Options.css';
import Welcome from './components/Welcome';
import DashboardView from './components/DashboardView';
import useZomatoScrapper from '../../hooks/useZomatoScrapper';
import useSwiggyScrapper from '../../hooks/useSwiggyScrapper';

const ZOMATO_CHECK = 'https://www.zomato.com/webroutes/user/orders';
const SWIGGY_CHECK = 'https://www.swiggy.com/dapi/order/all?order_id=';

async function checkZomatoLogin() {
  try {
    const res = await fetch(ZOMATO_CHECK);
    const data = await res.json();
    const pages = data?.sections?.SECTION_USER_ORDER_HISTORY?.totalPages;
    if (pages) {
      chrome.storage.local.set({ zomatePages: pages });
      return { loggedIn: true, pages };
    }
  } catch (_) {}
  return { loggedIn: false };
}

async function checkSwiggyLogin() {
  try {
    const res = await fetch(SWIGGY_CHECK);
    const data = await res.json();
    return { loggedIn: data?.statusCode === 0 };
  } catch (_) {
    return { loggedIn: false };
  }
}

const Options = () => {
  const [step, setStep] = useState('welcome'); // welcome | dashboard
  const [checking, setChecking] = useState(true);
  const [zomatoLoggedIn, setZomatoLoggedIn] = useState(false);
  const [swiggyLoggedIn, setSwiggyLoggedIn] = useState(false);
  const [fetching, setFetching] = useState(false);

  const {
    zomatoYearSummary,
    getZomatoYearSummary,
    zomatoLoading,
  } = useZomatoScrapper();

  const {
    yearSummarySwiggy,
    getYearSummarySwiggy,
    swiggyLoading,
  } = useSwiggyScrapper();

  const [zomatoOrders, setZomatoOrders] = useState(null);
  const [swiggyOrders, setSwiggyOrders] = useState(null);

  const recheck = useCallback(async () => {
    setChecking(true);
    const [z, s] = await Promise.all([checkZomatoLogin(), checkSwiggyLogin()]);
    setZomatoLoggedIn(z.loggedIn);
    setSwiggyLoggedIn(s.loggedIn);
    setChecking(false);
  }, []);

  useEffect(() => {
    recheck();
    chrome.storage?.local.get(['zomato', 'swiggy'], (res) => {
      if (res.zomato) setZomatoOrders(res.zomato);
      if (res.swiggy) setSwiggyOrders(res.swiggy);
    });
  }, [recheck]);

  // Re-check login state whenever the tab becomes active again. Users typically
  // pop over to zomato.com / swiggy.com to log in, then come back here - we
  // want their connection status to update without making them hit "Check
  // again" manually. Only fires when we're still on the welcome screen.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && step === 'welcome') {
        recheck();
      }
    };
    const onFocus = () => {
      if (step === 'welcome') recheck();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
    };
  }, [recheck, step]);

  useEffect(() => {
    if (zomatoYearSummary?.length) {
      chrome.storage.local.set({ zomato: zomatoYearSummary });
      setZomatoOrders(zomatoYearSummary);
    }
  }, [zomatoYearSummary]);

  useEffect(() => {
    if (yearSummarySwiggy?.length) {
      chrome.storage.local.set({ swiggy: yearSummarySwiggy });
      setSwiggyOrders(yearSummarySwiggy);
    }
  }, [yearSummarySwiggy]);

  const [fetchError, setFetchError] = useState(null);
  const onSeeStory = async () => {
    setFetching(true);
    setFetchError(null);
    const tasks = [];
    if (zomatoLoggedIn && !zomatoOrders?.length) {
      tasks.push(
        getZomatoYearSummary().catch((e) => {
          console.error('Zomato fetch failed', e);
          return null;
        })
      );
    }
    if (swiggyLoggedIn && !swiggyOrders?.length) {
      tasks.push(
        getYearSummarySwiggy().catch((e) => {
          console.error('Swiggy fetch failed', e);
          return null;
        })
      );
    }
    try {
      await Promise.all(tasks);
    } catch (e) {
      setFetchError(e?.message || 'Something went wrong while fetching orders.');
    } finally {
      setFetching(false);
      setStep('dashboard');
    }
  };

  const resetAll = () => {
    chrome.storage.local.clear();
    chrome.storage.sync.clear();
    setZomatoOrders(null);
    setSwiggyOrders(null);
    setStep('welcome');
    recheck();
  };

  if (step === 'dashboard') {
    return (
      <DashboardView
        zomatoOrders={zomatoOrders}
        swiggyOrders={swiggyOrders}
        zomatoLoggedIn={zomatoLoggedIn}
        swiggyLoggedIn={swiggyLoggedIn}
        onReset={resetAll}
      />
    );
  }

  return (
    <Welcome
      checking={checking}
      zomatoLoggedIn={zomatoLoggedIn}
      swiggyLoggedIn={swiggyLoggedIn}
      hasZomatoData={!!zomatoOrders?.length}
      hasSwiggyData={!!swiggyOrders?.length}
      fetching={fetching || zomatoLoading || swiggyLoading}
      onRecheck={recheck}
      onSeeStory={onSeeStory}
    />
  );
};

export default Options;
