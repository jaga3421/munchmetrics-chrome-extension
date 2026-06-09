import React from 'react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden {...props} fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.96c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.14 1.18a10.9 10.9 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const Footer = () => (
  <footer className="fixed bottom-0 left-0 right-0 z-40 bg-cream-100/85 backdrop-blur-md border-t border-espresso-900/10">
    <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-espresso-800/70">
      <a
        href="https://github.com/jaga3421/munchmetrics-chrome-extension"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 hover:text-espresso-900 transition"
      >
        <GithubIcon className="w-4 h-4" />
        Open source on GitHub
      </a>
      <a
        href="https://instagram.com/whereis.the.food"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 hover:text-espresso-900 transition"
      >
        Made with hunger by JJay
        <InstagramIcon className="w-4 h-4" />
      </a>
    </div>
  </footer>
);

export default Footer;
