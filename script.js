import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const supabase = createClient(
  window.SUPABASE_CONFIG.SUPABASE_URL,
  window.SUPABASE_CONFIG.SUPABASE_KEY
);

document.getElementById('year').textContent = new Date().getFullYear();

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

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

    box.replaceChildren(
      ...data.filter(l => l.is_active !== false).map(renderLink)
    );
  } catch (err) {
    console.error('Errore nel caricamento dei link:', err);
    const msg = document.createElement('div');
    msg.className = 'error-box';
    msg.textContent = 'Non riesco a caricare i link in questo momento. Riprova tra poco.';
    box.replaceChildren(msg);
  }
}

loadLinks();
