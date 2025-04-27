// Inizializza il client Supabase
const supabase = Supabase.createClient(
  'https://uplnnaiubixhjjhqzpxw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbG5uYWl1Yml4aGpqaHF6cHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NDU2MTUsImV4cCI6MjA2MTMyMTYxNX0.m6jrFgKHO9uDVbJnH0PjWVacgRaAYSb0SUIcwlGrJEQ'
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
