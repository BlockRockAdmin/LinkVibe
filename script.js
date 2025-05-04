// Verifica che Supabase sia definito
if (typeof Supabase === 'undefined') {
  console.error('Errore: Supabase non è definito. Assicurati che supabase.min.js sia caricato correttamente.');
  throw new Error('Supabase non è definito');
}

// Verifica che window.SUPABASE_CONFIG sia definito
if (typeof window.SUPABASE_CONFIG === 'undefined') {
  console.error('Errore: window.SUPABASE_CONFIG non è definito. Controlla config.js.');
  throw new Error('window.SUPABASE_CONFIG non è definito');
}

// Inizializza il client Supabase
const supabase = Supabase.createClient(
  window.SUPABASE_CONFIG.SUPABASE_URL,
  window.SUPABASE_CONFIG.SUPABASE_KEY
);

console.log('Supabase client inizializzato:', supabase);

// Funzione per caricare i link
async function loadLinks() {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('order_number', { ascending: true });

    if (error) {
      console.error('Errore nel caricamento dei link:', error);
      return;
    }

    console.log('Dati ricevuti:', data);

    const linksContainer = document.getElementById('links');
    if (!linksContainer) {
      console.error('Elemento #links non trovato nel DOM');
      return;
    }

    data.forEach(link => {
      const linkElement = document.createElement('a');
      linkElement.href = link.url;
      linkElement.className = 'link-button';
      linkElement.target = '_blank';
      linkElement.innerHTML = `<i class="fab fa-${link.icon}"></i> ${link.title}`;
      linksContainer.appendChild(linkElement);
    });
  } catch (err) {
    console.error('Errore di rete:', err);
  }
}

// Carica i link quando la pagina si carica
loadLinks();
