/**
 * João Felipe — cabeçalho verdadeiramente único para todo o portfólio.
 * v13: mesma estrutura, mesmos estilos e mesma lógica PT/EN nas três páginas.
 * O Shadow DOM isola os estilos dos CSS independentes do IDHM e da Copa.
 * Não modifica o conteúdo nem os scripts dos dashboards.
 */
(() => {
  'use strict';
  const scriptURL = document.currentScript?.src;
  if (!scriptURL) return;
  const siteRoot = new URL('../', scriptURL);
  const url = path => new URL(path, siteRoot).href;
  const STORAGE = 'jf_portfolio_lang';
  const brazil = `<svg viewBox="0 0 60 40" aria-hidden="true" focusable="false"><rect width="60" height="40" rx="2" fill="#169447"/><path d="M30 3 57 20 30 37 3 20Z" fill="#FFDB33"/><circle cx="30" cy="20" r="10" fill="#233B88"/><path d="M20 20 Q30 15 40 22" fill="none" stroke="#fff" stroke-width="2"/></svg>`;
  const uk = `<svg viewBox="0 0 60 40" aria-hidden="true" focusable="false"><rect width="60" height="40" rx="2" fill="#17366C"/><path d="M0 0 60 40 M60 0 0 40" stroke="#fff" stroke-width="9"/><path d="M0 0 60 40 M60 0 0 40" stroke="#CA2942" stroke-width="4"/><path d="M30 0V40 M0 20H60" stroke="#fff" stroke-width="12"/><path d="M30 0V40 M0 20H60" stroke="#CA2942" stroke-width="6"/></svg>`;

  const css = `
    :host{display:block;position:relative;z-index:60;width:100%;font:600 14px/1.4 'DM Sans',system-ui,-apple-system,'Segoe UI',Arial,sans-serif;color:#fff}
    *,*::before,*::after{box-sizing:border-box}
    .bar{background:#0c1824;border-bottom:1px solid #263846;width:100%}
    .inner{min-height:113px;padding:17px 0;max-width:1740px;width:calc(100% - 76px);margin:0 auto;display:flex;align-items:center;gap:26px}
    .brand{display:flex;gap:15px;align-items:center;flex:0 0 auto;text-decoration:none;color:#fff;white-space:nowrap}
    .brand-mark{font:800 34px/1 'Manrope',system-ui,sans-serif;letter-spacing:-.10em;color:#fff}
    .brand-mark b{color:#8de1c4}
    .brand-copy{display:flex;flex-direction:column;gap:3px;font:800 15px/1.25 'Manrope',system-ui,sans-serif;letter-spacing:.095em;color:#fff}
    .brand-copy small{font:600 11px/1.3 'DM Sans',system-ui,sans-serif;letter-spacing:.19em;color:#93acb4}
    .links{display:flex;gap:clamp(16px,2.1vw,37px);align-items:center;margin-left:auto;white-space:nowrap}
    .links a{font:700 15px/1.4 'DM Sans',system-ui,sans-serif;color:#d5dfe5;text-decoration:none;transition:color .15s ease}
    .links a:hover{color:#9fe7d0}.links a.github{color:#fff}
    .languages{display:inline-flex;align-items:center;gap:3px;border:1px solid #485e6a;border-radius:100px;padding:4px;margin-left:17px;flex:0 0 auto}
    .lang{display:inline-flex;align-items:center;gap:8px;justify-content:center;border:0;border-radius:100px;padding:9px 11px;background:transparent;color:#d5dfe5;font:800 13px/1 'DM Sans',system-ui,sans-serif;cursor:pointer;transition:background .15s ease,color .15s ease}
    .lang[aria-pressed="true"]{background:#dff9ee;color:#0b3029}
    .lang:hover:not([aria-pressed="true"]){background:#1a3040}
    .lang svg{width:25px;height:17px;flex:none;border-radius:2px}
    a:focus-visible,button:focus-visible{outline:3px solid #8de1c4;outline-offset:3px}
    @media(max-width:1200px){
      .inner{flex-wrap:wrap;gap:7px 18px;padding:15px 0}
      .brand{margin-right:auto}.languages{margin-left:auto}
      .links{order:3;margin:0;width:100%;justify-content:flex-start;overflow-x:auto;padding:9px 0 4px;gap:24px;scrollbar-width:thin}
    }
    @media(max-width:650px){
      .inner{width:calc(100% - 32px);min-height:87px}
      .brand{gap:8px}.brand-mark{font-size:27px}
      .brand-copy{font-size:11px}.brand-copy small{font-size:8px;letter-spacing:.12em}
      .links{gap:18px}.links a{font-size:12px}
      .languages{margin-left:0;padding:3px}.lang{padding:7px 8px;font-size:11px;gap:5px}.lang svg{width:20px;height:14px}
    }
    @media(max-width:390px){.brand-copy small{max-width:113px;white-space:normal;line-height:1.4}.lang{padding:6px}.lang svg{width:18px}}
  `;

  function init() {
    // Somente o cabeçalho GLOBAL é substituído, não o submenu específico do projeto.
    const prior = document.querySelector('header.site-nav, header.idhm-global-header, header.header');
    if (!prior) { console.warn('[Portfolio v13] Cabeçalho existente não encontrado.'); return; }
    if (document.querySelector('jf-global-header')) return;
    const host = document.createElement('jf-global-header');
    host.id = 'jf-global-header';
    const shadow = host.attachShadow({mode:'open'});
    shadow.innerHTML = `<style>${css}</style>
      <header class="bar" aria-label="Cabeçalho global do portfólio">
        <div class="inner">
          <a class="brand" href="${url('index.html')}" aria-label="João Felipe — página inicial">
            <span class="brand-mark">JF<b>.</b></span>
            <span class="brand-copy">JOÃO FELIPE<small>DATA &amp; BUSINESS INTELLIGENCE</small></span>
          </a>
          <nav class="links" aria-label="Navegação principal">
            <a data-nav="projects" href="${url('index.html#projects')}"></a>
            <a data-nav="about" href="${url('index.html#about')}"></a>
            <a data-nav="skills" href="${url('index.html#skills')}"></a>
            <a data-nav="contact" href="${url('index.html#contact')}"></a>
            <a data-nav="cv" href="${url('assets/CV_Joao_Felipe_PT.pdf')}" download="CV_Joao_Felipe_PT.pdf"></a>
            <a class="github" href="https://github.com/jfwelias-tech/portfolio-dados" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </nav>
          <div class="languages" role="group" aria-label="Selecionar idioma / Choose language">
            <button class="lang" type="button" data-lang="pt" aria-label="Português (Brasil)" aria-pressed="true">${brazil}<span>PT</span></button>
            <button class="lang" type="button" data-lang="en" aria-label="English (United Kingdom)" aria-pressed="false">${uk}<span>EN</span></button>
          </div>
        </div>
      </header>`;
    prior.replaceWith(host);

    // Os controles de idioma antigos estão fora do cabeçalho e os JS de projetos
    // existentes recebem o clique nesses proxies para manter seus filtros sincronizados.
    const proxy = document.createElement('div');
    proxy.hidden = true;
    proxy.setAttribute('aria-hidden','true');
    proxy.innerHTML = `<button data-set-language="pt" type="button" tabindex="-1"></button><button data-set-language="en" type="button" tabindex="-1"></button>`;
    document.body.append(proxy);
    const buttons = [...shadow.querySelectorAll('.lang')];
    const nav = Object.fromEntries([...shadow.querySelectorAll('[data-nav]')].map(el => [el.dataset.nav,el]));
    const dictionary = {
      pt: {projects:'Projetos',about:'Sobre',skills:'Competências',contact:'Contato',cv:'Currículo ↓',file:'CV_Joao_Felipe_PT.pdf'},
      en: {projects:'Projects',about:'About',skills:'Skills',contact:'Contact',cv:'Résumé ↓',file:'CV_Joao_Felipe_EN.pdf'}
    };
    let lang = 'pt';
    try {if(localStorage.getItem(STORAGE)==='en') lang='en';} catch(_){}

    function paintLanguage(language, notify) {
      lang = language === 'en' ? 'en' : 'pt';
      document.documentElement.lang = lang==='pt'?'pt-BR':'en';
      const dict = dictionary[lang];
      for (const [key,value] of Object.entries(dict)) {
        if (key==='file') continue;
        nav[key].textContent = value;
      }
      nav.cv.href = url('assets/'+dict.file);
      nav.cv.download = dict.file;
      for (const btn of buttons) btn.setAttribute('aria-pressed',String(btn.dataset.lang===lang));
      document.querySelectorAll('[data-pt][data-en]').forEach(el => {
        const value=el.getAttribute('data-'+lang);
        if (value == null) return;
        if (el.tagName==='INPUT'||el.tagName==='TEXTAREA')el.placeholder=value;
        else el.innerHTML=value;
      });
      try {localStorage.setItem(STORAGE,lang);}catch(_){}
      if (notify) {
        // Compatível com o dashboard IDHM e o script dos currículos.
        document.dispatchEvent(new CustomEvent('portfolio-language',{detail:{language:lang}}));
        // Mantém o estado interno do filtro de skills da home e da página Copa.
        proxy.querySelector(`[data-set-language="${lang}"]`).click();
      }
    }
    buttons.forEach(btn=>btn.addEventListener('click',()=>paintLanguage(btn.dataset.lang,true)));
    paintLanguage(lang,false);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
