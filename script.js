import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const supabase = createClient(
  window.SUPABASE_CONFIG.SUPABASE_URL,
  window.SUPABASE_CONFIG.SUPABASE_KEY
);

document.getElementById('year').textContent = new Date().getFullYear();

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

// profili aggiunti qui finché non sono nella tabella social_links (niente doppioni: vince la tabella)
const EXTRA_LINKS = [
  { title: 'Facebook', url: 'https://www.facebook.com/alessandro.lupi.1990', icon: 'fab fa-facebook' },
  { title: 'MQL5', url: 'https://www.mql5.com/en/users/alessandro.lupi', icon: 'fas fa-chart-line' },
];

function renderLink(link, i) {
  const a = document.createElement('a');
  a.href = link.url;
  a.className = 'social-icon';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.title = link.title;
  a.setAttribute('aria-label', `${link.title} (${hostOf(link.url)})`);
  a.style.setProperty('--i', i);
  const iEl = document.createElement('i');
  iEl.className = link.icon || 'fas fa-link';
  iEl.setAttribute('aria-hidden', 'true');
  a.appendChild(iEl);
  return a;
}

async function loadLinks() {
  const box = document.getElementById('links');
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('order_number', { ascending: true });
    if (error) throw error;

    const active = data.filter(l => l.is_active !== false);
    const known = new Set(active.map(l => hostOf(l.url)));
    const extra = EXTRA_LINKS.filter(l => !known.has(hostOf(l.url)));
    box.replaceChildren(...[...active, ...extra].map(renderLink));
  } catch (err) {
    console.error('Errore nel caricamento dei link:', err);
    const msg = document.createElement('div');
    msg.className = 'error-box';
    msg.textContent = 'Non riesco a caricare i link in questo momento. Riprova tra poco.';
    box.replaceChildren(msg);
  }
}

loadLinks();
