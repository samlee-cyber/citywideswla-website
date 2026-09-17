const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
navigation.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', (event) => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 941px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();

const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
for (const button of filters) {
  button.addEventListener('click', () => {
    for (const filter of filters) { const active = filter === button; filter.setAttribute('aria-pressed', String(active)); filter.classList.toggle('active', active); }
    let visible = 0;
    for (const card of cards) { card.hidden = button.dataset.filter !== 'all' && button.dataset.filter !== card.dataset.category; if (!card.hidden) visible++; }
    document.querySelector('#filter-status').textContent = `${visible} service ${visible === 1 ? 'category' : 'categories'} shown.`;
  });
}

const leadForm = document.querySelector('#lead-form');
const formStatus = document.querySelector('#form-status');
const sendButton = document.querySelector('#send-request');
let formConfig;
let widgetId;
let loadingConfig;
let requestId = crypto.randomUUID();
function showFormStatus(message) { formStatus.hidden = false; formStatus.textContent = message; }
async function prepareForm() {
  if (loadingConfig) return loadingConfig;
  loadingConfig = (async () => {
    try {
      const response = await fetch('/api/form-config');
      if (!response.ok) throw new Error('unavailable');
      formConfig = await response.json();
      if (!formConfig.ready) return;
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.onload = resolve;
        script.onerror = reject;
        document.head.append(script);
      });
      widgetId = window.turnstile.render('#turnstile-widget', { sitekey: formConfig.siteKey, action: 'walkthrough', theme: 'light' });
    } catch { formConfig = { ready: false }; }
  })();
  return loadingConfig;
}
leadForm.addEventListener('focusin', prepareForm, { once: true });
leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!leadForm.reportValidity() || sendButton.disabled) return;
  sendButton.disabled = true;
  try {
    await prepareForm();
    if (!formConfig?.ready) { showFormStatus('Online requests are not available yet. Your request has not been sent. Please call (562) 473-3136 to arrange a walkthrough.'); return; }
    const token = window.turnstile?.getResponse(widgetId);
    if (!token) { showFormStatus('Please complete the security check, then send your request.'); return; }
    showFormStatus('Sending your request…');
    const payload = Object.fromEntries(new FormData(leadForm));
    payload.token = token;
    payload.requestId = requestId;
    const response = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(25000) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'We couldn’t send your request. Please try again or call (562) 473-3136.');
    showFormStatus('Thank you. Your request has been received. Our Southwest Los Angeles team will follow up with you.');
    leadForm.reset();
    requestId = crypto.randomUUID();
  } catch (error) {
    showFormStatus(error.name === 'TimeoutError' ? 'We couldn’t confirm delivery. Please call (562) 473-3136, or try again. Your details are still here.' : (error.message || 'We couldn’t send your request. Please call (562) 473-3136.'));
  } finally {
    sendButton.disabled = false;
    if (widgetId !== undefined) window.turnstile?.reset(widgetId);
  }
});
