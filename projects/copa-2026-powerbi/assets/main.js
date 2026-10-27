// Site language toggle. Original analysis values always remain unchanged.
(()=>{
 const btn=document.getElementById('language-toggle');
 if(!btn)return;
 let preferred=null; try{preferred=localStorage.getItem('jf_portfolio_lang');}catch(e){}
 let language=preferred==='pt'?'pt':'en';
 function update(){
   document.documentElement.lang=language==='pt'?'pt-BR':'en';
   document.querySelectorAll('[data-en][data-pt]').forEach(el=>{
      const value=el.getAttribute('data-'+language);
      if(el.tagName==='INPUT') el.placeholder=value;
      else el.innerHTML=value;
   });
   btn.textContent=language==='en'?'PT':'EN';
   btn.setAttribute('aria-label',language==='en'?'Switch to Portuguese':'Mudar para inglês');
   document.dispatchEvent(new CustomEvent('portfolio-language',{detail:{language}}));
 }
 btn.addEventListener('click',()=>{language=language==='en'?'pt':'en';try{localStorage.setItem('jf_portfolio_lang',language);}catch(e){}update();});
 update();
})();

// Project skills: filters AND project-card tags are accessible buttons.
(()=>{
  const panel=document.getElementById('project-skill-filters');
  if(!panel)return;
  const buttons=[...panel.querySelectorAll('[data-filter]')];
  const cards=[...document.querySelectorAll('[data-project-card]')];
  const empty=document.getElementById('skill-filter-empty');
  const count=document.getElementById('filter-count');
  let active='all';
  const language=()=>document.documentElement.lang.toLowerCase().startsWith('pt')?'pt':'en';
  function apply(skill){
    active=skill;
    let visible=0;
    cards.forEach(card=>{
      const tags=(card.dataset.skills||'').split(/\s+/);
      const show=skill==='all'||tags.includes(skill);
      card.hidden=!show;
      if(show) visible++;
    });
    buttons.forEach(btn=>{
      const on=btn.dataset.filter===skill;
      btn.classList.toggle('is-active',on);
      btn.setAttribute('aria-pressed',String(on));
    });
    empty.hidden=visible!==0;
    count.textContent=language()==='pt'?`${visible} ${visible===1?'projeto':'projetos'}`:`${visible} ${visible===1?'project':'projects'}`;
  }
  panel.addEventListener('click',e=>{const btn=e.target.closest('[data-filter]');if(btn)apply(btn.dataset.filter);});
  document.querySelectorAll('[data-tag-skill]').forEach(tag=>tag.addEventListener('click',()=>{
    apply(tag.dataset.tagSkill);
    panel.scrollIntoView({behavior:'smooth',block:'center'});
  }));
  document.addEventListener('portfolio-language',()=>apply(active));
  apply(active);
})();
