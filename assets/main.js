(()=>{
  const ptBtn = document.getElementById('lang-pt');
  const enBtn = document.getElementById('lang-en');

  if(!ptBtn || !enBtn) return;

  let preferred = null;
  try {
    preferred = localStorage.getItem('jf_portfolio_lang');
  } catch(e) {}

  let language = preferred === 'pt' ? 'pt' : 'en';

  function update(){
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-en][data-pt]').forEach(el => {
      const value = el.getAttribute('data-' + language);
      if (el.tagName === 'INPUT') {
        el.placeholder = value;
      } else {
        el.innerHTML = value;
      }
    });

    ptBtn.classList.toggle('is-active', language === 'pt');
    enBtn.classList.toggle('is-active', language === 'en');

    ptBtn.setAttribute('aria-pressed', language === 'pt' ? 'true' : 'false');
    enBtn.setAttribute('aria-pressed', language === 'en' ? 'true' : 'false');

    try {
      localStorage.setItem('jf_portfolio_lang', language);
    } catch(e) {}
  }

  ptBtn.addEventListener('click', () => {
    language = 'pt';
    update();
  });

  enBtn.addEventListener('click', () => {
    language = 'en';
    update();
  });

  update();
})();