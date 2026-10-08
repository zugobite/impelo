(()=>{
 'use strict';
 const stage=document.querySelector('.device-stage');if(!stage)return;
 const image=document.querySelector('#platform-screen'),link=document.querySelector('#screen-fullsize');
 const screens={
  desktop:{file:stage.dataset.desktop,size:'1440 × 1000',description:stage.dataset.desktop==='desktop-queue.png'?'Queue · The current page retains its Coming Soon state.':'Health Home · Visit context and shortcuts in the current patient workspace.',alt:'Actual Impelo desktop '+(stage.dataset.desktop==='desktop-queue.png'?'queue page with its Coming Soon state':'patient health home')+', using a dummy account'},
  tablet:{file:'tablet-profile.png',size:'820 × 1120',description:'Profile · Account details and identity-update controls in the tablet layout.',alt:'Actual Impelo profile screen at tablet size, showing the supplied dummy account details'},
  mobile:{file:'mobile-health-home.png',size:'390 × 844',description:'Health Home · The responsive phone layout, with visit context and workspace shortcuts.',alt:'Actual Impelo patient health home in the responsive phone layout, using a dummy account'}
 };
 function select(device){
  const screen=screens[device];if(!screen)return;
  stage.dataset.device=device;stage.setAttribute('aria-labelledby',document.querySelector('.device-tabs [data-device="'+device+'"]').id);
  document.querySelectorAll('[data-device].tab').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.device===device)));
  image.dataset.src='/assets/platform-screens/'+screen.file;image.alt=screen.alt;
  if(!document.body.classList.contains('low-data')){image.src=image.dataset.src;image.hidden=false;}
  document.querySelector('#screen-device-label').textContent=device[0].toUpperCase()+device.slice(1)+' · '+screen.size;
  document.querySelector('#screen-description').textContent=screen.description;link.href=image.dataset.src;
 }
 document.querySelectorAll('.device-tabs [data-device]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.device)));
 select(matchMedia('(max-width:600px)').matches?'mobile':'desktop');
})();
