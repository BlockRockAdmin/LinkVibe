// Inizializza il client Supabase
const supabase = Supabase.createClient(
  window.SUPABASE_CONFIG.SUPABASE_URL,
  window.SUPABASE_CONFIG.SUPABASE_KEY
);

// Funzione per caricare i link
async function loadLinks() {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('order_number', { ascending: true });

  if (error) {
    console.error('Errore nel caricamento dei link:', error);
    return;
  }

  const linksContainer = document.getElementById('links');
  data.forEach(link => {
    const linkElement = document.createElement('a');
    linkElement.href = link.url;
    linkElement.className = 'link-button';
    linkElement.target = '_blank'; // Apre il link in una nuova scheda
    linkElement.innerHTML = `<i class="fab fa-${link.icon}"></i> ${link.title}`;
    linksContainer.appendChild(linkElement);
  });
}

// Carica i link quando la pagina si carica
loadLinks();
