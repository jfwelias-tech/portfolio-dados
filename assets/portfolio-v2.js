(()=>{
  const STORE='jf_portfolio_lang';
  let lang='pt';
  try {const stored=localStorage.getItem(STORE);if(stored==='pt'||stored==='en')lang=stored;}catch(e){}
  const filters=[...document.querySelectorAll('[data-filter]')];
  const cards=[...document.querySelectorAll('[data-project-card]')];
  const empty=document.getElementById('skill-filter-empty');
  const count=document.getElementById('filter-count');
  let active='all';
  function updateTranslation(){
    document.documentElement.lang=lang==='pt'?'pt-BR':'en';
    document.querySelectorAll('[data-pt][data-en]').forEach(el=>{el.innerHTML=el.getAttribute('data-'+lang);});
    document.querySelectorAll('[data-set-language]').forEach(b=>{const chosen=b.dataset.setLanguage===lang;b.classList.toggle('is-current',chosen);b.setAttribute('aria-pressed',String(chosen));});
    document.title=lang==='pt'?'João Felipe | Análise de Dados & BI':'João Felipe | Data Analytics & BI';
    updateFilters(active);
  }
  function updateFilters(skill){
    active=skill;
    let n=0;
    cards.forEach(card=>{const visible=skill==='all'||(card.dataset.skills||'').split(/\s+/).includes(skill);card.hidden=!visible;if(visible)n++;});
    filters.forEach(b=>{const isActive=b.dataset.filter===skill;b.classList.toggle('is-active',isActive);b.setAttribute('aria-pressed',String(isActive));});
    if(empty)empty.hidden=n!==0;
    if(count)count.textContent=lang==='pt'?`${n} ${n===1?'projeto':'projetos'}`:`${n} ${n===1?'project':'projects'}`;
  }
  document.addEventListener('click',e=>{
    const language=e.target.closest('[data-set-language]');
    if(language){lang=language.dataset.setLanguage;try{localStorage.setItem(STORE,lang);}catch(e){}updateTranslation();return;}
    const filter=e.target.closest('[data-filter]');if(filter){updateFilters(filter.dataset.filter);return;}
    const tag=e.target.closest('[data-tag-skill]');if(tag){updateFilters(tag.dataset.tagSkill);document.getElementById('project-skill-filters')?.scrollIntoView({behavior:'smooth',block:'center'});return;}
    if(e.target.closest('[data-reset-filter]'))updateFilters('all');
  });
  const q=new URLSearchParams(location.search).get('skill');
  if(q&&filters.some(b=>b.dataset.filter===q))active=q;
  updateTranslation();
})();
