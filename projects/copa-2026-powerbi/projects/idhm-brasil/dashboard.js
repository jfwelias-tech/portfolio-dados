// Lightweight client-side visualizations; run the pandas script to regenerate the JSON.
(()=>{
 const $=id=>document.getElementById(id);
 const NS='http://www.w3.org/2000/svg';
 const colors={IDHM:'#12a98f',IDHM_E:'#6877d9',IDHM_R:'#e6ad57',IDHM_L:'#5e9ec8'};
 const labels={en:{IDHM:'Overall IDHM',IDHM_E:'Education',IDHM_R:'Income',IDHM_L:'Longevity'},pt:{IDHM:'IDHM geral',IDHM_E:'Educação',IDHM_R:'Renda',IDHM_L:'Longevidade'}};
 const names={en:{all:'All states',top:'Highest first',bottom:'Lowest first',change:'Change 1991 → 2010',ranking:'Municipal ranking',found:'municipalities',shown:'Top 12 shown',empty:'No municipalities match the selected filters.',error:'Could not load the dataset. Open this site through GitHub Pages or a local HTTP server (not file://).'},pt:{all:'Todos os estados',top:'Maiores primeiro',bottom:'Menores primeiro',change:'Variação 1991 → 2010',ranking:'Ranking municipal',found:'municípios',shown:'12 primeiros exibidos',empty:'Nenhum município encontrado para esses filtros.',error:'Não foi possível carregar os dados. Abra o site pelo GitHub Pages ou por um servidor HTTP local (não file://).'}};
 const fmt=(num,n=3)=>Number(num).toFixed(n).replace('.',',');
 let D=null; let language=document.documentElement.lang.startsWith('pt')?'pt':'en';
 function svgNode(tag,attrs,text){const node=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs||{}))node.setAttribute(k,String(v));if(text!==undefined)node.textContent=text;return node;}
 function chart(){
  const svg=$('trends-chart'); if(!svg||!D)return; svg.innerHTML='';
  const l=50,r=20,t=20,b=42,w=680,h=285;
  const yy=v=>t+(1-v)*(h-t-b),xx=i=>l+i*(w-l-r)/2;
  [0,.2,.4,.6,.8,1].forEach(v=>{svg.appendChild(svgNode('line',{x1:l,x2:w-r,y1:yy(v),y2:yy(v),stroke:'#dbe3e9','stroke-width':1}));svg.appendChild(svgNode('text',{x:3,y:yy(v)+4,fill:'#667684','font-size':'13'},v.toFixed(1)));});
  D.years.forEach((year,i)=>svg.appendChild(svgNode('text',{x:xx(i),y:h-13,fill:'#637888','font-size':'14','text-anchor':'middle'},year)));
  ['IDHM','IDHM_E','IDHM_R','IDHM_L'].forEach(metric=>{
    const pts=D.means_unweighted[metric].map((value,i)=>`${xx(i)},${yy(value)}`).join(' ');
    svg.appendChild(svgNode('polyline',{points:pts,stroke:colors[metric],'stroke-width':4,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'}));
    D.means_unweighted[metric].forEach((value,i)=>{const circle=svgNode('circle',{cx:xx(i),cy:yy(value),r:5.8,fill:colors[metric],stroke:'#fff','stroke-width':2});circle.appendChild(svgNode('title',{},`${labels[language][metric]} · ${D.years[i]}: ${fmt(value)}`));svg.appendChild(circle);});
  });
 }
 function bars(){
  const parent=$('dimensions-bars');if(!parent||!D)return;parent.innerHTML='';
  const metrics=['IDHM_E','IDHM_L','IDHM_R'];
  metrics.forEach(m=>{
    const diff=D.means_unweighted[m][2]-D.means_unweighted[m][0];
    const container=document.createElement('div');container.className='dim-row';
    const head=document.createElement('div');head.className='dim-head';
    const name=document.createElement('strong');name.textContent=labels[language][m];
    const value=document.createElement('span');value.textContent='+'+fmt(diff);
    head.append(name,value);
    const rail=document.createElement('div');rail.className='dim-rail';
    const fill=document.createElement('div');fill.className='dim-fill';fill.style.width=(diff/.5*100)+'%';fill.style.background=colors[m];rail.append(fill);
    container.append(head,rail);parent.append(container);
  });
 }
 function rank(){
  if(!D)return;
  const metric=$('metric-filter').value,year=$('year-filter').value,state=$('state-filter').value,order=$('order-filter').value;
  const idx={'1991':0,'2000':1,'2010':2};
  const rows=D.municipalities.filter(m=>state==='ALL'||m.state===state);
  const valueOf=m=>year==='delta'?(m[metric][2]-m[metric][0]):m[metric][idx[year]];
  rows.sort((a,b)=> (order==='top'?1:-1)*(valueOf(b)-valueOf(a)) || a.name.localeCompare(b.name,'pt'));
  $('ranking-title').textContent=(language==='pt'?(year==='delta'?'Variação municipal':'Ranking municipal'):(year==='delta'?'Absolute municipal change':'Municipal ranking'))+' · '+labels[language][metric]+' · '+(year==='delta'?'1991–2010':year);
  $('ranking-subtitle').textContent=names[language].shown;
  $('n-filtered').textContent=rows.length.toLocaleString(language==='pt'?'pt-BR':'en-US')+' '+names[language].found;
  const root=$('rank-list');root.innerHTML='';
  if(!rows.length){root.textContent=names[language].empty;return;}
  rows.slice(0,12).forEach((m,i)=>{
    const v=valueOf(m);
    const row=document.createElement('div');row.className='rank-item';
    const rank=document.createElement('span');rank.className='rank-pos';rank.textContent=String(i+1).padStart(2,'0');
    const label=document.createElement('div');label.className='rank-name';label.textContent=m.name+' ';const uf=document.createElement('span');uf.className='rank-uf';uf.textContent=m.state;label.append(uf);
    const progress=document.createElement('div');progress.className='rank-track';const fill=document.createElement('span');fill.className='rank-progress';fill.style.width=Math.max(0,Math.min(100,(v/(year==='delta'?.5:1))*100))+'%';progress.append(fill);
    const value=document.createElement('strong');value.className='rank-value';value.textContent=(year==='delta'&&v>=0?'+':'')+fmt(v);
    row.append(rank,label,progress,value);root.append(row);
  });
 }
 function init(Dataset){D=Dataset;
   $('metric-start').textContent=D.means_unweighted.IDHM[0].toFixed(3);
   $('metric-end').textContent=D.means_unweighted.IDHM[2].toFixed(3);
   $('overall-delta').textContent='+'+(D.means_unweighted.IDHM[2]-D.means_unweighted.IDHM[0]).toFixed(3);
   $('education-delta').textContent='+'+(D.means_unweighted.IDHM_E[2]-D.means_unweighted.IDHM_E[0]).toFixed(3);
   [...new Set(D.municipalities.map(m=>m.state))].sort().forEach(uf=>{const o=document.createElement('option');o.value=uf;o.textContent=uf;$('state-filter').append(o)});
   ['metric-filter','year-filter','state-filter','order-filter'].forEach(id=>$(id).addEventListener('change',rank));
   refresh();
 }
 function refresh(){if(!D)return;
   $('state-filter').options[0].textContent=names[language].all;
   $('order-filter').options[0].textContent=names[language].top;
   $('order-filter').options[1].textContent=names[language].bottom;
   $('year-filter').options[3].textContent=names[language].change;
   chart();bars();rank();
 }
 document.addEventListener('portfolio-language',e=>{language=e.detail.language;refresh()});
 fetch('data/idhm_dashboard.json').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(init).catch(err=>{$('rank-list').innerHTML='';const p=document.createElement('p');p.className='error-message';p.textContent=names[language].error;$('rank-list').append(p);console.error(err)});
})();
