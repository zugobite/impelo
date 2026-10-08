(async()=>{
 'use strict';
 const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
 $('#clear-saved-preferences')?.addEventListener('click',()=>{try{localStorage.removeItem('impelo-public-preferences');localStorage.removeItem('impelo-public-language')}catch{}location.reload()});
 // Guard against native form submission before any asynchronous setup.
 $('#contact-form')?.addEventListener('submit',event=>event.preventDefault());
 window.addEventListener('pagehide',()=>$('#contact-form')?.reset());
 const legacyPages={'#how':'how-it-works','#team':'about-impelo','#pricing':'pricing','#contact':'contact'};
 if(document.body.dataset.publicPage==='home'&&legacyPages[location.hash]){location.replace('/public-website/'+legacyPages[location.hash]+'/'+location.hash);return;}
 const storage={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}},remove(k){try{localStorage.removeItem(k)}catch{}}};
 let locales={},lang='en',role='patient',step=0,complete=false,billing='monthly',night=false,formHasError=false;
 let prefs={data:false,text:false,contrast:false,motion:false};
 try{const saved=JSON.parse(storage.get('impelo-public-preferences')||'{}');Object.keys(prefs).forEach(k=>prefs[k]=saved[k]===true);}catch{}
 if(!storage.get('impelo-public-preferences')&&navigator.connection?.saveData)prefs.data=true;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const text=k=>locales[lang]?.[k]??locales.en?.[k]??k;
 const translated=k=>Object.hasOwn(locales[lang]||{},k);
 const nodeText=(el,k)=>{const label=String(text(k));const arrows={'→':'arrow-right','←':'arrow-left','↑':'arrow-up','↗':'external-link'};const glyph=Object.keys(arrows).find(g=>label.includes(g));el.textContent=glyph?label.replace(glyph,'').trim():label;el.classList.toggle('icon-label',!!glyph);if(glyph)el.insertAdjacentHTML('beforeend',icon(arrows[glyph]));el.lang=translated(k)?lang:'en';};
 const icon=n=>`<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><use href="#i-${n}"/></svg>`;
 let imageObserver;
 const loadArt=el=>{
  if(prefs.data)return;
  if(el.hasAttribute('data-avatar')){
   if(!el.querySelector('img')){const i=Number(el.dataset.avatar),im=document.createElement('img');const set=el.dataset.avatarSet;im.src=set?'/assets/impelo-'+set+'-additional.png':'/assets/avatars.png';if(set)im.style.height='200%';im.alt='';im.style.left=`-${i%5*100}%`;im.style.top=`-${Math.floor(i/5)*100}%`;const frame=document.createElement('span');frame.className='avatar-window';frame.append(im);el.append(frame);}
  }else if(el.dataset.src){el.src=el.dataset.art==='hero'?(night?'/assets/clinic-night.png':'/assets/clinic-day.png'):el.dataset.src;el.hidden=false;}
 };
 const observeArt=()=>{
  imageObserver?.disconnect();
  imageObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){loadArt(entry.target);imageObserver.unobserve(entry.target);}}),{rootMargin:'80px'});
  $$('img[data-src], [data-avatar]').forEach(el=>{if(!prefs.data){el.hidden=false;imageObserver.observe(el)}});
 };
 function applyPrefs(save=false){
  document.body.classList.toggle('low-data',prefs.data);document.body.classList.toggle('large-text',prefs.text);document.body.classList.toggle('contrast',prefs.contrast);document.body.classList.toggle('reduce-motion',prefs.motion);
  Object.keys(prefs).forEach(k=>$('#pref-'+k).checked=prefs[k]);
  $$('.art-placeholder').forEach(el=>el.hidden=!prefs.data);
  if(prefs.data){$$('img[data-src]').forEach(el=>{el.hidden=true;el.removeAttribute('src')});$$('[data-avatar] .avatar-window').forEach(el=>el.remove());}
  observeArt();if(save){storage.set('impelo-public-preferences',JSON.stringify(prefs));$('#announce').textContent=text('settingsSaved');}
 }
 applyPrefs();
 try{const response=await fetch('/public-locales.json');if(!response.ok)throw Error('locale');locales=await response.json();}
 catch{const banner=$('#translation-note');banner.hidden=false;banner.textContent='Language previews could not load. The English page is available; reload to try again.';return;}
 const storedLang=storage.get('impelo-public-language');if(storedLang&&locales[storedLang])lang=storedLang;
 function renderJourney(){
  if(!$('#demo-content'))return;
  const prefix=role==='patient'?'demo':'staff';
  $('#journey-steps').innerHTML=Array.from({length:4},(_,i)=>`<li><button type="button" data-step="${i}" aria-controls="demo-content" class="journey-step${step===i?' bg-muted':''}" ${step===i?'aria-current="step"':''}><span class="number">${i+1}</span><span><strong lang="${translated(prefix+(i+1))?lang:'en'}">${esc(text(prefix+(i+1)))}</strong><small lang="${translated(prefix+(i+1)+'Desc')?lang:'en'}">${esc(text(prefix+(i+1)+'Desc'))}</small></span></button></li>`).join('');
  const titles=role==='patient'?['sampleVisit','sampleQueue','sampleStatus','sampleRecords']:['staffContext','staffStatus','staffQueue','staffHandoff'];
  const secondary=role==='patient'?['appointments','queue','queue','records']:['appointments','queue','queue','records'];
  $('#demo-content').innerHTML=`<h3 id="journey-screen-title" class="demo-heading" lang="${translated(prefix+(step+1))?lang:'en'}">${esc(text(prefix+(step+1)))}</h3><p class="demo-description" lang="${translated(prefix+(step+1)+'Desc')?lang:'en'}">${esc(text(prefix+(step+1)+'Desc'))}</p><div class="demo-summary"><span class="status" lang="${translated('preview')?lang:'en'}">${icon(complete?'circle-check':'clock-3')}${esc(text('preview'))}</span><h4 lang="${translated(titles[step])?lang:'en'}">${esc(text(titles[step]))}</h4><ul><li lang="${translated('samplePractice')?lang:'en'}">${esc(text('samplePractice'))}</li><li lang="${translated(secondary[step])?lang:'en'}">${esc(text(secondary[step]))}</li></ul></div>`;
  const count=complete?text('journeyComplete'):text('journeyStep').replace('{step}',String(step+1)).replace('{total}','4');
  $('#journey-count').textContent=count;$('#journey-count').lang=translated(complete?'journeyComplete':'journeyStep')?lang:'en';
  $('.journey-progress').setAttribute('aria-valuenow',String(step+1));$('.journey-progress').setAttribute('aria-valuetext',count);$('#journey-progress-fill').style.width=((step+1)*25)+'%';
  const offline=$('#offline-demo').checked;
  nodeText($('#connection-status'),offline?'offline':complete?'finished':'online');$('#connection-status').classList.toggle('offline',offline);
  $('#journey-back').disabled=step===0;
  $('#journey-next').disabled=offline;
  nodeText($('#journey-next'),complete?'restart':step===3?'finish':'next');
  $$('[data-role]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.role===role)));
 }
 function renderBilling(){
  const note=$('#billing-note');if(!note)return;
  if(!$('.pricing-packages')){nodeText(note,billing==='annual'?'annualNote':'monthlyNote');return;}
  const annual=billing==='annual';
  const money=cents=>'R'+(cents/100).toLocaleString('en-ZA',{minimumFractionDigits:cents%100?2:0,maximumFractionDigits:2});
  $$('[data-plan-amount]').forEach(el=>{const base=Number(el.dataset.monthlyCents),amount=annual?Math.round(base*.9):base;el.textContent=money(amount);el.closest('.package-plan').querySelector('[data-plan-total]').textContent=money(annual?amount*12:amount)+(annual?' Billed Yearly':' Billed Monthly');});
  $$('[data-comparison-amount]').forEach(el=>{const base=Number(el.dataset.monthlyCents);el.textContent=money(annual?Math.round(base*.9):base)+(annual?' / month, billed yearly':' / month');});
  $$('[data-comparison-enquiry]').forEach(link=>{const url=new URL(link.href);url.searchParams.set('billing',billing);link.href=url.pathname+url.search;});
  $$('.package-plan a[href]').forEach(link=>{const url=new URL(link.href);url.searchParams.set('billing',billing);link.href=url.pathname+url.search;});
  note.textContent=annual?'Annual example: 10% less than 12 monthly payments. Monthly equivalents shown; the full yearly total would be paid upfront. No payment is taken.':'Monthly example: the displayed amount would be billed each month. No payment is taken.';note.lang='en';
 }
 function renderLang(save=false){
  document.documentElement.lang=lang;$('#language').value=lang;$('#footer-language').value=lang;
  $$('[data-t]').forEach(el=>nodeText(el,el.dataset.t));
  $('#translation-note').hidden=lang==='en';
  $('#language').setAttribute('aria-label',text('language'));$('#footer-language').setAttribute('aria-label',text('language'));
  $$('[data-slot=checkbox]').forEach(el=>{const label=document.querySelector(`label[for="${el.id}"]`);if(label)el.setAttribute('aria-label',label.textContent.trim());});
  $('#main-nav').setAttribute('aria-label',text('menu'));
  $('.journey-tabs')?.setAttribute('aria-label',text('how'));
  $('.billing-picker')?.setAttribute('aria-label',text('pricing'));
  $('.app-demo')?.setAttribute('aria-label',text('demo'));

  $$('img[data-src]').forEach(el=>el.lang='en');
  $('.access-button').setAttribute('aria-label',text('preferences'));
  $$('.close-dialog').forEach(b=>b.setAttribute('aria-label',text('close')));
  if($('#scene-toggle span'))nodeText($('#scene-toggle span'),night?'day':'night');
  renderBilling();
  if(formHasError)nodeText($('#form-error'),'formError');
  renderJourney();
  if(save){storage.set('impelo-public-language',lang);$('#announce').textContent=`${text('changed')}: ${$('#language').selectedOptions[0].textContent}`;}
 }
 $('#language').addEventListener('change',e=>{lang=e.target.value;renderLang(true)});$('#footer-language').addEventListener('change',e=>{lang=e.target.value;renderLang(true)});
 const menu=$('.menu-toggle');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));$('#main-nav').classList.toggle('open',open)});
 $('#main-nav').addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');$('#main-nav').classList.remove('open')}});
 let dialogOpener;
 $$('[data-open]').forEach(b=>b.addEventListener('click',()=>{dialogOpener=b;$('#'+b.dataset.open).showModal()}));
 $$('dialog').forEach(d=>{d.addEventListener('close',()=>dialogOpener?.focus({preventScroll:true}));d.querySelector('[data-close]').addEventListener('click',()=>d.close());});
 Object.keys(prefs).forEach(k=>$('#pref-'+k).addEventListener('change',e=>{prefs[k]=e.target.checked;applyPrefs(true)}));
 $('#restore-prefs').addEventListener('click',()=>{prefs={data:false,text:false,contrast:false,motion:false};applyPrefs(true)});
 $('#scene-toggle')?.addEventListener('click',()=>{night=!night;$('#scene-toggle').setAttribute('aria-pressed',String(night));if($('#scene-toggle span'))nodeText($('#scene-toggle span'),night?'day':'night');if(!prefs.data)loadArt($('[data-art="hero"]'));});
 $$('[data-role]').forEach(b=>b.addEventListener('click',()=>{role=b.dataset.role;step=0;complete=false;renderJourney()}));
 $('#journey-steps')?.addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b){step=Number(b.dataset.step);complete=false;renderJourney();}});
 $('#journey-next')?.addEventListener('click',()=>{if($('#offline-demo').checked)return;if(complete){step=0;complete=false}else if(step<3)step++;else complete=true;renderJourney();$('#announce').textContent=complete?text('finished'):text((role==='patient'?'demo':'staff')+(step+1));});
 $('#journey-back')?.addEventListener('click',()=>{if(step>0)step--;complete=false;renderJourney()});
 $('#reset-journey')?.addEventListener('click',()=>{step=0;complete=false;$('#offline-demo').checked=false;renderJourney()});
 $('#offline-demo')?.addEventListener('change',renderJourney);
 $$('[data-journey-jump]').forEach(a=>a.addEventListener('click',()=>{role=a.dataset.journeyJump;step=0;complete=false;renderJourney()}));
 $$('[data-billing]').forEach(b=>b.addEventListener('click',()=>{billing=b.dataset.billing;$$('[data-billing]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.billing===billing)));renderBilling()}));
 $$('[data-enquiry]').forEach(a=>a.addEventListener('click',()=>{if(!$('#contact-form'))return;$('#contact-topic').value=a.dataset.enquiry;if($('#contact-form').hidden)resetForm();$('#contact-topic').value=a.dataset.enquiry;$('#contact-topic').focus({preventScroll:true})}));
 function resetForm(){$('#contact-form').reset();$('#contact-form').hidden=false;$('#contact-success').hidden=true;$('#form-error').hidden=true;formHasError=false;$$('#contact-form [aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));}
 $('#contact-form')?.addEventListener('submit',e=>{
  e.preventDefault();const form=e.currentTarget;const name=form.elements.name,email=form.elements.email,message=form.elements.message,consent=document.querySelector('[data-consent]');
  const invalid=[name,email,message,consent].filter(el=>!el.checkValidity()||((el===name||el===message)&&el.value.trim().length<(el===message?10:1)));
  [name,email,message,consent].forEach(el=>el.setAttribute('aria-invalid',String(invalid.includes(el))));
  if(invalid.length){formHasError=true;nodeText($('#form-error'),'formError');$('#form-error').hidden=false;invalid[0].focus();return;}
  formHasError=false;$('#form-error').hidden=true;form.hidden=true;$('#contact-success').hidden=false;
  const ref='DEMO-'+Date.now().toString(36).toUpperCase();$('#demo-receipt').textContent=`${text('receipt')}: ${ref}`;$('#demo-receipt').lang=translated('receipt')?lang:'en';
  // No request is sent and no form value is persisted. Clear all fields once the demo completes.
  form.reset();$('#contact-success h3').setAttribute('tabindex','-1');$('#contact-success h3').focus({preventScroll:true});
 });
 $('#new-enquiry')?.addEventListener('click',()=>{resetForm();$('#contact-name').focus()});
 if($('#contact-form'))$('#contact-form button[type="submit"]').disabled=false;
 $('#language').disabled=false;
 const query=new URLSearchParams(location.search);
 const planNames={essentials:'Practice Essentials',team:'Practice Team',network:'Clinic Network'};const selectedPlan=Object.hasOwn(planNames,query.get('plan'))?planNames[query.get('plan')]:null;if(selectedPlan&&$('#contact-plan-context')){$('#contact-plan-context').textContent='Exploring '+selectedPlan+' · '+(query.get('billing')==='annual'?'Annual':'Monthly')+' Example Pricing. This is a demo enquiry, not a subscription.';$('#contact-plan-context').hidden=false;}
 if(query.get('journey')==='clinic')role='clinic';
 if($('#contact-topic')&&Array.from($('#contact-topic').options).some(o=>o.value===query.get('topic')))$('#contact-topic').value=query.get('topic');
 document.body.dataset.publicReady='true';
 renderLang();
 // Restore direct section links after component enhancement and language setup.
 if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start',behavior:'instant'}));
})();
