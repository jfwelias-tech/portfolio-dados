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
