(async()=>{
 'use strict';
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const logoStrip=$('#clinic-community'),logoMotion=$('#toggle-logo-motion');
 logoMotion?.addEventListener('click',()=>{const paused=logoStrip.classList.toggle('is-paused');logoMotion.setAttribute('aria-pressed',String(paused));logoMotion.textContent=paused?'Resume Logos':'Pause Logos';});
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const icon=n=>`<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><use href="#i-${n}"/></svg>`;
 const services={general:'General Care',family:'Family Care',wellness:'Wellness Visits'};
 const careBadge=s=>`<span><img class="care-icon" data-care-src="/assets/care-${s}.png" ${document.body.classList.contains('low-data')?'':`src="/assets/care-${s}.png"`} loading="lazy" width="36" height="36" alt="" aria-hidden="true">${services[s]}</span>`;
 function syncCareArt(){document.querySelectorAll('img[data-care-src]').forEach(img=>{if(document.body.classList.contains('low-data'))img.removeAttribute('src');else img.src=img.dataset.careSrc;});}
 syncCareArt();
 new MutationObserver(syncCareArt).observe(document.body,{attributes:true,attributeFilter:['class']});
 const normalize=s=>s.trim().toLocaleLowerCase('en-ZA').replace(/[^a-z0-9]+/g,' ');
 const distance=(a,b)=>{const r=Math.PI/180,dLat=(b.lat-a.lat)*r,dLng=(b.lng-a.lng)*r;return 6371*2*Math.atan2(Math.sqrt(Math.sin(dLat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dLng/2)**2),Math.sqrt(1-(Math.sin(dLat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dLng/2)**2)));};
 if($('#clinic-search-form')){
  let clinics=[],origin=null,locationRequest=0,opener;
  const form=$('#clinic-search-form'),query=$('#clinic-query'),service=$('#clinic-service'),status=$('#clinic-status'),results=$('#clinic-results');
  form.addEventListener('submit',e=>{e.preventDefault();locationRequest++;origin=null;render()});
  function render(){
   const term=normalize(query.value),type=service.value;
   const matches=clinics.filter(c=>(!term||normalize([c.name,c.city,c.suburb,c.postcode].join(' ')).includes(term))&&(type==='all'||c.services.includes(type))).sort((a,b)=>origin?distance(origin,a)-distance(origin,b):0);
   results.innerHTML=matches.map(c=>`<article class="clinic-card"><span class="clinic-city">${icon('map-pin')}${esc(c.suburb)}, ${esc(c.city)}</span><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><div class="clinic-services">${c.services.map(careBadge).join('')}</div><p class="clinic-languages">${esc(c.languages)}</p>${origin?`<span class="clinic-distance">About ${distance(origin,c).toFixed(1)} km Away · Sample Location</span>`:''}<button type="button" class="outline" data-clinic="${c.id}">View Clinic Preview</button></article>`).join('');
   $('#clinic-empty').hidden=matches.length>0;
   status.textContent=`${matches.length} Sample ${matches.length===1?'Clinic':'Clinics'}${origin?' Sorted By Distance':term?' Matching Your Search':''}`;
  }
  service.addEventListener('change',()=>{locationRequest++;origin=null;render()});
  $('#reset-clinics').addEventListener('click',()=>{locationRequest++;origin=null;query.value='';service.value='all';render();query.focus({preventScroll:true})});
  $('#use-location').addEventListener('click',()=>{
   if(!navigator.geolocation){status.textContent='Location Is Unavailable In This Browser. Search A City Or Suburb Instead.';return;}
   const request=++locationRequest;status.textContent='Requesting Your Location. You Can Also Search A City Or Suburb.';
   navigator.geolocation.getCurrentPosition(position=>{
    if(request!==locationRequest)return;
    origin={lat:position.coords.latitude,lng:position.coords.longitude};query.value='';render();
   },()=>{if(request===locationRequest)status.textContent='Location Access Was Unavailable. Search A City, Suburb Or Postcode Instead.';},{enableHighAccuracy:false,timeout:8000,maximumAge:0});
  });
  results.addEventListener('click',e=>{
   const b=e.target.closest('[data-clinic]');if(!b)return;
   const c=clinics.find(c=>c.id===b.dataset.clinic);if(!c)return;
   opener=b;
   $('#clinic-detail').innerHTML=`<h3>${esc(c.name)}</h3><p>${esc(c.suburb)}, ${esc(c.city)} · ${esc(c.postcode)}</p><p>${esc(c.description)}</p><dl><dt>Example Services</dt><dd class="clinic-services">${c.services.map(careBadge).join('')}</dd><dt>Example Language Support</dt><dd>${esc(c.languages)}</dd></dl><p class="small-note">Fictional Practice · No Live Hours, Appointments Or Provider Relationship</p>`;
   $('#clinic-dialog').showModal();
  });
  $('#clinic-dialog').addEventListener('close',()=>opener?.focus({preventScroll:true}));
  try{const response=await fetch('/clinic-demo.json');if(!response.ok)throw Error();clinics=await response.json();render();}
  catch{status.textContent='The Sample Directory Could Not Load. Reload To Try Again.';form.querySelector('button[type=submit]').disabled=true;$('#use-location').disabled=true;}
 }
 if($('#hq-map')){
  let locations,selected='cape-town',visible=false,explicit=false,loadId=0;
  const frame=$('#hq-map'),placeholder=$('#map-placeholder'),message=$('#map-message'),marker=$('#hq-demo-marker'),pin=$('#hq-pin');
  function positionMarker(){if(frame.hidden||!frame.naturalWidth){marker.hidden=true;return}const box=frame.parentElement.getBoundingClientRect(),scale=Math.max(box.width/frame.naturalWidth,box.height/frame.naturalHeight),anchor=locations[selected].anchor;marker.style.left=((box.width-frame.naturalWidth*scale)/2+anchor[0]*frame.naturalWidth*scale)+'px';marker.style.top=((box.height-frame.naturalHeight*scale)/2+anchor[1]*frame.naturalHeight*scale)+'px';marker.hidden=false;}
  new ResizeObserver(positionMarker).observe(frame.parentElement);
  frame.hidden=true;
  try{const response=await fetch('/headquarters-maps.json');if(!response.ok)throw Error();locations=await response.json();}catch{message.textContent='The Map Could Not Load. Use The Google Maps Link Below.';$('#load-map').hidden=true;return;}
  function render(){
   const city=locations[selected],lowData=document.body.classList.contains('low-data');
   $('#map-city-title').textContent=city.name;$('#hq-city-label').textContent=city.name+' · '+city.province;$('#hq-map-link').href=city.link;
   $$('[data-location]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.location===selected)));
   frame.alt=city.alt;$('#hq-demo-address').textContent=city.address;
   if(lowData&&!explicit){loadId++;marker.hidden=true;pin.removeAttribute('src');frame.removeAttribute('src');frame.hidden=true;placeholder.hidden=false;message.textContent='The Map Is Paused In Low-Data View. Load It When You Are Ready.';return;}
   if(!visible&&!explicit)return;
   if(frame.getAttribute('src')===city.asset)return;
   const current=++loadId;placeholder.hidden=false;message.textContent='Loading The City Map.';
   frame.onload=()=>{if(current===loadId&&frame.getAttribute('src')===city.asset){placeholder.hidden=true;frame.hidden=false;pin.src='/assets/impelo-pixel-location-pin.png';positionMarker();}};
   frame.onerror=()=>{if(current===loadId){frame.hidden=true;frame.removeAttribute('src');placeholder.hidden=false;message.textContent='The City Illustration Could Not Load. Try Again Or Open Google Maps Below.';}};
   marker.hidden=true;frame.hidden=true;frame.src=city.asset;
  }
  $$('[data-location]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.location;render()}));
  $('#load-map').addEventListener('click',()=>{explicit=true;visible=true;render()});
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){visible=true;render();observer.disconnect();}},{rootMargin:'80px'});observer.observe(frame.parentElement);
  new MutationObserver(()=>{if(document.body.classList.contains('low-data'))explicit=false;render()}).observe(document.body,{attributes:true,attributeFilter:['class']});
  render();
 }
 document.body.dataset.expansionReady='true';
})();
