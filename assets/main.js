/**
 * João Felipe · Data Portfolio
 * Responsive PT/EN selector with inline SVG flags.
 * Supports both the original #language-toggle and the later .language-switch markup.
 * Only this file needs to be replaced in assets/main.js.
 */
(() => {
  'use strict';

  const BRAZIL_FLAG = `
    <svg viewBox="0 0 60 40" width="27" height="18" aria-hidden="true" focusable="false">
      <rect width="60" height="40" rx="2" fill="#169447"/>
      <path d="M30 3 57 20 30 37 3 20Z" fill="#FFDB33"/>
      <circle cx="30" cy="20" r="10" fill="#233B88"/>
      <path d="M20 20 Q30 15 40 22" fill="none" stroke="#fff" stroke-width="2"/>
    </svg>`;

  const UK_FLAG = `
    <svg viewBox="0 0 60 40" width="27" height="18" aria-hidden="true" focusable="false">
      <rect width="60" height="40" rx="2" fill="#17366C"/>
      <path d="M0 0 60 40 M60 0 0 40" stroke="#fff" stroke-width="9"/>
      <path d="M0 0 60 40 M60 0 0 40" stroke="#CA2942" stroke-width="4"/>
      <path d="M30 0V40 M0 20H60" stroke="#fff" stroke-width="12"/>
      <path d="M30 0V40 M0 20H60" stroke="#CA2942" stroke-width="6"/>
    </svg>`;

  function initializeLanguageSwitcher() {
    const header = document.querySelector('header.header') || document.querySelector('header');
    if (!header) return;

    // The previous lessons used two different structures. Handle either one.
    const existing = header.querySelector('.language-switch, #language-toggle, .jf-language-switch');
    const switcher = document.createElement('div');
    switcher.className = 'language-switch jf-language-switch';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Language / Idioma');

    function makeButton(language, flag, label, accessibleLabel) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'jf-language-btn';
      button.dataset.language = language;
      button.id = language === 'pt' ? 'lang-pt' : 'lang-en';
      button.setAttribute('aria-label', accessibleLabel);
      button.innerHTML = flag + '<span>' + label + '</span>';
      return button;
    }

    const ptButton = makeButton('pt', BRAZIL_FLAG, 'PT', 'Português (Brasil)');
    const enButton = makeButton('en', UK_FLAG, 'EN', 'English (United Kingdom)');
    switcher.append(ptButton, enButton);

    if (existing) existing.replaceWith(switcher);
    else header.append(switcher);

    // This styling is self-contained: no changes to styles.css are required.
    if (!document.getElementById('jf-language-switch-styles')) {
      const style = document.createElement('style');
      style.id = 'jf-language-switch-styles';
      style.textContent = `
        .jf-language-switch {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center;
          gap: 8px;
          margin-left: auto;
          flex-shrink: 0;
        }
        .jf-language-switch .jf-language-btn {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 89px;
          min-height: 43px;
          padding: 9px 13px;
          border-radius: 12px;
          border: 1px solid #cbdbdf;
          background: #fff;
          color: #0d2131;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          font-weight: 800;
          line-height: 1;
          transition: background .16s ease, border-color .16s ease, transform .16s ease;
        }
        .jf-language-switch .jf-language-btn svg {
          width: 27px;
          height: 18px;
          border-radius: 2px;
          display: block;
          flex: none;
        }
        .jf-language-switch .jf-language-btn:hover {
          border-color: #0d927d;
          transform: translateY(-1px);
        }
        .jf-language-switch .jf-language-btn.is-active {
          background: #0d2131;
          border-color: #0d2131;
          color: #fff;
        }
        .jf-language-switch .jf-language-btn:focus-visible {
          outline: 3px solid #0d927d;
          outline-offset: 3px;
        }
        @media (max-width: 490px) {
          .jf-language-switch { gap: 6px; }
          .jf-language-switch .jf-language-btn {
            min-width: 72px;
            min-height: 40px;
            padding: 8px;
            gap: 5px;
            font-size: 12px;
          }
          .jf-language-switch .jf-language-btn svg { width: 23px; height: 16px; }
        }
      `;
      document.head.append(style);
    }

    let preferred = null;
    try { preferred = localStorage.getItem('jf_portfolio_lang'); } catch (error) { /* Storage may be disabled. */ }
    let language = preferred === 'pt' ? 'pt' : 'en';

    function updateLanguage(nextLanguage) {
      language = nextLanguage;
      document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';

      document.querySelectorAll('[data-en][data-pt]').forEach(element => {
        const translation = element.getAttribute('data-' + language);
        if (translation === null) return;
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          // Translations are authored in the project's own HTML and include deliberate <em> markup.
          element.innerHTML = translation;
        }
      });

      for (const button of [ptButton, enButton]) {
        const active = button.dataset.language === language;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      }

      try { localStorage.setItem('jf_portfolio_lang', language); } catch (error) { /* Optional preference. */ }
      // Important: the interactive IDHM dashboard also listens for this event.
      document.dispatchEvent(new CustomEvent('portfolio-language', { detail: { language } }));
    }

    ptButton.addEventListener('click', () => updateLanguage('pt'));
    enButton.addEventListener('click', () => updateLanguage('en'));
    updateLanguage(language);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageSwitcher, { once: true });
  } else {
    initializeLanguageSwitcher();
  }
})();
