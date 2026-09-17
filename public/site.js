const menu=document.querySelector('.navigation');
// Native details keeps navigation usable when JavaScript is disabled.
const desktop=matchMedia('(min-width:1101px)');
function syncMenu(){if(desktop.matches)menu.open=true;else menu.open=false;}
syncMenu();desktop.addEventListener('change',syncMenu);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!desktop.matches&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
menu.addEventListener('click',event=>{if(event.target.closest('a')&&!desktop.matches)menu.open=false;});
document.querySelectorAll('[data-case-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-case-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 let count=0;document.querySelectorAll('[data-case-category]').forEach(card=>{card.hidden=button.dataset.caseFilter!=='All'&&card.dataset.caseCategory!==button.dataset.caseFilter;if(!card.hidden)count++;});
 document.querySelector('#filter-status').textContent=count?`${count} case studies shown.`:'No approved case studies in this category yet.';
}));
// Analytics adapter: no vendor is installed. Explicit consent is required.
const allowedEvents=new Set(['walkthrough_form_view','walkthrough_form_start','walkthrough_form_submit_success','walkthrough_form_submit_error','phone_click','email_click','service_cta_click','case_study_cta_click']);
function track(event){if(!allowedEvents.has(event)||window.cityWideAnalyticsConsent!==true)return;window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,page_path:document.body.dataset.page});}
const form=document.querySelector('#walkthrough-form');
if(form){track('walkthrough_form_view');form.addEventListener('focusin',()=>track('walkthrough_form_start'),{once:true});}
if(document.querySelector('.error-summary'))track('walkthrough_form_submit_error');
function trackReceipt(){const id=document.body.dataset.receipt;if(!id||window.cityWideAnalyticsConsent!==true)return;try{const key='cw-received-'+id;if(!sessionStorage.getItem(key)){track('walkthrough_form_submit_success');sessionStorage.setItem(key,'1');}}catch{/* No storage: avoid an undeduplicated conversion. */}}
trackReceipt();window.addEventListener('citywide:analytics-consent',()=>{if(form)track('walkthrough_form_view');trackReceipt();});
document.addEventListener('click',event=>{const a=event.target.closest('a');if(!a)return;if(a.getAttribute('href')?.startsWith('tel:'))track('phone_click');else if(a.getAttribute('href')?.startsWith('mailto:'))track('email_click');else if(a.dataset.event)track(a.dataset.event);});
