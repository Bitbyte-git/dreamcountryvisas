// Google Analytics 4 — separate measurement ID per domain so .com and .in
// traffic are tracked as distinct properties. Kept as a file (not an inline
// <script>) so the server's Content-Security-Policy can allow it as 'self'.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
var GA4_MEASUREMENT_ID = window.location.hostname.includes('dreamcountryvisas.in')
  ? 'G-FN5CRWVL9L'
  : 'G-JY46359QXW';
gtag('config', GA4_MEASUREMENT_ID);
