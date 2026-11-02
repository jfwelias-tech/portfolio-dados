/** Choose the correct public CV from the active portfolio language. */
(() => {
  'use strict';
  const scriptUrl = document.currentScript && document.currentScript.src;
  const assetsUrl = scriptUrl ? new URL('.', scriptUrl) : new URL('assets/', document.baseURI);
  const files = { pt: 'CV_Joao_Felipe_PT.pdf', en: 'CV_Joao_Felipe_EN.pdf' };
  const links = [...document.querySelectorAll('a[data-cv-download]')];
  if (!links.length) return;

  function applyLanguage(language) {
    const selected = language === 'en' ? 'en' : 'pt';
    const filename = files[selected];
    const url = new URL(filename, assetsUrl).href;
    links.forEach(link => {
      link.href = url;
      link.download = filename;
      link.hreflang = selected === 'en' ? 'en' : 'pt-BR';
    });
  }

  const currentLanguage = () => document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pt';
  applyLanguage(currentLanguage());
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const switchButton = event.target.closest('[data-set-language], [data-language]');
    if (switchButton) {
      applyLanguage(switchButton.dataset.setLanguage || switchButton.dataset.language);
    } else if (event.target.closest('a[data-cv-download]')) {
      applyLanguage(currentLanguage());
    }
  }, true);
  document.addEventListener('portfolio-language', event => {
    if (event.detail && event.detail.language) applyLanguage(event.detail.language);
  });
})();
